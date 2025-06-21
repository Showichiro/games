"use client";

import { StatsRow } from "@/components/common";

interface GameHeaderProps {
  moves: number;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
}

export default function GameHeader({
  moves,
  elapsedTime,
  formatTime,
}: GameHeaderProps) {
  const statItems = [
    { label: "手数", value: moves },
    { label: "時間", value: formatTime(elapsedTime) },
  ];

  return (
    <div className="text-center mb-6 lg:mb-8 relative">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
        ライツアウト
      </h1>

      <StatsRow
        items={statItems}
        className="justify-center gap-6 lg:gap-8 text-neutral-100 text-sm md:text-base lg:text-lg"
      />
    </div>
  );
}
