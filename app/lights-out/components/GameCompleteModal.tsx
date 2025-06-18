"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/common"; // Changed path alias

interface GameCompleteModalProps {
  gameComplete: boolean;
  moves: number;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  onClose: () => void;
  onNewGame: () => void;
}

export default function GameCompleteModal({
  gameComplete,
  moves,
  elapsedTime,
  formatTime,
  onClose,
  onNewGame,
}: GameCompleteModalProps) {
  return (
    <AnimatePresence>
      {gameComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-950/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-neutral-0 rounded-2xl p-6 text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-default-font mb-2">
              🎉 クリア!
            </h2>
            <p className="text-subtext-color mb-4">
              {moves}手で {formatTime(elapsedTime)} でクリアしました!
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                size="md" // Default, matches px-4 py-2 font-semibold
                onClick={() => {
                  onClose();
                  onNewGame();
                }}
                // className="bg-brand-primary hover:bg-brand-700" // Uncomment to force original brand color
              >
                新しいゲーム
              </Button>
              <Button
                variant="secondary" // Using secondary as ghost is not available. Original: bg-neutral-300 text-neutral-700
                size="md" // Default, matches px-4 py-2 font-semibold
                onClick={onClose}
                // className="bg-neutral-300 text-neutral-700 hover:bg-neutral-400" // Uncomment to force original style
              >
                閉じる
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
