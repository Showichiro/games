"use client";

import { motion } from "motion/react";
import { StepTutorial } from "@/components/common";
import type { TutorialStep as AppTutorialStepConfig } from "../types";
import React from "react";

interface TutorialModalProps {
  showTutorial: boolean;
  tutorialStep: number;
  tutorialSteps: AppTutorialStepConfig[];
  demoToggle: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function TutorialModal({
  showTutorial,
  tutorialStep,
  tutorialSteps,
  demoToggle,
  onClose,
  onNext,
  onPrev,
}: TutorialModalProps) {
  const adaptedSteps = tutorialSteps.map((stepConfig) => {
    let customContent: React.ReactNode = null;
    if (stepConfig.highlight === "board") {
      customContent = (
        <div className="bg-neutral-100 p-3 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
            {Array(9)
              .fill(null)
              .map((_, i) => {
                const affectedByCenterTap =
                  i === 4 || i === 1 || i === 3 || i === 5 || i === 7;
                const initialState = i === 1 || i === 3 || i === 5 || i === 7;
                const isLit = demoToggle
                  ? affectedByCenterTap
                    ? !initialState
                    : initialState
                  : initialState;
                return (
                  <motion.div
                    key={i}
                    className={`aspect-square rounded border-2 ${
                      isLit
                        ? "bg-yellow-400 border-yellow-300"
                        : "bg-neutral-300 border-neutral-400"
                    }`}
                    animate={{
                      scale: isLit ? 1.05 : 1, // Slightly reduced scale for subtlety
                      backgroundColor: isLit ? "#facc15" : "#d1d5db",
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                );
              })}
          </div>
          <p className="text-xs text-subtext-color mt-2">
            {demoToggle
              ? "中央タップで十字パターンが反転"
              : "十字パターン - 中央をタップ..."}
          </p>
        </div>
      );
    }

    return {
      title: stepConfig.title,
      content: (
        <p className="text-subtext-color leading-relaxed whitespace-pre-line">
          {stepConfig.content}
        </p>
      ),
      customContent: customContent,
    };
  });

  return (
    <StepTutorial
      isOpen={showTutorial}
      onClose={onClose}
      steps={adaptedSteps}
      currentStep={tutorialStep}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
}
