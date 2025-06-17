"use client";

import { motion } from "motion/react";
import GameCell from "./GameCell";
import type { Board, Position, Player } from "../types";
import { BOARD_SIZE } from "../constants/gameConstants";

interface GameBoardProps {
  board: Board;
  validMoves: Position[];
  lastMove: Position | null;
  currentPlayer: Player;
  onCellClick: (position: Position) => void;
  disabled?: boolean;
  showHints?: boolean;
}

export default function GameBoard({
  board,
  validMoves,
  lastMove,
  onCellClick,
  disabled = false,
  showHints = true,
}: GameBoardProps) {
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some((move) => move.row === row && move.col === col);
  };

  const isLastMove = (row: number, col: number): boolean => {
    return lastMove?.row === row && lastMove?.col === col;
  };

  return (
    <motion.div
      className="inline-block bg-green-800 p-2 rounded-lg shadow-2xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-8 gap-1 bg-green-900 p-1 rounded">
        {Array.from({ length: BOARD_SIZE }, (_, row) =>
          Array.from({ length: BOARD_SIZE }, (_, col) => (
            <GameCell
              key={`${row}-${col}`}
              cellState={board[row][col]}
              position={{ row, col }}
              isValidMove={showHints && isValidMove(row, col)}
              isLastMove={isLastMove(row, col)}
              onClick={onCellClick}
              disabled={disabled}
            />
          )),
        )}
      </div>
    </motion.div>
  );
}
