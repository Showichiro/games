"use client";

import { useState, useEffect } from "react";
import { GameLayout } from "@/components/common";
import GameBoard from "./components/GameBoard";
import GameControls from "./components/GameControls";
import GameOverModal from "./components/GameOverModal";
import ScoreCalculator from "./components/ScoreCalculator";
import ScoreDisplay from "./components/ScoreDisplay";
import { useFarkleGame } from "./hooks/useFarkleGame";

export default function FarklePage() {
  const { gameState, actions, computed } = useFarkleGame();
  const [isRolling, setIsRolling] = useState(false);
  const [showScoreGuide, setShowScoreGuide] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const handleRoll = async () => {
    setIsRolling(true);
    // Add slight delay for animation
    setTimeout(() => {
      actions.rollDice();
      setIsRolling(false);
    }, 1200);
  };

  const isGameOver = gameState.gamePhase === "gameOver";

  // Show game over modal when game ends
  useEffect(() => {
    if (isGameOver) {
      setShowGameOverModal(true);
    }
  }, [isGameOver]);

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

        <ScoreCalculator
          dice={gameState.dice}
          selectedDice={gameState.selectedDice}
          isVisible={showScoreGuide}
          onToggle={() => setShowScoreGuide(!showScoreGuide)}
        />

        <GameControls
          canRoll={computed.canRoll && !isRolling}
          canBank={computed.canBank}
          isGameOver={isGameOver}
          hasHotDice={computed.hasHotDice}
          isFirstScore={computed.isFirstScore}
          meetsMinimumScore={computed.meetsMinimumScore}
          minimumScore={computed.minimumScore}
          totalTurnScore={computed.totalTurnScore}
          onRoll={handleRoll}
          onBank={actions.bankScore}
          onNewGame={actions.newGame}
          onContinueWithHotDice={actions.continueWithHotDice}
          currentTurnScore={computed.currentTurnScore}
        />

        <GameOverModal
          isOpen={showGameOverModal}
          playerName={computed.currentPlayer.name}
          finalScore={computed.currentPlayer.totalScore}
          onNewGame={() => {
            actions.newGame();
            setShowGameOverModal(false);
          }}
          onClose={() => setShowGameOverModal(false)}
        />
      </div>
    </GameLayout>
  );
}
