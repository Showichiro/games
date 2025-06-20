export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type GamePhase = "rolling" | "selecting" | "banking" | "gameOver";

export interface Player {
  id: number;
  name: string;
  totalScore: number;
  isAI: boolean;
  statistics: PlayerStats;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  highestScore: number;
  averageScore: number;
  totalFarkles: number;
  longestWinStreak: number;
}

export interface GameState {
  // Game state
  currentPlayer: number;
  players: Player[];
  gamePhase: GamePhase;

  // Turn state
  dice: DiceValue[];
  selectedDice: boolean[];
  turnScore: number;
  rollsInTurn: number;

  // Game settings
  targetScore: number;
  gameMode: "single"; // multiplayer is future implementation
  aiDifficulty: "easy" | "normal" | "hard";
}

export interface ScoreCombination {
  name: string;
  score: number;
  diceUsed: boolean[];
  description: string;
}

export type GameAction =
  | { type: "ROLL_DICE" }
  | { type: "SELECT_DICE"; payload: { index: number } }
  | { type: "BANK_SCORE" }
  | { type: "NEW_GAME" }
  | { type: "NEXT_PLAYER" }
  | { type: "GAME_OVER" };
