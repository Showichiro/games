"use client";

import { motion } from "motion/react";
import { useState } from "react";
import GamePiece from "./GamePiece";
import type { CellState, Position } from "../types";

interface GameCellProps {
  cellState: CellState;
  position: Position;
  isValidMove?: boolean;
  isLastMove?: boolean;
  isNewlyPlaced?: boolean;
  isFlipping?: boolean;
  flipFromPlayer?: CellState;
  onClick?: (position: Position) => void;
  disabled?: boolean;
  currentPlayer?: CellState;
}

export default function GameCell({
  cellState,
  position,
  isValidMove = false,
  isLastMove = false,
  isNewlyPlaced = false,
  isFlipping = false,
  flipFromPlayer = null,
  onClick,
  disabled = false,
  currentPlayer = "black",
}: GameCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const handleClick = () => {
    if (!disabled && onClick && isValidMove) {
      onClick(position);
    }
  };

  return (
    <motion.div
      className={`
                aspect-square border relative cursor-pointer transition-all duration-200 rounded-sm overflow-hidden
                min-h-6 min-w-6 sm:min-h-7 sm:min-w-7 md:min-h-8 md:min-w-8 lg:min-h-10 lg:min-w-10 xl:min-h-12 xl:min-w-12
                ${disabled ? "cursor-not-allowed" : ""}
            `}
      style={{
        backgroundColor:
          isValidMove && !disabled && isHovered
            ? "var(--color-reversi-cell-hover)"
            : "var(--color-reversi-cell-bg)",
        borderColor: "var(--color-reversi-cell-border)",
      }}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={
        !disabled && isValidMove
          ? {
              scale: 1.05,
              boxShadow: "0px 0px 20px var(--color-reversi-hint)",
              borderColor: "var(--color-reversi-hint-hover)",
            }
          : {}
      }
      whileTap={!disabled && isValidMove ? { scale: 0.95 } : {}}
    >
      {/* Placement ring effect */}
      {isNewlyPlaced && (
        <motion.div
          className="absolute inset-0 rounded-sm"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [1, 0], scale: [0.5, 1.5] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: `radial-gradient(circle, var(--color-reversi-last-move) 0%, rgba(251, 191, 36, 0.2) 50%, transparent 100%)`,
            boxShadow: `0 0 20px var(--color-reversi-last-move)`,
          }}
        />
      )}

      {cellState && (
        <div className="absolute inset-0.5 sm:inset-1 md:inset-1.5 lg:inset-2">
          <GamePiece
            player={cellState}
            isLastMove={isLastMove}
            isAnimating={isNewlyPlaced}
            isFlipping={isFlipping}
            flipFromPlayer={flipFromPlayer}
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
          {/* Primary hint circle */}
          <motion.div
            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full opacity-70"
            style={{ backgroundColor: "var(--color-reversi-hint)" }}
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
          {/* Hover enhancement ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 opacity-0"
            style={{ borderColor: "var(--color-reversi-hint-hover)" }}
            whileHover={{
              opacity: [0, 0.8, 0],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          {/* Sparkle particles on hover */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: "var(--color-reversi-hint-hover)",
                left: `${30 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -8, 0],
                x: [0, i % 2 ? 4 : -4, 0],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Preview piece on hover */}
      {isValidMove && !cellState && !disabled && isHovered && (
        <motion.div
          className="absolute inset-0.5 sm:inset-1 md:inset-1.5 lg:inset-2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-full h-full rounded-full border-2 border-dashed"
            style={{
              backgroundColor:
                currentPlayer === "black"
                  ? "var(--color-reversi-piece-black)"
                  : "var(--color-reversi-piece-white)",
              borderColor: "var(--color-reversi-piece-border)",
              opacity: 0.7,
              boxShadow:
                currentPlayer === "black"
                  ? "inset 2px 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.2)"
                  : "inset 2px 2px 4px rgba(0,0,0,0.1), 0 0 8px rgba(0,0,0,0.1)",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
