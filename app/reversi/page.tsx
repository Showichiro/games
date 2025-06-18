"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { GameLayout } from "@/components/common";
import CpuThinking from "./components/CpuThinking";
import GameBoard from "./components/GameBoard";
import GameCompleteModal from "./components/GameCompleteModal";
import GameControls from "./components/GameControls";
import GameHeader from "./components/GameHeader";
import GameHistoryPanel from "./components/GameHistoryPanel";
import GameStartModal from "./components/GameStartModal";
import SettingsModal from "./components/SettingsModal";
import TutorialModal from "./components/TutorialModal";
import { useCpuPlayer } from "./hooks/useCpuPlayer";
import { useGameLogic } from "./hooks/useGameLogic";
import type { Difficulty, Player, PlayerConfig } from "./types";

export default function ReversiPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [showHints, setShowHints] = useState(true);
  const [showGameCompleteModal, setShowGameCompleteModal] = useState(false);
  const [showGameStartModal, setShowGameStartModal] = useState(true);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
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
    history,
    undoMove,
    redoMove,
    jumpToMove,
    getMovesForDisplay,
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
    setShowGameCompleteModal(false);
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

  const sidebar = showHistoryPanel ? (
    <GameHistoryPanel
      moves={getMovesForDisplay()}
      onJumpToMove={jumpToMove}
      onUndo={undoMove}
      onRedo={redoMove}
      canUndo={history.canUndo}
      canRedo={history.canRedo}
      isOpen={showHistoryPanel}
      onToggle={() => setShowHistoryPanel(!showHistoryPanel)}
    />
  ) : undefined;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--gradient-game-bg)" }}
    >
      <GameLayout sidebar={sidebar}>
        <div className="max-w-4xl mx-auto p-2 sm:p-4">
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
              capturedPieces={gameState.capturedPieces}
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

          {/* CPU Thinking Indicator */}
          <div className="flex justify-center mb-4">
            <CpuThinking
              isVisible={
                gameState.isThinking &&
                gameState.currentPlayer === playerConfig.cpuPlayer
              }
              difficulty={difficulty}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GameControls
              onNewGame={handleNewGame}
              onToggleHints={handleToggleHints}
              showHints={showHints}
              disabled={gameState.isThinking}
              onOpenSettings={() => setShowSettingsModal(true)}
              onOpenTutorial={() => setShowTutorialModal(true)}
            />

            <div className="lg:hidden">
              <GameHistoryPanel
                moves={getMovesForDisplay()}
                onJumpToMove={jumpToMove}
                onUndo={undoMove}
                onRedo={redoMove}
                canUndo={history.canUndo}
                canRedo={history.canRedo}
                isOpen={showHistoryPanel}
                onToggle={() => setShowHistoryPanel(!showHistoryPanel)}
              />
            </div>
          </div>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div
              className="rounded-lg p-4 max-w-md"
              style={{ backgroundColor: "var(--color-neutral-800)" }}
            >
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
                      difficulty === level ? "text-white" : "text-white"
                    }`}
                    style={{
                      backgroundColor:
                        difficulty === level
                          ? "var(--color-interactive-focus)"
                          : "var(--color-neutral-600)",
                    }}
                    onMouseEnter={(e) => {
                      if (difficulty !== level) {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-neutral-500)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (difficulty !== level) {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-neutral-600)";
                      }
                    }}
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
              <p
                className="text-sm mt-2"
                style={{ color: "var(--color-neutral-400)" }}
              >
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

          <SettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            showHints={showHints}
            onToggleHints={handleToggleHints}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            animationsEnabled={animationsEnabled}
            onToggleAnimations={() => setAnimationsEnabled(!animationsEnabled)}
          />

          <TutorialModal
            isOpen={showTutorialModal}
            onClose={() => setShowTutorialModal(false)}
          />
        </div>
      </GameLayout>
    </div>
  );
}
