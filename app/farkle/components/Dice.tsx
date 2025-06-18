"use client";

import { motion } from "motion/react";
import { DiceValue } from "../types/farkle";

interface DiceProps {
    value: DiceValue;
    isSelected: boolean;
    isRolling: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const DiceDot = ({ position }: { position: string }) => (
    <div className={`w-2 h-2 bg-neutral-800 rounded-full ${position}`} />
);

const DiceFace = ({ value }: { value: DiceValue }) => {
    const dotPositions = {
        1: ["justify-center items-center"],
        2: ["justify-between items-stretch flex-col p-1"],
        3: ["justify-between items-center flex-col p-1"],
        4: ["justify-between items-stretch p-1"],
        5: ["justify-between items-stretch p-1"],
        6: ["justify-between items-stretch p-1"],
    };

    const renderDots = () => {
        switch (value) {
            case 1:
                return <DiceDot position="" />;
            case 2:
                return (
                    <>
                        <DiceDot position="self-start" />
                        <DiceDot position="self-end" />
                    </>
                );
            case 3:
                return (
                    <>
                        <DiceDot position="self-start" />
                        <DiceDot position="self-center" />
                        <DiceDot position="self-end" />
                    </>
                );
            case 4:
                return (
                    <>
                        <div className="flex justify-between">
                            <DiceDot position="" />
                            <DiceDot position="" />
                        </div>
                        <div className="flex justify-between">
                            <DiceDot position="" />
                            <DiceDot position="" />
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <div className="flex justify-between">
                            <DiceDot position="" />
                            <DiceDot position="" />
                        </div>
                        <div className="flex justify-center">
                            <DiceDot position="" />
                        </div>
                        <div className="flex justify-between">
                            <DiceDot position="" />
                            <DiceDot position="" />
                        </div>
                    </>
                );
            case 6:
                return (
                    <>
                        <div className="flex justify-between">
                            <DiceDot position="" />
                            <DiceDot position="" />
                        </div>
                        <div className="flex justify-between">
                            <DiceDot position="" />
                            <DiceDot position="" />
                        </div>
                        <div className="flex justify-between">
                            <DiceDot position="" />
                            <DiceDot position="" />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex ${dotPositions[value]?.[0] || "justify-center items-center"} w-full h-full`}>
            {renderDots()}
        </div>
    );
};

export default function Dice({ value, isSelected, isRolling, onClick, disabled = false }: DiceProps) {
    return (
        <motion.button
            className={`
                w-16 h-16 rounded-lg border-2 flex items-center justify-center
                relative transition-all duration-200 ease-out
                ${isSelected 
                    ? "bg-yellow-100 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]" 
                    : "bg-white border-neutral-300 shadow-lg hover:shadow-xl"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            animate={{
                scale: isSelected ? 1.1 : 1,
                rotateX: isRolling ? [0, 360, 720] : 0,
                rotateY: isRolling ? [0, 180, 360] : 0,
                y: isRolling ? [0, -50, 0] : 0,
            }}
            transition={{
                duration: isRolling ? 1.2 : 0.2,
                ease: isRolling ? "easeOut" : "easeInOut",
                type: isRolling ? "tween" : "spring",
                stiffness: 300,
                damping: 20,
            }}
        >
            <DiceFace value={value} />
        </motion.button>
    );
}