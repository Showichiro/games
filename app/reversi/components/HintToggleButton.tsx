"use client";

import { motion, type Variants } from "motion/react";
import { useMemo } from "react";

interface HintToggleButtonProps {
  onToggle: () => void;
  showHints: boolean;
  disabled?: boolean;
  buttonVariants?: Variants;
}

interface UseHintButtonStylesProps {
  showHints: boolean;
  disabled: boolean;
}

function useHintButtonStyles({
  showHints,
  disabled,
}: UseHintButtonStylesProps) {
  return useMemo(
    () => ({
      baseStyle: {
        backgroundColor: disabled
          ? "var(--color-neutral-600)"
          : showHints
            ? "var(--color-warning-600)"
            : "var(--color-neutral-600)",
        color: disabled ? "var(--color-neutral-400)" : "var(--color-white)",
        cursor: disabled ? "not-allowed" : "pointer",
      },
      hoverStyle: {
        backgroundColor: showHints
          ? "var(--color-warning-700)"
          : "var(--color-neutral-700)",
      },
      defaultStyle: {
        backgroundColor: showHints
          ? "var(--color-warning-600)"
          : "var(--color-neutral-600)",
      },
      animations: {
        pulseAnimation:
          showHints && !disabled
            ? {
                boxShadow: [
                  "0 0 0 0 var(--color-warning-400)",
                  "0 0 0 10px transparent",
                  "0 0 0 0 var(--color-warning-400)",
                ],
              }
            : {},
        pulseTransition: {
          duration: 2,
          repeat: showHints && !disabled ? Infinity : 0,
          ease: "easeInOut" as const,
        },
        shimmerTransition: {
          duration: 2,
          repeat: Infinity,
          ease: "linear" as const,
        },
      },
    }),
    [showHints, disabled],
  );
}

export default function HintToggleButton({
  onToggle,
  showHints,
  disabled = false,
  buttonVariants,
}: HintToggleButtonProps) {
  const styles = useHintButtonStyles({ showHints, disabled });

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = styles.hoverStyle.backgroundColor;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor =
        styles.defaultStyle.backgroundColor;
    }
  };

  return (
    <motion.button
      className="px-6 py-3 rounded-lg font-medium transition-all duration-200 relative overflow-hidden text-white shadow-lg"
      style={styles.baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={buttonVariants}
      whileHover={!disabled ? "hover" : {}}
      whileTap={!disabled ? "tap" : {}}
      onClick={onToggle}
      disabled={disabled}
      animate={styles.animations.pulseAnimation}
      transition={styles.animations.pulseTransition}
    >
      {showHints ? "💡 ヒントON" : "💡 ヒントOFF"}
      {showHints && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={styles.animations.shimmerTransition}
        />
      )}
    </motion.button>
  );
}
