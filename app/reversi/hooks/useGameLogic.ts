"use client";

import { useState, useCallback } from "react";
import type { GameState, Position, Player, Difficulty } from "../types";
import {
  initializeBoard,
  getValidMoves,
  makeMove,
  hasValidMoves,
  isGameOver,
  getWinner,
} from "../utils/gameLogic";
import { countPieces } from "../utils/boardUtils";

interface UseGameLogicProps {
  difficulty?: Difficulty;
  onGameEnd?: (winner: Player | "draw" | null) => void;
}

export function useGameLogic({
  onGameEnd,
}: UseGameLogicProps = {}) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const board = initializeBoard();
    const scores = countPieces(board);
    return {
      board,
      currentPlayer: "black" as Player,
      validMoves: getValidMoves(board, "black"),
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
    setGameState({
      board,
      currentPlayer: "black",
      validMoves: getValidMoves(board, "black"),
      gameStatus: "playing",
      scores,
      lastMove: null,
      capturedPieces: [],
      isThinking: false,
    });
  }, []);

  const switchPlayer = useCallback((currentPlayer: Player): Player => {
    return currentPlayer === "black" ? "white" : "black";
  }, []);

  const makePlayerMove = useCallback(
    (position: Position) => {
      if (gameState.gameStatus !== "playing" || gameState.isThinking) {
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
            nextPlayerCanMove && nextPlayer === "white" && !gameHasEnded,
        }));

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
    [gameState, switchPlayer, onGameEnd],
  );

  const makeCpuMove = useCallback(
    (cpuMove: Position) => {
      if (
        gameState.gameStatus !== "playing" ||
        gameState.currentPlayer !== "white"
      ) {
        return false;
      }

      try {
        const { newBoard, capturedPieces } = makeMove(
          gameState.board,
          cpuMove,
          "white",
        );

        const newScores = countPieces(newBoard);
        const nextValidMoves = getValidMoves(newBoard, "black");
        const gameHasEnded = isGameOver(newBoard);
        const playerCanMove = hasValidMoves(newBoard, "black");

        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          currentPlayer: playerCanMove ? "black" : "white",
          validMoves: playerCanMove
            ? nextValidMoves
            : getValidMoves(newBoard, "white"),
          gameStatus: gameHasEnded ? "finished" : "playing",
          scores: newScores,
          lastMove: cpuMove,
          capturedPieces,
          isThinking: false,
        }));

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
    [gameState, onGameEnd],
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
        isThinking: nextPlayer === "white",
      }));
    }
  }, [gameState, switchPlayer, onGameEnd]);

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
  };
}
