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
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.3)",
    },
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
                    px-6 py-3 rounded-lg font-medium transition-all duration-200 relative overflow-hidden
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
        animate={
          showHints && !disabled
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(255, 193, 7, 0.4)",
                  "0 0 0 10px rgba(255, 193, 7, 0)",
                  "0 0 0 0 rgba(255, 193, 7, 0)",
                ],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: showHints && !disabled ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {showHints ? "💡 ヒントON" : "💡 ヒントOFF"}
        {showHints && !disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </motion.button>
    </motion.div>
  );
}
