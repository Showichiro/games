"use client";

import { motion } from "motion/react";
import Button from "@/components/common/Button";

interface GameControlsProps {
  onNewGame: () => void;
  onToggleHints: () => void;
  showHints: boolean;
  disabled?: boolean;
  onOpenSettings?: () => void;
  onOpenTutorial?: () => void;
}

export default function GameControls({
  onNewGame,
  onToggleHints,
  showHints,
  disabled = false,
  onOpenSettings,
  onOpenTutorial,
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
      <motion.div
        variants={buttonVariants}
        whileHover={!disabled ? "hover" : {}}
        whileTap={!disabled ? "tap" : {}}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={onNewGame}
          disabled={disabled}
          className="shadow-lg"
        >
          🎮 新しいゲーム
        </Button>
      </motion.div>

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

      {onOpenSettings && (
        <motion.div
          variants={buttonVariants}
          whileHover={!disabled ? "hover" : {}}
          whileTap={!disabled ? "tap" : {}}
        >
          <Button
            variant="info"
            size="lg"
            onClick={onOpenSettings}
            disabled={disabled}
            className="shadow-lg"
            style={{
              backgroundColor: disabled
                ? "var(--color-neutral-600)"
                : "var(--color-purple-600)",
            }}
          >
            ⚙️ 設定
          </Button>
        </motion.div>
      )}

      {onOpenTutorial && (
        <motion.div
          variants={buttonVariants}
          whileHover={!disabled ? "hover" : {}}
          whileTap={!disabled ? "tap" : {}}
        >
          <Button
            variant="info"
            size="lg"
            onClick={onOpenTutorial}
            disabled={disabled}
            className="shadow-lg"
            style={{
              backgroundColor: disabled
                ? "var(--color-neutral-600)"
                : "var(--color-blue-600)",
            }}
          >
            📖 チュートリアル
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
