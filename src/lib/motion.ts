import type { Transition } from "motion/react";

/**
 * Vocabulaire d'animation du site. Un seul endroit pour régler le "toucher".
 * Tout est en spring : aucune durée fixe sauf pour les fondus purement optiques.
 */
export const spring = {
  /** Micro-interactions : survol, pression, bascules. */
  snappy: { type: "spring", stiffness: 420, damping: 32, mass: 0.6 },
  /** Déplacements d'objets : élèves, pupitres, caméra. */
  soft: { type: "spring", stiffness: 140, damping: 20, mass: 0.9 },
  /** Battants de la porte : très lourds. Le débattement doit rester lisible
      pendant plus d'une seconde — c'est le seul moment où l'on voit la salle
      se découvrir derrière le bois. */
  door: { type: "spring", stiffness: 16, damping: 11, mass: 3.2 },
  /** Ouverture de la fiche projet. */
  modal: { type: "spring", stiffness: 240, damping: 26, mass: 0.8 },
  /** Suivi du regard : rapide mais amorti, jamais nerveux. */
  gaze: { stiffness: 110, damping: 18, mass: 0.4 },
} satisfies Record<string, Transition | object>;

/** Courbe « expo out » d'Apple : sort vite, se pose en douceur. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/**
 * Courbe de travelling : démarre lentement, puis accélère sans jamais
 * ralentir. Une caméra qui franchit une porte prend de la vitesse — un
 * « expo out », qui fait l'inverse, expédie tout le mouvement dans le premier
 * cinquième de la durée et donne l'impression d'une coupe, pas d'une avancée.
 */
export const easeDolly = [0.55, 0, 0.85, 0.35] as const;

/** Décalage entre deux élèves qui prennent place. */
export const STAGGER = 0.085;
