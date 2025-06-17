"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Player } from "../types";

interface GameCompleteModalProps {
  isOpen: boolean;
  winner: Player | "draw" | null;
  scores: { black: number; white: number };
  onNewGame: () => void;
  onClose: () => void;
}

const VictoryFireworks = () => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#F9CA24"][
        Math.floor(Math.random() * 5)
      ],
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: `0 0 6px ${particle.color}`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const DefeatRain = () => {
  const [drops, setDrops] = useState<
    Array<{
      id: number;
      x: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const newDrops = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setDrops(newDrops);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-0.5 h-4 bg-gray-400 opacity-60"
          style={{
            left: `${drop.x}%`,
            top: "-10%",
          }}
          animate={{
            y: ["0vh", "110vh"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

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
          bgStyle: { background: "var(--gradient-victory)" },
        };
      case "white":
        return {
          title: "😢 CPUの勝ち！",
          message: "次回がんばりましょう！",
          bgStyle: { background: "var(--gradient-defeat)" },
        };
      case "draw":
        return {
          title: "🤝 引き分け！",
          message: "互角の勝負でした！",
          bgStyle: { background: "var(--gradient-draw)" },
        };
      default:
        return {
          title: "ゲーム終了",
          message: "",
          bgStyle: {
            background:
              "linear-gradient(135deg, var(--color-neutral-600), var(--color-neutral-800))",
          },
        };
    }
  };

  const { title, message, bgStyle } = getWinnerInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "var(--color-overlay-dark)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="rounded-2xl p-6 max-w-md w-full mx-4 text-white shadow-2xl relative overflow-hidden"
            style={bgStyle}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Effects */}
            {winner === "black" && <VictoryFireworks />}
            {winner === "white" && <DefeatRain />}

            <div className="text-center relative z-10">
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
                className="rounded-lg p-4 mb-6"
                style={{ backgroundColor: "var(--color-overlay-light)" }}
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
                  className="flex-1 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                  style={{ backgroundColor: "var(--color-overlay-light)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-neutral-700)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-overlay-light)";
                  }}
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
                  className="flex-1 font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
                  style={{
                    backgroundColor: "var(--color-white)",
                    color: "var(--color-neutral-800)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-neutral-100)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-white)";
                  }}
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
