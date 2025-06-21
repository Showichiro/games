"use client";

import {
  LightsOutPrimaryButton,
  LightsOutSecondaryButton,
} from "@/components/common";

interface GameControlsProps {
  onNewGame: () => void;
  onResetGame: () => void;
}

export default function GameControls({
  onNewGame,
  onResetGame,
}: GameControlsProps) {
  return (
    <div className="flex gap-3 lg:gap-4 justify-center flex-wrap">
      <LightsOutPrimaryButton
        size="xl"
        className="lg:px-8 lg:py-4 text-sm lg:text-base bg-brand-primary hover:bg-brand-700 text-neutral-0"
        onClick={onNewGame}
      >
        新規
      </LightsOutPrimaryButton>

      <LightsOutSecondaryButton
        size="xl"
        className="lg:px-8 lg:py-4 text-sm lg:text-base bg-neutral-600 hover:bg-neutral-700 text-neutral-0"
        onClick={onResetGame}
      >
        リセット
      </LightsOutSecondaryButton>
    </div>
  );
}
