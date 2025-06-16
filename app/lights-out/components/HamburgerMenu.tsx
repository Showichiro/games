"use client";

import { motion, AnimatePresence } from "motion/react";
import type { Difficulty, DifficultyConfig } from "../types";

interface HamburgerMenuProps {
  showMenu: boolean;
  difficulty: Difficulty;
  difficultyConfig: Record<Difficulty, DifficultyConfig>;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpenHistory: () => void;
  onShowTutorial: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export default function HamburgerMenu({
  showMenu,
  difficulty,
  difficultyConfig,
  onToggleMenu,
  onCloseMenu,
  onOpenHistory,
  onShowTutorial,
  onDifficultyChange,
}: HamburgerMenuProps) {
  return (
    <>
      {/* Hamburger Menu Button */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <motion.button
          className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMenu}
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

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              onClick={onCloseMenu}
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
                  onClick={onOpenHistory}
                >
                  📊 操作履歴を見る
                </button>
                <button
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                  onClick={() => {
                    onShowTutorial();
                    onCloseMenu();
                  }}
                >
                  ❓ ルール説明
                </button>
                <hr className="my-2" />
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-500 mb-2">難易度</p>
                  <div className="flex gap-1">
                    {(Object.keys(difficultyConfig) as Difficulty[]).map(
                      (diff) => (
                        <button
                          key={diff}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            difficulty === diff
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => {
                            onDifficultyChange(diff);
                            onCloseMenu();
                          }}
                        >
                          {difficultyConfig[diff].label}
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
    </>
  );
}
