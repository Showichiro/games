"use client";

import { useCallback, useState } from "react";
import type {
  Board,
  GameState,
  Player,
  PlayerConfig,
  Position,
} from "../types";
import { countPieces } from "../utils/boardUtils";
import {
  getValidMoves,
  getWinner,
  hasValidMoves,
  initializeBoard,
  isGameOver,
  makeMove,
} from "../utils/gameLogic";
import { useGameHistory } from "./useGameHistory";

interface UseGameLogicProps {
  playerConfig?: PlayerConfig;
  onGameEnd?: (winner: Player | "draw" | null) => void;
}

export function useGameLogic({
  playerConfig = { humanPlayer: "black", cpuPlayer: "white" },
  onGameEnd,
}: UseGameLogicProps = {}) {
  // ゲーム状態復元用のコールバック
  const handleRestoreGameState = useCallback(
    (
      board: Board,
      currentPlayer: Player,
      scores: { black: number; white: number } /* , moveIndex: number */,
    ) => {
      const validMoves = getValidMoves(board, currentPlayer);
      const gameHasEnded = isGameOver(board);

      setGameState((prev) => ({
        ...prev,
        board,
        currentPlayer,
        validMoves,
        scores,
        gameStatus: gameHasEnded ? "finished" : "playing",
        lastMove: null, // 履歴から復元時はlastMoveをクリア
        capturedPieces: [],
        isThinking: false,
      }));
    },
    [],
  );

  // 履歴管理フック
  const {
    history,
    addMove,
    undoMove,
    redoMove,
    jumpToMove,
    clearHistory,
    getMovesForDisplay,
  } = useGameHistory({ onRestoreGameState: handleRestoreGameState });

  const [gameState, setGameState] = useState<GameState>(() => {
    const board = initializeBoard();
    const scores = countPieces(board);
    const firstPlayer: Player = "black"; // 常に黒が先手
    return {
      board,
      currentPlayer: firstPlayer,
      validMoves: getValidMoves(board, firstPlayer),
      gameStatus: "playing",
      scores,
      lastMove: null,
      capturedPieces: [],
      isThinking: false,
    };
  });

  const resetGame = useCallback(() => {
    const board = initializeBoard();
    const scores = countPieces(board);
    const firstPlayer: Player = "black"; // 常に黒が先手

    setGameState({
      board,
      currentPlayer: firstPlayer,
      validMoves: getValidMoves(board, firstPlayer),
      gameStatus: "playing",
      scores,
      lastMove: null,
      capturedPieces: [],
      isThinking: false, // 初期は false で設定
    });
    clearHistory(); // 履歴もクリア

    // CPUが先手の場合、少し遅延してからthinkingを開始
    if (firstPlayer === playerConfig.cpuPlayer) {
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          isThinking: true,
        }));
      }, 500); // 500ms遅延
    }
  }, [clearHistory, playerConfig.cpuPlayer]);

  const switchPlayer = useCallback((currentPlayer: Player): Player => {
    return currentPlayer === "black" ? "white" : "black";
  }, []);

  const makePlayerMove = useCallback(
    (position: Position) => {
      if (
        gameState.gameStatus !== "playing" ||
        gameState.isThinking ||
        gameState.currentPlayer !== playerConfig.humanPlayer
      ) {
        return false;
      }

      const isValid = gameState.validMoves.some(
        (move) => move.row === position.row && move.col === position.col,
      );

      if (!isValid) {
        return false;
      }

      try {
        const { newBoard, capturedPieces } = makeMove(
          gameState.board,
          position,
          gameState.currentPlayer,
        );

        const newScores = countPieces(newBoard);
        const nextPlayer = switchPlayer(gameState.currentPlayer);
        const nextValidMoves = getValidMoves(newBoard, nextPlayer);

        const gameHasEnded = isGameOver(newBoard);
        const nextPlayerCanMove = hasValidMoves(newBoard, nextPlayer);

        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          currentPlayer: nextPlayerCanMove ? nextPlayer : prev.currentPlayer,
          validMoves: nextPlayerCanMove
            ? nextValidMoves
            : getValidMoves(newBoard, prev.currentPlayer),
          gameStatus: gameHasEnded ? "finished" : "playing",
          scores: newScores,
          lastMove: position,
          capturedPieces,
          isThinking:
            nextPlayerCanMove &&
            nextPlayer === playerConfig.cpuPlayer &&
            !gameHasEnded,
        }));

        // 履歴に手を追加
        addMove(
          position,
          gameState.currentPlayer,
          capturedPieces,
          newBoard,
          newScores,
        );

        if (gameHasEnded && onGameEnd) {
          const winner = getWinner(newBoard);
          onGameEnd(winner);
        }

        return true;
      } catch (error) {
        console.error("Move failed:", error);
        return false;
      }
    },
    [gameState, switchPlayer, onGameEnd, playerConfig, addMove],
  );

  const makeCpuMove = useCallback(
    (cpuMove: Position) => {
      if (
        gameState.gameStatus !== "playing" ||
        gameState.currentPlayer !== playerConfig.cpuPlayer
      ) {
        return false;
      }

      try {
        const { newBoard, capturedPieces } = makeMove(
          gameState.board,
          cpuMove,
          playerConfig.cpuPlayer,
        );

        const newScores = countPieces(newBoard);
        const nextPlayer = switchPlayer(playerConfig.cpuPlayer);
        const nextValidMoves = getValidMoves(newBoard, nextPlayer);
        const gameHasEnded = isGameOver(newBoard);
        const playerCanMove = hasValidMoves(newBoard, nextPlayer);

        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          currentPlayer: playerCanMove ? nextPlayer : playerConfig.cpuPlayer,
          validMoves: playerCanMove
            ? nextValidMoves
            : getValidMoves(newBoard, playerConfig.cpuPlayer),
          gameStatus: gameHasEnded ? "finished" : "playing",
          scores: newScores,
          lastMove: cpuMove,
          capturedPieces,
          isThinking: false,
        }));

        // 履歴に手を追加
        addMove(
          cpuMove,
          playerConfig.cpuPlayer,
          capturedPieces,
          newBoard,
          newScores,
        );

        if (gameHasEnded && onGameEnd) {
          const winner = getWinner(newBoard);
          onGameEnd(winner);
        }

        return true;
      } catch (error) {
        console.error("CPU move failed:", error);
        setGameState((prev) => ({ ...prev, isThinking: false }));
        return false;
      }
    },
    [gameState, onGameEnd, playerConfig, switchPlayer, addMove],
  );

  const setThinking = useCallback((thinking: boolean) => {
    setGameState((prev) => ({ ...prev, isThinking: thinking }));
  }, []);

  const passTurn = useCallback(() => {
    if (gameState.gameStatus !== "playing") return;

    const nextPlayer = switchPlayer(gameState.currentPlayer);
    const nextValidMoves = getValidMoves(gameState.board, nextPlayer);
    const nextPlayerCanMove = nextValidMoves.length > 0;

    if (!nextPlayerCanMove) {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "finished",
      }));

      if (onGameEnd) {
        const winner = getWinner(gameState.board);
        onGameEnd(winner);
      }
    } else {
      setGameState((prev) => ({
        ...prev,
        currentPlayer: nextPlayer,
        validMoves: nextValidMoves,
        isThinking: nextPlayer === playerConfig.cpuPlayer,
      }));
    }
  }, [gameState, switchPlayer, onGameEnd, playerConfig]);

  return {
    gameState,
    makePlayerMove,
    makeCpuMove,
    resetGame,
    setThinking,
    passTurn,
    canPlayerMove: gameState.validMoves.length > 0,
    isGameOver: gameState.gameStatus === "finished",
    winner:
      gameState.gameStatus === "finished" ? getWinner(gameState.board) : null,
    playerConfig,
    // 履歴関連
    history,
    undoMove,
    redoMove,
    jumpToMove,
    getMovesForDisplay,
  };
}
