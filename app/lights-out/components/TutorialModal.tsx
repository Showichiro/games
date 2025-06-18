"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button, IconButton } from "~/components/common"; // Added Button, IconButton
import type { TutorialStep } from "../types";

interface TutorialModalProps {
  showTutorial: boolean;
  tutorialStep: number;
  tutorialSteps: TutorialStep[];
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
  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-neutral-0 rounded-2xl p-6 text-center max-w-md w-full relative"
          >
            <IconButton
              icon={<span className="text-xl">×</span>} // Ensure icon size is appropriate
              variant="light" // Base variant
              className="absolute top-3 right-3 bg-transparent hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 focus:ring-0" // Ghost-like custom styling
              onClick={onClose}
              aria-label="チュートリアルを閉じる"
              size="sm" // Smaller size for a close button often looks better
            />

            <div className="mb-6">
              <h2 className="text-xl font-bold text-default-font mb-3">
                {tutorialSteps[tutorialStep]?.title}
              </h2>
              <p className="text-subtext-color leading-relaxed">
                {tutorialSteps[tutorialStep]?.content}
              </p>
            </div>

            {/* Demo Grid for Tutorial */}
            {tutorialSteps[tutorialStep]?.highlight === "board" && (
              <div className="bg-neutral-100 p-3 rounded-lg mb-6">
                <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                  {Array(9)
                    .fill(null)
                    .map((_, i) => {
                      // 中央（4）と上下左右の隣接セル（1,3,5,7）のみがタップで反転
                      const affectedByCenterTap =
                        i === 4 || i === 1 || i === 3 || i === 5 || i === 7;
                      // 最初は十字の端（1,3,5,7）が点灯、中央（4）と角（0,2,6,8）は消灯
                      const initialState =
                        i === 1 || i === 3 || i === 5 || i === 7;
                      const isLit = demoToggle
                        ? affectedByCenterTap
                          ? !initialState
                          : initialState // 影響受けるセルのみ反転
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
                            scale: isLit ? 1.1 : 1,
                            backgroundColor: isLit ? "#facc15" : "#cbd5e1",
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
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
            )}

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === tutorialStep ? "bg-brand-600" : "bg-neutral-300"
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 justify-center">
              {tutorialStep > 0 && (
                <Button
                  variant="secondary" // Using secondary as ghost is not available. Original: bg-neutral-300
                  size="md"
                  onClick={onPrev}
                  // className="bg-neutral-300 text-neutral-700 hover:bg-neutral-400" // Uncomment for original style
                >
                  前へ
                </Button>
              )}

              {tutorialStep < tutorialSteps.length - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onNext}
                  // className="bg-brand-primary hover:bg-brand-700" // Uncomment for original brand color
                >
                  次へ
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="md"
                  onClick={onClose}
                  // className="bg-success-600 hover:bg-success-700" // Uncomment for original success color
                >
                  始める
                </Button>
              )}

              <Button
                variant="secondary" // Using secondary for Skip button, similar to Prev button
                size="md"
                onClick={onClose}
                // className="bg-neutral-300 text-neutral-700 hover:bg-neutral-400" // Uncomment for original style
              >
                スキップ
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
