"use client";

import { motion } from "motion/react";
import type { GameBoard } from "../types";

interface MiniBoardProps {
  board: GameBoard;
  size?: "xs" | "sm";
  showMove?: { row: number; col: number };
}

export default function MiniBoard({
  board,
  size = "sm",
  showMove,
}: MiniBoardProps) {
  const cellSize = size === "xs" ? "w-2 h-2" : "w-3 h-3";
  const gap = size === "xs" ? "gap-0.5" : "gap-1";

  return (
    <div className={`grid grid-cols-5 ${gap}`}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isMove =
            showMove && showMove.row === rowIndex && showMove.col === colIndex;

          return (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={`${cellSize} rounded-sm border ${
                cell
                  ? "bg-yellow-400 border-yellow-300"
                   : "bg-neutral-400 border-neutral-300"
               } ${isMove ? "ring-1 ring-brand-400" : ""}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: (rowIndex * 5 + colIndex) * 0.01 }}
            />
          );
        }),
      )}
    </div>
  );
}
