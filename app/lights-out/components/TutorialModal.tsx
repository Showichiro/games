"use client";

import { motion } from "motion/react";
import { StepTutorial } from "@/components/common";
import type { TutorialStep as AppTutorialStepConfig } from "../types"; // Renamed to avoid conflict
import React from "react"; // Import React for JSX

// Props for this specific TutorialModal, which wraps StepTutorial
interface TutorialModalProps {
  showTutorial: boolean;
  tutorialStep: number; // Current step index
  tutorialStepsConfig: AppTutorialStepConfig[]; // The game-specific configuration for steps
  demoToggle: boolean; // State for the interactive demo grid
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  // onDemoToggle?: () => void; // If demo toggle is managed by this component and needs to be passed to customContent
}

export default function TutorialModal({
  showTutorial,
  tutorialStep,
  tutorialStepsConfig,
  demoToggle,
  onClose,
  onNext,
  onPrev,
}: TutorialModalProps) {
  // Adapt game-specific tutorialStepsConfig to the generic TutorialStep format for StepTutorial
  const adaptedSteps = tutorialStepsConfig.map((stepConfig, index) => {
    let customContent: React.ReactNode = null;
    if (stepConfig.highlight === "board") {
      customContent = (
        <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
            {Array(9)
              .fill(null)
              .map((_, i) => {
                const affectedByCenterTap = i === 4 || i === 1 || i === 3 || i === 5 || i === 7;
                const initialState = i === 1 || i === 3 || i === 5 || i === 7;
                const isLit = demoToggle ? (affectedByCenterTap ? !initialState : initialState) : initialState;
                return (
                  <motion.div
                    key={i}
                    className={`aspect-square rounded border-2 ${
                      isLit
                        ? "bg-yellow-400 border-yellow-300 dark:bg-yellow-500 dark:border-yellow-400"
                        : "bg-neutral-300 border-neutral-400 dark:bg-neutral-600 dark:border-neutral-500"
                    }`}
                    animate={{
                      scale: isLit ? 1.05 : 1, // Slightly reduced scale for subtlety
                      backgroundColor: isLit
                        ? "#facc15" // yellow-400
                        : (document.documentElement.classList.contains('dark') ? "#4b5563" : "#d1d5db"), // neutral-300 or dark:neutral-600
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                );
              })}
          </div>
          <p className="text-xs text-subtext-color mt-2">
            {/* This text could also be part of stepConfig if it varies per step */}
            {demoToggle ? "中央タップで十字パターンが反転" : "十字パターン - 中央をタップ..."}
          </p>
        </div>
      );
    }

    return {
      title: stepConfig.title,
      content: <p className="text-subtext-color leading-relaxed whitespace-pre-line">{stepConfig.content}</p>, // Added whitespace-pre-line for multi-line content
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
      // Optional: pass custom classNames if StepTutorial defaults are not sufficient
      // titleClassName="text-2xl font-semibold mb-4"
      // contentClassName="text-base mb-4"
    />
  );
}
