"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Crown,
  Gem,
  Heart,
  Lock,
  Medal,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Question = {
  level: string;
  emoji: string;
  prompt: string;
  choices: string[];
  answer: string;
  tip: string;
};

type Reward = {
  name: string;
  icon: string;
  rule: string;
};

type SavedProgress = {
  bestScore: number;
  starsBank: number;
  gems: number;
  sessionsPlayed: number;
  sessionsWon: number;
  totalCorrect: number;
  longestStreak: number;
  rewardsUnlocked: string[];
};

const STORAGE_KEY = "lexa-slay-progress-v1";

const QUESTIONS: Question[] = [
  {
    level: "Slay Mountain",
    emoji: "🐉",
    prompt: "Which number is a multiple of 6?",
    choices: ["14", "18", "25", "29"],
    answer: "18",
    tip: "Skip count by 6: 6, 12, 18, 24.",
  },
  {
    level: "Slay Mountain",
    emoji: "🐉",
    prompt: "What is the 5th multiple of 4?",
    choices: ["16", "20", "24", "12"],
    answer: "20",
    tip: "4, 8, 12, 16, 20.",
  },
  {
    level: "Factor Fairies",
    emoji: "🧚",
    prompt: "Which number is a factor of 15?",
    choices: ["4", "6", "3", "8"],
    answer: "3",
    tip: "A factor goes into a number evenly. 15 divided by 3 equals 5.",
  },
  {
    level: "Factor Fairies",
    emoji: "🧚",
    prompt: "Which list shows all the factors of 12?",
    choices: [
      "1, 2, 3, 4, 6, 12",
      "2, 4, 8, 12",
      "1, 3, 5, 12",
      "6, 12, 18",
    ],
    answer: "1, 2, 3, 4, 6, 12",
    tip: "Factor pairs for 12 are 1x12, 2x6, and 3x4.",
  },
  {
    level: "Pattern Pop Palace",
    emoji: "✨",
    prompt: "What comes next? 5, 10, 15, __",
    choices: ["18", "20", "25", "30"],
    answer: "20",
    tip: "The pattern adds 5 each time.",
  },
  {
    level: "Pattern Pop Palace",
    emoji: "✨",
    prompt: "What comes next? 3, 6, 12, __",
    choices: ["15", "18", "24", "9"],
    answer: "24",
    tip: "This one doubles each step: 3, 6, 12, 24.",
  },
  {
    level: "Squad Castle",
    emoji: "🏰",
    prompt: "There are 24 students. 4 per group. How many groups?",
    choices: ["4", "5", "6", "8"],
    answer: "6",
    tip: "When you know the group size, divide. 24 divided by 4 equals 6.",
  },
  {
    level: "Squad Castle",
    emoji: "🏰",
    prompt: "There are 5 teams with 6 players each. How many players total?",
    choices: ["11", "25", "30", "35"],
    answer: "30",
    tip: "Each means multiply. 5 times 6 equals 30.",
  },
  {
    level: "Even-Odd Island",
    emoji: "🌴",
    prompt: "Which number is odd?",
    choices: ["18", "24", "27", "32"],
    answer: "27",
    tip: "Odd numbers end in 1, 3, 5, 7, or 9.",
  },
  {
    level: "Even-Odd Island",
    emoji: "🌴",
    prompt: "Which number is even?",
    choices: ["11", "19", "22", "33"],
    answer: "22",
    tip: "Even numbers end in 0, 2, 4, 6, or 8.",
  },
  {
    level: "Slay Mountain",
    emoji: "🐉",
    prompt: "Which number is a multiple of 9?",
    choices: ["27", "25", "22", "31"],
    answer: "27",
    tip: "Count by 9s: 9, 18, 27.",
  },
  {
    level: "Slay Mountain",
    emoji: "🐉",
    prompt: "What is the 6th multiple of 3?",
    choices: ["12", "15", "18", "21"],
    answer: "18",
    tip: "3, 6, 9, 12, 15, 18.",
  },
  {
    level: "Factor Fairies",
    emoji: "🧚",
    prompt: "Which number is a factor of 24?",
    choices: ["5", "7", "8", "11"],
    answer: "8",
    tip: "24 divided by 8 equals 3 with no remainder.",
  },
  {
    level: "Factor Fairies",
    emoji: "🧚",
    prompt: "Which list shows factor pairs for 18?",
    choices: ["1x18, 2x9, 3x6", "2x8, 3x5", "1x12, 2x6", "6x6, 3x3"],
    answer: "1x18, 2x9, 3x6",
    tip: "Factor pairs multiply to the number exactly.",
  },
  {
    level: "Pattern Pop Palace",
    emoji: "✨",
    prompt: "What comes next? 100, 90, 80, __",
    choices: ["60", "70", "75", "85"],
    answer: "70",
    tip: "Subtract 10 each time.",
  },
  {
    level: "Pattern Pop Palace",
    emoji: "✨",
    prompt: "What comes next? 4, 7, 10, __",
    choices: ["12", "13", "14", "15"],
    answer: "13",
    tip: "Add 3 each time.",
  },
  {
    level: "Squad Castle",
    emoji: "🏰",
    prompt: "There are 21 stickers. Put 3 on each page. How many pages?",
    choices: ["6", "7", "8", "9"],
    answer: "7",
    tip: "Groups of 3 means divide 21 by 3.",
  },
  {
    level: "Squad Castle",
    emoji: "🏰",
    prompt: "Four bags hold 8 marbles each. How many marbles total?",
    choices: ["12", "24", "28", "32"],
    answer: "32",
    tip: "Equal groups means multiply 4 by 8.",
  },
  {
    level: "Even-Odd Island",
    emoji: "🌴",
    prompt: "Which pair has two even numbers?",
    choices: ["13 and 17", "22 and 40", "15 and 18", "31 and 33"],
    answer: "22 and 40",
    tip: "Even numbers both end in 0, 2, 4, 6, or 8.",
  },
  {
    level: "Even-Odd Island",
    emoji: "🌴",
    prompt: "Which number is odd and greater than 20?",
    choices: ["18", "20", "23", "24"],
    answer: "23",
    tip: "23 ends in 3, so it is odd.",
  },
  {
    level: "Fraction Fountain",
    emoji: "💧",
    prompt: "Which fraction means one out of four equal parts?",
    choices: ["1/2", "1/3", "1/4", "4/1"],
    answer: "1/4",
    tip: "The denominator tells how many equal pieces there are.",
  },
  {
    level: "Fraction Fountain",
    emoji: "💧",
    prompt: "Which is larger?",
    choices: ["1/2", "1/4", "They are equal", "Impossible to tell"],
    answer: "1/2",
    tip: "One half is bigger than one fourth.",
  },
  {
    level: "Fraction Fountain",
    emoji: "💧",
    prompt: "What fraction of this set is shaded if 3 out of 5 parts are colored?",
    choices: ["3/5", "5/3", "2/5", "3/8"],
    answer: "3/5",
    tip: "The top number is shaded parts. The bottom is total parts.",
  },
  {
    level: "Fraction Fountain",
    emoji: "💧",
    prompt: "Which fraction shows two equal pieces out of six?",
    choices: ["2/3", "2/6", "6/2", "1/2"],
    answer: "2/6",
    tip: "Numerator first, denominator second.",
  },
  {
    level: "Time Twist Tower",
    emoji: "⏰",
    prompt: "How many minutes are in 1 hour?",
    choices: ["30", "60", "90", "100"],
    answer: "60",
    tip: "Every hour has 60 minutes.",
  },
  {
    level: "Time Twist Tower",
    emoji: "⏰",
    prompt: "What time is 30 minutes after 2:15?",
    choices: ["2:30", "2:45", "3:15", "3:45"],
    answer: "2:45",
    tip: "Add 30 minutes to 15 minutes.",
  },
  {
    level: "Time Twist Tower",
    emoji: "⏰",
    prompt: "School starts at 8:00 and ends at 3:00. How many hours is that?",
    choices: ["5", "6", "7", "8"],
    answer: "7",
    tip: "Count the hours from 8 to 3.",
  },
  {
    level: "Time Twist Tower",
    emoji: "⏰",
    prompt: "Which clock time is quarter past 6?",
    choices: ["6:45", "6:15", "7:15", "5:45"],
    answer: "6:15",
    tip: "Quarter past means 15 minutes after.",
  },
];

const coachNotes = [
  { label: "Multiples", detail: "skip count to spot the rhythm", tone: "bg-amber-100" },
  { label: "Factors", detail: "divide evenly with no leftovers", tone: "bg-rose-100" },
  { label: "Groups of", detail: "usually means divide", tone: "bg-cyan-100" },
  { label: "Each", detail: "usually means multiply", tone: "bg-emerald-100" },
  { label: "Fractions", detail: "top is parts you have, bottom is total parts", tone: "bg-violet-100" },
  { label: "Time", detail: "quarter past = :15 and half past = :30", tone: "bg-lime-100" },
];

const allRewards: Reward[] = [
  { name: "First Spark", icon: "✨", rule: "Play 1 game" },
  { name: "Streak Sprite", icon: "🔥", rule: "Hit a 5-answer streak" },
  { name: "Gem Guardian", icon: "💎", rule: "Earn 25 gems total" },
  { name: "Crown Collector", icon: "👑", rule: "Score 180 or more in one game" },
  { name: "Practice Pro", icon: "🏅", rule: "Finish 3 full sessions" },
];

const defaultProgress: SavedProgress = {
  bestScore: 0,
  starsBank: 0,
  gems: 0,
  sessionsPlayed: 0,
  sessionsWon: 0,
  totalCorrect: 0,
  longestStreak: 0,
  rewardsUnlocked: [],
};

function loadSavedProgress() {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultProgress;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      ...defaultProgress,
      ...parsed,
      rewardsUnlocked: parsed.rewardsUnlocked ?? [],
    };
  } catch {
    return defaultProgress;
  }
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getBadge(score: number) {
  if (score >= 180) {
    return {
      name: "Lexa Slay Legend",
      icon: "👑",
      message: "Total math queen energy. You owned the whole map.",
    };
  }

  if (score >= 120) {
    return {
      name: "Sparkle Solver",
      icon: "💖",
      message: "You are crushing it. Your practice is paying off.",
    };
  }

  if (score >= 70) {
    return {
      name: "Pattern Princess",
      icon: "✨",
      message: "You are getting stronger every round.",
    };
  }

  return {
    name: "Slay Starter",
    icon: "🌈",
    message: "Every big win starts somewhere. Keep going.",
  };
}

function getLevelCounts() {
  const counts = new Map<string, number>();

  for (const question of QUESTIONS) {
    counts.set(question.level, (counts.get(question.level) ?? 0) + 1);
  }

  return counts;
}

const levelCounts = getLevelCounts();

export default function LexaSlayMathQuest() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState(() => shuffle(QUESTIONS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreakThisRound, setBestStreakThisRound] = useState(0);
  const [hearts, setHearts] = useState(4);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [savedProgress, setSavedProgress] = useState<SavedProgress>(loadSavedProgress);

  const audioContextRef = useRef<AudioContext | null>(null);

  const current = questions[index];
  const done = index >= questions.length || hearts <= 0;
  const progress = useMemo(
    () => Math.round((index / questions.length) * 100),
    [index, questions.length],
  );
  const badge = getBadge(score);
  const remainingQuestions = Math.max(questions.length - index, 0);
  const accuracy = index === 0 ? 0 : Math.round((correctCount / index) * 100);
  const masteryPercent = Math.min(
    100,
    Math.round((savedProgress.totalCorrect / QUESTIONS.length) * 100),
  );
  const currentLevelCount = current ? levelCounts.get(current.level) ?? 0 : 0;
  const currentLevelSeen = current
    ? questions
        .slice(0, index + 1)
        .filter((question) => question.level === current.level).length
    : 0;
  const currentLevelProgress =
    currentLevelCount === 0 ? 0 : Math.round((currentLevelSeen / currentLevelCount) * 100);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
  }, [savedProgress]);

  function playTone(frequency: number, duration: number, type: OscillatorType, volume: number) {
    if (!soundOn || typeof window === "undefined") return;

    const AudioContextCtor = window.AudioContext;
    if (!AudioContextCtor) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    const now = context.currentTime;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  function playCorrectSound() {
    playTone(523, 0.12, "triangle", 0.06);
    setTimeout(() => playTone(659, 0.16, "triangle", 0.05), 90);
  }

  function playWrongSound() {
    playTone(220, 0.18, "sawtooth", 0.05);
  }

  function playRewardSound() {
    playTone(659, 0.12, "sine", 0.05);
    setTimeout(() => playTone(784, 0.12, "sine", 0.05), 60);
    setTimeout(() => playTone(988, 0.18, "sine", 0.05), 120);
  }

  function unlockRewards(next: SavedProgress) {
    const unlocked = new Set(next.rewardsUnlocked);

    if (next.sessionsPlayed >= 1) unlocked.add("First Spark");
    if (next.longestStreak >= 5) unlocked.add("Streak Sprite");
    if (next.gems >= 25) unlocked.add("Gem Guardian");
    if (next.bestScore >= 180) unlocked.add("Crown Collector");
    if (next.sessionsWon >= 3) unlocked.add("Practice Pro");

    const nextRewards = [...unlocked];

    if (nextRewards.length > next.rewardsUnlocked.length) {
      playRewardSound();
    }

    return {
      ...next,
      rewardsUnlocked: nextRewards,
    };
  }

  function finalizeGame(params: {
    finalScore: number;
    finalStarsEarned: number;
    finalGemsEarned: number;
    finalCorrectCount: number;
    finalBestStreak: number;
    won: boolean;
  }) {
    setSavedProgress((currentProgress) => {
      const nextProgress = {
        ...currentProgress,
        bestScore: Math.max(currentProgress.bestScore, params.finalScore),
        starsBank: currentProgress.starsBank + params.finalStarsEarned,
        gems: currentProgress.gems + params.finalGemsEarned,
        sessionsPlayed: currentProgress.sessionsPlayed + 1,
        sessionsWon: currentProgress.sessionsWon + (params.won ? 1 : 0),
        totalCorrect: currentProgress.totalCorrect + params.finalCorrectCount,
        longestStreak: Math.max(currentProgress.longestStreak, params.finalBestStreak),
      };

      return unlockRewards(nextProgress);
    });
  }

  function startGame() {
    setQuestions(shuffle(QUESTIONS));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreakThisRound(0);
    setHearts(4);
    setSelected(null);
    setCorrectCount(0);
    setStarsEarned(0);
    setGemsEarned(0);
    setStarted(true);
  }

  function choose(choice: string) {
    if (selected) return;

    setSelected(choice);
    const correct = choice === current.answer;
    const isLastQuestion = index === questions.length - 1;

    if (correct) {
      const nextStreak = streak + 1;
      const bonus = nextStreak % 3 === 0 ? 20 : 0;
      const starPrize = 1 + (nextStreak >= 5 ? 1 : 0);
      const gemPrize = nextStreak % 4 === 0 ? 2 : 1;
      const nextScore = score + 10 + bonus;
      const nextCorrectCount = correctCount + 1;
      const nextStarsEarned = starsEarned + starPrize;
      const nextGemsEarned = gemsEarned + gemPrize;
      const nextBestStreak = Math.max(bestStreakThisRound, nextStreak);

      setStreak(nextStreak);
      setBestStreakThisRound(nextBestStreak);
      setScore(nextScore);
      setCorrectCount(nextCorrectCount);
      setStarsEarned(nextStarsEarned);
      setGemsEarned(nextGemsEarned);
      playCorrectSound();

      if (isLastQuestion) {
        finalizeGame({
          finalScore: nextScore,
          finalStarsEarned: nextStarsEarned,
          finalGemsEarned: nextGemsEarned,
          finalCorrectCount: nextCorrectCount,
          finalBestStreak: nextBestStreak,
          won: true,
        });
      }

      return;
    }

    const nextHearts = hearts - 1;

    setHearts(nextHearts);
    setStreak(0);
    playWrongSound();

    if (nextHearts <= 0) {
      finalizeGame({
        finalScore: score,
        finalStarsEarned: starsEarned,
        finalGemsEarned: gemsEarned,
        finalCorrectCount: correctCount,
        finalBestStreak: bestStreakThisRound,
        won: false,
      });
    }
  }

  function nextQuestion() {
    setIndex((value) => value + 1);
    setSelected(null);
  }

  const unlockedRewards = allRewards.filter((reward) =>
    savedProgress.rewardsUnlocked.includes(reward.name),
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff8ef_0%,#ffe7d6_28%,#dff7f3_100%)] px-3 py-4 sm:px-4 md:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[-5rem] top-[-4rem] h-48 w-48 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="absolute right-[-2rem] top-20 h-56 w-56 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-white/60 bg-white/85 shadow-[0_24px_80px_rgba(36,23,12,0.12)] backdrop-blur">
            <CardHeader className="gap-4 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                  <span className="rounded-full bg-amber-100 px-3 py-1">Study Adventure</span>
                  <span className="rounded-full bg-rose-100 px-3 py-1">Fast Feedback</span>
                  <span className="rounded-full bg-cyan-100 px-3 py-1">Playful Practice</span>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setSoundOn((value) => !value)}
                  className="rounded-full px-4 py-2 text-sm font-bold"
                >
                  {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {soundOn ? "Sound On" : "Sound Off"}
                </Button>
              </div>
              <CardTitle className="flex flex-col gap-3 text-4xl leading-none text-slate-900 md:text-6xl">
                <span className="flex items-center gap-3">
                  <Crown className="h-10 w-10 text-amber-500 md:h-14 md:w-14" />
                  Lexa Slay Math Quest
                </span>
              </CardTitle>
              <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                More levels, more rewards, and quick audio feedback so practice feels like a game and still builds real study confidence.
              </p>
            </CardHeader>
          </Card>
        </motion.div>

        {!started ? (
          <Card className="border-white/70 bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
            <CardContent className="grid gap-8 p-6 md:grid-cols-[1.35fr_0.95fr] md:p-10">
              <div className="space-y-6">
                <div className="text-6xl md:text-8xl">👑✨💖</div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                    Ready to level up?
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600">
                    The quest now includes fractions, time, more patterns, more factors, plus rewards and saved progress so each practice round means something.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] bg-amber-50 p-5 shadow-sm ring-1 ring-amber-100">
                    <div className="text-2xl">⭐</div>
                    <div className="mt-3 text-lg font-black text-slate-900">Earn stars</div>
                    <p className="mt-1 text-sm text-slate-600">for correct answers and hot streaks</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-rose-50 p-5 shadow-sm ring-1 ring-rose-100">
                    <div className="text-2xl">💎</div>
                    <div className="mt-3 text-lg font-black text-slate-900">Collect gems</div>
                    <p className="mt-1 text-sm text-slate-600">to unlock reward titles over time</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-cyan-50 p-5 shadow-sm ring-1 ring-cyan-100">
                    <div className="text-2xl">🎯</div>
                    <div className="mt-3 text-lg font-black text-slate-900">Track progress</div>
                    <p className="mt-1 text-sm text-slate-600">with saved best scores and sessions</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-slate-100 p-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Best Score
                    </div>
                    <div className="mt-2 text-3xl font-black text-slate-900">
                      {savedProgress.bestScore}
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-100 p-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Rewards Unlocked
                    </div>
                    <div className="mt-2 text-3xl font-black text-slate-900">
                      {savedProgress.rewardsUnlocked.length}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-5 w-5" />
                  Start Slaying
                </Button>
              </div>

              <div className="space-y-4">
                <div className="rounded-[2rem] bg-[linear-gradient(180deg,#fff9f2_0%,#fff0ea_48%,#eefaf8_100%)] p-6 ring-1 ring-white">
                  <div className="flex items-center gap-3 text-slate-900">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    <h2 className="text-2xl font-black">Quest Map</h2>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {Array.from(levelCounts.entries()).map(([level, count]) => (
                      <div
                        key={level}
                        className="rounded-[1.4rem] bg-white/80 p-4 text-slate-700 ring-1 ring-white"
                      >
                        <div className="font-black text-slate-900">{level}</div>
                        <div className="text-sm">{count} questions in the mix</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white/75 p-6 ring-1 ring-white">
                  <div className="flex items-center gap-3 text-slate-900">
                    <Medal className="h-6 w-6 text-rose-500" />
                    <h2 className="text-2xl font-black">Coach Corner</h2>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {coachNotes.map((note) => (
                      <div
                        key={note.label}
                        className={`rounded-[1.4rem] p-4 text-slate-700 ring-1 ring-white ${note.tone}`}
                      >
                        <div className="font-black text-slate-900">{note.label}</div>
                        <div className="text-sm">{note.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : done ? (
          <Card className="border-white/70 bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
            <CardContent className="space-y-5 p-6 text-center md:p-10">
              <div className="text-7xl md:text-8xl">{badge.icon}</div>
              <h2 className="text-4xl font-black text-slate-950 md:text-6xl">
                Quest Complete
              </h2>
              <p className="text-2xl text-slate-700 md:text-3xl">
                Score: <strong>{score}</strong>
              </p>
              <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
                <div className="rounded-[1.6rem] bg-amber-50 p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                    Stars Won
                  </div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{starsEarned}</div>
                </div>
                <div className="rounded-[1.6rem] bg-rose-50 p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">
                    Gems Won
                  </div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{gemsEarned}</div>
                </div>
                <div className="rounded-[1.6rem] bg-cyan-50 p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    Accuracy
                  </div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{accuracy}%</div>
                </div>
              </div>
              <div className="mx-auto max-w-2xl rounded-[2rem] bg-[linear-gradient(135deg,#fff0da_0%,#ffe7f2_52%,#e6fbf7_100%)] p-6 text-left ring-1 ring-white">
                <div className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
                  Your badge
                </div>
                <div className="mt-2 text-3xl font-black text-slate-950">
                  {badge.name}
                </div>
                <div className="mt-2 text-lg leading-7 text-slate-700">
                  {badge.message}
                </div>
              </div>
              <p className="text-lg text-slate-600">
                {hearts <= 0
                  ? "No biggie. Missed questions are still study reps."
                  : "Boom. You leveled up your math confidence."}
              </p>
              <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
                <div className="rounded-[1.6rem] bg-white p-5 text-left ring-1 ring-slate-100">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Lifetime Progress
                  </div>
                  <div className="mt-3 space-y-2 text-slate-700">
                    <div>Best score: <strong>{savedProgress.bestScore}</strong></div>
                    <div>Total stars: <strong>{savedProgress.starsBank}</strong></div>
                    <div>Total gems: <strong>{savedProgress.gems}</strong></div>
                    <div>Sessions played: <strong>{savedProgress.sessionsPlayed}</strong></div>
                  </div>
                </div>
                <div className="rounded-[1.6rem] bg-white p-5 text-left ring-1 ring-slate-100">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Rewards Case
                  </div>
                  <div className="mt-3 grid gap-2">
                    {allRewards.map((reward) => {
                      const unlocked = savedProgress.rewardsUnlocked.includes(reward.name);

                      return (
                        <div
                          key={reward.name}
                          className={`flex items-center justify-between rounded-[1.2rem] px-4 py-3 ${
                            unlocked ? "bg-emerald-50 text-slate-900" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <div>
                            <div className="font-black">
                              {reward.icon} {reward.name}
                            </div>
                            <div className="text-sm">{reward.rule}</div>
                          </div>
                          {unlocked ? <Medal className="h-5 w-5 text-emerald-500" /> : <Lock className="h-5 w-5" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button onClick={startGame} size="lg">
                  Play Again
                </Button>
                <Button variant="secondary" onClick={() => setStarted(false)} size="lg">
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.95fr)] md:gap-5">
                <Card className="border-white/70 bg-white/92 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
                  <CardContent className="space-y-6 p-5 md:p-8">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 md:text-base">
                        <span className="text-xl">{current.emoji}</span>
                        {current.level}
                      </div>
                      <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                        {current.prompt}
                      </h2>
                      <p className="text-sm text-slate-500 md:text-base">
                        Question {index + 1} of {questions.length}
                      </p>
                    </div>

                    <div className="grid gap-3 md:gap-4">
                      {current.choices.map((choice) => {
                        const isCorrect = selected !== null && choice === current.answer;
                        const isWrong = selected === choice && choice !== current.answer;

                        return (
                          <Button
                            key={choice}
                            variant="choice"
                            onClick={() => choose(choice)}
                            disabled={selected !== null}
                            className={[
                              isCorrect
                                ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                                : "",
                              isWrong
                                ? "border-rose-500 bg-rose-50 text-rose-950"
                                : "",
                            ].join(" ")}
                          >
                            {choice}
                          </Button>
                        );
                      })}
                    </div>

                    {selected && (
                      <div className="space-y-4">
                        <div className="rounded-[1.75rem] bg-slate-100 p-5 text-lg leading-7 text-slate-700 md:text-xl">
                          {selected === current.answer ? (
                            <span>✅ Slay. You got it right.</span>
                          ) : (
                            <span>💡 Try this: {current.tip}</span>
                          )}
                        </div>
                        <Button onClick={nextQuestion} size="lg">
                          Next Question
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="border-white/70 bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
                    <CardContent className="space-y-4 p-5">
                      <div>
                        <div className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Journey Progress
                        </div>
                        <Progress value={progress} className="h-4" />
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Current Level
                        </div>
                        <Progress value={currentLevelProgress} className="h-3" />
                      </div>
                      <div className="rounded-[1.5rem] bg-amber-50 p-4 text-xl font-black text-slate-900">
                        <div className="flex items-center gap-2">
                          <Star className="h-6 w-6 text-amber-500" />
                          Score: {score}
                        </div>
                      </div>
                      <div className="rounded-[1.5rem] bg-rose-50 p-4 text-xl font-black text-slate-900">
                        <div className="flex items-center gap-2">
                          <Wand2 className="h-6 w-6 text-rose-500" />
                          Streak: {streak}
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] bg-violet-50 p-4">
                          <div className="flex items-center gap-2 text-xl font-black text-slate-900">
                            <Gem className="h-6 w-6 text-violet-500" />
                            Gems: {gemsEarned}
                          </div>
                        </div>
                        <div className="rounded-[1.5rem] bg-emerald-50 p-4">
                          <div className="flex items-center gap-2 text-xl font-black text-slate-900">
                            <Sparkles className="h-6 w-6 text-emerald-500" />
                            Stars: {starsEarned}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[1.5rem] bg-cyan-50 p-4">
                        <div className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Hearts
                        </div>
                        <div className="flex min-h-10 flex-wrap gap-1 text-3xl md:text-4xl">
                          {Array.from({ length: hearts }).map((_, itemIndex) => (
                            <Heart
                              key={itemIndex}
                              className="h-9 w-9 fill-rose-400 text-rose-500"
                            />
                          ))}
                          {hearts === 0 && (
                            <span className="text-base font-semibold text-slate-500">
                              Out of hearts
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="rounded-[1.5rem] bg-slate-100 p-4 text-slate-700">
                        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Study Stats
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div>Accuracy: <strong>{accuracy}%</strong></div>
                          <div>Remaining: <strong>{remainingQuestions}</strong></div>
                          <div>Best streak this run: <strong>{bestStreakThisRound}</strong></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-white/70 bg-white/90 shadow-[0_18px_60px_rgba(36,23,12,0.1)]">
                    <CardContent className="p-5">
                      <h3 className="text-2xl font-black text-slate-950">
                        Progress Vault
                      </h3>
                      <div className="mt-4 rounded-[1.4rem] bg-slate-100 p-4">
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Lifetime Mastery
                        </div>
                        <div className="mt-2 text-3xl font-black text-slate-900">
                          {masteryPercent}%
                        </div>
                        <div className="mt-3">
                          <Progress value={masteryPercent} className="h-3" />
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3">
                        <div className="rounded-[1.3rem] bg-amber-50 p-3">
                          <strong>Total stars:</strong> {savedProgress.starsBank}
                        </div>
                        <div className="rounded-[1.3rem] bg-violet-50 p-3">
                          <strong>Total gems:</strong> {savedProgress.gems}
                        </div>
                        <div className="rounded-[1.3rem] bg-rose-50 p-3">
                          <strong>Rewards unlocked:</strong> {unlockedRewards.length}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
