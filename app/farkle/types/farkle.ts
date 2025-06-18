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

export interface GameAction {
    type: "ROLL_DICE" | "SELECT_DICE" | "BANK_SCORE" | "NEW_GAME" | "NEXT_PLAYER" | "GAME_OVER";
    payload?: any;
}