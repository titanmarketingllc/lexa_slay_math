"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Crown, Medal, Sparkles, SpellCheck, Star, Trophy, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Activity = "math" | "spelling";
type Difficulty = "Starter" | "Builder" | "Challenge";

type ScoreRecord = {
  id: string;
  playerName: string;
  activity: Activity;
  difficulty: Difficulty | "Mixed";
  score: number;
  correct: number;
  total: number;
  date: string;
};

type MathQuestion = {
  prompt: string;
  choices: string[];
  answer: string;
  tip: string;
};

type SpellingWord = {
  word: string;
  difficulty: Difficulty;
  clue: string;
};

const SCOREBOARD_KEY = "lexa-slay-scoreboard-v1";
const PLAYER_KEY = "lexa-slay-current-player-v1";

const MATH_QUESTIONS: MathQuestion[] = [
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

const SPELLING_WORDS: SpellingWord[] = [
  { word: "about", difficulty: "Starter", clue: "Concerning something" },
  { word: "again", difficulty: "Starter", clue: "One more time" },
  { word: "always", difficulty: "Starter", clue: "Every time" },
  { word: "answer", difficulty: "Starter", clue: "A reply or solution" },
  { word: "because", difficulty: "Starter", clue: "For the reason that" },
  { word: "before", difficulty: "Starter", clue: "Earlier than" },
  { word: "better", difficulty: "Starter", clue: "More good" },
  { word: "between", difficulty: "Starter", clue: "In the middle of two things" },
  { word: "brought", difficulty: "Starter", clue: "Carried with you" },
  { word: "caught", difficulty: "Starter", clue: "Grabbed or captured" },
  { word: "different", difficulty: "Starter", clue: "Not the same" },
  { word: "enough", difficulty: "Starter", clue: "As much as needed" },
  { word: "favorite", difficulty: "Starter", clue: "Liked the most" },
  { word: "friend", difficulty: "Starter", clue: "Someone you like and trust" },
  { word: "important", difficulty: "Starter", clue: "Matters a lot" },
  { word: "inside", difficulty: "Starter", clue: "Within something" },
  { word: "minute", difficulty: "Starter", clue: "Sixty seconds" },
  { word: "people", difficulty: "Starter", clue: "More than one person" },
  { word: "picture", difficulty: "Starter", clue: "A drawing or photo" },
  { word: "sentence", difficulty: "Starter", clue: "A group of words with a complete idea" },
  { word: "through", difficulty: "Starter", clue: "From one side to the other" },
  { word: "usually", difficulty: "Starter", clue: "Most of the time" },
  { word: "weather", difficulty: "Starter", clue: "Rain, sun, wind, and storms" },
  { word: "without", difficulty: "Starter", clue: "Not having something" },
  { word: "although", difficulty: "Builder", clue: "Even though" },
  { word: "beautiful", difficulty: "Builder", clue: "Very pretty" },
  { word: "believe", difficulty: "Builder", clue: "To think something is true" },
  { word: "business", difficulty: "Builder", clue: "A company or trade" },
  { word: "calendar", difficulty: "Builder", clue: "Tracks days, weeks, and months" },
  { word: "careful", difficulty: "Builder", clue: "Doing something with caution" },
  { word: "certain", difficulty: "Builder", clue: "Sure or specific" },
  { word: "complete", difficulty: "Builder", clue: "Finished" },
  { word: "continue", difficulty: "Builder", clue: "Keep going" },
  { word: "describe", difficulty: "Builder", clue: "Tell what something is like" },
  { word: "direction", difficulty: "Builder", clue: "A way to go or an instruction" },
  { word: "discover", difficulty: "Builder", clue: "Find something new" },
  { word: "exercise", difficulty: "Builder", clue: "Activity for your body" },
  { word: "favorite", difficulty: "Builder", clue: "Liked the most" },
  { word: "finally", difficulty: "Builder", clue: "At last" },
  { word: "history", difficulty: "Builder", clue: "Events from the past" },
  { word: "imagine", difficulty: "Builder", clue: "Picture in your mind" },
  { word: "language", difficulty: "Builder", clue: "Words people use to communicate" },
  { word: "library", difficulty: "Builder", clue: "A place with books" },
  { word: "measure", difficulty: "Builder", clue: "Find the size or amount" },
  { word: "natural", difficulty: "Builder", clue: "From nature" },
  { word: "possible", difficulty: "Builder", clue: "Can happen" },
  { word: "probably", difficulty: "Builder", clue: "Likely" },
  { word: "question", difficulty: "Builder", clue: "Something you ask" },
  { word: "remember", difficulty: "Builder", clue: "Keep in your mind" },
  { word: "separate", difficulty: "Builder", clue: "To keep apart" },
  { word: "special", difficulty: "Builder", clue: "Not ordinary" },
  { word: "straight", difficulty: "Builder", clue: "Not curved" },
  { word: "surprise", difficulty: "Builder", clue: "Something unexpected" },
  { word: "therefore", difficulty: "Builder", clue: "For that reason" },
  { word: "whether", difficulty: "Builder", clue: "Used when comparing choices" },
  { word: "accident", difficulty: "Challenge", clue: "Something that happens by mistake" },
  { word: "actually", difficulty: "Challenge", clue: "Really or truly" },
  { word: "adventure", difficulty: "Challenge", clue: "An exciting experience" },
  { word: "attention", difficulty: "Challenge", clue: "Focused listening or watching" },
  { word: "audience", difficulty: "Challenge", clue: "People watching or listening" },
  { word: "available", difficulty: "Challenge", clue: "Ready to use" },
  { word: "community", difficulty: "Challenge", clue: "A group of people in one area" },
  { word: "confidence", difficulty: "Challenge", clue: "Believing you can do it" },
  { word: "courageous", difficulty: "Challenge", clue: "Brave" },
  { word: "curiosity", difficulty: "Challenge", clue: "Wanting to learn or know" },
  { word: "dangerous", difficulty: "Challenge", clue: "Not safe" },
  { word: "decision", difficulty: "Challenge", clue: "A choice" },
  { word: "delicious", difficulty: "Challenge", clue: "Very tasty" },
  { word: "dictionary", difficulty: "Challenge", clue: "A book or site with word meanings" },
  { word: "embarrass", difficulty: "Challenge", clue: "To make someone feel awkward" },
  { word: "especially", difficulty: "Challenge", clue: "More than usual" },
  { word: "experience", difficulty: "Challenge", clue: "Something you do or live through" },
  { word: "experiment", difficulty: "Challenge", clue: "A science test" },
  { word: "government", difficulty: "Challenge", clue: "The people who run a city, state, or country" },
  { word: "guarantee", difficulty: "Challenge", clue: "A promise" },
  { word: "immediately", difficulty: "Challenge", clue: "Right away" },
  { word: "independent", difficulty: "Challenge", clue: "Able to do things on your own" },
  { word: "knowledge", difficulty: "Challenge", clue: "What you know" },
  { word: "necessary", difficulty: "Challenge", clue: "Needed" },
  { word: "occasion", difficulty: "Challenge", clue: "A special event or time" },
  { word: "opportunity", difficulty: "Challenge", clue: "A chance" },
  { word: "organization", difficulty: "Challenge", clue: "A group or the act of arranging things" },
  { word: "particular", difficulty: "Challenge", clue: "Specific" },
  { word: "performance", difficulty: "Challenge", clue: "How well someone does" },
  { word: "recommend", difficulty: "Challenge", clue: "Suggest as a good choice" },
  { word: "responsible", difficulty: "Challenge", clue: "Trusted to handle something" },
  { word: "schedule", difficulty: "Challenge", clue: "A plan for when things happen" },
  { word: "successful", difficulty: "Challenge", clue: "Having a good result" },
  { word: "temperature", difficulty: "Challenge", clue: "How hot or cold something is" },
  { word: "understand", difficulty: "Challenge", clue: "To know what something means" },
  { word: "wonderful", difficulty: "Challenge", clue: "Very good" },
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function loadScores(): ScoreRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SCOREBOARD_KEY) ?? "[]") as ScoreRecord[];
  } catch {
    return [];
  }
}

function getStoredPlayer() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PLAYER_KEY) ?? "";
}

export default function LexaSlayLearningHub() {
  const [playerName, setPlayerName] = useState(getStoredPlayer);
  const [pendingName, setPendingName] = useState(getStoredPlayer);
  const [scores, setScores] = useState<ScoreRecord[]>(loadScores);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | "Mixed">("Mixed");
  const [mathQuestions, setMathQuestions] = useState(() => shuffle(MATH_QUESTIONS));
  const [spellingWords, setSpellingWords] = useState(() => shuffle(SPELLING_WORDS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typedWord, setTypedWord] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  const leaderboard = useMemo(
    () => [...scores].sort((a, b) => b.score - a.score || b.correct - a.correct).slice(0, 10),
    [scores],
  );

  const playerTotals = useMemo(() => {
    const totals = new Map<string, { games: number; points: number; correct: number }>();
    for (const record of scores) {
      const current = totals.get(record.playerName) ?? { games: 0, points: 0, correct: 0 };
      totals.set(record.playerName, {
        games: current.games + 1,
        points: current.points + record.score,
        correct: current.correct + record.correct,
      });
    }
    return [...totals.entries()].sort((a, b) => b[1].points - a[1].points).slice(0, 8);
  }, [scores]);

  const currentMath = mathQuestions[index];
  const currentSpelling = spellingWords[index];
  const total = activity === "math" ? mathQuestions.length : spellingWords.length;
  const progress = total ? Math.round((index / total) * 100) : 0;

  useEffect(() => {
    window.localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scores));
  }, [scores]);

  function savePlayer() {
    const cleanName = pendingName.trim();
    if (!cleanName) return;
    setPlayerName(cleanName);
    window.localStorage.setItem(PLAYER_KEY, cleanName);
  }

  function startActivity(nextActivity: Activity, nextDifficulty: Difficulty | "Mixed" = "Mixed") {
    if (!playerName.trim()) {
      setFeedback("Enter your name first so your score counts.");
      return;
    }

    setActivity(nextActivity);
    setDifficulty(nextDifficulty);
    setIndex(0);
    setScore(0);
    setCorrect(0);
    setSelected(null);
    setTypedWord("");
    setFeedback("");
    setFinished(false);

    if (nextActivity === "math") {
      setMathQuestions(shuffle(MATH_QUESTIONS));
    } else {
      const pool = nextDifficulty === "Mixed" ? SPELLING_WORDS : SPELLING_WORDS.filter((word) => word.difficulty === nextDifficulty);
      setSpellingWords(shuffle(pool).slice(0, 15));
    }
  }

  function logScore(finalScore: number, finalCorrect: number, finalTotal: number) {
    const record: ScoreRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      playerName: playerName.trim(),
      activity: activity ?? "math",
      difficulty,
      score: finalScore,
      correct: finalCorrect,
      total: finalTotal,
      date: new Date().toLocaleDateString(),
    };
    setScores((current) => [record, ...current].slice(0, 100));
  }

  function finishGame(nextScore = score, nextCorrect = correct) {
    setFinished(true);
    logScore(nextScore, nextCorrect, total);
  }

  function nextRound() {
    const nextIndex = index + 1;
    setSelected(null);
    setTypedWord("");
    setFeedback("");
    if (nextIndex >= total) {
      finishGame();
      return;
    }
    setIndex(nextIndex);
  }

  function answerMath(choice: string) {
    if (!currentMath || selected) return;
    setSelected(choice);
    const isCorrect = choice === currentMath.answer;
    const nextScore = score + (isCorrect ? 10 : 0);
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    setScore(nextScore);
    setCorrect(nextCorrect);
    setFeedback(isCorrect ? "Correct. Slay move." : `Not quite. ${currentMath.tip}`);
    if (index + 1 >= total) {
      setTimeout(() => finishGame(nextScore, nextCorrect), 450);
    }
  }

  function answerSpelling() {
    if (!currentSpelling || finished) return;
    const isCorrect = normalize(typedWord) === normalize(currentSpelling.word);
    const nextScore = score + (isCorrect ? (currentSpelling.difficulty === "Challenge" ? 20 : currentSpelling.difficulty === "Builder" ? 15 : 10) : 0);
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    setScore(nextScore);
    setCorrect(nextCorrect);
    setFeedback(isCorrect ? "Nailed it. Dictionary domination." : `Good try. Correct spelling: ${currentSpelling.word}`);
    if (index + 1 >= total) {
      setTimeout(() => finishGame(nextScore, nextCorrect), 450);
    }
  }

  function speakWord() {
    if (!currentSpelling || typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(currentSpelling.word);
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  }

  function resetScoreboard() {
    setScores([]);
    window.localStorage.removeItem(SCOREBOARD_KEY);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffe7d6_34%,#dff7f3_100%)] px-3 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <Card className="bg-white/90 shadow-[0_24px_80px_rgba(36,23,12,0.12)] backdrop-blur">
          <CardHeader className="gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                <span className="rounded-full bg-amber-100 px-3 py-1">Math Quest</span>
                <span className="rounded-full bg-rose-100 px-3 py-1">Spelling Game</span>
                <span className="rounded-full bg-cyan-100 px-3 py-1">Player Scoreboard</span>
              </div>
              <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                {playerName ? `Player: ${playerName}` : "Name required before play"}
              </div>
            </div>
            <CardTitle className="flex flex-col gap-2 text-4xl font-black leading-none text-slate-950 md:text-6xl">
              <span className="flex items-center gap-3"><Crown className="h-10 w-10 text-amber-500" /> Lexa Slay Learning Quest</span>
            </CardTitle>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Choose a player, take a math round or spelling round, and every completed session logs to the scoreboard. No name, no score. Tiny accountability goblin included.
            </p>
          </CardHeader>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <section className="flex flex-col gap-5">
            <Card className="bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
              <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:p-6">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-lg font-black text-slate-900"><Users className="h-5 w-5" /> Who is playing?</div>
                  <input
                    value={pendingName}
                    onChange={(event) => setPendingName(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && savePlayer()}
                    placeholder="Enter player name"
                    className="min-h-14 w-full rounded-[1.25rem] border-2 border-slate-200 bg-white px-4 text-lg font-bold text-slate-900 outline-none focus:border-amber-300"
                  />
                </div>
                <Button onClick={savePlayer} size="lg" className="self-end"><Star className="h-5 w-5" /> Save Player</Button>
              </CardContent>
            </Card>

            {!activity ? (
              <Card className="bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
                <CardContent className="grid gap-5 p-5 md:grid-cols-2 md:p-8">
                  <div className="rounded-[2rem] bg-amber-50 p-6 ring-1 ring-amber-100">
                    <div className="text-5xl">🧮</div>
                    <h2 className="mt-4 text-3xl font-black text-slate-950">Math Quest</h2>
                    <p className="mt-2 text-slate-600">Fast multiple choice practice with points logged by player.</p>
                    <Button onClick={() => startActivity("math")} size="xl" className="mt-5 w-full"><BookOpen className="h-5 w-5" /> Start Math</Button>
                  </div>
                  <div className="rounded-[2rem] bg-rose-50 p-6 ring-1 ring-rose-100">
                    <div className="text-5xl">🔤</div>
                    <h2 className="mt-4 text-3xl font-black text-slate-950">4th Grade Spelling</h2>
                    <p className="mt-2 text-slate-600">Words are split into Starter, Builder, and Challenge sections.</p>
                    <div className="mt-5 grid gap-2">
                      {(["Starter", "Builder", "Challenge", "Mixed"] as const).map((level) => (
                        <Button key={level} onClick={() => startActivity("spelling", level)} variant="secondary" className="w-full justify-center">
                          <SpellCheck className="h-5 w-5" /> {level} Spelling
                        </Button>
                      ))}
                    </div>
                  </div>
                  {feedback && <div className="md:col-span-2 rounded-[1.5rem] bg-slate-100 p-4 font-bold text-slate-700">{feedback}</div>}
                </CardContent>
              </Card>
            ) : finished ? (
              <Card className="bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
                <CardContent className="space-y-5 p-8 text-center">
                  <div className="text-7xl">🏆</div>
                  <h2 className="text-4xl font-black text-slate-950">Score Logged</h2>
                  <p className="text-xl font-bold text-slate-700">{playerName} scored {score} with {correct}/{total} correct.</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={() => setActivity(null)} size="lg">Back to Games</Button>
                    <Button onClick={() => startActivity(activity, difficulty)} variant="secondary" size="lg">Play Again</Button>
                  </div>
                </CardContent>
              </Card>
            ) : activity === "math" && currentMath ? (
              <Card className="bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
                <CardContent className="space-y-5 p-5 md:p-8">
                  <GameHeader activityLabel="Math Quest" index={index} total={total} score={score} correct={correct} progress={progress} />
                  <h2 className="text-3xl font-black text-slate-950 md:text-5xl">{currentMath.prompt}</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {currentMath.choices.map((choice) => (
                      <Button key={choice} onClick={() => answerMath(choice)} variant="choice" className={selected === choice ? (choice === currentMath.answer ? "border-emerald-400 bg-emerald-50" : "border-rose-400 bg-rose-50") : ""}>{choice}</Button>
                    ))}
                  </div>
                  {feedback && <ResultBar feedback={feedback} onNext={nextRound} showNext={Boolean(selected)} />}
                </CardContent>
              </Card>
            ) : currentSpelling ? (
              <Card className="bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
                <CardContent className="space-y-5 p-5 md:p-8">
                  <GameHeader activityLabel={`${difficulty} Spelling`} index={index} total={total} score={score} correct={correct} progress={progress} />
                  <div className="rounded-[2rem] bg-rose-50 p-5 ring-1 ring-rose-100">
                    <div className="text-sm font-black uppercase tracking-[0.2em] text-rose-700">{currentSpelling.difficulty}</div>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">Clue: {currentSpelling.clue}</h2>
                    <Button onClick={speakWord} variant="secondary" className="mt-4">Hear Word</Button>
                  </div>
                  <input
                    value={typedWord}
                    onChange={(event) => setTypedWord(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && answerSpelling()}
                    placeholder="Type the spelling word"
                    className="min-h-16 w-full rounded-[1.5rem] border-2 border-slate-200 bg-white px-5 text-2xl font-black text-slate-900 outline-none focus:border-rose-300"
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={answerSpelling} size="lg"><Sparkles className="h-5 w-5" /> Submit</Button>
                    {feedback && <Button onClick={nextRound} variant="secondary" size="lg">Next Word</Button>}
                  </div>
                  {feedback && <div className="rounded-[1.5rem] bg-slate-100 p-4 text-lg font-bold text-slate-700">{feedback}</div>}
                </CardContent>
              </Card>
            ) : null}
          </section>

          <aside className="flex flex-col gap-5">
            <Card className="bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-black"><Trophy className="h-6 w-6 text-amber-500" /> Scoreboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.length === 0 ? <p className="text-slate-600">No scores yet. Somebody has to be first. Fame is calling.</p> : leaderboard.map((record, rank) => (
                  <div key={record.id} className="rounded-[1.25rem] bg-slate-50 p-4 ring-1 ring-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-black text-slate-950">#{rank + 1} {record.playerName}</div>
                      <div className="font-black text-amber-700">{record.score}</div>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-500">{record.activity} · {record.difficulty} · {record.correct}/{record.total} · {record.date}</div>
                  </div>
                ))}
                {scores.length > 0 && <Button onClick={resetScoreboard} variant="outline" className="w-full justify-center">Clear Scoreboard</Button>}
              </CardContent>
            </Card>

            <Card className="bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-black"><Medal className="h-6 w-6 text-rose-500" /> Player Totals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {playerTotals.length === 0 ? <p className="text-slate-600">Totals appear after completed rounds.</p> : playerTotals.map(([name, totalStats]) => (
                  <div key={name} className="rounded-[1.25rem] bg-cyan-50 p-4 ring-1 ring-cyan-100">
                    <div className="font-black text-slate-950">{name}</div>
                    <div className="text-sm font-semibold text-slate-600">{totalStats.points} points · {totalStats.correct} correct · {totalStats.games} games</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function GameHeader({ activityLabel, index, total, score, correct, progress }: { activityLabel: string; index: number; total: number; score: number; correct: number; progress: number }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-white">{activityLabel}</div>
        <div className="flex flex-wrap gap-2 text-sm font-black text-slate-700">
          <span className="rounded-full bg-amber-100 px-3 py-1">Score {score}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1">Correct {correct}</span>
          <span className="rounded-full bg-cyan-100 px-3 py-1">{index + 1}/{total}</span>
        </div>
      </div>
      <Progress value={progress} />
    </div>
  );
}

function ResultBar({ feedback, onNext, showNext }: { feedback: string; onNext: () => void; showNext: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-slate-100 p-4">
      <div className="text-lg font-bold text-slate-700">{feedback}</div>
      {showNext && <Button onClick={onNext} variant="secondary">Next</Button>}
    </div>
  );
}
