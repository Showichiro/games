"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/common";

interface GameOverModalProps {
  isOpen: boolean;
  playerName: string;
  finalScore: number;
  onNewGame: () => void;
  onClose: () => void;
}

export default function GameOverModal({
  isOpen,
  playerName,
  finalScore,
  onNewGame,
  onClose,
}: GameOverModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="bg-neutral-800 rounded-2xl p-8 max-w-md w-full border border-neutral-600 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Celebration Header */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                🎉
              </motion.div>

              <motion.h2
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Congratulations!
              </motion.h2>

              <motion.p
                className="text-neutral-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {playerName} wins!
              </motion.p>
            </motion.div>

            {/* Score Display */}
            <motion.div
              className="text-center mb-8 p-6 bg-neutral-700 rounded-xl border border-neutral-600"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-neutral-400 text-sm mb-2">Final Score</div>
              <motion.div
                className="text-4xl font-bold text-yellow-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                {finalScore.toLocaleString()}
              </motion.div>
              <div className="text-neutral-400 text-sm mt-2">points</div>
            </motion.div>

            {/* Achievement Messages */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {finalScore >= 15000 && (
                <div className="text-yellow-400 text-sm mb-2">
                  🏆 Outstanding Victory!
                </div>
              )}
              {finalScore >= 12000 && finalScore < 15000 && (
                <div className="text-green-400 text-sm mb-2">
                  🥇 Excellent Game!
                </div>
              )}
              {finalScore >= 10000 && finalScore < 12000 && (
                <div className="text-blue-400 text-sm mb-2">
                  🎯 Well Played!
                </div>
              )}

              <div className="text-neutral-400 text-xs">
                You reached the target of 10,000 points!
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Button
                variant="primary"
                fullWidth
                onClick={onNewGame}
                className="text-lg py-4"
              >
                Play Again
              </Button>

              <Button
                variant="secondary"
                fullWidth
                onClick={onClose}
                className="py-3"
              >
                Close
              </Button>
            </motion.div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: Math.random() * 400,
                    y: -10,
                    opacity: 1,
                  }}
                  animate={{
                    y: 500,
                    opacity: 0,
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
