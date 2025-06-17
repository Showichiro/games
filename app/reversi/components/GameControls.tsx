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
        className="px-6 py-3 rounded-lg font-medium transition-all duration-200 text-white shadow-lg"
        style={{
          backgroundColor: disabled
            ? "var(--color-neutral-600)"
            : "var(--color-interactive-focus)",
          color: disabled ? "var(--color-neutral-400)" : "var(--color-white)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor =
              "var(--color-interactive-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor =
              "var(--color-interactive-focus)";
          }
        }}
        variants={buttonVariants}
        whileHover={!disabled ? "hover" : {}}
        whileTap={!disabled ? "tap" : {}}
        onClick={onNewGame}
        disabled={disabled}
      >
        🎮 新しいゲーム
      </motion.button>

      <motion.button
        className="px-6 py-3 rounded-lg font-medium transition-all duration-200 relative overflow-hidden text-white shadow-lg"
        style={{
          backgroundColor: disabled
            ? "var(--color-neutral-600)"
            : showHints
              ? "var(--color-warning-600)"
              : "var(--color-neutral-600)",
          color: disabled ? "var(--color-neutral-400)" : "var(--color-white)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            const bgColor = showHints
              ? "var(--color-warning-700)"
              : "var(--color-neutral-700)";
            e.currentTarget.style.backgroundColor = bgColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            const bgColor = showHints
              ? "var(--color-warning-600)"
              : "var(--color-neutral-600)";
            e.currentTarget.style.backgroundColor = bgColor;
          }
        }}
        variants={buttonVariants}
        whileHover={!disabled ? "hover" : {}}
        whileTap={!disabled ? "tap" : {}}
        onClick={onToggleHints}
        disabled={disabled}
        animate={
          showHints && !disabled
            ? {
                boxShadow: [
                  "0 0 0 0 var(--color-warning-400)",
                  "0 0 0 10px transparent",
                  "0 0 0 0 var(--color-warning-400)",
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
