"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";
import HamburgerIcon from "./HamburgerIcon"; // Import the new HamburgerIcon

export interface HamburgerMenuProps {
  // Added export
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export default function HamburgerMenu({
  isOpen,
  onToggle,
  onClose,
  children,
  position = "top-right", // Default to top-right
  className,
}: HamburgerMenuProps) {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const menuPositionClasses = {
    "top-left": "top-16 left-4",
    "top-right": "top-16 right-4",
    "bottom-left": "bottom-16 left-4", // Adjust as needed
    "bottom-right": "bottom-16 right-4", // Adjust as needed
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <div className={`fixed z-40 ${positionClasses[position]}`}>
        <HamburgerIcon isOpen={isOpen} onClick={onToggle} />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/30 z-30 md:hidden" // Assuming this menu is primarily for mobile
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`fixed bg-white rounded-lg shadow-xl z-40 min-w-[200px] md:hidden ${menuPositionClasses[position]} ${className}`}
            >
              <div className="py-2">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
