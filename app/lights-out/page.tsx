"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type Cell = boolean;
type GameBoard = Cell[][];
type Difficulty = "easy" | "medium" | "hard";

const GRID_SIZE = 5;
const DIFFICULTY_CONFIG = {
  easy: { minMoves: 5, maxMoves: 8, label: "初級" },
  medium: { minMoves: 8, maxMoves: 12, label: "中級" },
  hard: { minMoves: 12, maxMoves: 18, label: "上級" },
};

const createInitialBoard = (): GameBoard => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(false));
};

const generateRandomBoard = (difficulty: Difficulty = "medium"): GameBoard => {
  const board = createInitialBoard();
  const config = DIFFICULTY_CONFIG[difficulty];
  const moves =
    Math.floor(Math.random() * (config.maxMoves - config.minMoves + 1)) +
    config.minMoves;

  for (let i = 0; i < moves; i++) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    toggleCell(board, row, col);
  }

  return board;
};

const toggleCell = (board: GameBoard, row: number, col: number): void => {
  const directions = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < GRID_SIZE &&
      newCol >= 0 &&
      newCol < GRID_SIZE
    ) {
      board[newRow][newCol] = !board[newRow][newCol];
    }
  });
};

const isGameComplete = (board: GameBoard): boolean => {
  return board.every((row) => row.every((cell) => !cell));
};

export default function LightsOut() {
  const [board, setBoard] = useState<GameBoard>(createInitialBoard);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [gameComplete, setGameComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  useEffect(() => {
    setBoard(generateRandomBoard(difficulty));
  }, [difficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameComplete) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  useEffect(() => {
    if (isGameComplete(board)) {
      setGameComplete(true);
    }
  }, [board]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameComplete) return;

      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        toggleCell(newBoard, row, col);
        return newBoard;
      });
      setMoves((prev) => prev + 1);
    },
    [gameComplete],
  );

  const resetGame = useCallback(() => {
    setBoard(generateRandomBoard(difficulty));
    setMoves(0);
    setStartTime(Date.now());
    setGameComplete(false);
    setElapsedTime(0);
  }, [difficulty]);

  const newGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setBoard(generateRandomBoard(newDifficulty));
    setMoves(0);
    setStartTime(Date.now());
    setGameComplete(false);
    setElapsedTime(0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">ライツアウト</h1>
          <div className="flex justify-center gap-6 text-gray-300 mb-4">
            <div>手数: {moves}</div>
            <div>時間: {formatTime(elapsedTime)}</div>
          </div>

          {/* Difficulty Selector */}
          <div className="flex justify-center gap-2">
            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
              <motion.button
                key={diff}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  difficulty === diff
                    ? "bg-blue-600 text-white"
                    : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                }`}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDifficultyChange(diff)}
              >
                {DIFFICULTY_CONFIG[diff].label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-slate-700 p-4 rounded-2xl shadow-2xl mb-6">
          <div className="grid grid-cols-5 gap-2">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square rounded-lg border-2 transition-colors ${
                    cell
                      ? "bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/30"
                      : "bg-slate-600 border-slate-500"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    backgroundColor: cell ? "#facc15" : "#475569",
                    rotate: cell ? 180 : 0,
                    scale: cell ? 1.05 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={gameComplete}
                />
              )),
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <motion.button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={newGame}
          >
            新規
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
          >
            リセット
          </motion.button>
        </div>
      </motion.div>

      {/* Game Complete Modal */}
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setGameComplete(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 text-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🎉 クリア!
              </h2>
              <p className="text-gray-600 mb-4">
                {moves}手で {formatTime(elapsedTime)} でクリアしました!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setGameComplete(false);
                    newGame();
                  }}
                >
                  新しいゲーム
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  onClick={() => setGameComplete(false)}
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
