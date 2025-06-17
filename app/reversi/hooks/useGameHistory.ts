"use client";

import { useCallback, useState } from "react";
import type {
  Board,
  DetailedGameHistory,
  DetailedGameMove,
  Player,
  Position,
} from "../types";
import { createEmptyBoard } from "../utils/gameLogic";

interface UseGameHistoryProps {
  onRestoreGameState: (
    board: Board,
    currentPlayer: Player,
    scores: { black: number; white: number },
    moveIndex: number,
  ) => void;
}

export function useGameHistory({ onRestoreGameState }: UseGameHistoryProps) {
  const [history, setHistory] = useState<DetailedGameHistory>({
    moves: [],
    currentMoveIndex: -1,
    canUndo: false,
    canRedo: false,
  });

  const addMove = useCallback(
    (
      position: Position,
      player: Player,
      capturedPieces: Position[],
      boardState: Board,
      scores: { black: number; white: number },
    ) => {
      setHistory((prev) => {
        // 現在の位置以降の履歴を削除（新しい分岐を作成）
        const movesToKeep = prev.moves.slice(0, prev.currentMoveIndex + 1);

        const newMove: DetailedGameMove = {
          id: `move-${Date.now()}-${Math.random()}`,
          position,
          player,
          timestamp: Date.now(),
          capturedPieces,
          boardState: boardState.map((row) => [...row]), // Deep copy
          scores: { ...scores },
          moveNumber: movesToKeep.length + 1,
        };

        const newMoves = [...movesToKeep, newMove];
        const newCurrentIndex = newMoves.length - 1;

        return {
          moves: newMoves,
          currentMoveIndex: newCurrentIndex,
          canUndo: newCurrentIndex >= 0,
          canRedo: false, // 新しい手を打ったのでredo不可
        };
      });
    },
    [],
  );

  const undoMove = useCallback(() => {
    setHistory((prev) => {
      if (prev.currentMoveIndex < 0) return prev;

      const newCurrentIndex = prev.currentMoveIndex - 1;
      const canUndo = newCurrentIndex >= 0;
      const canRedo = true;

      // ゲーム状態を復元
      if (newCurrentIndex >= 0) {
        const targetMove = prev.moves[newCurrentIndex];
        onRestoreGameState(
          targetMove.boardState,
          targetMove.player === "black" ? "white" : "black", // 次のプレイヤー
          targetMove.scores,
          newCurrentIndex,
        );
      } else {
        // 最初の状態に戻る
        onRestoreGameState(
          createEmptyBoard(),
          "black", // 最初は黒から
          { black: 2, white: 2 },
          -1,
        );
      }

      return {
        ...prev,
        currentMoveIndex: newCurrentIndex,
        canUndo,
        canRedo,
      };
    });
  }, [onRestoreGameState]);

  const redoMove = useCallback(() => {
    setHistory((prev) => {
      if (prev.currentMoveIndex >= prev.moves.length - 1) return prev;

      const newCurrentIndex = prev.currentMoveIndex + 1;
      const targetMove = prev.moves[newCurrentIndex];
      const canUndo = true;
      const canRedo = newCurrentIndex < prev.moves.length - 1;

      // ゲーム状態を復元
      onRestoreGameState(
        targetMove.boardState,
        targetMove.player === "black" ? "white" : "black", // 次のプレイヤー
        targetMove.scores,
        newCurrentIndex,
      );

      return {
        ...prev,
        currentMoveIndex: newCurrentIndex,
        canUndo,
        canRedo,
      };
    });
  }, [onRestoreGameState]);

  const jumpToMove = useCallback(
    (moveIndex: number) => {
      setHistory((prev) => {
        if (moveIndex < -1 || moveIndex >= prev.moves.length) return prev;

        if (moveIndex >= 0) {
          const targetMove = prev.moves[moveIndex];
          onRestoreGameState(
            targetMove.boardState,
            targetMove.player === "black" ? "white" : "black", // 次のプレイヤー
            targetMove.scores,
            moveIndex,
          );
        } else {
          // 最初の状態に戻る
          onRestoreGameState(
            createEmptyBoard(),
            "black",
            { black: 2, white: 2 },
            -1,
          );
        }

        return {
          ...prev,
          currentMoveIndex: moveIndex,
          canUndo: moveIndex >= 0,
          canRedo: moveIndex < prev.moves.length - 1,
        };
      });
    },
    [onRestoreGameState],
  );

  const clearHistory = useCallback(() => {
    setHistory({
      moves: [],
      currentMoveIndex: -1,
      canUndo: false,
      canRedo: false,
    });
  }, []);

  const getMovesForDisplay = useCallback(() => {
    return history.moves.map((move, index) => ({
      ...move,
      isCurrentMove: index === history.currentMoveIndex,
      isFutureMove: index > history.currentMoveIndex,
    }));
  }, [history]);

  return {
    history,
    addMove,
    undoMove,
    redoMove,
    jumpToMove,
    clearHistory,
    getMovesForDisplay,
  };
}
