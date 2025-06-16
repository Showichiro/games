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
import MiniBoard from "./components/MiniBoard";
import type {
  GameBoard as GameBoardType,
  Difficulty,
  TutorialStep,
  MoveRecord,
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
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [affectedCells, setAffectedCells] = useState<Set<string>>(new Set());
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

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
      setBoard(generateRandomBoard(difficulty));
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
        boardState: newBoard.map(boardRow => [...boardRow]), // Deep copy of new board state
      };
      
      // Update all states
      setBoard(newBoard);
      setMoves(newMoveCount);
      setMoveHistory(prev => [...prev, moveRecord]);
      
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
    [gameComplete, board, moves],
  );

  const resetGame = useCallback(() => {
    setBoard(generateRandomBoard(difficulty));
    setMoves(0);
    setStartTime(Date.now());
    setGameComplete(false);
    setElapsedTime(0);
    setHintCell(null);
    setHintsUsed(0);
    setMoveHistory([]);
    setAffectedCells(new Set());
    setShowCompletionAnimation(false);
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

  const replayToMove = useCallback((moveIndex: number) => {
    if (moveIndex < 0 || moveIndex >= moveHistory.length) return;
    
    // Replay to the specified move by restoring board state
    const targetMove = moveHistory[moveIndex];
    setBoard(targetMove.boardState.map(row => [...row])); // Deep copy
    setMoves(targetMove.moveNumber);
    
    // Trim move history to the replay point
    setMoveHistory(prev => prev.slice(0, moveIndex + 1));
    
    // Reset game completion state
    setGameComplete(false);
    setHintCell(null);
    
    // Close history modal
    setShowHistoryModal(false);
  }, [moveHistory]);

  const clearHistory = useCallback(() => {
    setMoveHistory([]);
  }, []);

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
              affectedCells={affectedCells}
              showCompletionAnimation={showCompletionAnimation}
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">操作履歴 ({moveHistory.length})</h3>
              {moveHistory.length > 0 && (
                <button
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                  onClick={clearHistory}
                >
                  クリア
                </button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto mb-6 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
              <div className="min-h-[12rem]">
                {moveHistory.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
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
                        className="flex items-center justify-between p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm min-w-0"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
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
                        <button
                          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex-shrink-0 ml-2"
                          onClick={() => replayToMove(index)}
                        >
                          再生
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
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
            affectedCells={affectedCells}
            showCompletionAnimation={showCompletionAnimation}
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
