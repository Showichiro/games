"use client";

import { motion } from "motion/react";
import { Button } from "@/components/common";

interface GameControlsProps {
  canRoll: boolean;
  canBank: boolean;
  isGameOver: boolean;
  hasHotDice: boolean;
  isFirstScore: boolean;
  meetsMinimumScore: boolean;
  minimumScore: number;
  totalTurnScore: number;
  onRoll: () => void;
  onBank: () => void;
  onNewGame: () => void;
  onContinueWithHotDice: () => void;
  currentTurnScore: number;
}

export default function GameControls({
  canRoll,
  canBank,
  isGameOver,
  hasHotDice,
  isFirstScore,
  meetsMinimumScore,
  minimumScore,
  totalTurnScore,
  onRoll,
  onBank,
  onNewGame,
  onContinueWithHotDice,
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
      {/* First Score Minimum Warning */}
      {isFirstScore && currentTurnScore > 0 && !meetsMinimumScore && (
        <motion.div
          className="text-center p-3 bg-orange-900/30 border border-orange-500 rounded-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="text-orange-400 font-bold text-sm mb-1">
            ⚠️ First Score Minimum
          </div>
          <div className="text-neutral-300 text-xs">
            Need {minimumScore} points minimum. Current: {totalTurnScore}
          </div>
        </motion.div>
      )}
      {hasHotDice && canBank ? (
        // Hot Dice scenario - show choice between continue or bank
        <>
          <motion.div
            className="text-center mb-3 p-3 bg-yellow-900/30 border border-yellow-500 rounded-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-yellow-400 font-bold text-sm mb-1">
              🔥 HOT DICE! 🔥
            </div>
            <div className="text-neutral-300 text-xs">
              All dice scored! Continue with 6 new dice or bank your points?
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              fullWidth
              onClick={onContinueWithHotDice}
              className="py-3"
            >
              Continue 🔥
            </Button>

            <Button
              variant="success"
              fullWidth
              onClick={onBank}
              className="py-3"
            >
              Bank ({currentTurnScore})
            </Button>
          </div>
        </>
      ) : (
        // Normal scenario
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
      )}

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
