import type { Board, Position, Player } from "../types";
import { DIRECTIONS, INITIAL_BOARD_STATE } from "../constants/gameConstants";
import {
  copyBoard,
  isValidPosition,
  getOpponent,
  countPieces,
} from "./boardUtils";

export function initializeBoard(): Board {
  return copyBoard(INITIAL_BOARD_STATE as Board);
}

export function findCapturedPieces(
  board: Board,
  position: Position,
  player: Player,
): Position[] {
  if (board[position.row][position.col] !== null) {
    return [];
  }

  const captured: Position[] = [];
  const opponent = getOpponent(player);

  for (const [deltaRow, deltaCol] of DIRECTIONS) {
    const lineCaptures: Position[] = [];
    let currentRow = position.row + deltaRow;
    let currentCol = position.col + deltaCol;

    while (isValidPosition(currentRow, currentCol)) {
      const currentCell = board[currentRow][currentCol];

      if (currentCell === null) {
        break;
      }

      if (currentCell === opponent) {
        lineCaptures.push({ row: currentRow, col: currentCol });
      } else if (currentCell === player) {
        captured.push(...lineCaptures);
        break;
      }

      currentRow += deltaRow;
      currentCol += deltaCol;
    }
  }

  return captured;
}

export function isValidMove(
  board: Board,
  position: Position,
  player: Player,
): boolean {
  return findCapturedPieces(board, position, player).length > 0;
}

export function getValidMoves(board: Board, player: Player): Position[] {
  const validMoves: Position[] = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) {
        const position = { row, col };
        if (isValidMove(board, position, player)) {
          validMoves.push(position);
        }
      }
    }
  }

  return validMoves;
}

export function makeMove(
  board: Board,
  position: Position,
  player: Player,
): { newBoard: Board; capturedPieces: Position[] } {
  const capturedPieces = findCapturedPieces(board, position, player);

  if (capturedPieces.length === 0) {
    throw new Error("Invalid move");
  }

  const newBoard = copyBoard(board);

  newBoard[position.row][position.col] = player;

  for (const capturedPosition of capturedPieces) {
    newBoard[capturedPosition.row][capturedPosition.col] = player;
  }

  return { newBoard, capturedPieces };
}

export function hasValidMoves(board: Board, player: Player): boolean {
  return getValidMoves(board, player).length > 0;
}

export function isGameOver(board: Board): boolean {
  return !hasValidMoves(board, "black") && !hasValidMoves(board, "white");
}

export function getWinner(board: Board): Player | "draw" | null {
  if (!isGameOver(board)) {
    return null;
  }

  const scores = countPieces(board);

  if (scores.black > scores.white) {
    return "black";
  } else if (scores.white > scores.black) {
    return "white";
  } else {
    return "draw";
  }
}
