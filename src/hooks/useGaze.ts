"use client";

import { useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { usePointer } from "@/components/providers/PointerProvider";

const clamp = (value: number, limit = 1) => Math.max(-limit, Math.min(limit, value));

export interface Gaze {
  /** −1 (regarde à gauche) → 1 (regarde à droite). */
  x: MotionValue<number>;
  /** −1 (regarde en haut) → 1 (regarde en bas). */
  y: MotionValue<number>;
}

/**
 * Fait suivre le curseur par un personnage placé en `anchor` (coordonnées en %
 * du viewport).
 *
 * Deux choses évitées ici, et c'est ce qui rend le suivi gratuit :
 * aucun `getBoundingClientRect` — la position de l'élève est déjà connue, on
 * compare deux vecteurs normalisés — et aucun ressort par élève. Le lissage est
 * fait une seule fois dans `PointerProvider` ; il ne reste qu'un calcul.
 *
 * `prefers-reduced-motion` neutralise le gain : le regard reste droit.
 */
export function useGaze(anchor: { x: number; y: number }, gain = 1.6): Gaze {
  const { gazeX, gazeY, aspect } = usePointer();
  const reduced = useReducedMotion();
  const strength = reduced ? 0 : gain;

  const anchorX = anchor.x / 100;
  const anchorY = anchor.y / 100;

  return {
    x: useTransform(
      [gazeX, aspect] as MotionValue<number>[],
      ([pointerX, ratio]: number[]) => clamp((pointerX - anchorX) * ratio * strength),
    ),
    y: useTransform(gazeY, (pointerY: number) =>
      clamp((pointerY - anchorY) * strength * 1.7),
    ),
  };
}
