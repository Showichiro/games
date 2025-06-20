"use client";

import { motion } from "motion/react";

interface ScoreDisplayProps {
  playerName: string;
  totalScore: number;
  turnScore: number;
  currentTurnScore: number;
  isGameOver: boolean;
}

export default function ScoreDisplay({
  playerName,
  totalScore,
  turnScore,
  currentTurnScore,
  isGameOver,
}: ScoreDisplayProps) {
  return (
    <div className="text-center mb-6">
      <motion.h1
        className="text-3xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Farkle
      </motion.h1>

      <motion.div
        className="text-lg text-neutral-300 space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="font-semibold text-white">
          {playerName}: {totalScore.toLocaleString()}
        </div>

        {!isGameOver && (
          <div className="flex justify-center space-x-4 text-sm">
            <span>Turn: {turnScore.toLocaleString()}</span>
            {currentTurnScore > 0 && (
              <motion.span
                className="text-yellow-400 font-semibold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                +{currentTurnScore.toLocaleString()}
              </motion.span>
            )}
          </div>
        )}

        {isGameOver && (
          <motion.div
            className="text-yellow-400 font-bold text-xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.3,
            }}
          >
            🎉 Winner! 🎉
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
