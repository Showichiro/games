"use client";

import {
  LightsOutPrimaryButton,
  LightsOutSecondaryButton,
  LightsOutButton,
} from "@/components/common";

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
  // Custom motion props to replicate existing whileTap, if LightsOutButton defaults are not enough
  const tapMotionProps = { whileTap: { scale: 0.95 } };

  return (
    <div className="flex gap-3 lg:gap-4 justify-center flex-wrap">
      {/*
        Original "新規" classes: "px-6 py-3 lg:px-8 lg:py-4 bg-brand-primary hover:bg-brand-700 text-neutral-0 rounded-lg font-semibold transition-colors text-sm lg:text-base"
        Button size="xl": 'px-6 py-3 text-base rounded-md'
        Using LightsOutPrimaryButton (bg-blue-600) and overriding styles for closer match.
        Or, use LightsOutButton with custom classes.
      */}
      <LightsOutPrimaryButton
        size="xl" // Provides base padding and text size
        className="lg:px-8 lg:py-4 text-sm lg:text-base bg-brand-primary hover:bg-brand-700 text-neutral-0" // Overrides for specific colors and responsive text/padding
        motionProps={tapMotionProps}
        onClick={onNewGame}
      >
        新規
      </LightsOutPrimaryButton>

      {/*
        Original "リセット" classes: "px-6 py-3 lg:px-8 lg:py-4 bg-neutral-600 hover:bg-neutral-700 text-neutral-0 rounded-lg font-semibold transition-colors text-sm lg:text-base"
        Button size="xl": 'px-6 py-3 text-base rounded-md'
        Using LightsOutSecondaryButton (bg-gray-200) and overriding.
        Alternatively, Button variant="dark" (bg-gray-800) might be closer if LightsOut is not a hard requirement.
        Or, LightsOutButton with custom classes.
      */}
      <LightsOutSecondaryButton
        size="xl" // Provides base padding and text size
        className="lg:px-8 lg:py-4 text-sm lg:text-base bg-neutral-600 hover:bg-neutral-700 text-neutral-0" // Overrides for specific colors and responsive text/padding
        motionProps={tapMotionProps}
        onClick={onResetGame}
      >
        リセット
      </LightsOutSecondaryButton>

      {/*
        Original "💡" Hint classes: "px-4 py-3 bg-success-600 hover:bg-success-700 text-neutral-0 rounded-lg font-semibold transition-colors text-sm relative lg:hidden"
        Button size="md": 'px-4 py-2 text-sm rounded-md'
        Using LightsOutButton with variant="success" (bg-green-500). We'll add custom class for bg-success-600.
      */}
      <LightsOutButton
        variant="success" // Base is green-500
        size="md" // px-4 py-2, original py-3
        className="px-4 py-3 bg-success-600 hover:bg-success-700 text-neutral-0 relative lg:hidden" // Custom padding, exact colors, and visibility
        motionProps={tapMotionProps}
        onClick={onHint}
        aria-label="Hint"
      >
        💡
        {hintsUsed > 0 && (
          <span className="absolute -top-1 -right-1 bg-error-500 text-neutral-0 text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {hintsUsed}
          </span>
        )}
      </LightsOutButton>

      {/*
        Original "？" Tutorial classes: "px-4 py-3 bg-purple-600 hover:bg-purple-700 text-neutral-0 rounded-lg font-semibold transition-colors text-sm lg:hidden"
        Button size="md": 'px-4 py-2 text-sm rounded-md'
        Using LightsOutButton and applying custom classes for purple color.
      */}
      <LightsOutButton
        size="md" // px-4 py-2, original py-3
        className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-neutral-0 relative lg:hidden" // Custom padding, exact colors, and visibility
        motionProps={tapMotionProps}
        onClick={onShowTutorial}
        aria-label="Tutorial"
      >
        ？
      </LightsOutButton>
    </div>
  );
}
