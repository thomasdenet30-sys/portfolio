"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useGaze } from "@/hooks/useGaze";
import { easeOutExpo, spring, STAGGER } from "@/lib/motion";
import type { Seat } from "@/lib/seating";
import type { Project } from "@/types/project";
import { Desk } from "./Desk";
import { StudentCharacter } from "./StudentCharacter";

interface StudentCardProps {
  project: Project;
  seat: Seat;
  index: number;
  /** Largeur du pupitre, décidée par le format de l'écran. */
  deskWidth: string;
  onSelect: (project: Project) => void;
}

/**
 * Un élève à sa place : personnage, pupitre et plaque gravée.
 *
 * Le composant est un `<button>`, donc survol et focus clavier déclenchent la
 * même réaction : l'amphithéâtre est navigable au clavier sans code en plus.
 *
 * Les transformations sont réparties sur quatre couches imbriquées — placement
 * statique, entrée en scène, réaction au survol — pour qu'aucune animation
 * n'écrase le `transform` d'une autre.
 */
export function StudentCard({ project, seat, index, deskWidth, onSelect }: StudentCardProps) {
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  // Le regard part de la tête, pas du sol : d'où le décalage vertical.
  const gaze = useGaze({ x: seat.x, y: seat.y - 11 * seat.scale });
  const plaqueName = project.shortName ?? project.name;

  return (
    /* 1 · Ancrage : le point au sol de la place. */
    <div className="absolute" style={{ left: `${seat.x}%`, top: `${seat.y}%`, zIndex: seat.z + (active ? 5 : 0) }}>
      {/* 2 · Placement statique : recentrage, orientation vers l'estrade, échelle du rang. */}
      <div
        className="-translate-x-1/2 -translate-y-full"
        style={{
          width: deskWidth,
          transform: `rotateY(${seat.turn}deg) scale(${seat.scale})`,
          transformOrigin: "50% 100%",
          // Exposée aux enfants : la gravure se dimensionne sur le pupitre.
          ["--desk-w" as string]: deskWidth,
        }}
      >
        {/* 3 · Entrée en scène, échelonnée d'un élève à l'autre. */}
        <motion.div
          initial={{ opacity: 0, y: 46 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduced ? 0 : 0.35 + index * STAGGER,
            duration: 0.95,
            ease: easeOutExpo,
          }}
        >
          {/* 4 · Réaction au survol / focus. */}
          <motion.button
            type="button"
            className="group relative block w-full cursor-pointer"
            onHoverStart={() => setActive(true)}
            onHoverEnd={() => setActive(false)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            onClick={() => onSelect(project)}
            animate={{ y: active ? -9 : 0 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.soft}
            aria-label={`Ouvrir la fiche du projet ${project.name}${project.inProgress ? ", en cours d'écriture" : ""}`}
          >
            <div className="relative w-full" style={{ aspectRatio: "200 / 176" }}>
              {/* Halo chaud : l'élève interpellé sort de la pénombre. */}
              <motion.div
                className="pointer-events-none absolute left-1/2 top-[4%] h-[72%] w-[130%] -translate-x-1/2 rounded-full blur-2xl"
                style={{ backgroundColor: project.colors.primary }}
                initial={false}
                animate={{ opacity: active ? 0.4 : 0 }}
                transition={spring.snappy}
              />

              {/* Le personnage est rendu avant le pupitre : il passe donc derrière. */}
              <div
                className="absolute left-1/2 top-0 w-[58%] -translate-x-1/2"
                style={{ aspectRatio: "140 / 132" }}
              >
                <StudentCharacter
                  project={project}
                  gaze={gaze}
                  active={active}
                  blinkDelay={index * 1.37}
                />
              </div>

              <div className="absolute bottom-0 left-0 w-full" style={{ aspectRatio: "200 / 100" }}>
                <Desk uid={project.id} accent={project.colors.primary} />
              </div>

              {/* Plaque gravée : en HTML, pour une typographie parfaitement nette. */}
              <div className="absolute bottom-[13%] left-1/2 w-[82%] -translate-x-1/2">
                <div className="material-brass relative rounded-[3px] px-2 py-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <span
                    className="engraved-deep block whitespace-nowrap text-center font-display leading-snug tracking-wide"
                    /* Indexée sur la largeur du pupitre, pas sur le viewport :
                       la plaque en occupe une fraction fixe, la gravure doit
                       suivre la même. Au-delà d'onze caractères elle rétrécit
                       plutôt que de déborder. */
                    style={{
                      fontSize: `calc(var(--desk-w) * ${(0.135 * Math.min(1, 11 / plaqueName.length)).toFixed(4)})`,
                    }}
                  >
                    {plaqueName}
                  </span>
                  {/* Témoin des projets encore en chantier. Le texte complet
                      est dans l'`aria-label` du bouton, pas ici : à l'échelle
                      du dernier rang il serait illisible. */}
                  {project.inProgress ? (
                    <span
                      className="absolute -right-[3%] -top-[18%] block h-[0.55vmax] w-[0.55vmax] rounded-full shadow-[0_0_0.5vmax_currentColor]"
                      style={{ backgroundColor: project.colors.accent, color: project.colors.accent }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
