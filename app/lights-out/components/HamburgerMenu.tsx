"use client";

import { AnimatePresence, motion } from "motion/react"; // motion needed for icon and AnimatePresence
import Link from "next/link";
import { Button, IconButton } from "@/components/common"; // Changed path alias
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
        <IconButton
          icon={
            <div className="w-5 h-5 flex flex-col justify-around">
              <motion.div
                className="w-full h-0.5 bg-current" // Use bg-current to inherit text color
                animate={{
                  rotate: showMenu ? 45 : 0,
                  y: showMenu ? 3 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="w-full h-0.5 bg-current" // Use bg-current
                animate={{
                  opacity: showMenu ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="w-full h-0.5 bg-current" // Use bg-current
                animate={{
                  rotate: showMenu ? -45 : 0,
                  y: showMenu ? -3 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          }
          onClick={onToggleMenu}
          aria-label={showMenu ? "メニューを閉じる" : "メニューを開く"}
          variant="dark" // bg-gray-800, text-white. Original was bg-neutral-700. This is close.
          size="md" // Default padding. Icon size w-5 h-5.
          className="w-10 h-10 bg-neutral-700 hover:bg-neutral-600 text-white" // Override for exact colors and size
          motionProps={{ whileTap: { scale: 0.95 } }}
        />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/30 z-30 md:hidden"
              onClick={onCloseMenu}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-16 right-4 bg-white rounded-lg shadow-xl z-40 min-w-[200px] md:hidden"
            >
              <div className="py-2">
                <Link href="/" passHref legacyBehavior>
                  <Button
                    // as="a" removed, Button component doesn't render 'a', Link handles it. href is passed by Link.
                    variant="light" // Use a light variant as base, customize further
                    className="w-full px-4 py-3 text-left justify-start hover:bg-neutral-100 transition-colors text-neutral-700 font-medium focus:ring-0"
                    onClick={onCloseMenu} // Close menu on navigation
                  >
                    🏠 ホームに戻る
                  </Button>
                </Link>
                <Button
                  variant="light"
                  className="w-full px-4 py-3 text-left justify-start hover:bg-neutral-100 transition-colors text-neutral-700 font-medium focus:ring-0"
                  onClick={() => {
                    onOpenHistory();
                    onCloseMenu(); // Typically, menu closes after action
                  }}
                >
                  📊 操作履歴を見る
                </Button>
                <Button
                  variant="light"
                  className="w-full px-4 py-3 text-left justify-start hover:bg-neutral-100 transition-colors text-neutral-700 font-medium focus:ring-0"
                  onClick={() => {
                    onShowTutorial();
                    onCloseMenu();
                  }}
                >
                  ❓ ルール説明
                </Button>
                <hr className="my-2" />
                <div className="px-4 py-2">
                  <p className="text-sm text-neutral-500 mb-2">難易度</p>
                  <div className="flex gap-1">
                    {(Object.keys(difficultyConfig) as Difficulty[]).map(
                      (d) => ( // Renamed diff to d for clarity
                        <Button
                          key={d}
                          size="xs" // px-2.5 py-1.5 text-xs. Original: px-2 py-1 text-xs
                          className={`px-2 py-1 font-medium transition-colors focus:ring-offset-0 focus:ring-1 ${ // Keep original padding, adjust focus ring
                            difficulty === d
                              ? "bg-brand-primary text-neutral-0 focus:ring-brand-300"
                              : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus:ring-neutral-400"
                          }`}
                          onClick={() => {
                            onDifficultyChange(d);
                            onCloseMenu();
                          }}
                        >
                          {difficultyConfig[d].label}
                        </Button>
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
