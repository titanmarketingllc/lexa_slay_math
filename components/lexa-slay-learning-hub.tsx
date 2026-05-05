"use client";

import { useMemo, useState } from "react";
import { BookOpen, Crown, Gem, Gift, Heart, Shirt, ShoppingBag, SpellCheck, Star, Target, Trophy, Volume2, Zap } from "lucide-react";

import LexaCharacter from "@/components/lexa/LexaCharacter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAllSpellingWords, getSpellingWordsForDifficulty, SPELLING_MODES, type SpellingMode, type SpellingPrompt } from "@/lib/spelling-inventory";
import { getLexaLine } from "@/src/data/lexaVoiceLines";

type View = "play" | "spelling" | "fashion" | "missions" | "shop" | "rewards";

type Question = {
  prompt: string;
  choices: string[];
  answer: string;
  tip: string;
};

type ScoreRecord = {
  id: string;
  player: string;
  score: number;
  correct: number;
  total: number;
  date: string;
  activity?: "Math" | "Spelling";
};

const PLAYER_KEY = "lexa-slay-current-player-v1";
const SCORE_KEY = "lexa-slay-scoreboard-v2";

const questions: Question[] = [
  { prompt: "Which number is a multiple of 6?", choices: ["14", "18", "25", "29"], answer: "18", tip: "Skip count by 6: 6, 12, 18." },
  { prompt: "What is the 5th multiple of 4?", choices: ["16", "20", "24", "12"], answer: "20", tip: "4, 8, 12, 16, 20." },
  { prompt: "Which number is a factor of 24?", choices: ["5", "7", "8", "11"], answer: "8", tip: "24 divided by 8 equals 3." },
  { prompt: "What comes next? 4, 7, 10, __", choices: ["12", "13", "14", "15"], answer: "13", tip: "Add 3 each time." },
  { prompt: "Which fraction means one out of four equal parts?", choices: ["1/2", "1/3", "1/4", "4/1"], answer: "1/4", tip: "The denominator tells the total equal pieces." },
  { prompt: "What time is 30 minutes after 2:15?", choices: ["2:30", "2:45", "3:15", "3:45"], answer: "2:45", tip: "15 plus 30 minutes equals 45." },
  { prompt: "There are 5 teams with 6 players each. How many players total?", choices: ["11", "25", "30", "35"], answer: "30", tip: "Each usually means multiply." },
  { prompt: "Which pair has two even numbers?", choices: ["13 and 17", "22 and 40", "15 and 18", "31 and 33"], answer: "22 and 40", tip: "Even numbers end in 0, 2, 4, 6, or 8." },
  { prompt: "What fraction of a set is shaded if 3 out of 5 parts are colored?", choices: ["3/5", "5/3", "2/5", "3/8"], answer: "3/5", tip: "Top number is the shaded parts." },
  { prompt: "School starts at 8:00 and ends at 3:00. How many hours is that?", choices: ["5", "6", "7", "8"], answer: "7", tip: "Count from 8 to 3." },
];

const nav = [
  { id: "play", label: "Play", icon: Zap },
  { id: "spelling", label: "Spelling", icon: SpellCheck },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "missions", label: "Missions", icon: Target },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "rewards", label: "Rewards", icon: Gift },
] as const;

const missionCards = ["Crown Collector", "Math Glow-Up", "Streak Queen"];
const shopCards = ["Crown Rush Boost", "Neon Jacket Drop", "VIP Sparkle Pass"];
const fashionSlots = ["Hair", "Tops", "Jackets", "Shoes", "Accessories"];

function storedPlayer() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PLAYER_KEY) ?? "";
}

function storedScores(): ScoreRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SCORE_KEY) ?? "[]") as ScoreRecord[];
  } catch {
    return [];
  }
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalizeSpelling(value: string) {
  return value.trim().toLowerCase();
}

function getClearEnglishVoice(voices: SpeechSynthesisVoice[]) {
  const preferredNames = [
    "Microsoft Jenny",
    "Microsoft Aria",
    "Microsoft Zira",
    "Google US English",
    "Samantha",
    "Karen",
    "Moira",
  ];
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));

  return (
    preferredNames
      .map((name) => englishVoices.find((voice) => voice.name.toLowerCase().includes(name.toLowerCase())))
      .find(Boolean) ??
    englishVoices.find((voice) => voice.lang.toLowerCase() === "en-us" && voice.localService) ??
    englishVoices.find((voice) => voice.lang.toLowerCase() === "en-us") ??
    englishVoices[0] ??
    null
  );
}

function speakVocabularyWord(word: string, slow = false) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const synth = window.speechSynthesis;
  const voices = synth.getVoices();

  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => speakVocabularyWord(word, slow);
    return;
  }

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(slow ? `${word}. ${word}.` : word);
  utterance.lang = "en-US";
  utterance.rate = slow ? 0.52 : 0.68;
  utterance.pitch = 0.95;
  utterance.volume = 1;
  utterance.voice = getClearEnglishVoice(voices);
  synth.speak(utterance);
}

export default function LexaSlayLearningHub() {
  const [player, setPlayer] = useState(storedPlayer);
  const [draftName, setDraftName] = useState(storedPlayer);
  const [scores, setScores] = useState<ScoreRecord[]>(storedScores);
  const [view, setView] = useState<View>("play");
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(() => shuffle(questions));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [line, setLine] = useState(getLexaLine("idle"));
  const [spellingMode, setSpellingMode] = useState<SpellingMode>("Mixed");
  const [spellingRound, setSpellingRound] = useState<SpellingPrompt[]>(() => shuffle(getAllSpellingWords()).slice(0, 12));
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingScore, setSpellingScore] = useState(0);
  const [spellingCorrect, setSpellingCorrect] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [spellingFeedback, setSpellingFeedback] = useState("");
  const [spellingDone, setSpellingDone] = useState(false);

  const current = round[index];
  const currentSpelling = spellingRound[spellingIndex];
  const done = started && index >= round.length;
  const leaderboard = useMemo(() => [...scores].sort((a, b) => b.score - a.score).slice(0, 6), [scores]);
  const playerTotals = useMemo(() => {
    const totals = new Map<string, { games: number; points: number; correct: number }>();
    for (const item of scores) {
      const currentTotal = totals.get(item.player) ?? { games: 0, points: 0, correct: 0 };
      totals.set(item.player, {
        games: currentTotal.games + 1,
        points: currentTotal.points + item.score,
        correct: currentTotal.correct + item.correct,
      });
    }
    return [...totals.entries()].sort((a, b) => b[1].points - a[1].points);
  }, [scores]);
  const activeTotals = playerTotals.find(([name]) => name === player)?.[1];

  function savePlayer() {
    const cleanName = draftName.trim();
    if (!cleanName) return;
    setPlayer(cleanName);
    window.localStorage.setItem(PLAYER_KEY, cleanName);
    setLine(`Welcome in, ${cleanName}. ${getLexaLine("start")}`);
  }

  function openView(nextView: View) {
    setStarted(false);
    setView(nextView);
    setLine(getLexaLine(nextView === "play" || nextView === "spelling" ? "idle" : nextView === "rewards" ? "reward" : nextView === "missions" ? "mission" : nextView));
  }

  function startRound() {
    if (!player.trim()) {
      setLine("Enter your name first so your score counts.");
      return;
    }
    setRound(shuffle(questions));
    setIndex(0);
    setScore(0);
    setCorrect(0);
    setStreak(0);
    setSelected(null);
    setStarted(true);
    setView("play");
    setLine(getLexaLine("start"));
  }

  function finishRound(finalScore: number, finalCorrect: number, finalTotal = round.length, activity: ScoreRecord["activity"] = "Math") {
    const record = {
      id: typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}`,
      player: player.trim(),
      score: finalScore,
      correct: finalCorrect,
      total: finalTotal,
      date: new Date().toLocaleDateString(),
      activity,
    };
    const nextScores = [record, ...scores].slice(0, 100);
    setScores(nextScores);
    window.localStorage.setItem(SCORE_KEY, JSON.stringify(nextScores));
    setLine(getLexaLine("levelComplete"));
  }

  function answer(choice: string) {
    if (!current || selected) return;
    const isCorrect = choice === current.answer;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    const nextScore = score + (isCorrect ? 10 + (nextStreak >= 3 ? 5 : 0) : 0);
    setSelected(choice);
    setStreak(nextStreak);
    setCorrect(nextCorrect);
    setScore(nextScore);
    setLine(isCorrect ? (nextStreak >= 3 ? getLexaLine("streak") : getLexaLine("correct")) : `${getLexaLine("wrong")} ${current.tip}`);
    if (index + 1 >= round.length) {
      setTimeout(() => {
        setIndex(round.length);
        finishRound(nextScore, nextCorrect);
      }, 450);
    }
  }

  function nextQuestion() {
    setSelected(null);
    setIndex((value) => value + 1);
    setLine(getLexaLine("idle"));
  }

  function startSpelling(nextMode: SpellingMode) {
    if (!player.trim()) {
      setLine("Enter your name first so your spelling score counts.");
      return;
    }
    const pool = nextMode === "Mixed" ? getAllSpellingWords() : getSpellingWordsForDifficulty(nextMode);
    setSpellingMode(nextMode);
    setSpellingRound(shuffle(pool).slice(0, 12));
    setSpellingIndex(0);
    setSpellingScore(0);
    setSpellingCorrect(0);
    setTypedWord("");
    setSpellingFeedback("");
    setSpellingDone(false);
    setView("spelling");
    setStarted(false);
    setLine("Tap Hear Word. I will say it slowly and clearly.");
  }

  function answerSpelling() {
    if (!currentSpelling || spellingFeedback) return;
    const isCorrect = normalizeSpelling(typedWord) === normalizeSpelling(currentSpelling.word);
    const pointValue = currentSpelling.difficulty === "Challenge" ? 20 : currentSpelling.difficulty === "Builder" ? 15 : 10;
    const nextScore = spellingScore + (isCorrect ? pointValue : 0);
    const nextCorrect = spellingCorrect + (isCorrect ? 1 : 0);
    setSpellingScore(nextScore);
    setSpellingCorrect(nextCorrect);
    setSpellingFeedback(isCorrect ? "Correct. Great spelling." : `Not quite. The word was ${currentSpelling.word}.`);
    setLine(isCorrect ? getLexaLine("correct") : "Good try. Listen closely and keep practicing.");

    if (spellingIndex + 1 >= spellingRound.length) {
      setTimeout(() => {
        setSpellingDone(true);
        finishRound(nextScore, nextCorrect, spellingRound.length, "Spelling");
      }, 500);
    }
  }

  function nextSpellingWord() {
    setTypedWord("");
    setSpellingFeedback("");
    setSpellingIndex((value) => value + 1);
    setLine("Tap Hear Word when you are ready for the next word.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080013] px-3 py-4 text-white sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(236,72,153,0.28),transparent_26%),radial-gradient(circle_at_90%_16%,rgba(34,211,238,0.22),transparent_24%),radial-gradient(circle_at_52%_100%,rgba(168,85,247,0.25),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-5">
        <header className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_0_80px_rgba(236,72,153,0.18)] backdrop-blur lg:grid-cols-[1fr_auto]">
          <section className="flex flex-col justify-center gap-4">
            <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.2em]">
              <span className="pill bg-fuchsia-500/20 text-fuchsia-100">Neon Math</span>
              <span className="pill bg-cyan-400/20 text-cyan-100">Lexa World</span>
              <span className="pill bg-amber-300/20 text-amber-100">Crown Energy</span>
            </div>
            <h1 className="text-4xl font-black leading-none drop-shadow-[0_0_18px_rgba(236,72,153,0.75)] md:text-6xl">Lexa Slay Math Quest</h1>
            <p className="max-w-3xl text-lg leading-8 text-cyan-50/85">A neon study arena where Lexa hypes every answer, streak, reward, mission, and comeback.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="player-name">Player name</label>
              <input
                id="player-name"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && savePlayer()}
                placeholder="Enter player name"
                className="min-h-14 min-w-0 flex-1 rounded-[1.25rem] border-2 border-white/15 bg-white/10 px-4 text-lg font-bold text-white outline-none placeholder:text-white/45 focus:border-cyan-300"
              />
              <Button onClick={savePlayer} size="lg" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"><Star className="h-5 w-5" /> Save Player</Button>
            </div>
          </section>
          <LexaCharacter pose="home" size="hero" className="mx-auto" />
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-4">
            <nav className="grid gap-2 rounded-[1.5rem] border border-white/10 bg-black/35 p-2 sm:grid-cols-6">
              {nav.map(({ id, label, icon: Icon }) => (
                <Button key={id} onClick={() => openView(id)} variant={view === id && !started ? "default" : "secondary"} className={view === id && !started ? "justify-center bg-fuchsia-500 text-white hover:bg-fuchsia-400" : "justify-center bg-white/10 text-white ring-white/15 hover:bg-white/15"}>
                  <Icon className="h-5 w-5" /> {label}
                </Button>
              ))}
            </nav>
            {started ? renderGame() : renderView()}
          </div>
          <aside className="grid content-start gap-4">
            <Panel>
              <div className="flex gap-4">
                <LexaCharacter pose={streak >= 3 ? "celebrate" : "avatar"} size="sm" />
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.2em] text-fuchsia-100">Lexa Line</div>
                  <p className="mt-1 text-lg font-black leading-snug">{line}</p>
                </div>
              </div>
            </Panel>
            <Panel title="Player HUD" icon={Crown}>
              <Stat icon={Crown} label="Crowns" value={scores.reduce((sum, item) => sum + item.correct * 5, 0)} />
              <Stat icon={Gem} label="Gems" value={scores.filter((item) => item.correct === item.total).length} />
              <Stat icon={Heart} label="Games" value={activeTotals?.games ?? 0} />
              <div className="rounded-[1.25rem] bg-white/10 p-4 font-black">{player || "No player saved"}</div>
            </Panel>
            <Panel title="Scoreboard" icon={Trophy}>
              {leaderboard.length === 0 ? <p className="text-white/65">No scores yet. The crown is waiting.</p> : leaderboard.map((item, rank) => (
                <div key={item.id} className="rounded-[1.25rem] bg-white/10 p-4 ring-1 ring-white/10">
                  <div className="flex justify-between gap-2 font-black"><span>#{rank + 1} {item.player}</span><span className="text-amber-100">{item.score}</span></div>
                  <div className="mt-1 text-sm text-white/55">{item.activity ?? "Math"} / {item.correct}/{item.total} / {item.date}</div>
                </div>
              ))}
            </Panel>
          </aside>
        </section>
      </div>
    </main>
  );

  function renderView() {
    if (view === "fashion") return <FeatureView pose="fashion" icon={Shirt} title="Style power rising" cards={fashionSlots} detail="Placeholder loadout tabs for hair, tops, jackets, shoes, and accessories." />;
    if (view === "missions") return <FeatureView pose="encourage" icon={Target} title="Small goals. Big slay." cards={missionCards} detail="Mission board placeholders for future quest tracking." />;
    if (view === "shop") return <FeatureView pose="shop" icon={ShoppingBag} title="Fresh drops just landed" cards={shopCards} detail="Reward and style shop placeholders only. No purchases are wired." />;
    if (view === "rewards") return <RewardsView leaderboard={leaderboard} playerTotals={playerTotals} />;
    if (view === "spelling") return renderSpelling();
    return (
      <Panel>
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="grid content-center gap-5">
            <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <div className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Lexa says</div>
              <p className="mt-3 text-2xl font-black">{line}</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-[1.5rem] border border-amber-200/25 bg-amber-300/10 p-5">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-amber-100"><BookOpen className="h-5 w-5" /> Math Quest</div>
                <h2 className="mt-3 text-3xl font-black">Start a neon math round</h2>
                <p className="mt-2 text-white/70">Multiple choice math stays intact, now with Lexa reactions, streak callouts, crowns, gems, and scoreboard logging.</p>
                <Button onClick={startRound} size="xl" className="mt-5 bg-amber-300 text-slate-950 hover:bg-amber-200"><Zap className="h-5 w-5" /> Start Math</Button>
              </div>
              <div className="rounded-[1.5rem] border border-fuchsia-200/25 bg-fuchsia-400/10 p-5">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-fuchsia-100"><SpellCheck className="h-5 w-5" /> Spelling Studio</div>
                <h2 className="mt-3 text-3xl font-black">Hear a word, then spell it</h2>
                <p className="mt-2 text-white/70">The vocabulary reader now uses a slower, clearer English voice and a slow replay option.</p>
                <Button onClick={() => openView("spelling")} size="xl" className="mt-5 bg-fuchsia-400 text-white hover:bg-fuchsia-300"><Volume2 className="h-5 w-5" /> Start Spelling</Button>
              </div>
            </div>
          </div>
          <LexaCharacter pose="gameplay" size="lg" className="mx-auto" />
        </div>
      </Panel>
    );
  }

  function renderSpelling() {
    if (spellingDone) {
      return (
        <Panel>
          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <LexaCharacter pose="celebrate" size="lg" className="mx-auto" />
            <div className="grid content-center gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-fuchsia-400 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white"><Trophy className="h-5 w-5" /> Spelling Score Logged</div>
              <h2 className="text-4xl font-black">{getLexaLine("levelComplete")}</h2>
              <p className="text-xl text-cyan-50/85">{player} scored {spellingScore} with {spellingCorrect}/{spellingRound.length} correct.</p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => openView("play")} size="lg">Back to Lobby</Button>
                <Button onClick={() => startSpelling(spellingMode)} variant="secondary" size="lg" className="bg-white/10 text-white ring-white/15">Play Again</Button>
              </div>
            </div>
          </div>
        </Panel>
      );
    }

    return (
      <Panel>
        <div className="grid gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-black uppercase tracking-[0.2em]">Spelling Studio</div>
              <div className="flex flex-wrap gap-2 text-sm font-black">
                <Badge>Score {spellingScore}</Badge><Badge>Correct {spellingCorrect}</Badge><Badge>{spellingIndex + 1}/{spellingRound.length}</Badge><Badge>{spellingMode}</Badge>
              </div>
            </div>
            <Progress value={Math.round((spellingIndex / spellingRound.length) * 100)} />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div className="grid gap-4">
              <div>
                <h2 className="text-3xl font-black leading-tight md:text-5xl">Listen, then spell the vocabulary word</h2>
                <p className="mt-3 text-cyan-50/75">Clue: {currentSpelling?.clue ?? "Choose a spelling mode to begin."}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SPELLING_MODES.map((mode) => (
                  <Button key={mode} onClick={() => startSpelling(mode)} variant={spellingMode === mode ? "default" : "secondary"} className={spellingMode === mode ? "bg-fuchsia-500 text-white hover:bg-fuchsia-400" : "bg-white/10 text-white ring-white/15 hover:bg-white/15"}>
                    {mode}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => currentSpelling && speakVocabularyWord(currentSpelling.word)} size="lg" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"><Volume2 className="h-5 w-5" /> Hear Word</Button>
                <Button onClick={() => currentSpelling && speakVocabularyWord(currentSpelling.word, true)} size="lg" variant="secondary" className="bg-white/10 text-white ring-white/15"><Volume2 className="h-5 w-5" /> Slower Replay</Button>
              </div>
            </div>
            <LexaCharacter pose="encourage" size="md" className="hidden lg:flex" />
          </div>

          <div className="grid gap-3">
            <label className="sr-only" htmlFor="spelling-answer">Type the spelling word</label>
            <input
              id="spelling-answer"
              value={typedWord}
              onChange={(event) => setTypedWord(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && answerSpelling()}
              placeholder="Type the word you heard"
              disabled={Boolean(spellingFeedback)}
              className="min-h-16 rounded-[1.5rem] border-2 border-white/15 bg-white/10 px-5 text-2xl font-black text-white outline-none placeholder:text-white/45 focus:border-fuchsia-300 disabled:opacity-70"
            />
            <div className="flex flex-wrap gap-3">
              <Button onClick={answerSpelling} disabled={!typedWord.trim() || Boolean(spellingFeedback)} size="lg" className="bg-amber-300 text-slate-950 hover:bg-amber-200"><SpellCheck className="h-5 w-5" /> Submit</Button>
              {spellingFeedback && spellingIndex + 1 < spellingRound.length && <Button onClick={nextSpellingWord} variant="secondary" size="lg" className="bg-white/10 text-white ring-white/15">Next Word</Button>}
            </div>
          </div>

          {spellingFeedback && (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-lg font-bold">
              {spellingFeedback}
            </div>
          )}
        </div>
      </Panel>
    );
  }

  function renderGame() {
    if (done) {
      return (
        <Panel>
          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <LexaCharacter pose="celebrate" size="lg" className="mx-auto" />
            <div className="grid content-center gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-slate-950"><Trophy className="h-5 w-5" /> Score Logged</div>
              <h2 className="text-4xl font-black">{line}</h2>
              <p className="text-xl text-cyan-50/85">{player} scored {score} with {correct}/{round.length} correct.</p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setStarted(false)} size="lg">Back to Lobby</Button>
                <Button onClick={startRound} variant="secondary" size="lg" className="bg-white/10 text-white ring-white/15">Play Again</Button>
              </div>
            </div>
          </div>
        </Panel>
      );
    }

    return (
      <Panel>
        <div className="grid gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-black uppercase tracking-[0.2em]">Math Quest</div>
              <div className="flex flex-wrap gap-2 text-sm font-black">
                <Badge>Score {score}</Badge><Badge>Correct {correct}</Badge><Badge>{index + 1}/{round.length}</Badge><Badge>Streak {streak}</Badge>
              </div>
            </div>
            <Progress value={Math.round((index / round.length) * 100)} />
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-black leading-tight md:text-5xl">{current.prompt}</h2>
              <p className="mt-3 text-cyan-50/75">Choose the answer that unlocks the next glow tile.</p>
            </div>
            <LexaCharacter pose={selected ? (selected === current.answer ? "celebrate" : "encourage") : "gameplay"} size="md" className="hidden lg:flex" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {current.choices.map((choice) => (
              <Button key={choice} onClick={() => answer(choice)} disabled={Boolean(selected)} variant="choice" className={choiceClass(choice)}>
                {choice}
              </Button>
            ))}
          </div>
          {selected && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <div className="text-lg font-bold">{line}</div>
              {index + 1 < round.length && <Button onClick={nextQuestion} variant="secondary" className="bg-white/10 text-white ring-white/15">Next</Button>}
            </div>
          )}
        </div>
      </Panel>
    );
  }

  function choiceClass(choice: string) {
    const base = "border-white/15 bg-white/10 text-white hover:border-cyan-300 hover:bg-cyan-300/15";
    if (!selected) return base;
    if (choice === current.answer) return `${base} border-emerald-300 bg-emerald-400/20 text-emerald-50`;
    if (choice === selected) return `${base} border-rose-300 bg-rose-400/20 text-rose-50`;
    return base;
  }
}

function FeatureView({ pose, icon: Icon, title, detail, cards }: { pose: "fashion" | "shop" | "encourage"; icon: typeof Shirt; title: string; detail: string; cards: string[] }) {
  return (
    <Panel>
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <LexaCharacter pose={pose} size="lg" className="mx-auto" />
        <div className="grid content-center gap-5">
          <div><div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-100"><Icon className="h-5 w-5" /> Lexa Zone</div><h2 className="mt-2 text-4xl font-black">{title}</h2><p className="mt-2 text-white/70">{detail}</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => <div key={card} className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 font-black">{card}<div className="mt-1 text-sm font-semibold text-white/60">Placeholder</div></div>)}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function RewardsView({ leaderboard, playerTotals }: { leaderboard: ScoreRecord[]; playerTotals: [string, { games: number; points: number; correct: number }][] }) {
  return (
    <Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <RewardList title="Top Scores" rows={leaderboard.map((item, index) => `#${index + 1} ${item.player}: ${item.score}`)} />
        <RewardList title="Player Totals" rows={playerTotals.map(([name, item]) => `${name}: ${item.points} points, ${item.correct} correct`)} />
      </div>
    </Panel>
  );
}

function RewardList({ title, rows }: { title: string; rows: string[] }) {
  return <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5"><h3 className="text-2xl font-black">{title}</h3><div className="mt-4 grid gap-3">{rows.length ? rows.map((row) => <div key={row} className="rounded-[1rem] bg-black/35 p-3 font-bold">{row}</div>) : <p className="text-white/65">Play a round to unlock this board.</p>}</div></div>;
}

function Panel({ children, title, icon: Icon }: { children: React.ReactNode; title?: string; icon?: typeof Crown }) {
  return (
    <Card className="border-white/10 bg-white/[0.07] text-white shadow-[0_0_60px_rgba(34,211,238,0.10)] backdrop-blur">
      <CardContent className="space-y-3 p-5 md:p-6">
        {title && Icon && <h2 className="flex items-center gap-2 text-2xl font-black"><Icon className="h-6 w-6 text-cyan-200" /> {title}</h2>}
        {children}
      </CardContent>
    </Card>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-white/10">{children}</span>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Crown; label: string; value: number }) {
  return <div className="flex items-center justify-between rounded-[1.25rem] bg-white/10 p-4"><span className="flex items-center gap-2 font-black"><Icon className="h-5 w-5 text-cyan-200" /> {label}</span><span className="font-black text-amber-100">{value}</span></div>;
}
