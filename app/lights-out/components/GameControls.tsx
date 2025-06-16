"use client";

import { motion } from "motion/react";

interface GameControlsProps {
  onNewGame: () => void;
  onResetGame: () => void;
  onShowTutorial: () => void;
}

export default function GameControls({
  onNewGame,
  onResetGame,
  onShowTutorial,
}: GameControlsProps) {
  return (
    <div className="flex gap-3 lg:gap-4 justify-center flex-wrap">
      <motion.button
        className="px-6 py-3 lg:px-8 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm lg:text-base"
        whileTap={{ scale: 0.95 }}
        onClick={onNewGame}
      >
        新規
      </motion.button>
      <motion.button
        className="px-6 py-3 lg:px-8 lg:py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm lg:text-base"
        whileTap={{ scale: 0.95 }}
        onClick={onResetGame}
      >
        リセット
      </motion.button>
      <motion.button
        className="px-4 py-3 lg:px-6 lg:py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-sm lg:text-base"
        whileTap={{ scale: 0.95 }}
        onClick={onShowTutorial}
      >
        ？
      </motion.button>
    </div>
  );
}
