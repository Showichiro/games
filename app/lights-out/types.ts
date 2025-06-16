export type Cell = boolean;
export type GameBoard = Cell[][];
export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  minMoves: number;
  maxMoves: number;
  label: string;
}

export interface TutorialStep {
  title: string;
  content: string;
  highlight: string | null;
}
