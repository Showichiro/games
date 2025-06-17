"use client";

import { motion } from "framer-motion";
import type { Player } from "../types";

interface GameHeaderProps {
  scores: { black: number; white: number };
  currentPlayer: Player;
  isThinking?: boolean;
  gameStatus?: string;
}

export default function GameHeader({
  scores,
  currentPlayer,
  isThinking = false,
  gameStatus,
}: GameHeaderProps) {
  const playerNames = {
    black: "あなた",
    white: "CPU",
  };

  const playerIcons = {
    black: "⚫",
    white: "⚪",
  };

  return (
    <motion.div
      className="flex flex-col items-center space-y-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-white mb-2">リバーシ</h1>

      <div className="flex items-center justify-center space-x-8">
        <motion.div
          className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg
                        ${
                          currentPlayer === "black" && !isThinking
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }
                    `}
          animate={{
            scale: currentPlayer === "black" && !isThinking ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-2xl">⚫</span>
          <div className="text-center">
            <div className="text-sm font-medium">{playerNames.black}</div>
            <div className="text-xl font-bold">{scores.black}</div>
          </div>
        </motion.div>

        <div className="text-2xl text-gray-400 font-bold">VS</div>

        <motion.div
          className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg
                        ${
                          currentPlayer === "white" || isThinking
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }
                    `}
          animate={{
            scale: currentPlayer === "white" || isThinking ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-2xl">⚪</span>
          <div className="text-center">
            <div className="text-sm font-medium">{playerNames.white}</div>
            <div className="text-xl font-bold">{scores.white}</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="text-center"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isThinking ? (
          <motion.div
            className="flex items-center justify-center space-x-2 text-yellow-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="font-medium">CPUが考え中...</span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          </motion.div>
        ) : gameStatus ? (
          <div className="text-lg font-medium text-white">{gameStatus}</div>
        ) : (
          <div className="text-lg font-medium text-white">
            {playerIcons[currentPlayer]} {playerNames[currentPlayer]}のターン
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
