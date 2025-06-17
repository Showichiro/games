"use client";

import { motion } from "motion/react";
import GamePiece from "./GamePiece";
import type { CellState, Position } from "../types";

interface GameCellProps {
  cellState: CellState;
  position: Position;
  isValidMove?: boolean;
  isLastMove?: boolean;
  onClick?: (position: Position) => void;
  disabled?: boolean;
}

export default function GameCell({
  cellState,
  position,
  isValidMove = false,
  isLastMove = false,
  onClick,
  disabled = false,
}: GameCellProps) {
  const handleClick = () => {
    if (!disabled && onClick && isValidMove) {
      onClick(position);
    }
  };

  return (
    <motion.div
      className={`
                aspect-square border border-green-700 bg-green-600 
                relative cursor-pointer transition-all duration-200 rounded-sm
                min-h-6 min-w-6 sm:min-h-7 sm:min-w-7 md:min-h-8 md:min-w-8 lg:min-h-10 lg:min-w-10 xl:min-h-12 xl:min-w-12
                ${isValidMove && !disabled ? "hover:bg-green-500" : ""}
                ${disabled ? "cursor-not-allowed" : ""}
            `}
      onClick={handleClick}
      whileHover={!disabled && isValidMove ? { scale: 1.05 } : {}}
      whileTap={!disabled && isValidMove ? { scale: 0.95 } : {}}
    >
      {cellState && (
        <div className="absolute inset-0.5 sm:inset-1 md:inset-1.5 lg:inset-2">
          <GamePiece
            player={cellState}
            isLastMove={isLastMove}
            isAnimating={true}
          />
        </div>
      )}

      {isValidMove && !cellState && !disabled && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-yellow-400 rounded-full opacity-70"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
