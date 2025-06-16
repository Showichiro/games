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
    <div className="text-center mb-6 relative">
      <h1 className="text-3xl font-bold text-white mb-4">ライツアウト</h1>
      <div className="flex justify-center gap-6 text-gray-300 mb-4">
        <div>手数: {moves}</div>
        <div>時間: {formatTime(elapsedTime)}</div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex justify-center gap-2">
        {(Object.keys(difficultyConfig) as Difficulty[]).map((diff) => (
          <motion.button
            key={diff}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              difficulty === diff
                ? "bg-blue-600 text-white"
                : "bg-slate-600 text-gray-300 hover:bg-slate-500"
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
