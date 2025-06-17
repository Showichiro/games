"use client";

import { motion } from "motion/react";

interface GameControlsProps {
  onNewGame: () => void;
  onResetGame: () => void;
  onShowTutorial: () => void;
  onHint: () => void;
  hintsUsed: number;
}

export default function GameControls({
  onNewGame,
  onResetGame,
  onShowTutorial,
  onHint,
  hintsUsed,
}: GameControlsProps) {
  return (
    <div className="flex gap-3 lg:gap-4 justify-center flex-wrap">
      <motion.button
        className="px-6 py-3 lg:px-8 lg:py-4 bg-brand-primary hover:bg-brand-700 text-neutral-0 rounded-lg font-semibold transition-colors text-sm lg:text-base"
        whileTap={{ scale: 0.95 }}
        onClick={onNewGame}
      >
        新規
      </motion.button>
      <motion.button
        className="px-6 py-3 lg:px-8 lg:py-4 bg-neutral-600 hover:bg-neutral-700 text-neutral-0 rounded-lg font-semibold transition-colors text-sm lg:text-base"
        whileTap={{ scale: 0.95 }}
        onClick={onResetGame}
      >
        リセット
      </motion.button>
      {/* Hide hint and tutorial buttons on desktop (lg+) since they're in the sidebar */}
      <motion.button
        className="px-4 py-3 bg-success-600 hover:bg-success-700 text-neutral-0 rounded-lg font-semibold transition-colors text-sm relative lg:hidden"
        whileTap={{ scale: 0.95 }}
        onClick={onHint}
      >
        💡
        {hintsUsed > 0 && (
          <span className="absolute -top-1 -right-1 bg-error-500 text-neutral-0 text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {hintsUsed}
          </span>
        )}
      </motion.button>
      <motion.button
        className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-neutral-0 rounded-lg font-semibold transition-colors text-sm lg:hidden"
        whileTap={{ scale: 0.95 }}
        onClick={onShowTutorial}
      >
        ？
      </motion.button>
    </div>
  );
}
