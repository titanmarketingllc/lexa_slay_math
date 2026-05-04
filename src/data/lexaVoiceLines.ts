export const lexaVoiceLines = {
  start: [
    "Ready to slay this round?",
    "Let's glow up that score.",
    "Math mode: activated.",
    "Crown up. Brain on.",
    "No panic. Just power moves.",
  ],
  correct: [
    "Slayed it.",
    "That was clean.",
    "Crown secured.",
    "Boom. Math magic.",
    "Correct and iconic.",
  ],
  streak: [
    "Slay streak!",
    "Combo queen.",
    "Crown rush activated.",
    "Keep that glow going.",
    "Major momentum.",
  ],
  nearMiss: [
    "So close. Tiny plot twist.",
    "Almost had it. Run it back.",
    "That was a near-slay.",
    "One more move and you've got it.",
    "No drama. Try again.",
  ],
  wrong: [
    "No stress. We level up from misses.",
    "Not that one, but your comeback is loading.",
    "Reset. Refocus. Slay again.",
    "Missed it, but you're still in the game.",
    "We learn, we glow, we go.",
  ],
  levelComplete: [
    "Level slayed.",
    "Crown earned.",
    "Victory looks good on you.",
    "Math boss defeated.",
    "That's a scoreboard glow-up.",
  ],
  reward: [
    "Reward secured.",
    "Shiny things for smart moves.",
    "You earned the sparkle.",
    "Crown bonus unlocked.",
    "Gems, crowns, and good decisions.",
  ],
  fashion: [
    "Fit check: legendary.",
    "Style power rising.",
    "Math, but make it fashion.",
    "New look, same genius.",
    "Crown-worthy style.",
  ],
  shop: [
    "Fresh drops just landed.",
    "Boosts, fits, and shiny bits.",
    "Pick your power-up.",
    "Style upgrade? Say less.",
    "Choose wisely. Slay loudly.",
  ],
  mission: [
    "Mission time.",
    "Small goals. Big slay.",
    "You've got quests to flex.",
    "One task at a time. Big wins stack.",
    "Quest mode is calling.",
  ],
  idle: [
    "I'm ready when you are.",
    "No rush. The crown can wait.",
    "Tiny steps still count.",
    "You got this. Obviously.",
    "Tap play when you're ready to slay.",
  ],
} as const;

export type LexaLineCategory = keyof typeof lexaVoiceLines;

export function getLexaLine(category: LexaLineCategory): string {
  const lines = lexaVoiceLines[category];
  return lines[Math.floor(Math.random() * lines.length)] ?? lexaVoiceLines.idle[0];
}
