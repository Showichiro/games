"use client";

import { motion } from "motion/react"; // motion is still used for list item animations
import { BottomSheetModal, Button, IconButton } from "@/components/common";
import type { MoveRecord } from "../types";
import MiniBoard from "./MiniBoard";

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

  const headerActions = (
    <>
      {moveHistory.length > 0 && (
        <Button
          variant="danger"
          size="sm"
          className="bg-transparent hover:bg-red-100 text-red-500 hover:text-red-700 font-medium focus:ring-offset-0"
          onClick={onClearHistory}
        >
          クリア
        </Button>
      )}
      <IconButton
        icon={<span className="text-xl">×</span>}
        variant="light"
        className="bg-transparent hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 focus:ring-0"
        onClick={onClose}
        aria-label="履歴モーダルを閉じる"
        size="sm"
      />
    </>
  );

  return (
    <BottomSheetModal
      isOpen={showHistoryModal}
      onClose={onClose}
      title={`操作履歴 (${moveHistory.length})`}
      headerActions={headerActions}
      // className can be used to pass specific styling to the sheet's main div if needed, e.g. "max-w-lg"
      // The BottomSheetModal already has max-w-md by default.
    >
      {/* Content for BottomSheetModal's children prop */}
      {moveHistory.length === 0 ? (
        <div className="text-center text-subtext-color py-8">
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
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {record.moveNumber}
                </div>
                <div className="flex items-center gap-3">
                  <MiniBoard
                    board={record.boardState}
                    size="xs"
                    showMove={{ row: record.row, col: record.col }}
                  />
                  <div>
                    <div className="text-sm font-medium text-default-font">
                      手数 {record.moveNumber}
                    </div>
                    <div className="text-xs text-subtext-color">
                      {formatTime(record.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="xs"
                className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full hover:bg-brand-200 transition-colors focus:ring-brand-300 focus:ring-offset-0 dark:bg-brand-800 dark:text-brand-200 dark:hover:bg-brand-700 shrink-0"
                onClick={() => onReplayToMove(index)}
              >
                再生
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </BottomSheetModal>
  );
}
