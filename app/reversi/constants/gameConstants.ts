import type { Difficulty } from "../types";

export const BOARD_SIZE = 8;

export const INITIAL_BOARD_STATE = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, "white", "black", null, null, null],
  [null, null, null, "black", "white", null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
] as const;

export const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

export const COLUMN_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const ROW_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    depth: number;
    randomness: number;
    thinkingTimeMin: number;
    thinkingTimeMax: number;
  }
> = {
  beginner: {
    depth: 2,
    randomness: 0.3,
    thinkingTimeMin: 500,
    thinkingTimeMax: 1000,
  },
  intermediate: {
    depth: 4,
    randomness: 0.1,
    thinkingTimeMin: 1000,
    thinkingTimeMax: 2000,
  },
  advanced: {
    depth: 6,
    randomness: 0,
    thinkingTimeMin: 2000,
    thinkingTimeMax: 3000,
  },
  expert: {
    depth: 8,
    randomness: 0,
    thinkingTimeMin: 3000,
    thinkingTimeMax: 5000,
  },
};
