"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useState } from "react";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: "リバーシ（オセロ）とは",
    content: (
      <div className="space-y-4">
        <p className="text-white">
          リバーシは2人で遊ぶボードゲームです。8×8のマス目に黒と白の石を置いて、相手の石を挟んで取っていきます。
        </p>
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-1 w-32 h-32 mx-auto">
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className="aspect-square rounded border border-neutral-600 flex items-center justify-center"
                style={{ backgroundColor: "var(--color-reversi-board-bg)" }}
              >
                {i === 5 || i === 10 ? (
                  <div className="w-6 h-6 rounded-full bg-white border border-gray-300" />
                ) : i === 6 || i === 9 ? (
                  <div className="w-6 h-6 rounded-full bg-black border border-gray-300" />
                ) : null}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-neutral-400 mt-2">
            初期配置：中央に黒と白が2個ずつ
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "基本ルール",
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">1️⃣</span>
            <div>
              <h4 className="text-white font-medium">順番制</h4>
              <p className="text-neutral-300 text-sm">
                黒（あなた）が先手、白（CPU）が後手で交互に石を置きます
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">2️⃣</span>
            <div>
              <h4 className="text-white font-medium">挟んで取る</h4>
              <p className="text-neutral-300 text-sm">
                相手の石を自分の石で挟むと、挟まれた石は全て自分の色になります
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">3️⃣</span>
            <div>
              <h4 className="text-white font-medium">置ける場所</h4>
              <p className="text-neutral-300 text-sm">
                相手の石を1個以上挟める場所にのみ石を置くことができます
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">4️⃣</span>
            <div>
              <h4 className="text-white font-medium">パス</h4>
              <p className="text-neutral-300 text-sm">
                置ける場所がない場合は自動的にパスになります
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "勝利条件と戦略",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="text-white font-medium mb-2">🏆 勝利条件</h4>
          <p className="text-neutral-300 text-sm mb-3">
            ボードが埋まるか、両者ともパスした時点でゲーム終了。石の数が多い方が勝利です。
          </p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">💡 基本戦略</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-neutral-300">
                四隅を取ると有利（取られにくい）
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">✗</span>
              <span className="text-neutral-300">角の隣（C打ち）は避ける</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">💡</span>
              <span className="text-neutral-300">序盤は石数より位置を重視</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🎯</span>
              <span className="text-neutral-300">終盤は多くの石を取る</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "ゲームの操作方法",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="text-white font-medium mb-3">🎮 基本操作</h4>
          <div className="space-y-3">
            <div className="bg-neutral-800 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🖱️</span>
                <span className="text-white font-medium">石を置く</span>
              </div>
              <p className="text-neutral-300 text-sm">
                緑色に光っているマスをクリック/タップして石を置きます
              </p>
            </div>
            <div className="bg-neutral-800 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">💡</span>
                <span className="text-white font-medium">ヒント機能</span>
              </div>
              <p className="text-neutral-300 text-sm">
                「ヒントON/OFF」ボタンで置ける場所の表示を切り替えできます
              </p>
            </div>
            <div className="bg-neutral-800 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">⏮️</span>
                <span className="text-white font-medium">履歴機能</span>
              </div>
              <p className="text-neutral-300 text-sm">
                手の取り消し（Undo）や進める（Redo）が可能です
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "AIの難易度について",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="text-white font-medium mb-3">🤖 AI難易度</h4>
          <div className="space-y-3">
            <div className="bg-green-900/30 border border-green-600 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🟢</span>
                <span className="text-white font-medium">初級</span>
              </div>
              <p className="text-neutral-300 text-sm">
                ランダム要素多め、初心者におすすめ
              </p>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-600 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🟡</span>
                <span className="text-white font-medium">中級</span>
              </div>
              <p className="text-neutral-300 text-sm">
                バランス型AI、戦略を学びたい方に
              </p>
            </div>
            <div className="bg-orange-900/30 border border-orange-600 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🟠</span>
                <span className="text-white font-medium">上級</span>
              </div>
              <p className="text-neutral-300 text-sm">
                戦略的AI、手強い相手をお求めの方に
              </p>
            </div>
            <div className="bg-red-900/30 border border-red-600 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🔴</span>
                <span className="text-white font-medium">専門家</span>
              </div>
              <p className="text-neutral-300 text-sm">
                定石使用、最高難易度に挑戦したい方に
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "チュートリアル完了！",
    content: (
      <div className="text-center space-y-4">
        <div className="text-6xl">🎉</div>
        <h4 className="text-white font-bold text-xl">準備完了です！</h4>
        <p className="text-neutral-300">
          これでリバーシの基本をマスターしました。
          <br />
          実際にゲームをプレイして戦略を磨いていきましょう！
        </p>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mt-4">
          <p className="text-white font-medium">💡 プレイのコツ</p>
          <p className="text-neutral-200 text-sm mt-1">
            最初は「初級」から始めて、慣れてきたら徐々に難易度を上げてみてください。
            ヒント機能を使って置ける場所を確認しながらプレイするのもおすすめです！
          </p>
        </div>
      </div>
    ),
  },
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
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
                <BookOpen className="text-blue-400" size={24} />
                <h2 className="text-2xl font-bold text-white">
                  チュートリアル
                </h2>
                <span
                  className="px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: "var(--color-neutral-700)",
                    color: "var(--color-neutral-300)",
                  }}
                >
                  {currentStep + 1} / {tutorialSteps.length}
                </span>
              </div>
              <motion.button
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: "var(--color-neutral-700)",
                  color: "var(--color-neutral-300)",
                }}
                whileHover={{
                  backgroundColor: "var(--color-neutral-600)",
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div
                className="w-full h-2 rounded-full"
                style={{ backgroundColor: "var(--color-neutral-700)" }}
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {tutorialSteps[currentStep].title}
                </h3>
                <div className="text-neutral-300">
                  {tutorialSteps[currentStep].content}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <motion.button
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor:
                    currentStep === 0
                      ? "var(--color-neutral-700)"
                      : "var(--color-neutral-600)",
                  color:
                    currentStep === 0
                      ? "var(--color-neutral-500)"
                      : "var(--color-white)",
                  cursor: currentStep === 0 ? "not-allowed" : "pointer",
                }}
                whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
                whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft size={16} />
                前へ
              </motion.button>

              <div className="flex gap-2">
                {tutorialSteps.map((_, index) => (
                  <motion.button
                    key={index}
                    className="w-3 h-3 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        index === currentStep
                          ? "var(--color-blue-500)"
                          : "var(--color-neutral-600)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </div>

              {currentStep === tutorialSteps.length - 1 ? (
                <motion.button
                  className="px-6 py-2 rounded-lg font-medium transition-all text-white"
                  style={{
                    backgroundColor: "var(--color-green-600)",
                  }}
                  whileHover={{
                    backgroundColor: "var(--color-green-700)",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                >
                  開始する！
                </motion.button>
              ) : (
                <motion.button
                  className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-white"
                  style={{
                    backgroundColor: "var(--color-blue-600)",
                  }}
                  whileHover={{
                    backgroundColor: "var(--color-blue-700)",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                >
                  次へ
                  <ChevronRight size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
