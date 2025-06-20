"use client";

import Link from "next/link";
import {
  Button,
  HamburgerMenu as CommonHamburgerMenu,
} from "@/components/common"; // Aliased to avoid name clash
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
  onShowHint: () => void;
  hintsUsed: number;
  gameComplete: boolean;
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
  onShowHint,
  hintsUsed,
  gameComplete,
}: HamburgerMenuProps) {
  return (
    <CommonHamburgerMenu
      isOpen={showMenu}
      onToggle={onToggleMenu}
      onClose={onCloseMenu}
      position="top-right"
    >
      <div className="py-1">
        {/* Home Navigation */}
        <Link href="/" passHref legacyBehavior>
          <Button
            variant="light"
            className="w-full px-4 py-2.5 text-left justify-start hover:bg-neutral-100 transition-colors text-neutral-700 font-medium focus:ring-0"
            onClick={onCloseMenu}
          >
            🏠 ホームに戻る
          </Button>
        </Link>

        <hr className="my-2 border-neutral-200" />

        {/* Game Actions */}
        <Button
          variant="light"
          className="w-full px-4 py-2.5 text-left justify-start hover:bg-neutral-100 transition-colors text-neutral-700 font-medium focus:ring-0 relative"
          disabled={gameComplete}
          onClick={() => {
            onShowHint();
            onCloseMenu();
          }}
        >
          💡 ヒント
          {hintsUsed > 0 && (
            <span className="absolute top-1 right-2 bg-error-500 text-neutral-0 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {hintsUsed}
            </span>
          )}
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

        <hr className="my-2 border-neutral-200" />

        {/* Game Settings */}
        <div className="px-4 py-2">
          <p className="text-sm text-neutral-500 mb-2">⚙️ 難易度設定</p>
          <div className="flex gap-1.5">
            {(Object.keys(difficultyConfig) as Difficulty[]).map((d) => (
              <Button
                key={d}
                size="xs"
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
