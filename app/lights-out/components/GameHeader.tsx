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

  const buttonGroupItems = (
    Object.keys(difficultyConfig) as Difficulty[]
  ).map((d) => ({
    id: d,
    label: difficultyConfig[d].label,
    // Example of using item-specific classes if ButtonGroup defaults are not enough:
    // className: "custom-inactive-class-for-this-item",
    // activeClassName: "custom-active-class-for-this-item",
  }));

  return (
    <div className="text-center mb-6 lg:mb-8 relative">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 dark:text-neutral-100">
        ライツアウト
      </h1>

      {/* Stats Display */}
      <StatsRow
        items={statItems}
        className="justify-center gap-6 lg:gap-8 text-neutral-100 dark:text-neutral-300 mb-4 lg:mb-6 text-sm md:text-base lg:text-lg"
        // itemClassName can be used if individual stat items need specific styling beyond StatsRow defaults
      />

      {/* Difficulty Selector */}
      <ButtonGroup
        items={buttonGroupItems}
        selectedId={difficulty}
        onSelect={(selectedDifficulty) =>
          onDifficultyChange(selectedDifficulty as Difficulty) // Cast needed as onSelect provides T (string from id)
        }
        // containerClassName can override default "flex justify-center gap-2 lg:gap-3"
        // buttonClassName can override default button base styles
        // activeButtonClassName can override default active button styles
        // inactiveButtonClassName can override default inactive button styles
        // For this case, we want to replicate the original specific active/inactive styles:
        buttonClassName="px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-opacity-50"
        activeButtonClassName="bg-brand-primary text-neutral-0 focus:ring-brand-300"
        inactiveButtonClassName="bg-neutral-600 text-neutral-0 hover:bg-neutral-700 focus:ring-neutral-400 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus:ring-neutral-500"
      />
    </div>
  );
}
