export const lexaVoiceLines = {
  start: [
    "Ready to start? Take your time and choose carefully.",
    "Let's build your score one answer at a time.",
    "Math mode is on. You can do this.",
    "Crown up. Think it through.",
    "Stay calm, read the question, and make your move.",
  ],
  correct: [
    "Correct. Great work.",
    "Yes. That answer is right.",
    "Nice thinking. You got it.",
    "That is the right answer. Keep going.",
    "Smart move. Your score is growing.",
  ],
  streak: [
    "Streak started. Keep focusing.",
    "You are on a roll.",
    "Crown streak active. Stay sharp.",
    "Great momentum. Keep reading closely.",
    "That is strong practice. Keep going.",
  ],
  nearMiss: [
    "Very close. Check the question one more time.",
    "Almost. Try the next one with the hint in mind.",
    "You were near the answer. Keep practicing.",
    "One small step away. You can get the next one.",
    "Good effort. Try again with a fresh look.",
  ],
  wrong: [
    "Not quite. Read the hint and try the next one.",
    "That answer was not right, but you are still learning.",
    "Reset and refocus. The next question is a new chance.",
    "Good try. Mistakes help your brain grow.",
    "Keep going. Practice makes the next answer easier.",
  ],
  levelComplete: [
    "Round complete. Your score has been saved.",
    "Level complete. Nice work today.",
    "You finished the round and earned your crowns.",
    "Great practice. Check your score on the board.",
    "Score logged. You are building real skill.",
  ],
  reward: [
    "Reward earned. Nice job.",
    "Your practice unlocked a sparkle reward.",
    "You earned this by finishing strong.",
    "Crown bonus unlocked for your effort.",
    "Gems and crowns grow when you keep practicing.",
  ],
  fashion: [
    "Choose a style that feels powerful.",
    "Style power is rising.",
    "New look, same smart player.",
    "Pick a look and bring that confidence back to math.",
    "Crown-worthy style is ready.",
  ],
  shop: [
    "Fresh rewards are ready to preview.",
    "Boosts, outfits, and sparkle rewards are here.",
    "Pick the power-up you want to show off.",
    "Style upgrade ready when you are.",
    "Choose a reward and keep practicing.",
  ],
  mission: [
    "Mission time. Start with one goal.",
    "Small goals can lead to big wins.",
    "Your quests are ready.",
    "One task at a time. Wins stack up.",
    "Quest mode is calling. Pick a goal and begin.",
  ],
  idle: [
    "I am ready when you are.",
    "No rush. Start when you feel ready.",
    "Tiny steps still count.",
    "You have got this.",
    "Tap play when you are ready to practice.",
  ],
  scienceStart: [
    "Welcome to the Slay Lab.",
    "Science mode: activated.",
    "Grab your goggles. We're about to glow.",
    "Let's test it, prove it, slay it.",
    "Tiny scientist, big brain energy.",
  ],
  scienceCorrect: [
    "That hypothesis hit.",
    "Certified science slay.",
    "Data says: you crushed it.",
    "That answer has lab-coat confidence.",
    "Boom. Science sparkle.",
  ],
  scienceWrong: [
    "No stress. Experiments are for learning.",
    "That result was unexpected. Try again.",
    "Science loves a comeback.",
    "New data, new move.",
    "Good try. Check the explanation and keep going.",
  ],
  scienceLevelComplete: [
    "Lab level slayed.",
    "Crown earned, goggles glowing.",
    "You just upgraded your science brain.",
    "The lab report says: iconic.",
    "Science boss defeated.",
  ],
} as const;

export type LexaLineCategory = keyof typeof lexaVoiceLines;

export function getLexaLine(category: LexaLineCategory): string {
  const lines = lexaVoiceLines[category];
  return lines[Math.floor(Math.random() * lines.length)] ?? lexaVoiceLines.idle[0];
}
