"use client";

import { motion, useTransform } from "motion/react";
import type { Gaze } from "@/hooks/useGaze";
import { spring } from "@/lib/motion";
import type { Personality, Project } from "@/types/project";
import { Accessory } from "./accessories";
import { Hair } from "./hair";

/** Les deux bouches partagent la même structure de commandes : `d` est donc interpolable. */
const MOUTH_NEUTRAL = "M58 78Q70 82 82 78";
const MOUTH_SMILE = "M55 75Q70 91 85 75";

/** Posture au repos : deux degrés suffisent à distinguer un tempérament. */
const POSTURE: Record<Personality, { rotate: number; y: number; brow: number }> = {
  athletic: { rotate: -1.5, y: -1, brow: -1.5 },
  elegant: { rotate: 0, y: 0, brow: 0 },
  romantic: { rotate: 3, y: 0, brow: -0.5 },
  creative: { rotate: -2.5, y: -0.5, brow: -1 },
  trustworthy: { rotate: 0, y: 0, brow: 0.5 },
  /** Penché en avant, sourcils bas : concentré sur ses chiffres. */
  analytical: { rotate: 1.5, y: 0.5, brow: 1 },
  /** Tête inclinée, sourcils hauts : à l'affût. */
  resourceful: { rotate: -3.5, y: -1, brow: -2 },
};

interface StudentCharacterProps {
  project: Project;
  /** Direction du regard, fournie par `useGaze`. */
  gaze: Gaze;
  /** Vrai au survol / focus : l'élève se redresse et sourit. */
  active: boolean;
  /** Décalage du clignement, pour que la classe ne cligne pas à l'unisson. */
  blinkDelay: number;
  /** Suffixe des `id` de dégradé : un même élève peut être rendu deux fois. */
  uid?: string;
}

/**
 * Un élève, entièrement dessiné à partir de `project.avatar` et `project.colors`.
 *
 * Aucune image : le SVG est la seule source. Le regard et le sourire sont pilotés
 * par des MotionValues, donc animés hors du cycle de rendu de React.
 */
export function StudentCharacter({
  project,
  gaze,
  active,
  blinkDelay,
  uid,
}: StudentCharacterProps) {
  const { avatar, id, personality } = project;
  const posture = POSTURE[personality];
  const scope = uid ?? id;

  const pupilX = useTransform(gaze.x, (value) => value * 2.7);
  const pupilY = useTransform(gaze.y, (value) => value * 2);
  const headX = useTransform(gaze.x, (value) => value * 2.4);
  const headRotate = useTransform(gaze.x, (value) => posture.rotate + value * 3);

  const skinShade = `skin-${scope}`;
  const outfitShade = `outfit-${scope}`;
  const isRomantic = personality === "romantic";

  return (
    <svg
      viewBox="0 0 140 132"
      className="h-full w-full overflow-visible"
      role="presentation"
      focusable="false"
    >
      <defs>
        <radialGradient id={skinShade} cx="34%" cy="24%" r="82%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id={outfitShade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* La respiration est une keyframe CSS sur un groupe distinct : elle ne se
          bat pas avec le `transform` inline posé par Motion juste en dessous. */}
      <g
        className="animate-breathe"
        style={{
          transformOrigin: "70px 130px",
          transformBox: "view-box",
          animationDelay: `${blinkDelay * 0.7}s`,
        }}
      >
      <motion.g
        style={{ transformOrigin: "70px 130px", transformBox: "view-box" }}
        animate={{ y: active ? posture.y - 3.5 : posture.y, scale: active ? 1.035 : 1 }}
        transition={spring.snappy}
      >
        {/* ── Buste ─────────────────────────────────────────────── */}
        <path d="M8 132C10 110 34 97 70 97C106 97 130 110 132 132Z" fill={avatar.outfit} />
        <path d="M8 132C10 110 34 97 70 97C106 97 130 110 132 132Z" fill={`url(#${outfitShade})`} />
        <path d="M56 98C60 107 80 107 84 98C84 98 78 113 70 113C62 113 56 98 56 98Z" fill="rgba(0,0,0,0.22)" />

        {/* ── Cou ───────────────────────────────────────────────── */}
        <path d="M60 76H80V95C80 101 60 101 60 95Z" fill={avatar.skin} />
        <ellipse cx="70" cy="82" rx="15" ry="8" fill="rgba(0,0,0,0.18)" />

        {/* ── Tête ──────────────────────────────────────────────── */}
        <motion.g
          style={{
            x: headX,
            rotate: headRotate,
            transformOrigin: "70px 92px",
            transformBox: "view-box",
          }}
        >
          <ellipse cx="39" cy="60" rx="6" ry="9" fill={avatar.skin} />
          <ellipse cx="101" cy="60" rx="6" ry="9" fill={avatar.skin} />

          <ellipse cx="70" cy="54" rx="31" ry="35" fill={avatar.skin} />
          <ellipse cx="70" cy="54" rx="31" ry="35" fill={`url(#${skinShade})`} />

          <Hair spec={avatar} />

          {/* Sourcils : ils montent au survol, c'est 80 % de l'expression. */}
          <motion.g
            stroke={avatar.hair}
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
            animate={{ y: active ? posture.brow - 3 : posture.brow }}
            transition={spring.snappy}
          >
            <path d="M46 43Q56 37 66 42" />
            <path d="M74 42Q84 37 94 43" />
          </motion.g>

          {/* Yeux : blanc, pupille qui suit le curseur, paupière qui cligne. */}
          {[56.5, 83.5].map((cx, index) => (
            <g key={cx}>
              <ellipse cx={cx} cy="56" rx="8.2" ry="6.6" fill="#fdf8f2" />
              <motion.g style={{ x: pupilX, y: pupilY }}>
                <circle cx={cx} cy="56" r="4" fill="#2a1c12" />
                <circle cx={cx - 1.4} cy="54.4" r="1.5" fill="#ffffff" fillOpacity="0.9" />
              </motion.g>
              <ellipse
                className="animate-blink"
                cx={cx}
                cy="56"
                rx="8.6"
                ry="7"
                fill={avatar.skin}
                style={{ "--blink-delay": `${blinkDelay + index * 0.04}s` } as React.CSSProperties}
              />
              {/* Ligne de cils : discrète, sinon elle se lit comme un second
                  sourcil et le visage paraît fermé. */}
              <path
                d={`M${cx - 8.2} 55.4Q${cx} ${48.8} ${cx + 8.2} 55.4`}
                fill="none"
                stroke="rgba(0,0,0,0.22)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          ))}

          <path
            d="M70 58Q66 68 71.5 69.5"
            fill="none"
            stroke="rgba(0,0,0,0.26)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <motion.path
            initial={false}
            animate={{ d: active ? MOUTH_SMILE : MOUTH_NEUTRAL }}
            transition={spring.snappy}
            fill="none"
            stroke="rgba(74,32,20,0.72)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Le fard est toujours rosé : l'indexer sur `colors.accent`
              donnerait des joues vert néon ou cyan selon le projet. */}
          <motion.g
            fill="#e0687f"
            initial={false}
            animate={{ opacity: isRomantic ? 0.42 : active ? 0.26 : 0 }}
            transition={spring.snappy}
          >
            <ellipse cx="48" cy="71" rx="7.5" ry="4.2" />
            <ellipse cx="92" cy="71" rx="7.5" ry="4.2" />
          </motion.g>
        </motion.g>

        <Accessory project={project} />
      </motion.g>
      </g>
    </svg>
  );
}
