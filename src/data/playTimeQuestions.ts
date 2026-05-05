export type MiniGameSubject = "math" | "science" | "vocabulary" | "patterns";
export type MiniGameDifficulty = "easy" | "medium" | "hard";

export type MiniGameQuestion = {
  id: string;
  subject: MiniGameSubject;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: MiniGameDifficulty;
};

export const playTimeQuestions: MiniGameQuestion[] = [
  { id: "pt-math-01", subject: "math", prompt: "8 + 7 = ?", choices: ["13", "15", "16"], correctAnswer: "15", difficulty: "easy" },
  { id: "pt-math-02", subject: "math", prompt: "6 x 4 = ?", choices: ["20", "24", "28"], correctAnswer: "24", difficulty: "easy" },
  { id: "pt-math-03", subject: "math", prompt: "36 / 6 = ?", choices: ["5", "6", "8"], correctAnswer: "6", difficulty: "easy" },
  { id: "pt-math-04", subject: "math", prompt: "12 x 3 = ?", choices: ["36", "32", "42"], correctAnswer: "36", difficulty: "medium" },
  { id: "pt-math-05", subject: "math", prompt: "100 - 45 = ?", choices: ["55", "65", "45"], correctAnswer: "55", difficulty: "medium" },
  { id: "pt-math-06", subject: "math", prompt: "9 x 7 = ?", choices: ["56", "63", "72"], correctAnswer: "63", difficulty: "medium" },
  { id: "pt-math-07", subject: "math", prompt: "48 / 8 = ?", choices: ["6", "7", "8"], correctAnswer: "6", difficulty: "medium" },
  { id: "pt-math-08", subject: "math", prompt: "25 + 36 = ?", choices: ["51", "61", "71"], correctAnswer: "61", difficulty: "hard" },
  { id: "pt-math-09", subject: "math", prompt: "11 x 5 = ?", choices: ["45", "55", "65"], correctAnswer: "55", difficulty: "hard" },
  { id: "pt-math-10", subject: "math", prompt: "81 / 9 = ?", choices: ["8", "9", "10"], correctAnswer: "9", difficulty: "hard" },
  { id: "pt-sci-01", subject: "science", prompt: "Which is a solid?", choices: ["Ice cube", "Steam", "Air"], correctAnswer: "Ice cube", explanation: "A solid keeps its own shape.", difficulty: "easy" },
  { id: "pt-sci-02", subject: "science", prompt: "What gives Earth light and heat?", choices: ["The Sun", "The Moon", "Clouds"], correctAnswer: "The Sun", explanation: "The Sun gives Earth most of its light and heat.", difficulty: "easy" },
  { id: "pt-sci-03", subject: "science", prompt: "What do plants need to make food?", choices: ["Sunlight", "Plastic", "Rocks only"], correctAnswer: "Sunlight", explanation: "Plants use sunlight, water, and air to make food.", difficulty: "easy" },
  { id: "pt-sci-04", subject: "science", prompt: "What force pulls objects toward Earth?", choices: ["Gravity", "Sound", "Friction only"], correctAnswer: "Gravity", difficulty: "medium" },
  { id: "pt-sci-05", subject: "science", prompt: "Which is a gas?", choices: ["Oxygen", "Book", "Ice"], correctAnswer: "Oxygen", difficulty: "medium" },
  { id: "pt-sci-06", subject: "science", prompt: "What causes day and night?", choices: ["Earth rotating", "Clouds spinning", "The Sun turning off"], correctAnswer: "Earth rotating", difficulty: "medium" },
  { id: "pt-sci-07", subject: "science", prompt: "Which is a producer?", choices: ["Grass", "Rabbit", "Fox"], correctAnswer: "Grass", difficulty: "medium" },
  { id: "pt-sci-08", subject: "science", prompt: "What is erosion?", choices: ["Moving rocks and soil", "A plant making food", "A sound wave"], correctAnswer: "Moving rocks and soil", difficulty: "hard" },
  { id: "pt-sci-09", subject: "science", prompt: "What does a mirror do to light?", choices: ["Reflects it", "Freezes it", "Turns it into sound"], correctAnswer: "Reflects it", difficulty: "hard" },
  { id: "pt-sci-10", subject: "science", prompt: "Which object is a star?", choices: ["The Sun", "The Moon", "Earth"], correctAnswer: "The Sun", difficulty: "hard" },
  { id: "pt-word-01", subject: "vocabulary", prompt: "Which word means very large?", choices: ["Tiny", "Huge", "Quiet"], correctAnswer: "Huge", difficulty: "easy" },
  { id: "pt-pat-01", subject: "patterns", prompt: "What comes next: red, blue, red, blue, ?", choices: ["Red", "Green", "Yellow"], correctAnswer: "Red", difficulty: "easy" },
  { id: "pt-word-02", subject: "vocabulary", prompt: "Which word means the opposite of fast?", choices: ["Slow", "Quick", "Bright"], correctAnswer: "Slow", difficulty: "easy" },
  { id: "pt-pat-02", subject: "patterns", prompt: "What comes next: 2, 4, 6, 8, ?", choices: ["10", "9", "12"], correctAnswer: "10", difficulty: "easy" },
  { id: "pt-word-03", subject: "vocabulary", prompt: "Which word means to look closely?", choices: ["Observe", "Ignore", "Drop"], correctAnswer: "Observe", difficulty: "medium" },
  { id: "pt-pat-03", subject: "patterns", prompt: "What comes next: star, crown, star, crown, ?", choices: ["Star", "Heart", "Gem"], correctAnswer: "Star", difficulty: "medium" },
  { id: "pt-word-04", subject: "vocabulary", prompt: "Which word means happy and excited?", choices: ["Thrilled", "Bored", "Sleepy"], correctAnswer: "Thrilled", difficulty: "medium" },
  { id: "pt-pat-04", subject: "patterns", prompt: "What comes next: A, B, A, B, ?", choices: ["A", "C", "D"], correctAnswer: "A", difficulty: "medium" },
  { id: "pt-word-05", subject: "vocabulary", prompt: "Which word means to guess using clues?", choices: ["Infer", "Erase", "Float"], correctAnswer: "Infer", difficulty: "hard" },
  { id: "pt-pat-05", subject: "patterns", prompt: "What comes next: 5, 10, 15, 20, ?", choices: ["25", "22", "30"], correctAnswer: "25", difficulty: "hard" },
];

export function getPlayTimeQuestion(index: number) {
  return playTimeQuestions[index % playTimeQuestions.length];
}
