"use client";

import { motion } from "motion/react";
import type { GameBoard } from "../types";

interface GameBoardProps {
  board: GameBoard;
  gameComplete: boolean;
  onCellClick: (row: number, col: number) => void;
  hintCell?: { row: number; col: number } | null;
  affectedCells?: Set<string>;
  showCompletionAnimation?: boolean;
}

export default function GameBoard({
  board,
  gameComplete,
  onCellClick,
  hintCell,
  affectedCells,
  showCompletionAnimation,
}: GameBoardProps) {
  return (
    <div className="bg-slate-700 p-4 md:p-6 lg:p-8 rounded-2xl shadow-2xl mb-6">
      <motion.div 
        className="grid grid-cols-5 gap-2 md:gap-3 lg:gap-4"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;
            const isHintCell = hintCell && hintCell.row === rowIndex && hintCell.col === colIndex;
            const isAffected = affectedCells?.has(cellKey);
            
            // Calculate stagger delay based on distance from center for affected cells
            const getStaggerDelay = () => {
              if (!isAffected) return 0;
              const distance = Math.abs(rowIndex - 2) + Math.abs(colIndex - 2);
              return distance * 0.05;
            };

            // Calculate completion animation delay based on spiral pattern
            const getCompletionDelay = () => {
              if (!showCompletionAnimation) return 0;
              // Spiral pattern from center outward
              const centerRow = 2;
              const centerCol = 2;
              const distance = Math.max(
                Math.abs(rowIndex - centerRow),
                Math.abs(colIndex - centerCol)
              );
              return distance * 0.15;
            };
            
            return (
              <motion.button
                key={cellKey}
                className={`aspect-square rounded-lg border-2 transition-colors min-h-[44px] md:min-h-[52px] lg:min-h-[60px] relative ${
                  cell
                    ? "bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/30"
                    : "bg-slate-600 border-slate-500"
                } ${isHintCell ? "ring-4 ring-blue-400 ring-opacity-70" : ""}`}
                whileTap={{ scale: 0.9 }}
                animate={{
                  backgroundColor: showCompletionAnimation 
                    ? "#10b981" // Green color for completion
                    : cell ? "#facc15" : "#475569",
                  rotate: showCompletionAnimation 
                    ? 360 
                    : cell ? 180 : 0,
                  scale: showCompletionAnimation 
                    ? [1, 1.2, 0.8] 
                    : cell ? 1.05 : 1,
                  boxShadow: showCompletionAnimation 
                    ? "0 0 30px rgba(16, 185, 129, 0.8)"
                    : isHintCell 
                      ? "0 0 20px rgba(59, 130, 246, 0.8)"
                      : cell 
                        ? "0 10px 25px rgba(250, 204, 21, 0.3)"
                        : "none",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: showCompletionAnimation 
                    ? getCompletionDelay() 
                    : isAffected ? getStaggerDelay() : 0,
                  duration: showCompletionAnimation ? 0.8 : undefined,
                }}
                variants={{
                  hidden: { scale: 0.8, opacity: 0 },
                  visible: { 
                    scale: 1, 
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }
                  },
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
                {isAffected && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-white opacity-20"
                    initial={{ scale: 1.2, opacity: 0.4 }}
                    animate={{ scale: 1, opacity: 0 }}
                    transition={{ 
                      duration: 0.6,
                      delay: getStaggerDelay(),
                      ease: "easeOut"
                    }}
                  />
                )}
                {showCompletionAnimation && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-green-400"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.3, 1], 
                      opacity: [0, 0.8, 0.6] 
                    }}
                    transition={{ 
                      duration: 1.2,
                      delay: getCompletionDelay(),
                      ease: "easeOut"
                    }}
                  />
                )}
                {showCompletionAnimation && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center text-white font-bold"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 1], 
                      opacity: [0, 1, 0.8] 
                    }}
                    transition={{ 
                      duration: 1.0,
                      delay: getCompletionDelay() + 0.2,
                      ease: "easeOut"
                    }}
                  >
                    ✨
                  </motion.div>
                )}
              </motion.button>
            );
          }),
        )}
      </motion.div>
    </div>
  );
}
