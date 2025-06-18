"use client";

import { motion } from "motion/react";
import React from "react";
import Button from "./Button";
import Modal from "./Modal"; // Using the common Modal component

export interface TutorialStep {
  // Added export
  title: string;
  content: React.ReactNode;
  customContent?: React.ReactNode;
}

export interface StepTutorialProps {
  // Added export
  isOpen: boolean;
  onClose: () => void;
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  // Optional classNames for further customization
  titleClassName?: string;
  contentClassName?: string;
  progressDotsClassName?: string;
  navigationButtonClassName?: string;
}

export default function StepTutorial({
  isOpen,
  onClose,
  steps,
  currentStep,
  onNext,
  onPrev,
  titleClassName = "text-xl font-bold text-default-font mb-3",
  contentClassName = "text-subtext-color leading-relaxed",
  progressDotsClassName = "w-2 h-2 rounded-full",
  navigationButtonClassName, // Consumers can pass this for button styling
}: StepTutorialProps) {
  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return null; // Or some error/fallback UI
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md w-full text-center"
    >
      {/* Using motion.div for content scaling animation, similar to original TutorialModal */}
      <motion.div
        key={currentStep} // Animate when step changes
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative" // Added relative for potential absolute positioned elements inside customContent
      >
        {/* Close button can be part of Modal or added via headerActions if Modal is enhanced */}
        {/* For now, Modal's default onClose (backdrop click) handles closing. An explicit close button can be added if needed. */}

        <div className="mb-6">
          <h2 className={titleClassName}>{currentStepData.title}</h2>
          <div className={contentClassName}>{currentStepData.content}</div>
        </div>

        {currentStepData.customContent && (
          <div className="mb-6">{currentStepData.customContent}</div>
        )}

        {/* Progress dots */}
        {steps.length > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`${progressDotsClassName} ${
                  index === currentStep ? "bg-brand-600" : "bg-neutral-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 justify-center">
          {currentStep > 0 && (
            <Button
              variant="secondary"
              size="md"
              onClick={onPrev}
              className={navigationButtonClassName}
            >
              戻る
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              onClick={onNext}
              className={navigationButtonClassName}
            >
              次へ
            </Button>
          ) : (
            <Button
              variant="success" // Or primary, depending on desired final action emphasis
              size="md"
              onClick={onClose} // Or a specific onFinish callback
              className={navigationButtonClassName}
            >
              始める
            </Button>
          )}

          {/* Optional Skip button, can be controlled by a prop if needed */}
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            className={navigationButtonClassName}
          >
            スキップ
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
}
