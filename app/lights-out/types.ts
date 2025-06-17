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

export interface MoveRecord {
  id: string;
  row: number;
  col: number;
  timestamp: number;
  moveNumber: number;
  boardState: GameBoard;
}

export interface GameState {
  board: GameBoard;
  solution: Set<string>;
  playerMoves: Set<string>;
}
