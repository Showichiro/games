export const POSITION_VALUES = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100],
] as const;

export const EVALUATION_WEIGHTS = {
  POSITION_VALUE: 1.0,
  MOBILITY: 0.8,
  STABILITY: 1.2,
  CORNER_CONTROL: 2.0,
} as const;

export const CORNER_POSITIONS = [
  [0, 0],
  [0, 7],
  [7, 0],
  [7, 7],
] as const;

export const EDGE_POSITIONS = [
  // Top and bottom edges
  ...Array.from({ length: 8 }, (_, i) => [0, i]),
  ...Array.from({ length: 8 }, (_, i) => [7, i]),
  // Left and right edges (excluding corners already included)
  ...Array.from({ length: 6 }, (_, i) => [i + 1, 0]),
  ...Array.from({ length: 6 }, (_, i) => [i + 1, 7]),
] as const;
