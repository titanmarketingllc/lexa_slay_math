"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Crown, FlaskConical, Lock, RotateCcw, Star, Trophy, Zap } from "lucide-react";

import LexaCharacter from "@/components/lexa/LexaCharacter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getScienceLevel, getScienceQuestionsForLevel, scienceLevels, type ScienceQuestion } from "@/src/data/scienceQuestions";
import { getLexaLine } from "@/src/data/lexaVoiceLines";

type ScienceProgress = Record<number, { crowns: number; bestScore: number; unlocked: boolean }>;

const SCIENCE_PROGRESS_KEY = "lexa-slay-science-progress-v1";

function storedScienceProgress(): ScienceProgress {
  const fallback = { 1: { crowns: 0, bestScore: 0, unlocked: true } };
  if (typeof window === "undefined") return fallback;
  try {
    return { ...fallback, ...(JSON.parse(window.localStorage.getItem(SCIENCE_PROGRESS_KEY) ?? "{}") as ScienceProgress) };
  } catch {
    return fallback;
  }
}

function crownsFor(correct: number) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 5) return 1;
  return 0;
}

export default function ScienceSlayLab() {
  const [progress, setProgress] = useState<ScienceProgress>(storedScienceProgress);
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState<ScienceQuestion[]>(() => getScienceQuestionsForLevel(1));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<"select" | "quiz" | "results">("select");
  const [line, setLine] = useState(getLexaLine("scienceStart"));

  const current = questions[index];
  const levelMeta = getScienceLevel(level);
  const earnedCrowns = crownsFor(correct);
  const passed = correct >= 7;

  const totalCrowns = useMemo(
    () => Object.values(progress).reduce((sum, item) => sum + item.crowns, 0),
    [progress],
  );

  function saveProgress(nextProgress: ScienceProgress) {
    setProgress(nextProgress);
    window.localStorage.setItem(SCIENCE_PROGRESS_KEY, JSON.stringify(nextProgress));
  }

  function startLevel(nextLevel: number) {
    const levelProgress = progress[nextLevel] ?? { crowns: 0, bestScore: 0, unlocked: nextLevel === 1 };
    if (!levelProgress.unlocked) {
      setLine("Complete the earlier lab level to unlock this one.");
      return;
    }
    setLevel(nextLevel);
    setQuestions(getScienceQuestionsForLevel(nextLevel));
    setIndex(0);
    setScore(0);
    setCorrect(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setMode("quiz");
    setLine(getLexaLine("scienceStart"));
  }

  function answer(choice: string) {
    if (!current || selected) return;
    const isCorrect = choice === current.correctAnswer;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const nextScore = score + (isCorrect ? 100 + (nextStreak >= 3 ? 25 : 0) : 0);
    setSelected(choice);
    setCorrect((value) => value + (isCorrect ? 1 : 0));
    setStreak(nextStreak);
    setBestStreak((value) => Math.max(value, nextStreak));
    setScore(nextScore);
    setLine(isCorrect ? getLexaLine("scienceCorrect") : getLexaLine("scienceWrong"));
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      finishLevel();
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setLine(getLexaLine("scienceStart"));
  }

  function finishLevel() {
    const finalScore = score + (correct === questions.length ? 500 : 0);
    const nextCrowns = crownsFor(correct);
    const nextProgress = { ...progress };
    const previous = nextProgress[level] ?? { crowns: 0, bestScore: 0, unlocked: true };
    nextProgress[level] = {
      crowns: Math.max(previous.crowns, nextCrowns),
      bestScore: Math.max(previous.bestScore, finalScore),
      unlocked: true,
    };
    if (correct >= 7 && level < scienceLevels.length) {
      const nextLevel = level + 1;
      nextProgress[nextLevel] = {
        crowns: nextProgress[nextLevel]?.crowns ?? 0,
        bestScore: nextProgress[nextLevel]?.bestScore ?? 0,
        unlocked: true,
      };
    }
    setScore(finalScore);
    saveProgress(nextProgress);
    setMode("results");
    setLine(getLexaLine("scienceLevelComplete"));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080013] px-3 py-4 text-white sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.25),transparent_26%),radial-gradient(circle_at_90%_16%,rgba(236,72,153,0.24),transparent_24%),radial-gradient(circle_at_52%_100%,rgba(250,204,21,0.18),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-5">
        <header className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_0_80px_rgba(34,211,238,0.18)] backdrop-blur lg:grid-cols-[1fr_auto]">
          <section className="grid content-center gap-4">
            <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/10">
              <ArrowLeft className="h-4 w-4" /> Back to Quest
            </Link>
            <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.2em]">
              <span className="pill bg-cyan-400/20 text-cyan-100">Science</span>
              <span className="pill bg-fuchsia-500/20 text-fuchsia-100">Slay Lab</span>
              <span className="pill bg-amber-300/20 text-amber-100">{totalCrowns}/15 Crowns</span>
            </div>
            <h1 className="text-4xl font-black leading-none drop-shadow-[0_0_18px_rgba(34,211,238,0.75)] md:text-6xl">Science Slay Lab</h1>
            <p className="max-w-3xl text-lg leading-8 text-cyan-50/85">Explore animals, energy, Earth, space, and matter through 5 fourth grade lab levels.</p>
          </section>
          <LexaCharacter pose="encourage" size="hero" className="mx-auto" />
        </header>

        {mode === "select" && renderLevelSelect()}
        {mode === "quiz" && renderQuiz()}
        {mode === "results" && renderResults()}
      </div>
    </main>
  );

  function renderLevelSelect() {
    return (
      <section className="grid gap-4">
        <Card className="border-white/10 bg-white/[0.07] text-white backdrop-blur">
          <CardContent className="grid gap-4 p-5 md:p-6">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-7 w-7 text-cyan-200" />
              <div>
                <h2 className="text-3xl font-black">Choose your lab level</h2>
                <p className="text-white/65">Pass with 7 or more correct answers to unlock the next level.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {scienceLevels.map((item) => {
                const itemProgress = progress[item.level] ?? { crowns: 0, bestScore: 0, unlocked: item.level === 1 };
                return (
                  <div key={item.level} className={itemProgress.unlocked ? "rounded-[1.5rem] border border-cyan-300/25 bg-cyan-300/10 p-5 ring-1 ring-white/10" : "rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 opacity-70 ring-1 ring-white/10"}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-fuchsia-500 px-3 py-1 text-sm font-black">Level {item.level}</span>
                      {itemProgress.unlocked ? <CheckCircle2 className="h-6 w-6 text-cyan-200" /> : <Lock className="h-6 w-6 text-white/55" />}
                    </div>
                    <h3 className="mt-4 text-2xl font-black">{item.title}</h3>
                    <p className="mt-2 min-h-12 text-sm font-semibold text-white/65">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm font-black">
                      <Badge>Crowns {itemProgress.crowns}/3</Badge>
                      <Badge>Best {itemProgress.bestScore}</Badge>
                    </div>
                    <Button onClick={() => startLevel(item.level)} disabled={!itemProgress.unlocked} className="mt-5 w-full justify-center bg-cyan-300 text-slate-950 hover:bg-cyan-200 disabled:bg-white/10 disabled:text-white/45">
                      {itemProgress.unlocked ? "Start Lab" : "Locked"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  function renderQuiz() {
    if (!current) return null;
    const isAnswered = Boolean(selected);
    const isCorrect = selected === current.correctAnswer;
    return (
      <Card className="border-white/10 bg-white/[0.07] text-white backdrop-blur">
        <CardContent className="grid gap-6 p-5 md:p-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-slate-950">Level {level}: {levelMeta?.title}</div>
              <div className="flex flex-wrap gap-2 text-sm font-black">
                <Badge>Score {score}</Badge><Badge>Question {index + 1}/{questions.length}</Badge><Badge>Streak {streak}</Badge>
              </div>
            </div>
            <Progress value={Math.round((index / questions.length) * 100)} />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-cyan-300/20 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-100">{current.topic.replace("-", " ")}</div>
              <h2 className="text-3xl font-black leading-tight md:text-5xl">{current.question}</h2>
            </div>
            <LexaCharacter pose={isAnswered ? (isCorrect ? "celebrate" : "encourage") : "gameplay"} size="md" className="hidden lg:flex" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {current.choices.map((choice) => (
              <Button key={choice} onClick={() => answer(choice)} disabled={isAnswered} variant="choice" className={scienceChoiceClass(choice)}>
                {choice}
              </Button>
            ))}
          </div>

          {isAnswered && (
            <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <div className="text-lg font-black">{line}</div>
              <p className="text-white/75">{current.explanation}</p>
              <Button onClick={nextQuestion} size="lg" className="w-fit bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                {index + 1 >= questions.length ? "See Results" : "Next Question"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  function renderResults() {
    return (
      <Card className="border-white/10 bg-white/[0.07] text-white backdrop-blur">
        <CardContent className="grid gap-6 p-5 md:grid-cols-[auto_1fr] md:p-6">
          <LexaCharacter pose="celebrate" size="lg" className="mx-auto" />
          <div className="grid content-center gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-slate-950"><Trophy className="h-5 w-5" /> Lab Results</div>
            <h2 className="text-4xl font-black">{line}</h2>
            <p className="text-xl text-cyan-50/85">You scored {score} with {correct}/{questions.length} correct and a best streak of {bestStreak}.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat icon={Crown} label="Crowns" value={earnedCrowns} />
              <Stat icon={Zap} label="Score" value={score} />
              <Stat icon={Star} label="Correct" value={correct} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setMode("select")} size="lg">Level Select</Button>
              <Button onClick={() => startLevel(level)} variant="secondary" size="lg" className="bg-white/10 text-white ring-white/15"><RotateCcw className="h-5 w-5" /> Retry</Button>
              {passed && level < scienceLevels.length && <Button onClick={() => startLevel(level + 1)} size="lg" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">Next Level</Button>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function scienceChoiceClass(choice: string) {
    const base = "border-white/15 bg-white/10 text-white hover:border-cyan-300 hover:bg-cyan-300/15";
    if (!selected || !current) return base;
    if (choice === current.correctAnswer) return `${base} border-emerald-300 bg-emerald-400/20 text-emerald-50`;
    if (choice === selected) return `${base} border-rose-300 bg-rose-400/20 text-rose-50`;
    return `${base} opacity-70`;
  }
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-white/10">{children}</span>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Crown; label: string; value: number }) {
  return <div className="flex items-center justify-between rounded-[1.25rem] bg-white/10 p-4"><span className="flex items-center gap-2 font-black"><Icon className="h-5 w-5 text-cyan-200" /> {label}</span><span className="font-black text-amber-100">{value}</span></div>;
}
