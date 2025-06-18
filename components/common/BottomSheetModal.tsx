"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";

export interface BottomSheetModalProps {
  // Added export
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function BottomSheetModal({
  isOpen,
  onClose,
  title,
  headerActions,
  children,
  className,
}: BottomSheetModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-950/70 flex items-end justify-center p-4 z-50 md:items-center"
          onClick={onClose} // Backdrop click
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }} // Smoother animation
            className={`bg-neutral-0 rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col ${className}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sheet
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold text-default-font">{title}</h3>
              {headerActions && (
                <div className="flex gap-2 items-center">{headerActions}</div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-grow">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
