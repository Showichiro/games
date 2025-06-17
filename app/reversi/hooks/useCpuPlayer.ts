"use client";

import { useEffect, useCallback } from "react";
import type { Board, Difficulty, Position } from "../types";
import { getBestMove, getRandomThinkingTime } from "../utils/cpuAI";

interface UseCpuPlayerProps {
  board: Board;
  isThinking: boolean;
  currentPlayer: "black" | "white";
  gameStatus: "playing" | "paused" | "finished";
  difficulty: Difficulty;
  onCpuMove: (move: Position) => void;
  onSetThinking: (thinking: boolean) => void;
}

export function useCpuPlayer({
  board,
  isThinking,
  currentPlayer,
  gameStatus,
  difficulty,
  onCpuMove,
  onSetThinking,
}: UseCpuPlayerProps) {
  const makeCpuMove = useCallback(async () => {
    if (gameStatus !== "playing" || currentPlayer !== "white" || !isThinking) {
      return;
    }

    try {
      const thinkingTime = getRandomThinkingTime(difficulty);

      await new Promise((resolve) => setTimeout(resolve, thinkingTime));

      if (gameStatus !== "playing" || currentPlayer !== "white") {
        return;
      }

      const bestMove = getBestMove(board, difficulty);

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
    gameStatus,
    difficulty,
    onCpuMove,
    onSetThinking,
  ]);

  useEffect(() => {
    if (isThinking && currentPlayer === "white" && gameStatus === "playing") {
      makeCpuMove();
    }
  }, [isThinking, currentPlayer, gameStatus, makeCpuMove]);

  return {
    isThinking: isThinking && currentPlayer === "white",
  };
}
