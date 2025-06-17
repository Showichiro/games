"use client";

import { motion, AnimatePresence } from "motion/react";
import type { Player } from "../types";

interface GameCompleteModalProps {
  isOpen: boolean;
  winner: Player | "draw" | null;
  scores: { black: number; white: number };
  onNewGame: () => void;
  onClose: () => void;
}

export default function GameCompleteModal({
  isOpen,
  winner,
  scores,
  onNewGame,
  onClose,
}: GameCompleteModalProps) {
  if (!isOpen || !winner) return null;

  const getWinnerInfo = () => {
    switch (winner) {
      case "black":
        return {
          title: "🎉 あなたの勝ち！",
          message: "おめでとうございます！",
          bgColor: "from-blue-600 to-blue-800",
        };
      case "white":
        return {
          title: "😢 CPUの勝ち！",
          message: "次回がんばりましょう！",
          bgColor: "from-red-600 to-red-800",
        };
      case "draw":
        return {
          title: "🤝 引き分け！",
          message: "互角の勝負でした！",
          bgColor: "from-yellow-600 to-yellow-800",
        };
      default:
        return {
          title: "ゲーム終了",
          message: "",
          bgColor: "from-gray-600 to-gray-800",
        };
    }
  };

  const { title, message, bgColor } = getWinnerInfo();

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
            className={`bg-gradient-to-br ${bgColor} rounded-2xl p-6 max-w-md w-full mx-4 text-white shadow-2xl`}
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
                {title}
              </motion.h2>

              <motion.p
                className="text-xl mb-6 opacity-90"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>

              <motion.div
                className="bg-white/20 rounded-lg p-4 mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-3">最終スコア</h3>
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚫</div>
                    <div className="text-sm opacity-75">あなた</div>
                    <div className="text-2xl font-bold">{scores.black}</div>
                  </div>
                  <div className="text-2xl font-bold opacity-50">-</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚪</div>
                    <div className="text-sm opacity-75">CPU</div>
                    <div className="text-2xl font-bold">{scores.white}</div>
                  </div>
                </div>
              </motion.div>

              <div className="flex space-x-3">
                <motion.button
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  閉じる
                </motion.button>
                <motion.button
                  className="flex-1 bg-white text-gray-800 hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNewGame}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  🎮 新しいゲーム
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
