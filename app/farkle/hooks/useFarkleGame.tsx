"use client";

import { useCallback, useReducer } from "react";
import { DiceValue, GameAction, GameState, Player } from "../types/farkle";
import { getSelectedScore, isFarkle } from "../utils/scoreCalculator";

const initialPlayer: Player = {
  id: 1,
  name: "Player 1",
  totalScore: 0,
  isAI: false,
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    highestScore: 0,
    averageScore: 0,
    totalFarkles: 0,
    longestWinStreak: 0,
  },
};

const initialState: GameState = {
  currentPlayer: 0,
  players: [initialPlayer],
  gamePhase: "rolling",
  dice: [1, 1, 1, 1, 1, 1],
  selectedDice: [false, false, false, false, false, false],
  turnScore: 0,
  rollsInTurn: 0,
  targetScore: 10000,
  gameMode: "single",
  aiDifficulty: "normal",
};

function rollDice(): DiceValue[] {
  return Array.from(
    { length: 6 },
    () => (Math.floor(Math.random() * 6) + 1) as DiceValue,
  );
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ROLL_DICE": {
      const newDice = rollDice();

      // Check for Farkle
      if (isFarkle(newDice)) {
        return {
          ...state,
          dice: newDice,
          selectedDice: [false, false, false, false, false, false],
          gamePhase: "rolling",
          turnScore: 0,
          rollsInTurn: state.rollsInTurn + 1,
        };
      }

      return {
        ...state,
        dice: newDice,
        selectedDice: [false, false, false, false, false, false],
        gamePhase: "selecting",
        rollsInTurn: state.rollsInTurn + 1,
      };
    }

    case "SELECT_DICE": {
      const { index } = action.payload;
      const newSelectedDice = [...state.selectedDice];
      newSelectedDice[index] = !newSelectedDice[index];

      return {
        ...state,
        selectedDice: newSelectedDice,
        gamePhase: "selecting",
      };
    }

    case "BANK_SCORE": {
      const selectedScore = getSelectedScore(state.dice, state.selectedDice);
      const newTotalScore =
        state.players[state.currentPlayer].totalScore +
        state.turnScore +
        selectedScore;

      // Update player score
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayer] = {
        ...updatedPlayers[state.currentPlayer],
        totalScore: newTotalScore,
      };

      // Check for game over
      if (newTotalScore >= state.targetScore) {
        return {
          ...state,
          players: updatedPlayers,
          gamePhase: "gameOver",
          turnScore: 0,
          selectedDice: [false, false, false, false, false, false],
        };
      }

      return {
        ...state,
        players: updatedPlayers,
        gamePhase: "rolling",
        turnScore: 0,
        selectedDice: [false, false, false, false, false, false],
        rollsInTurn: 0,
      };
    }

    case "NEW_GAME": {
      return {
        ...initialState,
        players: [{ ...initialPlayer }],
      };
    }

    default:
      return state;
  }
}

export function useFarkleGame() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const rollDice = useCallback(() => {
    dispatch({ type: "ROLL_DICE" });
  }, []);

  const selectDice = useCallback((index: number) => {
    dispatch({ type: "SELECT_DICE", payload: { index } });
  }, []);

  const bankScore = useCallback(() => {
    dispatch({ type: "BANK_SCORE" });
  }, []);

  const newGame = useCallback(() => {
    dispatch({ type: "NEW_GAME" });
  }, []);

  const currentTurnScore = getSelectedScore(
    gameState.dice,
    gameState.selectedDice,
  );
  const canBank = currentTurnScore > 0;
  const canRoll = gameState.gamePhase === "rolling";
  const isFarkled =
    isFarkle(gameState.dice) &&
    gameState.gamePhase === "rolling" &&
    gameState.rollsInTurn > 0;

  return {
    gameState,
    actions: {
      rollDice,
      selectDice,
      bankScore,
      newGame,
    },
    computed: {
      currentTurnScore,
      canBank,
      canRoll,
      isFarkled,
      currentPlayer: gameState.players[gameState.currentPlayer],
    },
  };
}
