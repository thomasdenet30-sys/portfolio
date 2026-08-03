"use client";

import { useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { usePointer } from "@/components/providers/PointerProvider";
import { spring } from "@/lib/motion";

const clamp = (value: number, limit = 1) => Math.max(-limit, Math.min(limit, value));

export interface Gaze {
  /** −1 (regarde à gauche) → 1 (regarde à droite). */
  x: MotionValue<number>;
  /** −1 (regarde en haut) → 1 (regarde en bas). */
  y: MotionValue<number>;
}

/**
 * Fait suivre le curseur par un personnage placé en `anchor` (coordonnées en %
 * du viewport). Aucun `getBoundingClientRect` : la position de l'élève est déjà
 * connue, on compare donc deux vecteurs normalisés — coût nul par frame.
 *
 * `prefers-reduced-motion` neutralise le gain : le regard reste droit.
 */
export function useGaze(anchor: { x: number; y: number }, gain = 1.6): Gaze {
  const { nx, ny, aspect } = usePointer();
  const reduced = useReducedMotion();
  const strength = reduced ? 0 : gain;

  const anchorX = anchor.x / 100;
  const anchorY = anchor.y / 100;

  const rawX = useTransform(
    [nx, aspect] as MotionValue<number>[],
    ([pointerX, ratio]: number[]) => clamp((pointerX - anchorX) * ratio * strength),
  );
  const rawY = useTransform(ny, (pointerY: number) =>
    clamp((pointerY - anchorY) * strength * 1.7),
  );

  return {
    x: useSpring(rawX, spring.gaze),
    y: useSpring(rawY, spring.gaze),
  };
}
