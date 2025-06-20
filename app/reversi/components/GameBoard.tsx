"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { BoardContainer } from "@/components/common";
import { BOARD_SIZE } from "../constants/gameConstants";
import type { Board, Player, Position } from "../types";
import GameCell from "./GameCell";
import RippleEffect from "./RippleEffect";

interface GameBoardProps {
  board: Board;
  validMoves: Position[];
  lastMove: Position | null;
  capturedPieces: Position[];
  currentPlayer: Player;
  onCellClick: (position: Position) => void;
  disabled?: boolean;
  showHints?: boolean;
}

export default function GameBoard({
  board,
  validMoves,
  lastMove,
  capturedPieces,
  currentPlayer,
  onCellClick,
  disabled = false,
  showHints = true,
}: GameBoardProps) {
  const [showRipple, setShowRipple] = useState(false);
  const [rippleData, setRippleData] = useState<{
    source: Position;
    captured: Position[];
  }>({ source: { row: 0, col: 0 }, captured: [] });

  // Trigger ripple effect when there are captured pieces
  useEffect(() => {
    if (capturedPieces.length > 1 && lastMove) {
      setRippleData({
        source: lastMove,
        captured: capturedPieces,
      });
      setShowRipple(true);
    }
  }, [capturedPieces, lastMove]);

  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some((move) => move.row === row && move.col === col);
  };

  const isLastMove = (row: number, col: number): boolean => {
    return lastMove?.row === row && lastMove?.col === col;
  };

  const isCapturedPiece = (row: number, col: number): boolean => {
    return capturedPieces.some(
      (piece) => piece.row === row && piece.col === col,
    );
  };

  const getFlipFromPlayer = (row: number, col: number): Player | null => {
    if (isCapturedPiece(row, col)) {
      // 反転された石の元の色は現在の石の色の反対（反転前の色）
      const currentCellState = board[row][col];
      return currentCellState === "black" ? "white" : "black";
    }
    return null;
  };

  return (
    <BoardContainer className="inline-block">
      <motion.div
        className="relative grid grid-cols-8 gap-1 sm:gap-2 p-1 sm:p-2 rounded w-[85vw] h-[90vw] sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[30rem] xl:h-[30rem] max-w-[85vw] max-h-[90vw] sm:max-w-none sm:max-h-none"
        style={{ backgroundColor: "var(--color-reversi-board-border)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: BOARD_SIZE }, (_, row) =>
          Array.from({ length: BOARD_SIZE }, (_, col) => (
            <GameCell
              key={`${row}-${col}`}
              cellState={board[row][col]}
              position={{ row, col }}
              isValidMove={showHints && isValidMove(row, col)}
              isLastMove={isLastMove(row, col)}
              isNewlyPlaced={isLastMove(row, col)}
              isFlipping={isCapturedPiece(row, col)}
              flipFromPlayer={getFlipFromPlayer(row, col)}
              onClick={onCellClick}
              disabled={disabled}
              currentPlayer={currentPlayer}
            />
          )),
        )}

        {/* Ripple Effect */}
        <RippleEffect
          trigger={showRipple}
          sourcePosition={rippleData.source}
          capturedPositions={rippleData.captured}
          onComplete={() => setShowRipple(false)}
        />
      </motion.div>
    </BoardContainer>
  );
}
