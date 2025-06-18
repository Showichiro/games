"use client"; // Or remove if not strictly needed

import React from "react";

export interface ButtonGroupItem<T extends string | number | symbol = string> { // Added export
  id: T;
  label: React.ReactNode;
  className?: string; // Custom class for this button when inactive
  activeClassName?: string; // Custom class for this button when active
}

export interface ButtonGroupProps<T extends string | number | symbol = string> { // Added export
  items: ButtonGroupItem<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  containerClassName?: string;
  buttonClassName?: string; // Base class for all buttons
  activeButtonClassName?: string; // Base class for the active button
  inactiveButtonClassName?: string; // Base class for inactive buttons
}

export default function ButtonGroup<T extends string | number | symbol>({
  items,
  selectedId,
  onSelect,
  containerClassName = "flex justify-center gap-2 lg:gap-3",
  buttonClassName = "px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50",
  activeButtonClassName = "bg-blue-500 text-white focus:ring-blue-300", // Generic active style
  inactiveButtonClassName = "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700 focus:ring-neutral-400", // Generic inactive style
}: ButtonGroupProps<T>) {
  return (
    <div className={containerClassName}>
      {items.map((item) => {
        const isActive = item.id === selectedId;
        const activeClasses = isActive
          ? `${activeButtonClassName} ${item.activeClassName || ""}`
          : "";
        const inactiveClasses = !isActive
          ? `${inactiveButtonClassName} ${item.className || ""}`
          : "";

        return (
          <button
            key={item.id.toString()} // Ensure key is a string
            type="button" // Good practice for buttons not submitting forms
            className={`${buttonClassName} ${activeClasses} ${inactiveClasses}`.trim()}
            onClick={() => onSelect(item.id)}
            aria-pressed={isActive} // For accessibility
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
