"use client";

import { useState } from "react";
import { motion } from "motion/react";
import GameBoard from "./components/GameBoard";
import GameHeader from "./components/GameHeader";
import GameControls from "./components/GameControls";
import GameCompleteModal from "./components/GameCompleteModal";
import GameStartModal from "./components/GameStartModal";
import { useGameLogic } from "./hooks/useGameLogic";
import { useCpuPlayer } from "./hooks/useCpuPlayer";
import type { Difficulty, Player, PlayerConfig } from "./types";

export default function ReversiPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [showHints, setShowHints] = useState(true);
  const [showGameCompleteModal, setShowGameCompleteModal] = useState(false);
  const [showGameStartModal, setShowGameStartModal] = useState(true);
  const [playerConfig, setPlayerConfig] = useState<PlayerConfig>({
    humanPlayer: "black",
    cpuPlayer: "white",
  });

  const {
    gameState,
    makePlayerMove,
    makeCpuMove,
    resetGame,
    setThinking,
    isGameOver,
    winner,
  } = useGameLogic({
    playerConfig,
    onGameEnd: (gameWinner) => {
      if (gameWinner) {
        setTimeout(() => {
          setShowGameCompleteModal(true);
        }, 1000);
      }
    },
  });

  useCpuPlayer({
    board: gameState.board,
    isThinking: gameState.isThinking,
    currentPlayer: gameState.currentPlayer,
    cpuPlayer: playerConfig.cpuPlayer,
    gameStatus: gameState.gameStatus,
    difficulty,
    onCpuMove: makeCpuMove,
    onSetThinking: setThinking,
  });

  const handleNewGame = () => {
    setShowGameStartModal(true);
  };

  const handlePlayerSelect = (selectedPlayer: Player) => {
    const newPlayerConfig: PlayerConfig = {
      humanPlayer: selectedPlayer,
      cpuPlayer: selectedPlayer === "black" ? "white" : "black",
    };
    setPlayerConfig(newPlayerConfig);
    setShowGameStartModal(false);
    setShowGameCompleteModal(false);
    resetGame();
  };

  const handleToggleHints = () => {
    setShowHints(!showHints);
  };

  const handleCloseModal = () => {
    setShowGameCompleteModal(false);
  };

  const handleCloseStartModal = () => {
    setShowGameStartModal(false);
  };

  const getGameStatusText = () => {
    if (isGameOver) {
      if (winner === "black") return "🎉 あなたの勝ち！";
      if (winner === "white") return "😢 CPUの勝ち！";
      return "🤝 引き分け！";
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl px-2 sm:px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GameHeader
            scores={gameState.scores}
            currentPlayer={gameState.currentPlayer}
            isThinking={gameState.isThinking}
            gameStatus={getGameStatusText()}
          />
        </motion.div>

        <motion.div
          className="flex justify-center mb-6 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GameBoard
            board={gameState.board}
            validMoves={gameState.validMoves}
            lastMove={gameState.lastMove}
            currentPlayer={gameState.currentPlayer}
            onCellClick={makePlayerMove}
            disabled={
              gameState.isThinking ||
              isGameOver ||
              gameState.currentPlayer !== playerConfig.humanPlayer
            }
            showHints={showHints}
          />
        </motion.div>

        <GameControls
          onNewGame={handleNewGame}
          onToggleHints={handleToggleHints}
          showHints={showHints}
          disabled={gameState.isThinking}
        />

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gray-800 rounded-lg p-4 max-w-md">
            <h3 className="text-white text-lg font-semibold mb-2">
              難易度設定
            </h3>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "beginner",
                  "intermediate",
                  "advanced",
                  "expert",
                ] as Difficulty[]
              ).map((level) => (
                <button
                  key={level}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    difficulty === level
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                  onClick={() => setDifficulty(level)}
                  disabled={gameState.isThinking}
                >
                  {level === "beginner" && "初級"}
                  {level === "intermediate" && "中級"}
                  {level === "advanced" && "上級"}
                  {level === "expert" && "専門家"}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2">
              現在の難易度:{" "}
              {difficulty === "beginner"
                ? "初級"
                : difficulty === "intermediate"
                  ? "中級"
                  : difficulty === "advanced"
                    ? "上級"
                    : "専門家"}
            </p>
          </div>
        </motion.div>

        <GameStartModal
          isOpen={showGameStartModal}
          onPlayerSelect={handlePlayerSelect}
          onClose={handleCloseStartModal}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />

        <GameCompleteModal
          isOpen={showGameCompleteModal}
          winner={winner}
          scores={gameState.scores}
          onNewGame={handleNewGame}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
