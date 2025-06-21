"use client";

import { motion } from "motion/react";
import Button from "@/components/common/Button";
import HintToggleButton from "./HintToggleButton";

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

      <HintToggleButton
        onToggle={onToggleHints}
        showHints={showHints}
        disabled={disabled}
        buttonVariants={buttonVariants}
      />

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
