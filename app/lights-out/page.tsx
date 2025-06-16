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

const TUTORIAL_STEPS = [
  {
    title: "ライツアウトゲームへようこそ！",
    content:
      "5×5のグリッドで行うパズルゲームです。全てのライトを消すことが目標です。",
    highlight: null,
  },
  {
    title: "操作方法",
    content:
      "セルをタップすると、そのセルと上下左右の隣接セルの状態が反転します。",
    highlight: "board",
  },
  {
    title: "ゲームの目標",
    content:
      "全てのライトを消灯させましょう！手数を少なくクリアできるかチャレンジしてみてください。",
    highlight: "stats",
  },
  {
    title: "難易度選択",
    content:
      "初級・中級・上級から難易度を選択できます。最初は初級から始めることをおすすめします。",
    highlight: "difficulty",
  },
];

export default function LightsOut() {
  const [board, setBoard] = useState<GameBoard>(createInitialBoard);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [gameComplete, setGameComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [demoToggle, setDemoToggle] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setBoard(generateRandomBoard(difficulty));
    }
  }, [isClient, difficulty]);

  useEffect(() => {
    if (isClient) {
      const hasSeenTutorial = localStorage.getItem("lights-out-tutorial-seen");
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (showTutorial && TUTORIAL_STEPS[tutorialStep]?.highlight === "board") {
      const interval = setInterval(() => {
        setDemoToggle((prev) => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showTutorial, tutorialStep]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameComplete && !showTutorial) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gameComplete, showTutorial]);

  useEffect(() => {
    if (moves > 0 && isGameComplete(board)) {
      setGameComplete(true);
    }
  }, [board, moves]);

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

  const closeTutorial = useCallback(() => {
    setShowTutorial(false);
    setTutorialStep(0);
    setStartTime(Date.now()); // タイマーをリセット
    setElapsedTime(0);
    if (typeof window !== "undefined") {
      localStorage.setItem("lights-out-tutorial-seen", "true");
    }
  }, []);

  const nextTutorialStep = useCallback(() => {
    setTutorialStep((prev) => prev + 1);
  }, []);

  const prevTutorialStep = useCallback(() => {
    setTutorialStep((prev) => Math.max(0, prev - 1));
  }, []);

  const showTutorialAgain = useCallback(() => {
    setShowTutorial(true);
    setTutorialStep(0);
  }, []);

  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  const openHistoryModal = useCallback(() => {
    setShowHistoryModal(true);
    setShowMenu(false);
  }, []);

  const closeHistoryModal = useCallback(() => {
    setShowHistoryModal(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      {/* Hamburger Menu Button */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <motion.button
          className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
          whileTap={{ scale: 0.95 }}
          onClick={toggleMenu}
        >
          <div className="w-5 h-5 flex flex-col justify-around">
            <motion.div
              className="w-full h-0.5 bg-white origin-center"
              animate={{
                rotate: showMenu ? 45 : 0,
                y: showMenu ? 3 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="w-full h-0.5 bg-white"
              animate={{
                opacity: showMenu ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="w-full h-0.5 bg-white origin-center"
              animate={{
                rotate: showMenu ? -45 : 0,
                y: showMenu ? -3 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6 relative">
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
        <div className="flex gap-3 justify-center flex-wrap">
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
          <motion.button
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={showTutorialAgain}
          >
            ？
          </motion.button>
        </div>
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-16 right-4 bg-white rounded-lg shadow-xl z-40 min-w-[200px] md:hidden"
            >
              <div className="py-2">
                <button
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                  onClick={openHistoryModal}
                >
                  📊 操作履歴を見る
                </button>
                <button
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                  onClick={() => {
                    showTutorialAgain();
                    closeMenu();
                  }}
                >
                  ❓ ルール説明
                </button>
                <hr className="my-2" />
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-500 mb-2">難易度</p>
                  <div className="flex gap-1">
                    {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(
                      (diff) => (
                        <button
                          key={diff}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            difficulty === diff
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => {
                            handleDifficultyChange(diff);
                            closeMenu();
                          }}
                        >
                          {DIFFICULTY_CONFIG[diff].label}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-end justify-center p-4 z-50 md:items-center"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">操作履歴</h3>
                <button
                  className="text-gray-400 hover:text-gray-600 text-xl"
                  onClick={closeHistoryModal}
                >
                  ×
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="text-center text-gray-500 py-8">
                  <p>まだ操作履歴がありません</p>
                  <p className="text-sm mt-2">
                    ゲームを開始すると、ここに履歴が表示されます
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
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
                onClick={closeTutorial}
              >
                ×
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {TUTORIAL_STEPS[tutorialStep]?.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {TUTORIAL_STEPS[tutorialStep]?.content}
                </p>
              </div>

              {/* Demo Grid for Tutorial */}
              {TUTORIAL_STEPS[tutorialStep]?.highlight === "board" && (
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
                {TUTORIAL_STEPS.map((_, index) => (
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
                    onClick={prevTutorialStep}
                  >
                    前へ
                  </button>
                )}

                {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    onClick={nextTutorialStep}
                  >
                    次へ
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    onClick={closeTutorial}
                  >
                    始める
                  </button>
                )}

                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  onClick={closeTutorial}
                >
                  スキップ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
