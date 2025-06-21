"use client";

import { useCallback, useEffect } from "react";
import type { Board, Difficulty, Player, Position } from "../types";
import { getBestMove, getRandomThinkingTime } from "../utils/cpuAI";

interface UseCpuPlayerProps {
  board: Board;
  isThinking: boolean;
  currentPlayer: Player;
  cpuPlayer: Player;
  gameStatus: "playing" | "paused" | "finished";
  difficulty: Difficulty;
  onCpuMove: (move: Position) => void;
  onSetThinking: (thinking: boolean) => void;
}

export function useCpuPlayer({
  board,
  isThinking,
  currentPlayer,
  cpuPlayer,
  gameStatus,
  difficulty,
  onCpuMove,
  onSetThinking,
}: UseCpuPlayerProps) {
  const makeCpuMove = useCallback(async () => {
    if (
      gameStatus !== "playing" ||
      currentPlayer !== cpuPlayer ||
      !isThinking
    ) {
      return;
    }

    try {
      const thinkingTime = getRandomThinkingTime(difficulty);

      await new Promise((resolve) => setTimeout(resolve, thinkingTime));

      if (gameStatus !== "playing" || currentPlayer !== cpuPlayer) {
        return;
      }

      const bestMove = getBestMove(board, difficulty, cpuPlayer);

      if (bestMove) {
        onCpuMove(bestMove);
      } else {
        onSetThinking(false);
      }
    } catch (error) {
      console.error("CPU move error:", error);
      onSetThinking(false);
    }
  }, [
    board,
    isThinking,
    currentPlayer,
    cpuPlayer,
    gameStatus,
    difficulty,
    onCpuMove,
    onSetThinking,
  ]);

  useEffect(() => {
    if (isThinking && currentPlayer === cpuPlayer && gameStatus === "playing") {
      makeCpuMove();
    }
  }, [isThinking, currentPlayer, cpuPlayer, gameStatus, makeCpuMove]);

  return {
    isThinking: isThinking && currentPlayer === cpuPlayer,
  };
}
