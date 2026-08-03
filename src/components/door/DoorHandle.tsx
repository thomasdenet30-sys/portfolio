"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";

/**
 * Poignée de laiton, montée *dans* le vantail : elle pivote avec la porte
 * quand celle-ci s'ouvre, au lieu de rester suspendue dans le vide.
 *
 * Dimensions indexées sur `--door-w`, comme la plaque.
 */
export function DoorHandle({
  side,
  hovered,
  pressed,
}: {
  side: "left" | "right";
  hovered: boolean;
  pressed: boolean;
}) {
  const isLeft = side === "left";

  return (
    <div
      className="absolute top-[57%] -translate-y-1/2"
      style={{ [isLeft ? "right" : "left"]: "22%" }}
      aria-hidden="true"
    >
      {/* Halo qui pulse tant que le visiteur n'a pas repéré le geste. */}
      <span className="animate-handle-hint absolute left-1/2 top-1/2 h-[calc(var(--door-w)*0.14)] w-[calc(var(--door-w)*0.14)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd98a] blur-xl" />

      <motion.div
        animate={{ opacity: hovered ? 0.75 : 0 }}
        transition={spring.snappy}
        className="absolute left-1/2 top-1/2 h-[calc(var(--door-w)*0.17)] w-[calc(var(--door-w)*0.17)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffcf7a] blur-xl"
      />

      {/* Rosace. */}
      <div className="material-brass relative h-[calc(var(--door-w)*0.085)] w-[calc(var(--door-w)*0.085)] rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,246,215,0.75)]">
        {/* Entrée de serrure. */}
        <span className="absolute left-1/2 top-1/2 h-[calc(var(--door-w)*0.021)] w-[calc(var(--door-w)*0.011)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b1c07] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />

        {/* Béquille, tournée vers le joint central : elle s'abaisse au clic. */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ transformOrigin: "0% 50%" }}
          animate={{
            rotate: pressed ? (isLeft ? 26 : -26) : hovered ? (isLeft ? -5 : 5) : 0,
          }}
          transition={spring.snappy}
        >
          <div
            className="material-brass h-[calc(var(--door-w)*0.028)] rounded-full shadow-[0_3px_6px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,246,215,0.65)]"
            style={{
              width: "calc(var(--door-w) * 0.147)",
              transform: `translate(${isLeft ? "0" : "-100%"}, -50%)`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
