"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { projects } from "@/data/projects";
import { easeOutExpo } from "@/lib/motion";
import { buildSeating, buildTiers, DESK_WIDTH } from "@/lib/seating";
import { usePortrait } from "@/hooks/useMediaQuery";
import type { Project } from "@/types/project";
import { StudentCard } from "@/components/students/StudentCard";
import { Background } from "./Background";
import { CameraAnimation } from "./CameraAnimation";
import { LightEffects } from "./LightEffects";

/**
 * La salle : décor, gradins, promotion.
 *
 * Trois plans se superposent, chacun avec sa propre amplitude de caméra.
 * Le décor bouge à 0,4, les élèves à 1,2 : c'est ce différentiel qui donne
 * la profondeur, et il ne coûte que deux `transform` composités.
 */
export function Classroom({ onSelect }: { onSelect: (project: Project) => void }) {
  /* Le format décide de la disposition : plus de rangs et moins d'élèves par
     rang sur un téléphone tenu droit, sans quoi les pupitres deviennent trop
     étroits pour que leur plaque reste lisible. */
  const layout = usePortrait() ? "portrait" : "landscape";
  const seats = useMemo(() => buildSeating(projects.length, layout), [layout]);
  const tiers = useMemo(() => buildTiers(projects.length, layout), [layout]);

  return (
    /* Fondu seul, sans mise à l'échelle : la salle apparaît pendant que le
       chambranle grandit, et deux plans plein écran ne peuvent pas se
       transformer en même temps sans faire tomber la cadence. Le mouvement
       d'avancée est déjà porté par le dolly de la porte. */
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: easeOutExpo }}
    >
      <CameraAnimation depth={0.4} className="absolute inset-0">
        <Background />
      </CameraAnimation>

      <div className="absolute inset-0" style={{ perspective: "130vmax" }}>
        <CameraAnimation depth={1.2} className="absolute inset-0">
          {/* Gradins : une marche entre chaque rangée. */}
          {tiers.map((tier, row) => {
            if (row === 0) return null;
            const riser = (tiers[row - 1].y - tier.y) * 0.42;
            return (
              <div
                key={tier.y}
                /* Décor pur : sans `pointer-events-none`, la marche happait
                   les clics destinés aux élèves du rang juste en dessous. */
                className="pointer-events-none absolute inset-x-[-8%]"
                style={{
                  top: `${tier.y}%`,
                  height: `${riser}%`,
                  zIndex: (tiers.length - row) * 10 - 5,
                }}
              >
                <div className="material-oak absolute inset-x-0 top-0 h-[22%] shadow-[0_0.4vmax_0.8vmax_rgba(0,0,0,0.6)]" />
                <div className="material-walnut absolute inset-x-0 bottom-0 top-[22%]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              </div>
            );
          })}

          {projects.map((project, index) => (
            <StudentCard
              key={project.id}
              project={project}
              seat={seats[index]}
              index={index}
              deskWidth={DESK_WIDTH[layout]}
              onSelect={onSelect}
            />
          ))}
        </CameraAnimation>
      </div>

      {/* Avant-plan : le bord de l'estrade, juste sous la caméra.
          C'est lui qui place le visiteur *dans* la salle plutôt que devant.
          Il parallaxe deux fois plus que les élèves — le décalage suffit à
          faire lire le premier plan, sans aucun flou animé. */}
      <CameraAnimation depth={2.4} className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-[-16%] bottom-0 h-[19%]"
          style={{
            backgroundImage:
              "linear-gradient(to top, #150c04 45%, rgba(21,12,4,0.88) 74%, transparent 100%)",
          }}
        />
        <div className="absolute inset-x-[-16%] bottom-[18.4%] h-[0.4%] bg-[#8a5c34]/35 blur-[3px]" />
      </CameraAnimation>

      <LightEffects />
    </motion.div>
  );
}
