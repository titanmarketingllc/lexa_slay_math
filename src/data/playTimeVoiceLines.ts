export const playTimeVoiceLines = {
  runnerCorrect: ["Crown secured.", "That lane was legendary.", "You dodged the drama and found the answer."],
  runnerWrong: ["Wrong lane, right comeback.", "No stress. Swerve and slay.", "New lane, new chance."],
  runnerComplete: ["Crown Rush complete.", "You ran that city.", "Speed, sparkle, science, math. Iconic."],
  match: ["Gem match glow-up.", "That combo had sparkle.", "You matched that like a pro."],
  brainBurst: ["Brain Burst unlocked.", "Quick question, big reward.", "Smart move bonus incoming."],
  matchCorrect: ["Gems and genius. Powerful combo.", "Brain Burst handled.", "That answer sparkled."],
  matchWrong: ["Close one. The lab has notes.", "No worries. New match, new chance.", "Check the hint and keep glowing."],
  buzzStart: ["Beat the Buzz is live.", "Tap smart. Tap fast. Tap cute.", "Rhythm brain: activated."],
  buzzCorrect: ["Perfect hit.", "That beat got slayed.", "Timing and brains. That is unfair."],
  buzzMiss: ["Missed beat, no defeat.", "Reset the rhythm. You've got this.", "The beat got sneaky."],
  buzzComplete: ["Buzz beaten.", "That rhythm had no chance.", "You turned brain power into a bop."],
} as const;

export type PlayTimeLineCategory = keyof typeof playTimeVoiceLines;

export function getPlayTimeLine(category: PlayTimeLineCategory) {
  const lines = playTimeVoiceLines[category];
  return lines[Math.floor(Math.random() * lines.length)] ?? "Keep playing and keep glowing.";
}
