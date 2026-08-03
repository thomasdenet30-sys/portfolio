"use client";

import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { usePointer } from "@/components/providers/PointerProvider";
import { spring } from "@/lib/motion";

/**
 * Mouvement de caméra piloté par le curseur.
 *
 * On enveloppe chaque plan de la scène avec une `depth` différente : le décor
 * bouge peu, les élèves bougent davantage. C'est cet écart — et non un vrai
 * déplacement 3D — qui fait lire la profondeur, pour le prix d'un `transform`
 * composité par le GPU.
 *
 * Le léger sur-dimensionnement (`scale`) évite de découvrir les bords quand la
 * couche pivote.
 */
export function CameraAnimation({
  depth = 1,
  children,
  className,
}: {
  depth?: number;
  children: ReactNode;
  className?: string;
}) {
  const { nx, ny } = usePointer();
  const reduced = useReducedMotion();
  const amplitude = reduced ? 0 : depth;

  const x = useSpring(useTransform(nx, [0, 1], [16 * amplitude, -16 * amplitude]), spring.soft);
  const y = useSpring(useTransform(ny, [0, 1], [9 * amplitude, -9 * amplitude]), spring.soft);
  const rotateY = useSpring(
    useTransform(nx, [0, 1], [-1.1 * amplitude, 1.1 * amplitude]),
    spring.soft,
  );
  const rotateX = useSpring(
    useTransform(ny, [0, 1], [0.7 * amplitude, -0.7 * amplitude]),
    spring.soft,
  );

  return (
    <motion.div
      className={className}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        scale: 1 + 0.02 * amplitude,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
