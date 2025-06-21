"use client";

import { Brain, Cpu } from "lucide-react";
import { motion } from "motion/react";

interface CpuThinkingProps {
  isVisible: boolean;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  className?: string;
}

const difficultyConfig = {
  beginner: {
    label: "初級AI",
    color: "green",
    description: "考え中...",
    icon: "🤔",
  },
  intermediate: {
    label: "中級AI",
    color: "yellow",
    description: "戦略を練っています...",
    icon: "🧠",
  },
  advanced: {
    label: "上級AI",
    color: "orange",
    description: "深く思考中...",
    icon: "🤖",
  },
  expert: {
    label: "専門家AI",
    color: "red",
    description: "最適手を計算中...",
    icon: "👑",
  },
};

export default function CpuThinking({
  isVisible,
  difficulty,
  className = "",
}: CpuThinkingProps) {
  const config = difficultyConfig[difficulty];

  if (!isVisible) return null;

  return (
    <motion.div
      className={`flex items-center justify-center gap-3 p-4 rounded-lg backdrop-blur-sm ${className}`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        border: `1px solid var(--color-${config.color}-500)`,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Brain Icon */}
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Brain
          size={24}
          style={{ color: `var(--color-${config.color}-400)` }}
        />

        {/* Pulsing effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, var(--color-${config.color}-400) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Text Content */}
      <div className="text-center">
        <motion.div
          className="flex items-center gap-2 text-white font-medium"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-lg">{config.icon}</span>
          <span>{config.label}</span>
        </motion.div>
        <motion.p
          className="text-sm mt-1"
          style={{ color: `var(--color-${config.color}-300)` }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {config.description}
        </motion.p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: `var(--color-${config.color}-400)` }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* CPU Icon with rotation */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Cpu
          size={20}
          className={`text-${config.color}-300`}
          style={{ color: `var(--color-${config.color}-300)` }}
        />
      </motion.div>
    </motion.div>
  );
}
