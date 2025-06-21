"use client";

import { AnimatePresence, motion } from "motion/react";
import { DiceValue } from "../types/farkle";
import { getAvailableCombinations } from "../utils/scoreCalculator";

interface ScoreCalculatorProps {
  dice: DiceValue[];
  selectedDice: boolean[];
  isVisible: boolean;
  onToggle: () => void;
  rollsInTurn: number;
}

export default function ScoreCalculator({
  dice,
  selectedDice,
  isVisible,
  onToggle,
  rollsInTurn,
}: ScoreCalculatorProps) {
  const availableCombinations = getAvailableCombinations(dice);
  const selectedDiceValues = dice.filter((_, index) => selectedDice[index]);
  const selectedCombinations =
    selectedDiceValues.length > 0
      ? getAvailableCombinations(selectedDiceValues)
      : [];

  const totalSelectedScore = selectedCombinations.reduce(
    (sum, combo) => sum + combo.score,
    0,
  );

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="mb-4 text-sm text-neutral-400 hover:text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isVisible ? "Hide" : "Show"} Scoring Guide
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-neutral-800 rounded-lg p-4 border border-neutral-600"
          >
            {/* Current Selection */}
            {selectedDiceValues.length > 0 && (
              <div className="mb-4 p-3 bg-neutral-700 rounded-lg">
                <h4 className="text-white font-semibold mb-2">
                  Selected Dice: {selectedDiceValues.join(", ")}
                </h4>
                {selectedCombinations.length > 0 ? (
                  <div className="space-y-1">
                    {selectedCombinations.map((combo, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-neutral-300">
                          {combo.description}
                        </span>
                        <span className="text-yellow-400 font-semibold">
                          {combo.score} pts
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-neutral-600 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">Total:</span>
                        <span className="text-yellow-400">
                          {totalSelectedScore} pts
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-400 text-sm">
                    No scoring combinations!
                  </p>
                )}
              </div>
            )}

            {/* Available Combinations */}
            {rollsInTurn > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">
                  Available Combinations ({dice.join(", ")})
                </h4>
                {availableCombinations.length > 0 ? (
                  <div className="space-y-2">
                    {availableCombinations.map((combo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-2 bg-neutral-700 rounded text-sm"
                      >
                        <div>
                          <span className="text-neutral-200 font-medium">
                            {combo.name}
                          </span>
                          <span className="text-neutral-400 ml-2">
                            ({combo.description})
                          </span>
                        </div>
                        <span className="text-yellow-400 font-bold">
                          {combo.score} pts
                        </span>
                      </motion.div>
                    ))}
                    <div className="border-t border-neutral-600 pt-2 mt-3">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">Maximum Possible:</span>
                        <span className="text-green-400">
                          {availableCombinations.reduce(
                            (sum, combo) => sum + combo.score,
                            0,
                          )}{" "}
                          pts
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-4"
                  >
                    <p className="text-red-400 font-bold text-lg">FARKLE!</p>
                    <p className="text-neutral-400 text-sm">
                      No scoring combinations available
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Scoring Rules Quick Reference */}
            <details className="mt-4">
              <summary className="text-neutral-400 text-sm cursor-pointer hover:text-white">
                Scoring Rules Reference
              </summary>
              <div className="mt-2 text-xs text-neutral-300 space-y-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>Single 1 = 100</div>
                  <div>Single 5 = 50</div>
                  <div>Three 1s = 1,000</div>
                  <div>Three 2s = 200</div>
                  <div>Three 3s = 300</div>
                  <div>Three 4s = 400</div>
                  <div>Three 5s = 500</div>
                  <div>Three 6s = 600</div>
                  <div>Straight = 1,000</div>
                  <div>Three Pairs = 750</div>
                  <div>Four + Two = 1,500</div>
                  <div>4+ of kind = 2x previous</div>
                </div>
              </div>
            </details>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
