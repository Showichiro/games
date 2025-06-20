"use client";

import { GameLayout } from "@/components/common";
import { useFarkleGame } from "./hooks/useFarkleGame";
import GameBoard from "./components/GameBoard";
import ScoreDisplay from "./components/ScoreDisplay";
import GameControls from "./components/GameControls";
import { useState } from "react";

export default function FarklePage() {
  const { gameState, actions, computed } = useFarkleGame();
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = async () => {
    setIsRolling(true);
    // Add slight delay for animation
    setTimeout(() => {
      actions.rollDice();
      setIsRolling(false);
    }, 1200);
  };

  const isGameOver = gameState.gamePhase === "gameOver";

  return (
    <GameLayout>
      <div className="max-w-md mx-auto">
        <ScoreDisplay
          playerName={computed.currentPlayer.name}
          totalScore={computed.currentPlayer.totalScore}
          turnScore={gameState.turnScore}
          currentTurnScore={computed.currentTurnScore}
          isGameOver={isGameOver}
        />

        <GameBoard
          dice={gameState.dice}
          selectedDice={gameState.selectedDice}
          isRolling={isRolling}
          onDiceClick={actions.selectDice}
          disabled={isGameOver || gameState.gamePhase === "rolling"}
        />

        <GameControls
          canRoll={computed.canRoll && !isRolling}
          canBank={computed.canBank}
          isGameOver={isGameOver}
          onRoll={handleRoll}
          onBank={actions.bankScore}
          onNewGame={actions.newGame}
          currentTurnScore={computed.currentTurnScore}
        />
      </div>
    </GameLayout>
  );
}
