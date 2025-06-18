import { DiceValue, ScoreCombination } from "../types/farkle";

export function calculateScore(dice: DiceValue[]): ScoreCombination[] {
    const combinations: ScoreCombination[] = [];
    const diceCount = dice.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {} as Record<DiceValue, number>);

    const usedDice = new Array(dice.length).fill(false);

    // Check for straight (1-2-3-4-5-6)
    if (dice.length === 6 && [1, 2, 3, 4, 5, 6].every(value => diceCount[value as DiceValue] === 1)) {
        combinations.push({
            name: "Straight",
            score: 1000,
            diceUsed: new Array(6).fill(true),
            description: "1-2-3-4-5-6"
        });
        return combinations; // Straight uses all dice
    }

    // Check for 3 pairs
    const pairs: DiceValue[] = [];
    Object.entries(diceCount).forEach(([value, count]) => {
        if (count === 2) {
            pairs.push(parseInt(value) as DiceValue);
        }
    });
    
    if (pairs.length === 3 && dice.length === 6) {
        combinations.push({
            name: "Three Pairs",
            score: 750,
            diceUsed: new Array(6).fill(true),
            description: "Three pairs"
        });
        return combinations; // Three pairs uses all dice
    }

    // Check for 4 of a kind + 2 of a kind
    const fours: DiceValue[] = [];
    const twos: DiceValue[] = [];
    Object.entries(diceCount).forEach(([value, count]) => {
        if (count === 4) fours.push(parseInt(value) as DiceValue);
        if (count === 2) twos.push(parseInt(value) as DiceValue);
    });
    
    if (fours.length === 1 && twos.length === 1 && dice.length === 6) {
        combinations.push({
            name: "Four + Two",
            score: 1500,
            diceUsed: new Array(6).fill(true),
            description: "4 of a kind + 2 of a kind"
        });
        return combinations; // Four + Two uses all dice
    }

    // Check for multiple of the same number (3, 4, 5, 6 of a kind)
    Object.entries(diceCount).forEach(([value, count]) => {
        const diceValue = parseInt(value) as DiceValue;
        if (count >= 3) {
            let baseScore: number;
            if (diceValue === 1) {
                baseScore = 1000;
            } else {
                baseScore = diceValue * 100;
            }

            // Calculate score based on count
            let multiplier = 1;
            for (let i = 4; i <= count; i++) {
                multiplier *= 2;
            }
            
            const score = baseScore * multiplier;
            const diceUsed = new Array(dice.length).fill(false);
            
            // Mark the dice used for this combination
            let marked = 0;
            dice.forEach((die, index) => {
                if (die === diceValue && marked < count && !usedDice[index]) {
                    diceUsed[index] = true;
                    usedDice[index] = true;
                    marked++;
                }
            });

            combinations.push({
                name: `${count} ${diceValue}s`,
                score,
                diceUsed,
                description: `${count} of ${diceValue}`
            });
        }
    });

    // Check for single 1s and 5s not used in combinations
    dice.forEach((die, index) => {
        if (!usedDice[index]) {
            if (die === 1) {
                const diceUsed = new Array(dice.length).fill(false);
                diceUsed[index] = true;
                combinations.push({
                    name: "Single 1",
                    score: 100,
                    diceUsed,
                    description: "Single 1"
                });
                usedDice[index] = true;
            } else if (die === 5) {
                const diceUsed = new Array(dice.length).fill(false);
                diceUsed[index] = true;
                combinations.push({
                    name: "Single 5",
                    score: 50,
                    diceUsed,
                    description: "Single 5"
                });
                usedDice[index] = true;
            }
        }
    });

    return combinations;
}

export function getSelectedScore(dice: DiceValue[], selectedDice: boolean[]): number {
    const selectedDiceValues = dice.filter((_, index) => selectedDice[index]);
    const combinations = calculateScore(selectedDiceValues);
    return combinations.reduce((total, combo) => total + combo.score, 0);
}

export function getAvailableCombinations(dice: DiceValue[]): ScoreCombination[] {
    return calculateScore(dice);
}

export function isFarkle(dice: DiceValue[]): boolean {
    const combinations = calculateScore(dice);
    return combinations.length === 0;
}

export function canContinue(dice: DiceValue[], selectedDice: boolean[]): boolean {
    // Can continue if there are unselected dice and selected dice form valid combinations
    const hasUnselected = selectedDice.some(selected => !selected);
    const selectedScore = getSelectedScore(dice, selectedDice);
    return hasUnselected && selectedScore > 0;
}