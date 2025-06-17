"use client";

import { motion } from "motion/react";
import type { Difficulty, DifficultyConfig } from "../types";

interface GameHeaderProps {
  moves: number;
  elapsedTime: number;
  difficulty: Difficulty;
  difficultyConfig: Record<Difficulty, DifficultyConfig>;
  onDifficultyChange: (difficulty: Difficulty) => void;
  formatTime: (seconds: number) => string;
}

export default function GameHeader({
  moves,
  elapsedTime,
  difficulty,
  difficultyConfig,
  onDifficultyChange,
  formatTime,
}: GameHeaderProps) {
  return (
    <div className="text-center mb-6 lg:mb-8 relative">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
        ライツアウト
      </h1>
      <div className="flex justify-center gap-6 lg:gap-8 text-neutral-300 mb-4 lg:mb-6 text-sm md:text-base lg:text-lg">
        <div>手数: {moves}</div>
        <div>時間: {formatTime(elapsedTime)}</div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex justify-center gap-2 lg:gap-3">
        {(Object.keys(difficultyConfig) as Difficulty[]).map((diff) => (
          <motion.button
            key={diff}
            className={`px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors ${
              difficulty === diff
                ? "bg-brand-primary text-neutral-0"
                : "bg-neutral-600 text-neutral-0 hover:bg-neutral-700"
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDifficultyChange(diff)}
          >
            {difficultyConfig[diff].label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
