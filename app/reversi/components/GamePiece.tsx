"use client";

import { motion } from "motion/react";
import type { Player } from "../types";

interface GamePieceProps {
  player: Player;
  isAnimating?: boolean;
  isLastMove?: boolean;
  delay?: number;
}

export default function GamePiece({
  player,
  isAnimating = false,
  isLastMove = false,
  delay = 0,
}: GamePieceProps) {
  const pieceVariants = {
    initial: {
      scale: 0,
      rotateY: 0,
    },
    animate: {
      scale: 1,
      rotateY: 0,
    },
    flip: {
      rotateY: 180,
    },
  };

  const pieceClasses = {
    black: "bg-gradient-to-br from-gray-600 via-gray-900 to-black shadow-lg",
    white: "bg-gradient-to-br from-white via-gray-100 to-gray-300 shadow-lg",
  };

  return (
    <motion.div
      className={`
                w-full h-full rounded-full border-2 border-gray-400
                ${pieceClasses[player]}
                ${isLastMove ? "ring-2 ring-yellow-400 ring-opacity-75" : ""}
            `}
      variants={pieceVariants}
      initial={isAnimating ? "initial" : "animate"}
      animate={isAnimating ? "animate" : "animate"}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay,
      }}
      style={{
        boxShadow:
          player === "black"
            ? "inset 0 0 20px rgba(255,255,255,0.3), 0 5px 15px rgba(0,0,0,0.5)"
            : "inset 0 0 20px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.3)",
      }}
    />
  );
}
