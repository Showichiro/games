"use client";

import { motion, AnimatePresence } from "motion/react";

interface HistoryModalProps {
  showHistoryModal: boolean;
  onClose: () => void;
}

export default function HistoryModal({
  showHistoryModal,
  onClose,
}: HistoryModalProps) {
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
              <h3 className="text-lg font-bold text-gray-800">操作履歴</h3>
              <button
                className="text-gray-400 hover:text-gray-600 text-xl"
                onClick={onClose}
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
  );
}
