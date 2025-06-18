"use client";

import { motion } from "motion/react"; // motion is used for history items, not buttons here
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BoardContainer, Button, GameLayout } from "@/components/common";
import GameBoard from "./components/GameBoard";
import GameCompleteModal from "./components/GameCompleteModal";
import GameControls from "./components/GameControls";
import GameHeader from "./components/GameHeader";
import HamburgerMenu from "./components/HamburgerMenu";
import HistoryModal from "./components/HistoryModal";
import MiniBoard from "./components/MiniBoard";
import TutorialModal from "./components/TutorialModal";
import type {
  Difficulty,
  GameBoard as GameBoardType,
  MoveRecord,
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
): { board: GameBoardType; solution: Set<string> } => {
  const board = createInitialBoard();
  const config = DIFFICULTY_CONFIG[difficulty];
  const movesToMake =
    Math.floor(Math.random() * (config.maxMoves - config.minMoves + 1)) +
    config.minMoves;
  const solution = new Set<string>();

  while (solution.size < movesToMake) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    const cellCoord = `${row}-${col}`;

    if (!solution.has(cellCoord)) {
      toggleCell(board, row, col);
      solution.add(cellCoord);
    }
  }

  return { board, solution };
};

const getAffectedCells = (row: number, col: number): Set<string> => {
  const directions = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const affected = new Set<string>();
  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < GRID_SIZE &&
      newCol >= 0 &&
      newCol < GRID_SIZE
    ) {
      affected.add(`${newRow}-${newCol}`);
    }
  });

  return affected;
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

const findHintMove = (
  solution: Set<string>,
  playerMoves: Set<string>,
): { row: number; col: number } | null => {
  // Priority 1: Suggest unpressed solution cells
  for (const cellCoord of solution) {
    if (!playerMoves.has(cellCoord)) {
      const [sRow, sCol] = cellCoord.split("-").map(Number);
      return { row: sRow, col: sCol };
    }
  }

  // Priority 2: Suggest undoing incorrect moves
  for (const cellCoord of playerMoves) {
    if (!solution.has(cellCoord)) {
      const [sRow, sCol] = cellCoord.split("-").map(Number);
      return { row: sRow, col: sCol };
    }
  }

  // No hint needed
  return null;
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
  {
    title: "ヒント機能",
    content:
      "💡ヒントボタンで次の最適手をパルスエフェクトで表示します。使用回数が記録されるので、なるべく使わずにクリアを目指しましょう。",
    highlight: null,
  },
  {
    title: "操作履歴",
    content:
      "全ての操作が記録され、任意の手まで戻ることができます。PCでは右サイドバー、モバイルではメニューから確認できます。",
    highlight: null,
  },
];

export default function LightsOut() {
  const [board, setBoard] = useState<GameBoardType>(createInitialBoard);
  const [initialBoard, setInitialBoard] =
    useState<GameBoardType>(createInitialBoard);
  const [initialSolution, setInitialSolution] = useState<Set<string>>(
    new Set(),
  );
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
  const [hintCell, setHintCell] = useState<{ row: number; col: number } | null>(
    null,
  );
  const [hintsUsed, setHintsUsed] = useState(0);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [affectedCells, setAffectedCells] = useState<Set<string>>(new Set());
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [solution, setSolution] = useState<Set<string>>(new Set());
  const [playerMoves, setPlayerMoves] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsClient(true);

    // Check tutorial status
    const hasSeenTutorial = localStorage.getItem("lights-out-tutorial-seen");
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const { board: newBoard, solution: newSolution } =
        generateRandomBoard(difficulty);
      setBoard(newBoard);
      setSolution(newSolution);
      setInitialBoard(newBoard.map((row) => [...row])); // Deep copy
      setInitialSolution(new Set(newSolution)); // Deep copy
    }
  }, [isClient, difficulty]);

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameComplete) return;

      // Get affected cells for animation
      const affected = getAffectedCells(row, col);
      setAffectedCells(affected);

      const newBoard = board.map((boardRow) => [...boardRow]);
      toggleCell(newBoard, row, col);
      const newMoveCount = moves + 1;

      // Record move in history
      const moveRecord: MoveRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${row}-${col}`,
        row,
        col,
        timestamp: Date.now(),
        moveNumber: newMoveCount,
        boardState: newBoard.map((boardRow) => [...boardRow]), // Deep copy of new board state
      };

      // Update all states
      setBoard(newBoard);
      setMoves(newMoveCount);
      setMoveHistory((prev) => [...prev, moveRecord]);

      // Update player moves
      const cellCoord = `${row}-${col}`;
      const newPlayerMoves = new Set(playerMoves);
      if (newPlayerMoves.has(cellCoord)) {
        newPlayerMoves.delete(cellCoord);
      } else {
        newPlayerMoves.add(cellCoord);
      }
      setPlayerMoves(newPlayerMoves);

      // Clear affected cells animation after delay
      setTimeout(() => {
        setAffectedCells(new Set());
      }, 800);

      // Check for game completion
      if (isGameComplete(newBoard)) {
        setGameComplete(true);
        // Start completion animation
        setTimeout(() => {
          setShowCompletionAnimation(true);
        }, 100);
        // Stop completion animation after sequence
        setTimeout(() => {
          setShowCompletionAnimation(false);
        }, 2500);
      }
    },
    [gameComplete, board, moves, playerMoves],
  );

  const resetGame = useCallback(() => {
    setBoard(initialBoard.map((row) => [...row])); // Deep copy from initialBoard
    setSolution(new Set(initialSolution)); // Deep copy from initialSolution
    setPlayerMoves(new Set());
    setMoves(0);
    setStartTime(Date.now());
    setGameComplete(false);
    setElapsedTime(0);
    setHintCell(null);
    setHintsUsed(0);
    setMoveHistory([]);
    setAffectedCells(new Set());
    setShowCompletionAnimation(false);
  }, [initialBoard, initialSolution]);

  const newGame = useCallback(() => {
    const { board: newBoard, solution: newSolution } =
      generateRandomBoard(difficulty);
    setBoard(newBoard);
    setSolution(newSolution);
    // Also update the initial board and solution to this new game
    setInitialBoard(newBoard.map((row) => [...row]));
    setInitialSolution(new Set(newSolution));

    // Reset other game states
    setPlayerMoves(new Set());
    setMoves(0);
    setStartTime(Date.now());
    setGameComplete(false);
    setElapsedTime(0);
    setHintCell(null);
    setHintsUsed(0);
    setMoveHistory([]);
    setAffectedCells(new Set());
    setShowCompletionAnimation(false);
  }, [difficulty, setInitialBoard, setInitialSolution]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    const { board: newBoard, solution: newSolution } =
      generateRandomBoard(newDifficulty);
    setBoard(newBoard);
    setSolution(newSolution);
    setInitialBoard(newBoard.map((row) => [...row])); // Deep copy
    setInitialSolution(new Set(newSolution)); // Deep copy
    setPlayerMoves(new Set());
    setMoves(0);
    setStartTime(Date.now());
    setGameComplete(false);
    setElapsedTime(0);
    setHintCell(null);
    setHintsUsed(0);
    setMoveHistory([]);
    setAffectedCells(new Set());
    setShowCompletionAnimation(false);
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

    const hint = findHintMove(solution, playerMoves);
    if (hint) {
      setHintCell(hint);
      setHintsUsed((prev) => prev + 1);

      // Clear hint after 3 seconds
      setTimeout(() => {
        setHintCell(null);
      }, 3000);
    }
  }, [solution, playerMoves, gameComplete]);

  const replayToMove = useCallback(
    (moveIndex: number) => {
      if (moveIndex < 0 || moveIndex >= moveHistory.length) return;

      // Replay to the specified move by restoring board state
      const targetMove = moveHistory[moveIndex];
      setBoard(targetMove.boardState.map((row) => [...row])); // Deep copy
      setMoves(targetMove.moveNumber);

      // Trim move history to the replay point
      setMoveHistory((prev) => prev.slice(0, moveIndex + 1));

      // Reset game completion state
      setGameComplete(false);
      setHintCell(null);

      // Close history modal
      setShowHistoryModal(false);
    },
    [moveHistory],
  );

  const clearHistory = useCallback(() => {
    setMoveHistory([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-neutral-100">
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

      <GameLayout
        sidebar={
          <>
            {" "}
            {/* This content goes into GameLayout's aside (w-64, bg-neutral-800) */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-100">
                操作履歴 ({moveHistory.length})
              </h3>
              {moveHistory.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  className="bg-transparent hover:bg-error-100 text-error-400 hover:text-error-600 font-medium focus:ring-offset-0 py-0 px-1" // Adjusted padding for more ghost-like
                  onClick={clearHistory}
                >
                  クリア
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto mb-6 scrollbar-thin scrollbar-track-neutral-700 scrollbar-thumb-neutral-500 pr-1">
              {" "}
              {/* Adjusted scrollbar track for solid bg */}
              <div className="min-h-[12rem]">
                {moveHistory.length === 0 ? (
                  <div className="text-neutral-400 text-center py-8">
                    <p>まだ操作履歴がありません</p>
                    <p className="text-sm mt-2">
                      ゲームを開始すると、ここに履歴が表示されます
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 pr-2">
                    {moveHistory.map((record, index) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center justify-between p-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors text-sm min-w-0" // Solid bg for items
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-5 h-5 bg-brand-500 text-neutral-0 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {record.moveNumber}
                          </div>
                          <div className="flex-shrink-0">
                            <MiniBoard
                              board={record.boardState}
                              size="xs"
                              showMove={{ row: record.row, col: record.col }}
                            />
                          </div>
                        </div>
                        <Button
                          size="xs"
                          className="px-2 py-1 bg-brand-600 hover:bg-brand-500 text-neutral-0 rounded transition-colors focus:ring-brand-400 focus:ring-offset-0 flex-shrink-0 ml-2"
                          onClick={() => replayToMove(index)}
                        >
                          再生
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/" passHref className="block">
                <Button
                  // as="a" removed, Button component doesn't render 'a', Link handles it. href is passed by Link.
                  variant="primary"
                  fullWidth
                  icon="🏠"
                  iconPosition="left"
                  size="md" // Default size (px-4 py-2 font-semibold)
                  // className="bg-brand-600 hover:bg-brand-500" // Uncomment to match original brand color
                >
                  ホームに戻る
                </Button>
              </Link>
              <Button
                variant="success"
                fullWidth
                icon="💡"
                iconPosition="left"
                size="md"
                disabled={gameComplete}
                onClick={showHint}
                className="relative justify-center" // justify-center for fullWidth icon+text alignment
                // Original: bg-success-600 hover:bg-success-500. Variant is bg-green-500.
                // className="relative justify-center bg-success-600 hover:bg-success-500" // If exact color needed
              >
                ヒント
                {hintsUsed > 0 && (
                  <span className="absolute top-0 right-1 bg-error-500 text-neutral-0 text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                    {hintsUsed}
                  </span>
                )}
              </Button>
              <Button
                variant="info" // Original: bg-purple-600. Variant is bg-teal-500.
                fullWidth
                icon="❓"
                iconPosition="left"
                size="md"
                onClick={showTutorialAgain}
                className="justify-center" // justify-center for fullWidth icon+text alignment
                // className="justify-center bg-purple-600 hover:bg-purple-500" // Uncomment for original purple color
              >
                ルール説明
              </Button>
            </div>
          </>
        }
      >
        {/* Children of GameLayout start here */}
        <GameHeader
          moves={moves}
          elapsedTime={elapsedTime}
          difficulty={difficulty}
          difficultyConfig={DIFFICULTY_CONFIG}
          onDifficultyChange={handleDifficultyChange}
          formatTime={formatTime}
        />

        {/* Main game content area (Board and Controls) */}
        {/* The div with class "flex-1" from previous structure is removed as GameLayout's main area handles flex growth */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto lg:max-w-md xl:max-w-lg mt-4 lg:mt-6" // Added margin-top to space from GameHeader
        >
          <BoardContainer>
            <GameBoard
              board={board}
              gameComplete={gameComplete}
              onCellClick={handleCellClick}
              hintCell={hintCell}
              affectedCells={affectedCells}
              showCompletionAnimation={showCompletionAnimation}
            />
          </BoardContainer>
          <div className="mt-4 lg:mt-6">
            <GameControls
              onNewGame={newGame}
              onResetGame={resetGame}
              onShowTutorial={showTutorialAgain}
              onHint={showHint}
              hintsUsed={hintsUsed}
            />
          </div>
        </motion.div>
        {/* Children of GameLayout end here */}
      </GameLayout>

      <HistoryModal
        showHistoryModal={showHistoryModal}
        onClose={closeHistoryModal}
        moveHistory={moveHistory}
        onReplayToMove={replayToMove}
        onClearHistory={clearHistory}
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
