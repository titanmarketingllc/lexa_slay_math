export type SpellingDifficulty = "Starter" | "Builder" | "Challenge";
export type SpellingMode = SpellingDifficulty | "Mixed";

export type SpellingWord = {
  word: string;
  clue: string;
};

export type SpellingPrompt = SpellingWord & {
  difficulty: SpellingDifficulty;
};

export const SPELLING_DIFFICULTIES = ["Starter", "Builder", "Challenge"] as const;
export const SPELLING_MODES = [...SPELLING_DIFFICULTIES, "Mixed"] as const;

const SPELLING_WORD_BANK: Record<SpellingDifficulty, SpellingWord[]> = {
  Starter: [
    { word: "about", clue: "Concerning something" },
    { word: "again", clue: "One more time" },
    { word: "always", clue: "Every time" },
    { word: "answer", clue: "A reply or solution" },
    { word: "because", clue: "For the reason that" },
    { word: "before", clue: "Earlier than" },
    { word: "better", clue: "More good" },
    { word: "between", clue: "In the middle of two things" },
    { word: "brought", clue: "Carried with you" },
    { word: "caught", clue: "Grabbed or captured" },
    { word: "different", clue: "Not the same" },
    { word: "enough", clue: "As much as needed" },
    { word: "favorite", clue: "Liked the most" },
    { word: "friend", clue: "Someone you like and trust" },
    { word: "important", clue: "Matters a lot" },
    { word: "inside", clue: "Within something" },
    { word: "minute", clue: "Sixty seconds" },
    { word: "people", clue: "More than one person" },
    { word: "picture", clue: "A drawing or photo" },
    { word: "sentence", clue: "A group of words with a complete idea" },
    { word: "through", clue: "From one side to the other" },
    { word: "usually", clue: "Most of the time" },
    { word: "weather", clue: "Rain, sun, wind, and storms" },
    { word: "without", clue: "Not having something" },
  ],
  Builder: [
    { word: "although", clue: "Even though" },
    { word: "beautiful", clue: "Very pretty" },
    { word: "believe", clue: "To think something is true" },
    { word: "business", clue: "A company or trade" },
    { word: "calendar", clue: "Tracks days, weeks, and months" },
    { word: "careful", clue: "Doing something with caution" },
    { word: "certain", clue: "Sure or specific" },
    { word: "complete", clue: "Finished" },
    { word: "continue", clue: "Keep going" },
    { word: "describe", clue: "Tell what something is like" },
    { word: "direction", clue: "A way to go or an instruction" },
    { word: "discover", clue: "Find something new" },
    { word: "exercise", clue: "Activity for your body" },
    { word: "favorite", clue: "Liked the most" },
    { word: "finally", clue: "At last" },
    { word: "history", clue: "Events from the past" },
    { word: "imagine", clue: "Picture in your mind" },
    { word: "language", clue: "Words people use to communicate" },
    { word: "library", clue: "A place with books" },
    { word: "measure", clue: "Find the size or amount" },
    { word: "natural", clue: "From nature" },
    { word: "possible", clue: "Can happen" },
    { word: "probably", clue: "Likely" },
    { word: "question", clue: "Something you ask" },
    { word: "remember", clue: "Keep in your mind" },
    { word: "separate", clue: "To keep apart" },
    { word: "special", clue: "Not ordinary" },
    { word: "straight", clue: "Not curved" },
    { word: "surprise", clue: "Something unexpected" },
    { word: "therefore", clue: "For that reason" },
    { word: "whether", clue: "Used when comparing choices" },
  ],
  Challenge: [
    { word: "accident", clue: "Something that happens by mistake" },
    { word: "actually", clue: "Really or truly" },
    { word: "adventure", clue: "An exciting experience" },
    { word: "attention", clue: "Focused listening or watching" },
    { word: "audience", clue: "People watching or listening" },
    { word: "available", clue: "Ready to use" },
    { word: "community", clue: "A group of people in one area" },
    { word: "confidence", clue: "Believing you can do it" },
    { word: "courageous", clue: "Brave" },
    { word: "curiosity", clue: "Wanting to learn or know" },
    { word: "dangerous", clue: "Not safe" },
    { word: "decision", clue: "A choice" },
    { word: "delicious", clue: "Very tasty" },
    { word: "dictionary", clue: "A book or site with word meanings" },
    { word: "embarrass", clue: "To make someone feel awkward" },
    { word: "especially", clue: "More than usual" },
    { word: "experience", clue: "Something you do or live through" },
    { word: "experiment", clue: "A science test" },
    { word: "government", clue: "The people who run a city, state, or country" },
    { word: "guarantee", clue: "A promise" },
    { word: "immediately", clue: "Right away" },
    { word: "independent", clue: "Able to do things on your own" },
    { word: "knowledge", clue: "What you know" },
    { word: "necessary", clue: "Needed" },
    { word: "occasion", clue: "A special event or time" },
    { word: "opportunity", clue: "A chance" },
    { word: "organization", clue: "A group or the act of arranging things" },
    { word: "particular", clue: "Specific" },
    { word: "performance", clue: "How well someone does" },
    { word: "recommend", clue: "Suggest as a good choice" },
    { word: "responsible", clue: "Trusted to handle something" },
    { word: "schedule", clue: "A plan for when things happen" },
    { word: "successful", clue: "Having a good result" },
    { word: "temperature", clue: "How hot or cold something is" },
    { word: "understand", clue: "To know what something means" },
    { word: "wonderful", clue: "Very good" },
  ],
};

export function getSpellingWordsForDifficulty(difficulty: SpellingDifficulty): SpellingPrompt[] {
  return SPELLING_WORD_BANK[difficulty].map((word) => ({ ...word, difficulty }));
}

export function getAllSpellingWords(): SpellingPrompt[] {
  return SPELLING_DIFFICULTIES.flatMap(getSpellingWordsForDifficulty);
}
