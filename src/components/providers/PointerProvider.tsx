"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { spring } from "@/lib/motion";

interface PointerState {
  /** Position du curseur, normalisée : 0 = bord gauche, 1 = bord droit. */
  nx: MotionValue<number>;
  /** Position du curseur, normalisée : 0 = haut, 1 = bas. */
  ny: MotionValue<number>;
  /** Rapport largeur/hauteur du viewport, pour corriger les distances. */
  aspect: MotionValue<number>;
  /** Position lissée pour les regards : réactive, mais jamais nerveuse. */
  gazeX: MotionValue<number>;
  gazeY: MotionValue<number>;
  /** Position lissée pour la caméra : plus lente, plus ample. */
  cameraX: MotionValue<number>;
  cameraY: MotionValue<number>;
}

const PointerContext = createContext<PointerState | null>(null);

/**
 * Diffuse la position du curseur sous forme de MotionValues.
 *
 * Volontairement hors du state React : le regard des élèves, le parallaxe et
 * les reflets se mettent à jour sans provoquer le moindre re-render.
 *
 * ── Un ressort par usage, pas un par élément ──────────────────────────────
 * Chaque élève lissait autrefois son propre regard, et chaque plan de décor sa
 * propre caméra : vingt-six ressorts intégrés à chaque frame, tous alimentés
 * par les deux mêmes valeurs. Le lissage est désormais fait **une fois ici**,
 * et chacun se contente d'en dériver sa valeur par un simple calcul. Quatre
 * ressorts au total, pour un rendu identique.
 */
export function PointerProvider({ children }: { children: ReactNode }) {
  const nx = useMotionValue(0.5);
  const ny = useMotionValue(0.42);
  const aspect = useMotionValue(1.6);

  const gazeX = useSpring(nx, spring.gaze);
  const gazeY = useSpring(ny, spring.gaze);
  const cameraX = useSpring(nx, spring.soft);
  const cameraY = useSpring(ny, spring.soft);

  const value = useMemo<PointerState>(
    () => ({ nx, ny, aspect, gazeX, gazeY, cameraX, cameraY }),
    [nx, ny, aspect, gazeX, gazeY, cameraX, cameraY],
  );

  useEffect(() => {
    let frame = 0;
    let pendingX = 0.5;
    let pendingY = 0.42;

    const flush = () => {
      frame = 0;
      nx.set(pendingX);
      ny.set(pendingY);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onPointerMove = (event: PointerEvent) => {
      pendingX = event.clientX / window.innerWidth;
      pendingY = event.clientY / window.innerHeight;
      schedule();
    };

    // Sur mobile : l'inclinaison remplace le curseur, sinon la scène reste figée.
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      pendingX = 0.5 + Math.max(-1, Math.min(1, event.gamma / 40)) * 0.5;
      pendingY = 0.42 + Math.max(-1, Math.min(1, (event.beta - 45) / 40)) * 0.3;
      schedule();
    };

    const onResize = () => aspect.set(window.innerWidth / window.innerHeight);

    onResize();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("resize", onResize);
    };
  }, [nx, ny, aspect]);

  return <PointerContext.Provider value={value}>{children}</PointerContext.Provider>;
}

export function usePointer(): PointerState {
  const context = useContext(PointerContext);
  if (!context) throw new Error("usePointer doit être utilisé dans <PointerProvider>");
  return context;
}
