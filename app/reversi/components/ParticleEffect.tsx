"use client";

import { motion } from "motion/react";
import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface ParticleEffectProps {
  trigger: boolean;
  type: "capture" | "place" | "victory" | "defeat";
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export default function ParticleEffect({
  trigger,
  type,
  position = { x: 50, y: 50 },
  onComplete,
}: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = useCallback(
    (particleType: string) => {
      const newParticles: Particle[] = [];
      const particleCount = getParticleCount(particleType);

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const velocity = getVelocity(particleType);
        const life = getLifespan(particleType);

        newParticles.push({
          id: `particle-${i}-${Date.now()}`,
          x: position.x,
          y: position.y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: life,
          maxLife: life,
          size: getSize(particleType),
          color: getColor(particleType),
        });
      }

      return newParticles;
    },
    [position.x, position.y],
  );

  const getParticleCount = (particleType: string): number => {
    switch (particleType) {
      case "capture":
        return 8;
      case "place":
        return 6;
      case "victory":
        return 20;
      case "defeat":
        return 15;
      default:
        return 6;
    }
  };

  const getVelocity = (particleType: string): number => {
    switch (particleType) {
      case "capture":
        return 2 + Math.random() * 3;
      case "place":
        return 1 + Math.random() * 2;
      case "victory":
        return 3 + Math.random() * 4;
      case "defeat":
        return 1.5 + Math.random() * 2.5;
      default:
        return 2;
    }
  };

  const getLifespan = (particleType: string): number => {
    switch (particleType) {
      case "capture":
        return 30;
      case "place":
        return 25;
      case "victory":
        return 40;
      case "defeat":
        return 35;
      default:
        return 30;
    }
  };

  const getSize = (particleType: string): number => {
    switch (particleType) {
      case "capture":
        return 3 + Math.random() * 2;
      case "place":
        return 2 + Math.random() * 2;
      case "victory":
        return 4 + Math.random() * 3;
      case "defeat":
        return 3 + Math.random() * 2;
      default:
        return 3;
    }
  };

  const getColor = (particleType: string): string => {
    switch (particleType) {
      case "capture":
        return ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24"][
          Math.floor(Math.random() * 4)
        ];
      case "place":
        return ["#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"][
          Math.floor(Math.random() * 4)
        ];
      case "victory":
        return ["#ffd700", "#ff6b6b", "#4ecdc4", "#f9ca24"][
          Math.floor(Math.random() * 4)
        ];
      case "defeat":
        return ["#747d8c", "#a4b0be", "#57606f", "#2f3542"][
          Math.floor(Math.random() * 4)
        ];
      default:
        return "#ffffff";
    }
  };

  useEffect(() => {
    if (!trigger) return;

    const newParticles = createParticles(type);
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((currentParticles) => {
        const updatedParticles = currentParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            life: particle.life - 1,
          }))
          .filter((particle) => particle.life > 0);

        if (updatedParticles.length === 0) {
          clearInterval(interval);
          onComplete?.();
        }

        return updatedParticles;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [trigger, type, position.x, position.y, onComplete, createParticles]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}
    </div>
  );
}
