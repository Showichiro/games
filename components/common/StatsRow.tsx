"use client"; // Or remove if not strictly needed, but good for consistency if other common components use it.

import React from "react";

export interface StatsItem { // Added export
  label: string;
  value: string | number;
}

export interface StatsRowProps { // Added export
  items: StatsItem[];
  className?: string;
  itemClassName?: string;
}

export default function StatsRow({
  items,
  className = "flex justify-center gap-6 text-neutral-700 dark:text-neutral-300 text-sm md:text-base", // Default styling
  itemClassName = "", // Default styling for individual items
}: StatsRowProps) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className={itemClassName}>
          <span className="font-medium">{item.label}:</span> {item.value}
        </div>
      ))}
    </div>
  );
}
