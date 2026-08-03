"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { teacher } from "@/data/projects";
import { easeOutExpo } from "@/lib/motion";

/**
 * Interface de la salle : titre, consigne, et rien d'autre.
 *
 * Le composant est monté dès l'ouverture de la porte mais ne se révèle qu'une
 * fois le seuil franchi : construire ce bloc à l'arrivée coûtait une frame,
 * et le laisser visible plus tôt le faisait transparaître dans l'embrasure.
 *
 * Le titre porte `tabIndex={-1}` et reçoit le focus au moment de la révélation :
 * sans cela, la disparition du bouton « Entrer » renverrait le focus clavier
 * sur `<body>` et le contexte serait perdu pour un lecteur d'écran.
 */
export function RoomHud({
  visible,
  hintVisible,
}: {
  visible: boolean;
  hintVisible: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (visible) headingRef.current?.focus();
  }, [visible]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      // Invisible *et* hors de l'arbre d'accessibilité tant qu'on n'est pas entré.
      aria-hidden={!visible}
    >
      <motion.div
        /* Sur petit écran le titre descend sous le bouton d'ambiance : le
           cartouche occupe toute la largeur utile au lieu de se faire rogner
           par une marge réservée au coin haut droit. */
        className="absolute left-1/2 top-[8.5vh] w-[min(94vw,58rem)] -translate-x-1/2 px-4 text-center sm:top-[3.5vh] sm:px-0"
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -14 }}
        transition={{ delay: visible ? 0.25 : 0, duration: 0.8, ease: easeOutExpo }}
      >
        <div className="cartouche inline-block px-5 py-3 sm:px-9 sm:py-4">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-balance font-display text-[clamp(1.4rem,2.6vmax,2.4rem)] leading-tight tracking-wide text-[#ffe9c4] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] outline-none"
          >
            La salle de cours d&apos;{teacher.name}
          </h1>
          <p className="mt-2.5 hidden whitespace-nowrap text-[clamp(0.55rem,0.95vmax,0.82rem)] uppercase tracking-[0.26em] text-[#f3d7a8]/75 sm:block">
            {teacher.roles.join(" • ")}
          </p>
        </div>
      </motion.div>

      <motion.p
        className="absolute bottom-[4vh] left-1/2 w-[min(88vw,44rem)] -translate-x-1/2 text-balance text-center text-[0.95rem] tracking-wide sm:text-[clamp(0.8rem,1.1vmax,0.95rem)] text-[#f3d7a8]/75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        initial={false}
        animate={{ opacity: visible && hintVisible ? 1 : 0 }}
        transition={{ delay: visible && hintVisible ? 1.1 : 0, duration: 0.7, ease: easeOutExpo }}
      >
        Chaque élève est un projet — survolez-le, puis cliquez pour ouvrir sa fiche.
      </motion.p>
    </div>
  );
}
