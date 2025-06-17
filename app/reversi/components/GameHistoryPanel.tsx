"use client";

import { motion, AnimatePresence } from "motion/react";
import type { DetailedGameMove } from "../types";

interface GameHistoryPanelProps {
  moves: Array<
    DetailedGameMove & { isCurrentMove: boolean; isFutureMove: boolean }
  >;
  onJumpToMove: (moveIndex: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function GameHistoryPanel({
  moves,
  onJumpToMove,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isOpen,
  onToggle,
}: GameHistoryPanelProps) {
  const formatMoveTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getPositionLabel = (row: number, col: number) => {
    return `${String.fromCharCode(65 + col)}${row + 1}`;
  };

  return (
    <div className="relative">
      {/* トグルボタン */}
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-white shadow-lg"
        style={{
          backgroundColor: "var(--color-neutral-700)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
      >
        📜 履歴 {isOpen ? "▼" : "▶"}
      </motion.button>

      {/* 履歴パネル */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-80 rounded-lg shadow-2xl z-30"
            style={{ backgroundColor: "var(--color-neutral-800)" }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* ヘッダー */}
            <div
              className="px-4 py-3 border-b rounded-t-lg"
              style={{ borderColor: "var(--color-neutral-600)" }}
            >
              <h3 className="text-white font-semibold mb-2">手の履歴</h3>

              {/* 操作ボタン */}
              <div className="flex gap-2">
                <motion.button
                  className="flex-1 px-3 py-1 rounded text-sm font-medium transition-all"
                  style={{
                    backgroundColor: canUndo
                      ? "var(--color-interactive-focus)"
                      : "var(--color-neutral-600)",
                    color: canUndo
                      ? "var(--color-white)"
                      : "var(--color-neutral-400)",
                    cursor: canUndo ? "pointer" : "not-allowed",
                  }}
                  whileHover={canUndo ? { scale: 1.05 } : {}}
                  whileTap={canUndo ? { scale: 0.95 } : {}}
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  ⏪ 戻る
                </motion.button>

                <motion.button
                  className="flex-1 px-3 py-1 rounded text-sm font-medium transition-all"
                  style={{
                    backgroundColor: canRedo
                      ? "var(--color-interactive-focus)"
                      : "var(--color-neutral-600)",
                    color: canRedo
                      ? "var(--color-white)"
                      : "var(--color-neutral-400)",
                    cursor: canRedo ? "pointer" : "not-allowed",
                  }}
                  whileHover={canRedo ? { scale: 1.05 } : {}}
                  whileTap={canRedo ? { scale: 0.95 } : {}}
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  ⏩ 進む
                </motion.button>
              </div>
            </div>

            {/* 履歴リスト */}
            <div className="max-h-64 overflow-y-auto">
              {moves.length === 0 ? (
                <div
                  className="p-4 text-center"
                  style={{ color: "var(--color-neutral-400)" }}
                >
                  まだ手が打たれていません
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {/* 初期状態 */}
                  <motion.button
                    className={`w-full p-2 rounded text-left transition-all text-sm ${
                      moves.every((m) => !m.isCurrentMove) ? "ring-2" : ""
                    }`}
                    style={{
                      backgroundColor: moves.every((m) => !m.isCurrentMove)
                        ? "var(--color-interactive-focus)"
                        : "var(--color-neutral-700)",
                      color: "var(--color-white)",
                      ringColor: moves.every((m) => !m.isCurrentMove)
                        ? "var(--color-interactive-focus)"
                        : "transparent",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onJumpToMove(-1)}
                  >
                    <div className="font-medium">ゲーム開始</div>
                    <div style={{ color: "var(--color-neutral-300)" }}>
                      初期配置 (黒:2 白:2)
                    </div>
                  </motion.button>

                  {moves.map((move, index) => (
                    <motion.button
                      key={move.id}
                      className={`w-full p-2 rounded text-left transition-all text-sm ${
                        move.isCurrentMove ? "ring-2" : ""
                      }`}
                      style={{
                        backgroundColor: move.isCurrentMove
                          ? "var(--color-interactive-focus)"
                          : move.isFutureMove
                            ? "var(--color-neutral-600)"
                            : "var(--color-neutral-700)",
                        color: move.isFutureMove
                          ? "var(--color-neutral-400)"
                          : "var(--color-white)",
                        opacity: move.isFutureMove ? 0.6 : 1,
                        ringColor: move.isCurrentMove
                          ? "var(--color-interactive-focus)"
                          : "transparent",
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onJumpToMove(index)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">
                          {move.moveNumber}.{" "}
                          {move.player === "black" ? "⚫" : "⚪"}
                          {getPositionLabel(
                            move.position.row,
                            move.position.col,
                          )}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-neutral-300)" }}
                        >
                          {formatMoveTime(move.timestamp)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: "var(--color-neutral-300)" }}>
                          {move.capturedPieces.length}個取得
                        </span>
                        <span style={{ color: "var(--color-neutral-300)" }}>
                          黒:{move.scores.black} 白:{move.scores.white}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
