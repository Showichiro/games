"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import type { Player } from "../types";

interface GamePieceProps {
  player: Player;
  isAnimating?: boolean;
  isLastMove?: boolean;
  isFlipping?: boolean;
  flipFromPlayer?: Player;
  delay?: number;
  onFlipComplete?: () => void;
}

export default function GamePiece({
  player,
  isAnimating = false,
  isLastMove = false,
  isFlipping = false,
  flipFromPlayer,
  delay = 0,
  onFlipComplete,
}: GamePieceProps) {
  const [isFlipAnimating, setIsFlipAnimating] = useState(false);
  const [currentDisplayPlayer, setCurrentDisplayPlayer] = useState(player);

  useEffect(() => {
    if (isFlipping && flipFromPlayer && flipFromPlayer !== player) {
      setIsFlipAnimating(true);
      setCurrentDisplayPlayer(flipFromPlayer);

      // Mid-flip change the display player
      setTimeout(() => {
        setCurrentDisplayPlayer(player);
      }, 200);

      setTimeout(() => {
        setIsFlipAnimating(false);
        onFlipComplete?.();
      }, 400);
    }
  }, [isFlipping, flipFromPlayer, player, onFlipComplete]);

  const pieceVariants = {
    initial: {
      scale: 0,
      rotateY: 0,
      y: -20,
    },
    animate: {
      scale: 1,
      rotateY: 0,
      y: 0,
    },
    flip: {
      rotateY: isFlipAnimating ? 360 : 0,
      scale: 1,
    },
  };

  const pieceClasses = {
    black: "bg-gradient-to-br from-gray-600 via-gray-900 to-black",
    white: "bg-gradient-to-br from-white via-gray-100 to-gray-300",
  };

  const glowEffect = isLastMove
    ? {
        boxShadow:
          "0 0 20px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)",
      }
    : {
        boxShadow:
          currentDisplayPlayer === "black"
            ? "inset 0 0 20px rgba(255,255,255,0.3), 0 5px 15px rgba(0,0,0,0.5)"
            : "inset 0 0 20px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.3)",
      };

  return (
    <div className="relative w-full h-full">
      <motion.div
        className="w-full h-full"
        animate={isFlipAnimating ? { scale: [1, 1.15, 1] } : {}}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className={`
                      w-full h-full rounded-full border-2 border-gray-400 relative overflow-hidden
                      ${pieceClasses[currentDisplayPlayer]}
                      ${isLastMove ? "ring-2 ring-yellow-400" : ""}
                  `}
          variants={pieceVariants}
          initial={isAnimating ? "initial" : "animate"}
          animate={isFlipAnimating ? "flip" : "animate"}
          transition={{
            type: isFlipAnimating ? "tween" : "spring",
            stiffness: 300,
            damping: 25,
            delay,
            duration: isFlipAnimating ? 0.4 : 0.6,
            ease: isFlipAnimating ? "easeInOut" : "easeOut",
          }}
          style={glowEffect}
        >
          {/* Inner light reflection */}
          <div
            className={`absolute top-2 left-2 w-3 h-3 rounded-full opacity-60 ${
              currentDisplayPlayer === "black" ? "bg-white" : "bg-gray-400"
            }`}
          />

          {/* Sparkle effect for last move */}
          {isLastMove && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)",
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Flip particles effect */}
      {isFlipping && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${20 + (i % 2) * 20}%`,
              }}
              animate={{
                y: [-5, -15, -5],
                x: [0, i % 2 ? 10 : -10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
