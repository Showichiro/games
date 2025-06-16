"use client";

import { motion, AnimatePresence } from "motion/react";
import MiniBoard from "./MiniBoard";
import type { MoveRecord } from "../types";

interface HistoryModalProps {
  showHistoryModal: boolean;
  onClose: () => void;
  moveHistory: MoveRecord[];
  onReplayToMove: (moveIndex: number) => void;
  onClearHistory: () => void;
}

export default function HistoryModal({
  showHistoryModal,
  onClose,
  moveHistory,
  onReplayToMove,
  onClearHistory,
}: HistoryModalProps) {
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  return (
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
              <h3 className="text-lg font-bold text-gray-800">
                操作履歴 ({moveHistory.length})
              </h3>
              <div className="flex gap-2">
                {moveHistory.length > 0 && (
                  <button
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                    onClick={onClearHistory}
                  >
                    クリア
                  </button>
                )}
                <button
                  className="text-gray-400 hover:text-gray-600 text-xl"
                  onClick={onClose}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              {moveHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>まだ操作履歴がありません</p>
                  <p className="text-sm mt-2">
                    ゲームを開始すると、ここに履歴が表示されます
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {moveHistory.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {record.moveNumber}
                        </div>
                        <div className="flex items-center gap-3">
                          <MiniBoard 
                            board={record.boardState} 
                            size="xs"
                            showMove={{ row: record.row, col: record.col }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              手数 {record.moveNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(record.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        onClick={() => onReplayToMove(index)}
                      >
                        再生
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
