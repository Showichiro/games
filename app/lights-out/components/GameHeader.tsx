"use client";

import { LightsOutButton } from "@/components/common";
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
  const tapMotionProps = { whileTap: { scale: 0.95 } }; // To match original tap effect

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
        {(Object.keys(difficultyConfig) as Difficulty[]).map((d) => {
          const isActive = difficulty === d;
          return (
            <LightsOutButton
              key={d}
              className={`px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors focus:ring-offset-0 focus:ring-2 focus:ring-opacity-50 ${
                isActive
                  ? "bg-brand-primary text-neutral-0 focus:ring-brand-300"
                  : "bg-neutral-600 text-neutral-0 hover:bg-neutral-700 focus:ring-neutral-400"
              }`}
              // Pass motionProps to ensure the tap effect is consistent,
              // LightsOutButton default hover will also apply.
              // If only tap is desired, motionProps={{...tapMotionProps, whileHover: {}}}
              motionProps={tapMotionProps}
              onClick={() => onDifficultyChange(d)}
              // The `variant` prop could be used if styles were aligned, e.g., variant={isActive ? 'primary' : 'dark'}
              // But here specific class names are more direct for matching existing styles.
            >
              {difficultyConfig[d].label}
            </LightsOutButton>
          );
        })}
      </div>
    </div>
  );
}
