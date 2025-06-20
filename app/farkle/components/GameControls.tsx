"use client";

import { motion } from "motion/react";
import { Button } from "@/components/common";

interface GameControlsProps {
  canRoll: boolean;
  canBank: boolean;
  isGameOver: boolean;
  onRoll: () => void;
  onBank: () => void;
  onNewGame: () => void;
  currentTurnScore: number;
}

export default function GameControls({
  canRoll,
  canBank,
  isGameOver,
  onRoll,
  onBank,
  onNewGame,
  currentTurnScore,
}: GameControlsProps) {
  if (isGameOver) {
    return (
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button
          variant="primary"
          fullWidth
          onClick={onNewGame}
          className="text-lg py-4"
        >
          Play Again
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          fullWidth
          onClick={onRoll}
          disabled={!canRoll}
          className="py-3"
        >
          Roll Dice
        </Button>

        <Button
          variant="success"
          fullWidth
          onClick={onBank}
          disabled={!canBank}
          className="py-3"
        >
          Bank {currentTurnScore > 0 ? `(${currentTurnScore})` : ""}
        </Button>
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={onNewGame}
        className="py-3"
      >
        New Game
      </Button>
    </motion.div>
  );
}
