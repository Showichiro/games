"use client";

import Link from "next/link";
import { Button, HamburgerMenu as CommonHamburgerMenu } from "@/components/common"; // Aliased to avoid name clash
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
    <CommonHamburgerMenu
      isOpen={showMenu}
      onToggle={onToggleMenu}
      onClose={onCloseMenu}
      position="top-right" // This was the original position
      // className for the menu container can be added if specific styling beyond default is needed
      // e.g., className="min-w-[220px]" if the default min-w-[200px] is not enough
    >
      <div className="py-1"> {/* Adjusted padding to py-1 to match common pattern, original was py-2 for the whole block */}
        <Link href="/" passHref legacyBehavior>
          <Button
            variant="light"
            className="w-full px-4 py-2.5 text-left justify-start hover:bg-neutral-100 transition-colors text-neutral-700 font-medium focus:ring-0" // Adjusted padding from py-3 to py-2.5
            onClick={onCloseMenu}
          >
            🏠 ホームに戻る
          </Button>
        </Link>
        <Button
          variant="light"
          className="w-full px-4 py-2.5 text-left justify-start hover:bg-neutral-100 transition-colors text-neutral-700 font-medium focus:ring-0"
          onClick={() => {
            onOpenHistory();
            onCloseMenu();
          }}
        >
          📊 操作履歴を見る
        </Button>
        <Button
          variant="light"
          className="w-full px-4 py-2.5 text-left justify-start hover:bg-neutral-100 transition-colors text-neutral-700 font-medium focus:ring-0"
          onClick={() => {
            onShowTutorial();
            onCloseMenu();
          }}
        >
          ❓ ルール説明
        </Button>
        <hr className="my-2 border-neutral-200" /> {/* Ensured hr has a color */}
        <div className="px-4 py-2">
          <p className="text-sm text-neutral-500 mb-2">難易度</p>
          <div className="flex gap-1.5"> {/* Adjusted gap from 1 to 1.5 */}
            {(Object.keys(difficultyConfig) as Difficulty[]).map((d) => (
              <Button
                key={d}
                size="xs" // px-2.5 py-1.5 text-xs
                className={`font-medium transition-colors focus:ring-offset-0 focus:ring-1 ${
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
            ))}
          </div>
        </div>
      </div>
    </CommonHamburgerMenu>
  );
}
