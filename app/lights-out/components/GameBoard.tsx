"use client";

import { motion } from "motion/react";
import type { GameBoard } from "../types";

interface GameBoardProps {
  board: GameBoard;
  gameComplete: boolean;
  onCellClick: (row: number, col: number) => void;
}

export default function GameBoard({
  board,
  gameComplete,
  onCellClick,
}: GameBoardProps) {
  return (
    <div className="bg-slate-700 p-4 md:p-6 lg:p-8 rounded-2xl shadow-2xl mb-6">
      <div className="grid grid-cols-5 gap-2 md:gap-3 lg:gap-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square rounded-lg border-2 transition-colors min-h-[44px] md:min-h-[52px] lg:min-h-[60px] ${
                cell
                  ? "bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/30"
                  : "bg-slate-600 border-slate-500"
              }`}
              whileTap={{ scale: 0.9 }}
              animate={{
                backgroundColor: cell ? "#facc15" : "#475569",
                rotate: cell ? 180 : 0,
                scale: cell ? 1.05 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={gameComplete}
            />
          )),
        )}
      </div>
    </div>
  );
}
