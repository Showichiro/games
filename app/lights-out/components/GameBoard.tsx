"use client";

import { motion } from "motion/react";
import type { GameBoard } from "../types";

interface GameBoardProps {
  board: GameBoard;
  gameComplete: boolean;
  onCellClick: (row: number, col: number) => void;
  hintCell?: { row: number; col: number } | null;
}

export default function GameBoard({
  board,
  gameComplete,
  onCellClick,
  hintCell,
}: GameBoardProps) {
  return (
    <div className="bg-slate-700 p-4 md:p-6 lg:p-8 rounded-2xl shadow-2xl mb-6">
      <div className="grid grid-cols-5 gap-2 md:gap-3 lg:gap-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isHintCell = hintCell && hintCell.row === rowIndex && hintCell.col === colIndex;
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square rounded-lg border-2 transition-colors min-h-[44px] md:min-h-[52px] lg:min-h-[60px] relative ${
                  cell
                    ? "bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/30"
                    : "bg-slate-600 border-slate-500"
                } ${isHintCell ? "ring-4 ring-blue-400 ring-opacity-70" : ""}`}
                whileTap={{ scale: 0.9 }}
                animate={{
                  backgroundColor: cell ? "#facc15" : "#475569",
                  rotate: cell ? 180 : 0,
                  scale: cell ? 1.05 : 1,
                  boxShadow: isHintCell 
                    ? "0 0 20px rgba(59, 130, 246, 0.8)"
                    : cell 
                      ? "0 10px 25px rgba(250, 204, 21, 0.3)"
                      : "none",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                onClick={() => onCellClick(rowIndex, colIndex)}
                disabled={gameComplete}
              >
                {isHintCell && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-blue-400 opacity-30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                )}
              </motion.button>
            );
          }),
        )}
      </div>
    </div>
  );
}
