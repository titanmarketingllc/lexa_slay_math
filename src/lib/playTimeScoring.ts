export const PLAY_TIME_STORAGE_KEYS = {
  crownRushBest: "lexa-playtime-crown-rush-best",
  gemMatchBest: "lexa-playtime-gem-match-best",
  beatBuzzBest: "lexa-playtime-beat-buzz-best",
  totalCrowns: "lexa-playtime-total-crowns",
} as const;

export function readNumber(key: string) {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(key) ?? "0");
}

export function saveBestScore(key: string, score: number) {
  const best = Math.max(readNumber(key), score);
  window.localStorage.setItem(key, String(best));
  return best;
}

export function addCrowns(amount: number) {
  const next = readNumber(PLAY_TIME_STORAGE_KEYS.totalCrowns) + amount;
  window.localStorage.setItem(PLAY_TIME_STORAGE_KEYS.totalCrowns, String(next));
  return next;
}
