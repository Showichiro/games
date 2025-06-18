"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Settings, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";
import Button from "@/components/common/Button";
import type { Difficulty } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  showHints: boolean;
  onToggleHints: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
}

const difficultyConfig = {
  beginner: {
    label: "初級",
    description: "初心者向け - ランダム要素多め",
    icon: "🟢",
    thinkingTime: "0.5-1秒",
  },
  intermediate: {
    label: "中級",
    description: "中級者向け - バランス型AI",
    icon: "🟡",
    thinkingTime: "1-2秒",
  },
  advanced: {
    label: "上級",
    description: "上級者向け - 戦略的AI",
    icon: "🟠",
    thinkingTime: "2-3秒",
  },
  expert: {
    label: "専門家",
    description: "最高難易度 - 定石使用",
    icon: "🔴",
    thinkingTime: "3-5秒",
  },
};

export default function SettingsModal({
  isOpen,
  onClose,
  difficulty,
  onDifficultyChange,
  showHints,
  onToggleHints,
  soundEnabled,
  onToggleSound,
  animationsEnabled,
  onToggleAnimations,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{
              background: "var(--gradient-game-bg)",
              border: "1px solid var(--color-neutral-700)",
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Settings className="text-blue-400" size={24} />
                <h2 className="text-2xl font-bold text-white">設定</h2>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<X size={20} />}
                  aria-label="閉じる"
                  className="p-2"
                />
              </motion.div>
            </div>

            {/* Difficulty Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                🎯 難易度設定
              </h3>
              <div className="space-y-3">
                {(Object.keys(difficultyConfig) as Difficulty[]).map(
                  (level) => {
                    const config = difficultyConfig[level];
                    const isSelected = difficulty === level;

                    return (
                      <motion.button
                        key={level}
                        className="w-full p-4 rounded-lg border transition-all text-left"
                        style={{
                          backgroundColor: isSelected
                            ? "var(--color-interactive-focus)"
                            : "var(--color-neutral-800)",
                          borderColor: isSelected
                            ? "var(--color-interactive-focus)"
                            : "var(--color-neutral-600)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onDifficultyChange(level)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2 text-white font-medium">
                            {config.icon} {config.label}
                          </span>
                          <span
                            className="text-sm px-2 py-1 rounded"
                            style={{
                              backgroundColor: "var(--color-neutral-700)",
                              color: "var(--color-neutral-300)",
                            }}
                          >
                            {config.thinkingTime}
                          </span>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-neutral-400)" }}
                        >
                          {config.description}
                        </p>
                      </motion.button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Game Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                ⚙️ ゲーム設定
              </h3>
              <div className="space-y-3">
                {/* Hints Toggle */}
                <motion.button
                  className="w-full p-4 rounded-lg border flex items-center justify-between transition-all"
                  style={{
                    backgroundColor: showHints
                      ? "var(--color-warning-600)"
                      : "var(--color-neutral-800)",
                    borderColor: showHints
                      ? "var(--color-warning-600)"
                      : "var(--color-neutral-600)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onToggleHints}
                >
                  <div className="flex items-center gap-3 text-white">
                    {showHints ? <Eye size={20} /> : <EyeOff size={20} />}
                    <div>
                      <div className="font-medium">ヒント表示</div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--color-neutral-400)" }}
                      >
                        置ける場所を表示
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-all ${
                      showHints ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full mt-0.5"
                      animate={{ x: showHints ? 26 : 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    />
                  </div>
                </motion.button>

                {/* Sound Toggle */}
                <motion.button
                  className="w-full p-4 rounded-lg border flex items-center justify-between transition-all"
                  style={{
                    backgroundColor: soundEnabled
                      ? "var(--color-blue-600)"
                      : "var(--color-neutral-800)",
                    borderColor: soundEnabled
                      ? "var(--color-blue-600)"
                      : "var(--color-neutral-600)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onToggleSound}
                >
                  <div className="flex items-center gap-3 text-white">
                    {soundEnabled ? (
                      <Volume2 size={20} />
                    ) : (
                      <VolumeX size={20} />
                    )}
                    <div>
                      <div className="font-medium">サウンド</div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--color-neutral-400)" }}
                      >
                        効果音とBGM
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-all ${
                      soundEnabled ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full mt-0.5"
                      animate={{ x: soundEnabled ? 26 : 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    />
                  </div>
                </motion.button>

                {/* Animations Toggle */}
                <motion.button
                  className="w-full p-4 rounded-lg border flex items-center justify-between transition-all"
                  style={{
                    backgroundColor: animationsEnabled
                      ? "var(--color-purple-600)"
                      : "var(--color-neutral-800)",
                    borderColor: animationsEnabled
                      ? "var(--color-purple-600)"
                      : "var(--color-neutral-600)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onToggleAnimations}
                >
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-xl">✨</span>
                    <div>
                      <div className="font-medium">アニメーション</div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--color-neutral-400)" }}
                      >
                        視覚効果とアニメーション
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-all ${
                      animationsEnabled ? "bg-purple-500" : "bg-gray-500"
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full mt-0.5"
                      animate={{ x: animationsEnabled ? 26 : 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Close Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="primary" size="lg" fullWidth onClick={onClose}>
                設定を保存
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
