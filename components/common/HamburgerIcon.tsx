"use client";

import { motion } from "motion/react";
import React from "react";

export interface HamburgerIconProps { // Added export
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function HamburgerIcon({
  isOpen,
  onClick,
  className,
}: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
      className={`w-10 h-10 flex flex-col justify-center items-center gap-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded ${className}`} // Added rounded, removed game-specific sizing/positioning
    >
      <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
        <motion.div
          className="w-full h-0.5 bg-current"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 3 : 0, // Adjusted y translation for centering the cross
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="w-full h-0.5 bg-current"
          animate={{
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="w-full h-0.5 bg-current"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -3 : 0, // Adjusted y translation for centering the cross
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </button>
  );
}
