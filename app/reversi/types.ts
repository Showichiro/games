export type Player = "black" | "white";
export type CellState = Player | null;
export type Board = CellState[][];

export interface Position {
  row: number;
  col: number;
}

export type GameStatus = "playing" | "paused" | "finished";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface GameState {
  board: Board;
  currentPlayer: Player;
  validMoves: Position[];
  gameStatus: GameStatus;
  scores: { black: number; white: number };
  lastMove: Position | null;
  capturedPieces: Position[];
  isThinking: boolean;
}

export interface CpuConfig {
  difficulty: Difficulty;
  thinkingTime: number;
  showThinking: boolean;
  adaptiveDifficulty: boolean;
}

export interface Move {
  position: Position;
  player: Player;
  capturedPieces: Position[];
}

export interface DetailedGameMove {
  id: string;
  position: Position;
  player: Player;
  timestamp: number;
  capturedPieces: Position[];
  boardState: Board;
  scores: { black: number; white: number };
  moveNumber: number;
}

export interface GameHistory {
  moves: Move[];
  scores: { black: number; white: number }[];
}

export interface DetailedGameHistory {
  moves: DetailedGameMove[];
  currentMoveIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  bestScore: number;
}

export interface PlayerConfig {
  humanPlayer: Player;
  cpuPlayer: Player;
}
