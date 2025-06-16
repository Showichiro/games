"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import TutorialModal from "./components/TutorialModal";
import HamburgerMenu from "./components/HamburgerMenu";
import HistoryModal from "./components/HistoryModal";
import GameBoard from "./components/GameBoard";
import GameHeader from "./components/GameHeader";
import GameControls from "./components/GameControls";
import GameCompleteModal from "./components/GameCompleteModal";
import type {
  GameBoard as GameBoardType,
  Difficulty,
  TutorialStep,
} from "./types";

const GRID_SIZE = 5;
const DIFFICULTY_CONFIG = {
  easy: { minMoves: 5, maxMoves: 8, label: "初級" },
  medium: { minMoves: 8, maxMoves: 12, label: "中級" },
  hard: { minMoves: 12, maxMoves: 18, label: "上級" },
};

const createInitialBoard = (): GameBoardType => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(false));
};

const generateRandomBoard = (
  difficulty: Difficulty = "medium",
): GameBoardType => {
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

const toggleCell = (board: GameBoardType, row: number, col: number): void => {
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

const isGameComplete = (board: GameBoardType): boolean => {
  return board.every((row) => row.every((cell) => !cell));
};

// Simple hint algorithm - finds a random valid move that reduces the number of lit cells
const findHintMove = (board: GameBoardType): { row: number; col: number } | null => {
  const moves: { row: number; col: number }[] = [];
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      // Simulate the move
      const testBoard = board.map(r => [...r]);
      toggleCell(testBoard, row, col);
      
      // Count lit cells before and after
      const originalLit = board.flat().filter(Boolean).length;
      const newLit = testBoard.flat().filter(Boolean).length;
      
      // If this move reduces lit cells, it's potentially helpful
      if (newLit < originalLit) {
        moves.push({ row, col });
      }
    }
  }
  
  // Return a random good move, or any move if no good moves found
  if (moves.length > 0) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  
  // Fallback: return any random move
  return {
    row: Math.floor(Math.random() * GRID_SIZE),
    col: Math.floor(Math.random() * GRID_SIZE)
  };
};

const TUTORIAL_STEPS: TutorialStep[] = [
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
  const [board, setBoard] = useState<GameBoardType>(createInitialBoard);
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
  const [hintCell, setHintCell] = useState<{ row: number; col: number } | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);

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
    setHintCell(null);
    setHintsUsed(0);
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
    setHintCell(null);
    setHintsUsed(0);
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

  const showHint = useCallback(() => {
    if (gameComplete) return;
    
    const hint = findHintMove(board);
    if (hint) {
      setHintCell(hint);
      setHintsUsed(prev => prev + 1);
      
      // Clear hint after 3 seconds
      setTimeout(() => {
        setHintCell(null);
      }, 3000);
    }
  }, [board, gameComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <HamburgerMenu
        showMenu={showMenu}
        difficulty={difficulty}
        difficultyConfig={DIFFICULTY_CONFIG}
        onToggleMenu={toggleMenu}
        onCloseMenu={closeMenu}
        onOpenHistory={openHistoryModal}
        onShowTutorial={showTutorialAgain}
        onDifficultyChange={handleDifficultyChange}
      />

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <GameHeader
              moves={moves}
              elapsedTime={elapsedTime}
              difficulty={difficulty}
              difficultyConfig={DIFFICULTY_CONFIG}
              onDifficultyChange={handleDifficultyChange}
              formatTime={formatTime}
            />

            <GameBoard
              board={board}
              gameComplete={gameComplete}
              onCellClick={handleCellClick}
              hintCell={hintCell}
            />

            <GameControls
              onNewGame={newGame}
              onResetGame={resetGame}
              onShowTutorial={showTutorialAgain}
              onHint={showHint}
              hintsUsed={hintsUsed}
            />
          </motion.div>
        </div>

        {/* Sidebar for History Panel */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 p-6">
          <div className="text-white">
            <h3 className="text-lg font-bold mb-4">操作履歴</h3>
            <div className="text-gray-400 text-center py-8">
              <p>まだ操作履歴がありません</p>
              <p className="text-sm mt-2">
                ゲームを開始すると、ここに履歴が表示されます
              </p>
            </div>
            <div className="mt-6 space-y-2">
              <button
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors relative"
                onClick={showHint}
                disabled={gameComplete}
              >
                💡 ヒント
                {hintsUsed > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {hintsUsed}
                  </span>
                )}
              </button>
              <button
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                onClick={showTutorialAgain}
              >
                ❓ ルール説明
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <GameHeader
            moves={moves}
            elapsedTime={elapsedTime}
            difficulty={difficulty}
            difficultyConfig={DIFFICULTY_CONFIG}
            onDifficultyChange={handleDifficultyChange}
            formatTime={formatTime}
          />

          <GameBoard
            board={board}
            gameComplete={gameComplete}
            onCellClick={handleCellClick}
            hintCell={hintCell}
          />

          <GameControls
            onNewGame={newGame}
            onResetGame={resetGame}
            onShowTutorial={showTutorialAgain}
            onHint={showHint}
            hintsUsed={hintsUsed}
          />
        </motion.div>
      </div>

      <HistoryModal
        showHistoryModal={showHistoryModal}
        onClose={closeHistoryModal}
      />

      <TutorialModal
        showTutorial={showTutorial}
        tutorialStep={tutorialStep}
        tutorialSteps={TUTORIAL_STEPS}
        demoToggle={demoToggle}
        onClose={closeTutorial}
        onNext={nextTutorialStep}
        onPrev={prevTutorialStep}
      />

      <GameCompleteModal
        gameComplete={gameComplete}
        moves={moves}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
        onClose={() => setGameComplete(false)}
        onNewGame={newGame}
      />
    </div>
  );
}
