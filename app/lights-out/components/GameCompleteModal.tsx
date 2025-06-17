"use client";

import { motion, AnimatePresence } from "motion/react";

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
              <button
                className="px-4 py-2 bg-brand-primary hover:bg-brand-700 text-neutral-0 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
                onClick={() => {
                  onClose();
                  onNewGame();
                }}
              >
                新しいゲーム
              </button>
              <button
                className="px-4 py-2 bg-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-400 transition-colors"
                onClick={onClose}
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
