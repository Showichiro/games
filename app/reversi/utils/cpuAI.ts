import type { Board, Position, Player, Difficulty } from "../types";
import { getValidMoves, makeMove, isGameOver, getWinner } from "./gameLogic";
import { getOpponent } from "./boardUtils";
import { POSITION_VALUES, EVALUATION_WEIGHTS } from "../constants/aiConstants";
import { DIFFICULTY_CONFIG } from "../constants/gameConstants";

export function evaluateBoard(
  board: Board,
  player: Player,
  depth: number = 0,
): number {
  if (isGameOver(board)) {
    const winner = getWinner(board);
    if (winner === player) return 10000 - depth;
    if (winner === getOpponent(player)) return -10000 + depth;
    return 0;
  }


  const positionValue = calculatePositionValue(board, player);
  const mobility = calculateMobility(board, player);
  const stability = calculateStability(board, player);
  const cornerControl = calculateCornerControl(board, player);

  return (
    positionValue * EVALUATION_WEIGHTS.POSITION_VALUE +
    mobility * EVALUATION_WEIGHTS.MOBILITY +
    stability * EVALUATION_WEIGHTS.STABILITY +
    cornerControl * EVALUATION_WEIGHTS.CORNER_CONTROL
  );
}

function calculatePositionValue(board: Board, player: Player): number {
  let value = 0;
  const opponent = getOpponent(player);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === player) {
        value += POSITION_VALUES[row][col];
      } else if (board[row][col] === opponent) {
        value -= POSITION_VALUES[row][col];
      }
    }
  }

  return value;
}

function calculateMobility(board: Board, player: Player): number {
  const playerMoves = getValidMoves(board, player).length;
  const opponentMoves = getValidMoves(board, getOpponent(player)).length;

  if (playerMoves + opponentMoves === 0) return 0;
  return ((playerMoves - opponentMoves) / (playerMoves + opponentMoves)) * 100;
}

function calculateStability(board: Board, player: Player): number {
  let stability = 0;
  const opponent = getOpponent(player);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === player) {
        if (isStablePosition(board, { row, col })) {
          stability += 1;
        }
      } else if (board[row][col] === opponent) {
        if (isStablePosition(board, { row, col })) {
          stability -= 1;
        }
      }
    }
  }

  return stability;
}

function calculateCornerControl(board: Board, player: Player): number {
  let control = 0;
  const corners = [
    [0, 0],
    [0, 7],
    [7, 0],
    [7, 7],
  ];
  const opponent = getOpponent(player);

  for (const [row, col] of corners) {
    if (board[row][col] === player) {
      control += 25;
    } else if (board[row][col] === opponent) {
      control -= 25;
    }
  }

  return control;
}

function isStablePosition(
  board: Board,
  position: Position,
): boolean {
  const { row, col } = position;

  if (row === 0 || row === 7 || col === 0 || col === 7) {
    return true;
  }

  return false;
}

export function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player,
): { score: number; move: Position | null } {
  if (depth === 0 || isGameOver(board)) {
    return {
      score: evaluateBoard(board, player, depth),
      move: null,
    };
  }

  const currentPlayer = maximizingPlayer ? player : getOpponent(player);
  const validMoves = getValidMoves(board, currentPlayer);

  if (validMoves.length === 0) {
    return minimax(board, depth - 1, alpha, beta, !maximizingPlayer, player);
  }

  let bestMove: Position | null = null;

  if (maximizingPlayer) {
    let maxScore = -Infinity;

    for (const move of validMoves) {
      try {
        const { newBoard } = makeMove(board, move, currentPlayer);
        const result = minimax(newBoard, depth - 1, alpha, beta, false, player);

        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = move;
        }

        alpha = Math.max(alpha, result.score);
        if (beta <= alpha) {
          break;
        }
      } catch {
        continue;
      }
    }

    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;

    for (const move of validMoves) {
      try {
        const { newBoard } = makeMove(board, move, currentPlayer);
        const result = minimax(newBoard, depth - 1, alpha, beta, true, player);

        if (result.score < minScore) {
          minScore = result.score;
          bestMove = move;
        }

        beta = Math.min(beta, result.score);
        if (beta <= alpha) {
          break;
        }
      } catch {
        continue;
      }
    }

    return { score: minScore, move: bestMove };
  }
}

export function getBestMove(
  board: Board,
  difficulty: Difficulty,
): Position | null {
  const config = DIFFICULTY_CONFIG[difficulty];
  const validMoves = getValidMoves(board, "white");

  if (validMoves.length === 0) {
    return null;
  }

  if (validMoves.length === 1) {
    return validMoves[0];
  }

  if (Math.random() < config.randomness) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  const result = minimax(
    board,
    config.depth,
    -Infinity,
    Infinity,
    true,
    "white",
  );

  return result.move || validMoves[0];
}

export function getRandomThinkingTime(difficulty: Difficulty): number {
  const config = DIFFICULTY_CONFIG[difficulty];
  return (
    Math.random() * (config.thinkingTimeMax - config.thinkingTimeMin) +
    config.thinkingTimeMin
  );
}
