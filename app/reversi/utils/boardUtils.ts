import {
  BOARD_SIZE,
  COLUMN_LABELS,
  ROW_LABELS,
} from "../constants/gameConstants";
import type { Board, Player, Position } from "../types";

export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
}

export function copyBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getOpponent(player: Player): Player {
  return player === "black" ? "white" : "black";
}

export function countPieces(board: Board): { black: number; white: number } {
  let black = 0;
  let white = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === "black") black++;
      else if (board[row][col] === "white") white++;
    }
  }

  return { black, white };
}

export function positionToAlgebraic(position: Position): string {
  return `${COLUMN_LABELS[position.col]}${ROW_LABELS[position.row]}`;
}

export function algebraicToPosition(algebraic: string): Position {
  const col = COLUMN_LABELS.indexOf(
    algebraic[0] as (typeof COLUMN_LABELS)[number],
  );
  const row = ROW_LABELS.indexOf(algebraic[1] as (typeof ROW_LABELS)[number]);
  return { row, col };
}

export function isSamePosition(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

export function getEmptyPositions(board: Board): Position[] {
  const empty: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}
