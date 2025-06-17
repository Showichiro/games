"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Difficulty, Player } from "../types";

interface GameStartModalProps {
  isOpen: boolean;
  onPlayerSelect: (player: Player) => void;
  onClose: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export default function GameStartModal({
  isOpen,
  onPlayerSelect,
  onClose,
  difficulty,
  onDifficultyChange,
}: GameStartModalProps) {
  const difficultyNames = {
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
    expert: "専門家",
  };

  const difficultyDescriptions = {
    beginner: "リバーシ初心者におすすめ",
    intermediate: "少し考えて打つCPU",
    advanced: "戦略的に考えるCPU",
    expert: "手強い上級者CPU",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-lg w-full mx-4 text-white shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.h2
                className="text-3xl font-bold mb-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                🎮 新しいゲーム
              </motion.h2>

              <motion.p
                className="text-lg mb-6 opacity-90"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                あなたの石の色を選んでください
              </motion.p>

              {/* プレイヤー選択 */}
              <motion.div
                className="mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-4">石の色を選択</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    className="bg-gradient-to-br from-gray-700 to-black p-6 rounded-lg border-2 border-gray-600 hover:border-white/50 transition-all duration-200"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPlayerSelect("black")}
                  >
                    <div className="text-4xl mb-2">⚫</div>
                    <div className="font-semibold mb-1">黒石</div>
                    <div className="text-sm opacity-75">先手でプレイ</div>
                    <div className="text-xs mt-1 text-green-400">推奨</div>
                  </motion.button>

                  <motion.button
                    className="bg-gradient-to-br from-gray-200 to-white text-gray-800 p-6 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-all duration-200"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPlayerSelect("white")}
                  >
                    <div className="text-4xl mb-2">⚪</div>
                    <div className="font-semibold mb-1">白石</div>
                    <div className="text-sm opacity-75">後手でプレイ</div>
                    <div className="text-xs mt-1 text-orange-600">
                      チャレンジ
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              {/* 難易度選択 */}
              <motion.div
                className="mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold mb-4">CPU難易度</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(difficultyNames) as Difficulty[]).map(
                    (level) => (
                      <button
                        key={level}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          difficulty === level
                            ? "bg-blue-600 text-white border-2 border-blue-400"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-transparent"
                        }`}
                        onClick={() => onDifficultyChange(level)}
                      >
                        <div className="font-semibold mb-1">
                          {difficultyNames[level]}
                        </div>
                        <div className="text-xs opacity-75">
                          {difficultyDescriptions[level]}
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </motion.div>

              {/* 説明テキスト */}
              <motion.div
                className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4 mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-sm">
                  <div className="font-semibold mb-2">💡 ゲームのコツ</div>
                  <ul className="text-left space-y-1 text-xs opacity-90">
                    <li>• 角を取ると有利になります</li>
                    <li>• 相手の選択肢を少なくしましょう</li>
                    <li>• 序盤は石数より位置が重要です</li>
                  </ul>
                </div>
              </motion.div>

              {/* キャンセルボタン */}
              <motion.button
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                キャンセル
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
