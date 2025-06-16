"use client";

import { motion, AnimatePresence } from "motion/react";
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
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 text-center max-w-md w-full relative"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              onClick={onClose}
            >
              ×
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {tutorialSteps[tutorialStep]?.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {tutorialSteps[tutorialStep]?.content}
              </p>
            </div>

            {/* Demo Grid for Tutorial */}
            {tutorialSteps[tutorialStep]?.highlight === "board" && (
              <div className="bg-slate-100 p-3 rounded-lg mb-6">
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
                              : "bg-slate-300 border-slate-400"
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
                <p className="text-xs text-gray-500 mt-2">
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
                    index === tutorialStep ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 justify-center">
              {tutorialStep > 0 && (
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  onClick={onPrev}
                >
                  前へ
                </button>
              )}

              {tutorialStep < tutorialSteps.length - 1 ? (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={onNext}
                >
                  次へ
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  onClick={onClose}
                >
                  始める
                </button>
              )}

              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                onClick={onClose}
              >
                スキップ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
