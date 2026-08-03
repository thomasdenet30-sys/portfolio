"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { usePointer } from "@/components/providers/PointerProvider";

/**
 * Mouvement de caméra piloté par le curseur.
 *
 * On enveloppe chaque plan de la scène avec une `depth` différente : le décor
 * bouge peu, les élèves davantage, l'estrade beaucoup. C'est cet écart — et non
 * un vrai déplacement 3D — qui fait lire la profondeur, pour le prix d'un
 * `transform` composité par le GPU.
 *
 * Le lissage vient de `PointerProvider`, partagé par tous les plans : chacun ne
 * fait plus qu'en dériver son amplitude. Trois plans coûtaient douze ressorts,
 * ils n'en coûtent plus aucun.
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
  const { cameraX, cameraY } = usePointer();
  const reduced = useReducedMotion();
  const amplitude = reduced ? 0 : depth;

  const x = useTransform(cameraX, (v) => (0.5 - v) * 32 * amplitude);
  const y = useTransform(cameraY, (v) => (0.5 - v) * 18 * amplitude);
  const rotateY = useTransform(cameraX, (v) => (v - 0.5) * 2.2 * amplitude);
  const rotateX = useTransform(cameraY, (v) => (0.5 - v) * 1.4 * amplitude);

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
