"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { DoorHandle } from "./DoorHandle";

/**
 * Un vantail de chêne. Il pivote vers l'intérieur autour de son gond, donc
 * autour du bord extérieur du chambranle.
 *
 * L'arrondi n'est posé que sur le coin haut extérieur : les deux battants
 * réunis reconstituent le plein cintre de la baie.
 */
export function DoorLeaf({
  side,
  open,
  hovered,
  pressed,
}: {
  side: "left" | "right";
  open: boolean;
  hovered: boolean;
  pressed: boolean;
}) {
  const isLeft = side === "left";

  return (
    <motion.div
      className="material-oak absolute top-0 h-full w-1/2 overflow-hidden"
      style={{
        [isLeft ? "left" : "right"]: 0,
        transformOrigin: isLeft ? "0% 50%" : "100% 50%",
        /* Chaque vantail ne porte que son coin extérieur : réunis, ils
           reconstituent exactement le cintre du chambranle (50 % × 42 %). */
        [isLeft ? "borderTopLeftRadius" : "borderTopRightRadius"]: "100% 42%",
        boxShadow: "inset 0 0 3vmax rgba(0,0,0,0.55)",
      }}
      animate={{ rotateY: open ? (isLeft ? 104 : -104) : 0 }}
      transition={spring.door}
    >
      {/* Panneaux moulurés. */}
      <div className="absolute inset-x-[12%] top-[10%] h-[36%] rounded-[6px] shadow-[inset_0_0_0_2px_rgba(0,0,0,0.35),inset_0_3px_10px_rgba(0,0,0,0.55),0_1px_0_rgba(255,214,160,0.14)]" />
      <div className="absolute inset-x-[12%] bottom-[8%] h-[38%] rounded-[6px] shadow-[inset_0_0_0_2px_rgba(0,0,0,0.35),inset_0_3px_10px_rgba(0,0,0,0.55),0_1px_0_rgba(255,214,160,0.14)]" />

      {/* Traverse centrale. */}
      <div className="absolute inset-x-0 top-[49%] h-[3%] bg-black/25 shadow-[0_1px_0_rgba(255,214,160,0.12)]" />

      {/* Montant du joint central, dans l'ombre. */}
      <div
        className="absolute inset-y-0 w-[4%] bg-gradient-to-r from-transparent to-black/70"
        style={{ [isLeft ? "right" : "left"]: 0, transform: isLeft ? "none" : "scaleX(-1)" }}
      />

      {/* Éclairage : le vantail est plus clair vers l'extérieur du chambranle. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to ${isLeft ? "left" : "right"}, rgba(0,0,0,0.55), rgba(255,190,120,0.06))`,
        }}
      />

      <DoorHandle side={side} hovered={hovered} pressed={pressed} />
    </motion.div>
  );
}
