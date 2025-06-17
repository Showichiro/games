"use client";

import { motion } from "motion/react";

interface GameControlsProps {
  onNewGame: () => void;
  onToggleHints: () => void;
  showHints: boolean;
  disabled?: boolean;
}

export default function GameControls({
  onNewGame,
  onToggleHints,
  showHints,
  disabled = false,
}: GameControlsProps) {
  const buttonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.button
        className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      disabled
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    }
                `}
        variants={buttonVariants}
        whileHover={!disabled ? "hover" : {}}
        whileTap={!disabled ? "tap" : {}}
        onClick={onNewGame}
        disabled={disabled}
      >
        🎮 新しいゲーム
      </motion.button>

      <motion.button
        className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      disabled
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : showHints
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg"
                          : "bg-gray-600 hover:bg-gray-700 text-white shadow-lg"
                    }
                `}
        variants={buttonVariants}
        whileHover={!disabled ? "hover" : {}}
        whileTap={!disabled ? "tap" : {}}
        onClick={onToggleHints}
        disabled={disabled}
      >
        {showHints ? "💡 ヒントON" : "💡 ヒントOFF"}
      </motion.button>
    </motion.div>
  );
}
