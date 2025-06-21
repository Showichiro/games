"use client";

import { BoardContainer } from "@/components/common";
import { DiceValue } from "../types/farkle";
import Dice from "./Dice";

interface GameBoardProps {
  dice: DiceValue[];
  selectedDice: boolean[];
  isRolling: boolean;
  onDiceClick: (index: number) => void;
  disabled?: boolean;
}

export default function GameBoard({
  dice,
  selectedDice,
  isRolling,
  onDiceClick,
  disabled = false,
}: GameBoardProps) {
  return (
    <BoardContainer>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {dice.map((value, index) => (
          <Dice
            key={index}
            value={value}
            isSelected={selectedDice[index]}
            isRolling={isRolling}
            onClick={() => onDiceClick(index)}
            disabled={disabled || isRolling}
          />
        ))}
      </div>
    </BoardContainer>
  );
}
