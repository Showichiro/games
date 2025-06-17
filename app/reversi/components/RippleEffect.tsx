"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Position } from "../types";

interface RippleEffectProps {
  trigger: boolean;
  sourcePosition: Position;
  capturedPositions: Position[];
  onComplete?: () => void;
}

export default function RippleEffect({
  trigger,
  sourcePosition,
  capturedPositions,
  onComplete,
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<
    Array<{
      id: string;
      position: Position;
      delay: number;
      distance: number;
    }>
  >([]);

  useEffect(() => {
    if (!trigger || capturedPositions.length === 0) {
      setRipples([]);
      return;
    }

    // Calculate distances and create ripples with delays
    const newRipples = capturedPositions.map((pos) => {
      const distance = Math.sqrt(
        Math.pow(pos.row - sourcePosition.row, 2) +
          Math.pow(pos.col - sourcePosition.col, 2),
      );

      return {
        id: `ripple-${pos.row}-${pos.col}-${Date.now()}`,
        position: pos,
        delay: distance * 0.1, // Delay based on distance from source
        distance,
      };
    });

    // Sort by distance for wave effect
    newRipples.sort((a, b) => a.distance - b.distance);
    setRipples(newRipples);

    // Clear ripples after animation completes
    const maxDelay = Math.max(...newRipples.map((r) => r.delay));
    const timeout = setTimeout(
      () => {
        setRipples([]);
        onComplete?.();
      },
      (maxDelay + 0.8) * 1000,
    );

    return () => clearTimeout(timeout);
  }, [trigger, sourcePosition, capturedPositions, onComplete]);

  if (ripples.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute"
          style={{
            left: `${(ripple.position.col / 8) * 100}%`,
            top: `${(ripple.position.row / 8) * 100}%`,
            width: `${100 / 8}%`,
            height: `${100 / 8}%`,
          }}
        >
          {/* Primary ripple */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-yellow-400"
            initial={{
              scale: 0.3,
              opacity: 0,
              borderWidth: 0,
            }}
            animate={{
              scale: [0.3, 1.2, 0.3],
              opacity: [0, 1, 0],
              borderWidth: [0, 3, 0],
            }}
            transition={{
              duration: 0.8,
              delay: ripple.delay,
              ease: "easeOut",
            }}
            style={{
              boxShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
            }}
          />

          {/* Secondary ripple for depth */}
          <motion.div
            className="absolute inset-1 rounded-full border border-white"
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 0.6,
              delay: ripple.delay + 0.1,
              ease: "easeOut",
            }}
          />

          {/* Sparkle particles */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: `${25 + i * 20}%`,
                top: `${25 + (i % 2) * 30}%`,
              }}
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -10, 0],
                x: [0, i % 2 ? 5 : -5, 0],
              }}
              transition={{
                duration: 0.6,
                delay: ripple.delay + 0.2 + i * 0.05,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}
