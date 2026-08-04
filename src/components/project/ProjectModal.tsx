"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useGaze } from "@/hooks/useGaze";
import { easeOutExpo, spring } from "@/lib/motion";
import { StudentCharacter } from "@/components/students/StudentCharacter";
import type { Personality, Project } from "@/types/project";
import { ProjectLogo } from "./ProjectLogo";
import { ProjectVisual } from "./ProjectVisual";

const TEMPERAMENT: Record<Personality, string> = {
  athletic: "Énergique",
  elegant: "Élégant",
  romantic: "Romantique",
  creative: "Créatif",
  trustworthy: "Fiable",
  analytical: "Analytique",
  resourceful: "Débrouillard",
};

/**
 * Fiche projet.
 *
 * Contraste : le bouton d'action reprend `colors.ink` sur `colors.surface`,
 * soit systématiquement du très sombre sur du très clair. Utiliser `primary`
 * en fond aurait produit des ratios sous le seuil AA sur la moitié des projets.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project ? <ModalContent project={project} onClose={onClose} /> : null}
    </AnimatePresence>
  );
}

function ModalContent({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const gaze = useGaze({ x: 28, y: 52 }, 1.1);
  useFocusTrap(dialogRef, onClose);

  const {
    colors,
    name,
    discipline,
    shortDescription,
    website,
    personality,
    inProgress,
  } = project;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
      <motion.button
        type="button"
        className="absolute inset-0 cursor-default bg-[#0b0704]/90 sm:bg-[#0b0704]/75 sm:backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: easeOutExpo }}
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-${project.id}-title`}
        className="relative w-full max-w-4xl overflow-hidden rounded-[28px] shadow-[0_40px_120px_rgba(0,0,0,0.75)]"
        style={{ backgroundColor: colors.surface }}
        initial={{ opacity: 0, y: 34, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 22, scale: 0.96 }}
        transition={spring.modal}
      >
        <div className="grid md:grid-cols-[1.02fr_1fr]">
          {/* Grand visuel + l'élève, tiré de son pupitre. */}
          <div className="relative aspect-[16/11] md:aspect-auto md:min-h-[26rem]">
            <ProjectVisual project={project} />
            <div className="absolute bottom-0 left-1/2 w-[62%] max-w-[19rem] -translate-x-1/2 drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)]">
              <StudentCharacter
                project={project}
                gaze={gaze}
                active
                blinkDelay={0.6}
                uid={`modal-${project.id}`}
              />
            </div>
          </div>

          {/* Contenu. */}
          <div
            className="flex flex-col gap-5 p-7 sm:p-9"
            style={{ color: colors.ink }}
          >
            <div className="flex items-center gap-4">
              <ProjectLogo project={project} className="h-14 w-14 shrink-0" />
              <div className="min-w-0">
                <h2
                  id={`project-${project.id}-title`}
                  className="font-display text-3xl leading-none tracking-tight sm:text-4xl"
                >
                  {name}
                </h2>
                <p className="mt-1.5 text-sm font-medium opacity-70">
                  {discipline}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className="w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
                style={{
                  backgroundColor: `${colors.primary}1f`,
                  color: colors.ink,
                }}
              >
                {TEMPERAMENT[personality]}
              </span>
              {inProgress ? (
                <span
                  className="flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{
                    backgroundColor: `${colors.ink}14`,
                    color: colors.ink,
                  }}
                >
                  <span
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                  En cours
                </span>
              ) : null}
            </div>

            <p className="text-[1.0625rem] leading-relaxed opacity-90">
              {shortDescription}
            </p>

            {/* Sans adresse renseignée, on le dit — plutôt qu'un lien mort. */}
            {website ? (
              <>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-auto inline-flex w-fit items-center gap-2.5 rounded-full px-6 py-3.5 text-[0.95rem] font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    backgroundColor: colors.ink,
                    color: colors.surface,
                    boxShadow: `0 10px 26px ${colors.primary}55`,
                  }}
                >
                  {/* Un lien App Store ne « découvre » pas un projet, il le
                    télécharge : le libellé doit annoncer ce qui va se passer. */}
                  {website.includes("apps.apple.com")
                    ? "Télécharger sur l'App Store"
                    : "Découvrir le projet"}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 4h6v6" />
                    <path d="M20 4 10.5 13.5" />
                    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                  </svg>
                  <span className="sr-only">(nouvel onglet)</span>
                </a>

                {/* Dit à voix haute ce que seule l'icône suggérait : le visiteur
                  sait qu'il pourra revenir. `aria-hidden` évite de le répéter
                  aux lecteurs d'écran, qui l'entendent déjà dans le nom du
                  lien. */}
                <p
                  aria-hidden="true"
                  className="text-xs leading-snug opacity-55"
                >
                  S&apos;ouvre dans un nouvel onglet — le portfolio reste
                  ouvert.
                </p>
              </>
            ) : (
              <p
                className="mt-auto inline-flex w-fit items-center gap-2.5 rounded-full px-6 py-3.5 text-[0.95rem] font-semibold"
                style={{
                  backgroundColor: `${colors.ink}12`,
                  color: colors.ink,
                }}
              >
                Bientôt en ligne
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/65"
          aria-label="Fermer la fiche projet"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4.5 w-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
