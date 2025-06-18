"use client";

import { StatsRow, ButtonGroup } from "@/components/common"; // Updated imports
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
  const statItems = [
    { label: "手数", value: moves },
    { label: "時間", value: formatTime(elapsedTime) },
  ];

  const buttonGroupItems = (Object.keys(difficultyConfig) as Difficulty[]).map(
    (d) => ({
      id: d,
      label: difficultyConfig[d].label,
    }),
  );

  return (
    <div className="text-center mb-6 lg:mb-8 relative">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
        ライツアウト
      </h1>

      <StatsRow
        items={statItems}
        className="justify-center gap-6 lg:gap-8 text-neutral-100 mb-4 lg:mb-6 text-sm md:text-base lg:text-lg"
      />

      <ButtonGroup
        items={buttonGroupItems}
        selectedId={difficulty}
        onSelect={(selectedDifficulty) =>
          onDifficultyChange(selectedDifficulty as Difficulty)
        }
        buttonClassName="px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50"
        activeButtonClassName="bg-brand-primary text-neutral-0 focus:ring-brand-300"
        inactiveButtonClassName="bg-neutral-600 text-neutral-0 hover:bg-neutral-700 focus:ring-neutral-400"
      />
    </div>
  );
}
