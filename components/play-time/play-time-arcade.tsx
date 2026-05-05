"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Brain, Crown, Gamepad2, Gem, RotateCcw, Trophy, Zap } from "lucide-react";

import LexaCharacter from "@/components/lexa/LexaCharacter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPlayTimeQuestion, type MiniGameQuestion } from "@/src/data/playTimeQuestions";
import { getPlayTimeLine } from "@/src/data/playTimeVoiceLines";
import { addCrowns, PLAY_TIME_STORAGE_KEYS, readNumber, saveBestScore } from "@/src/lib/playTimeScoring";

type GameMode = "hub" | "runner" | "match" | "buzz" | "results";
type GameKey = "crownRushBest" | "gemMatchBest" | "beatBuzzBest";

const tiles = ["👑", "💎", "💖", "⭐", "⚡", "🧪"];

function makeBoard(seed = 0) {
  return Array.from({ length: 36 }, (_, index) => tiles[(index * 3 + seed + Math.floor(index / 6)) % tiles.length]);
}

export default function PlayTimeArcade() {
  const [mode, setMode] = useState<GameMode>("hub");
  const [activeGame, setActiveGame] = useState<GameKey>("crownRushBest");
  const [score, setScore] = useState(0);
  const [crowns, setCrowns] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(0);
  const [line, setLine] = useState("Pick a mini-game and let the brain rewards begin.");
  const [question, setQuestion] = useState<MiniGameQuestion>(() => getPlayTimeQuestion(0));
  const [selected, setSelected] = useState<string | null>(null);
  const [board, setBoard] = useState(() => makeBoard());
  const [firstTile, setFirstTile] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);
  const [brainBurst, setBrainBurst] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);

  const bestScores = {
    crownRushBest: readNumber(PLAY_TIME_STORAGE_KEYS.crownRushBest),
    gemMatchBest: readNumber(PLAY_TIME_STORAGE_KEYS.gemMatchBest),
    beatBuzzBest: readNumber(PLAY_TIME_STORAGE_KEYS.beatBuzzBest),
  };

  function reset(game: GameKey) {
    setActiveGame(game);
    setScore(0);
    setCrowns(0);
    setStreak(0);
    setRound(0);
    setSelected(null);
    setMatches(0);
    setBrainBurst(false);
    setBeatIndex(0);
    setQuestion(getPlayTimeQuestion(game === "beatBuzzBest" ? 20 : 0));
    setBoard(makeBoard(game.length));
    setLine(game === "beatBuzzBest" ? getPlayTimeLine("buzzStart") : "Game on. Pick the smart move and stack rewards.");
    setMode(game === "crownRushBest" ? "runner" : game === "gemMatchBest" ? "match" : "buzz");
  }

  function finish(game: GameKey) {
    saveBestScore(PLAY_TIME_STORAGE_KEYS[game], score);
    addCrowns(crowns);
    setLine(game === "crownRushBest" ? getPlayTimeLine("runnerComplete") : game === "beatBuzzBest" ? getPlayTimeLine("buzzComplete") : "Gem Match Lab complete.");
    setMode("results");
  }

  function answerRunner(choice: string) {
    const correct = choice === question.correctAnswer;
    const nextStreak = correct ? streak + 1 : 0;
    setSelected(choice);
    setScore((value) => value + (correct ? 100 : 0));
    setCrowns((value) => value + (correct ? 1 : 0));
    setStreak(nextStreak);
    setLine(correct ? getPlayTimeLine("runnerCorrect") : getPlayTimeLine("runnerWrong"));
  }

  function nextRunner() {
    const nextRound = round + 1;
    if (nextRound >= 10) {
      finish("crownRushBest");
      return;
    }
    setRound(nextRound);
    setSelected(null);
    setQuestion(getPlayTimeQuestion(nextRound));
  }

  function tileClick(index: number) {
    if (brainBurst) return;
    if (firstTile === null) {
      setFirstTile(index);
      return;
    }
    if (firstTile === index) {
      setFirstTile(null);
      return;
    }
    const nextBoard = [...board];
    [nextBoard[firstTile], nextBoard[index]] = [nextBoard[index], nextBoard[firstTile]];
    const matchSize = nextBoard[firstTile] === nextBoard[index] ? 4 : 3;
    const nextMatches = matches + 1;
    setBoard(nextBoard.map((tile, tileIndex) => (tileIndex === firstTile || tileIndex === index ? tiles[(tileIndex + nextMatches) % tiles.length] : tile)));
    setFirstTile(null);
    setMatches(nextMatches);
    setStreak((value) => value + 1);
    setScore((value) => value + (matchSize === 4 ? 100 : 50));
    setLine(getPlayTimeLine("match"));
    if (nextMatches % 3 === 0) {
      setBrainBurst(true);
      setQuestion(getPlayTimeQuestion(10 + nextMatches));
      setLine(getPlayTimeLine("brainBurst"));
    }
    if (nextMatches >= 12) finish("gemMatchBest");
  }

  function answerBrainBurst(choice: string) {
    const correct = choice === question.correctAnswer;
    setScore((value) => value + (correct ? 250 : 0));
    setCrowns((value) => value + (correct ? 1 : 0));
    setLine(correct ? getPlayTimeLine("matchCorrect") : `${getPlayTimeLine("matchWrong")} ${question.explanation ?? ""}`);
    setBrainBurst(false);
  }

  function answerBuzz(choice: string) {
    const correct = choice === question.correctAnswer;
    const nextStreak = correct ? streak + 1 : 0;
    setScore((value) => value + (correct ? 50 + (nextStreak % 5 === 0 ? 100 : 0) : 0));
    setCrowns((value) => value + (correct && nextStreak % 10 === 0 ? 1 : 0));
    setStreak(nextStreak);
    setLine(correct ? getPlayTimeLine("buzzCorrect") : getPlayTimeLine("buzzMiss"));
    const nextBeat = beatIndex + 1;
    if (nextBeat >= 12) {
      finish("beatBuzzBest");
      return;
    }
    setBeatIndex(nextBeat);
    setQuestion(getPlayTimeQuestion(20 + nextBeat));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080013] px-3 py-4 text-white sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(236,72,153,0.26),transparent_26%),radial-gradient(circle_at_90%_16%,rgba(34,211,238,0.24),transparent_24%),radial-gradient(circle_at_52%_100%,rgba(250,204,21,0.18),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-5">
        <header className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_0_80px_rgba(236,72,153,0.18)] backdrop-blur lg:grid-cols-[1fr_auto]">
          <section className="grid content-center gap-4">
            <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/10"><ArrowLeft className="h-4 w-4" /> Back to Quest</Link>
            <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.2em]"><span className="pill bg-fuchsia-500/20 text-fuchsia-100">Play Time</span><span className="pill bg-cyan-400/20 text-cyan-100">Brainy Rewards</span><span className="pill bg-amber-300/20 text-amber-100">{readNumber(PLAY_TIME_STORAGE_KEYS.totalCrowns)} Crowns</span></div>
            <h1 className="text-4xl font-black leading-none drop-shadow-[0_0_18px_rgba(236,72,153,0.75)] md:text-6xl">Play Time Arcade</h1>
            <p className="max-w-3xl text-lg leading-8 text-cyan-50/85">Run, match, tap, and slay quick challenges with math, science, vocabulary, and pattern rewards.</p>
          </section>
          <LexaCharacter pose="celebrate" size="hero" className="mx-auto" />
        </header>

        {mode === "hub" && renderHub()}
        {mode === "runner" && renderRunner()}
        {mode === "match" && renderMatch()}
        {mode === "buzz" && renderBuzz()}
        {mode === "results" && renderResults()}
      </div>
    </main>
  );

  function renderHub() {
    const cards = [
      { key: "crownRushBest" as const, title: "Crown Rush Runner", copy: "Dodge drama. Grab crowns. Pick the right answers.", icon: Crown, best: bestScores.crownRushBest },
      { key: "gemMatchBest" as const, title: "Gem Match Lab", copy: "Match glowing gems and unlock Brain Burst questions.", icon: Gem, best: bestScores.gemMatchBest },
      { key: "beatBuzzBest" as const, title: "Beat the Buzz", copy: "Tap the right beats and build your brain combo.", icon: Zap, best: bestScores.beatBuzzBest },
    ];
    return <section className="grid gap-4 md:grid-cols-3">{cards.map(({ key, title, copy, icon: Icon, best }) => <Card key={key} className="border-white/10 bg-white/[0.07] text-white backdrop-blur"><CardContent className="grid gap-4 p-5"><Icon className="h-10 w-10 text-cyan-200" /><h2 className="text-3xl font-black">{title}</h2><p className="text-white/70">{copy}</p><Badge>Best {best}</Badge><Button onClick={() => reset(key)} size="lg" className="justify-center bg-fuchsia-500 text-white hover:bg-fuchsia-400"><Gamepad2 className="h-5 w-5" /> Play</Button></CardContent></Card>)}</section>;
  }

  function renderStats(progress: number) {
    return <div className="grid gap-3"><div className="flex flex-wrap gap-2 text-sm font-black"><Badge>Score {score}</Badge><Badge>Streak {streak}</Badge><Badge>Crowns {crowns}</Badge></div><Progress value={progress} /><div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-4 text-lg font-black">{line}</div></div>;
  }

  function renderRunner() {
    return <Card className="border-white/10 bg-white/[0.07] text-white backdrop-blur"><CardContent className="grid gap-5 p-5 md:p-6">{renderStats((round / 10) * 100)}<h2 className="text-4xl font-black">{question.prompt}</h2><div className="grid gap-3 md:grid-cols-3">{question.choices.map((choice, index) => <Button key={choice} onClick={() => answerRunner(choice)} disabled={Boolean(selected)} variant="choice" className={laneClass(choice)}><span className="block text-xs uppercase tracking-[0.2em] text-white/60">Lane {index + 1}</span>{choice}</Button>)}</div>{selected && <Button onClick={nextRunner} size="lg" className="w-fit bg-cyan-300 text-slate-950 hover:bg-cyan-200">Next Run</Button>}<DramaBlocks /></CardContent></Card>;
  }

  function renderMatch() {
    return <Card className="border-white/10 bg-white/[0.07] text-white backdrop-blur"><CardContent className="grid gap-5 p-5 md:p-6">{renderStats((matches / 12) * 100)}<div className="grid grid-cols-6 gap-2">{board.map((tile, index) => <button key={`${tile}-${index}`} onClick={() => tileClick(index)} className={firstTile === index ? "aspect-square rounded-xl bg-amber-300 text-3xl shadow-[0_0_22px_rgba(250,204,21,0.5)]" : "aspect-square rounded-xl bg-white/10 text-3xl ring-1 ring-white/10 hover:bg-white/15"}>{tile}</button>)}</div>{brainBurst && <div className="rounded-[1.5rem] border border-fuchsia-300/30 bg-fuchsia-400/10 p-4"><div className="mb-3 flex items-center gap-2 text-xl font-black"><Brain className="h-6 w-6 text-fuchsia-100" /> Brain Burst</div><p className="mb-3 text-2xl font-black">{question.prompt}</p><div className="grid gap-2 md:grid-cols-3">{question.choices.map((choice) => <Button key={choice} onClick={() => answerBrainBurst(choice)} className="justify-center bg-white/10 text-white hover:bg-white/15">{choice}</Button>)}</div></div>}</CardContent></Card>;
  }

  function renderBuzz() {
    return <Card className="border-white/10 bg-white/[0.07] text-white backdrop-blur"><CardContent className="grid gap-5 p-5 md:p-6">{renderStats((beatIndex / 12) * 100)}<h2 className="text-4xl font-black">{question.prompt}</h2><div className="rounded-[2rem] border border-white/10 bg-black/30 p-4"><div className="mb-3 rounded-full border border-cyan-300/40 bg-cyan-300/10 p-3 text-center text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Hit Zone</div><div className="grid gap-3 md:grid-cols-3">{question.choices.map((choice, index) => <Button key={choice} onClick={() => answerBuzz(choice)} variant="choice" className="min-h-28 animate-pulse border-white/15 bg-white/10 text-white hover:border-fuchsia-300 hover:bg-fuchsia-300/15"><span className="block text-xs uppercase tracking-[0.2em] text-white/60">Beat {index + 1}</span>{choice}</Button>)}</div></div></CardContent></Card>;
  }

  function renderResults() {
    const best = readNumber(PLAY_TIME_STORAGE_KEYS[activeGame]);
    return <Card className="border-white/10 bg-white/[0.07] text-white backdrop-blur"><CardContent className="grid gap-6 p-5 md:grid-cols-[auto_1fr] md:p-6"><LexaCharacter pose="celebrate" size="lg" className="mx-auto" /><div className="grid content-center gap-4"><div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-slate-950"><Trophy className="h-5 w-5" /> Results</div><h2 className="text-4xl font-black">{line}</h2><p className="text-xl text-cyan-50/85">Score {score}, crowns {crowns}, best score {best}.</p><div className="flex flex-wrap gap-3"><Button onClick={() => reset(activeGame)} size="lg"><RotateCcw className="h-5 w-5" /> Replay</Button><Button onClick={() => setMode("hub")} variant="secondary" size="lg" className="bg-white/10 text-white ring-white/15">Play Time Hub</Button></div></div></CardContent></Card>;
  }

  function laneClass(choice: string) {
    const base = "min-h-32 border-white/15 bg-white/10 text-3xl text-white hover:border-cyan-300 hover:bg-cyan-300/15";
    if (!selected) return base;
    if (choice === question.correctAnswer) return `${base} border-emerald-300 bg-emerald-400/20`;
    if (choice === selected) return `${base} border-rose-300 bg-rose-400/20`;
    return base;
  }
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-white/10">{children}</span>;
}

function DramaBlocks() {
  return <div className="grid gap-2 md:grid-cols-3"><div className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-3 text-center font-black text-fuchsia-100">Drama Block</div><div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-center font-black text-cyan-100">Speed Boost</div><div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-center font-black text-amber-100">Crown Gate</div></div>;
}
