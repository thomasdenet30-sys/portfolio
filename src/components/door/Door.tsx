"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { easeDolly, easeOutExpo, spring } from "@/lib/motion";
import { DoorLeaf } from "./DoorLeaf";
import { DoorPlaque } from "./DoorPlaque";

interface DoorProps {
  /** Vrai dès le clic : déclenche toute la séquence d'ouverture. */
  open: boolean;
  onEnter: () => void;
  /** Déclenché au survol de la poignée, pour précharger la salle. */
  onPrefetch: () => void;
  /** Appelé quand la caméra a fini de franchir la porte. */
  onEntered: () => void;
}

/**
 * Le seuil : couloir sombre, chambranle cintré, double vantail de chêne.
 *
 * Chorégraphie du clic :
 *   0,00 s  la béquille s'abaisse, le loquet claque
 *   0,15 s  les vantaux partent vers l'intérieur (ressort lourd)
 *   0,15 s  la lumière de la salle envahit la baie
 *   1,00 s  la caméra avance ; couloir, grain et vantaux s'effacent
 *   2,50 s  `onEntered` — le seuil peut être démonté
 *
 * ── Pourquoi seul le chambranle grandit ──────────────────────────────────
 * La première version mettait à l'échelle le plan plein écran tout entier.
 * Chaque frame obligeait alors le moteur à recalculer le masque du couloir,
 * le grain en `mix-blend-mode` et trois flous, à une taille chaque fois
 * différente : l'ouverture tombait à 24 images par seconde.
 *
 * Désormais le couloir, le grain et le vignettage ne bougent plus — ils se
 * contentent de disparaître — et le dolly ne porte que sur le chambranle,
 * une surface dix fois plus petite. Les vantaux s'effacent dès que la caméra
 * s'élance : ils ont fini de tourner, et leur sous-arbre 3D n'a plus à être
 * redessiné pendant l'agrandissement.
 */
export function Door({ open, onEnter, onPrefetch, onEntered }: DoorProps) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  const arm = () => {
    setHovered(true);
    onPrefetch();
  };

  /** Tout ce qui doit s'effacer au moment où la caméra s'élance. */
  const fadeOnDolly = {
    initial: false as const,
    animate: { opacity: open ? 0 : 1 },
    transition: { duration: 0.6, delay: open && !reduced ? 1 : 0, ease: easeOutExpo },
  };

  return (
    <div className="door-scene fixed inset-0 z-30 grid place-items-center overflow-hidden">
      {/* Couloir : lambris presque noirs, percés de la baie.
          Il ne subit aucune transformation — seulement un fondu. */}
      <motion.div className="corridor-mask absolute inset-0" aria-hidden="true" {...fadeOnDolly}>
        <div className="absolute inset-0 bg-[#0b0704]" />
        <div className="material-walnut absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[#080502]/70" />

        {/* Sol du couloir, en fuite vers la porte. */}
        <div
          className="material-floor absolute inset-x-[-30%] bottom-0 h-[34%] opacity-45"
          style={{ maskImage: "linear-gradient(to top, #000 10%, transparent 100%)" }}
        />
      </motion.div>

      {/* Flaque de lumière qui s'échappe sous les vantaux (hors masque : elle
          déborde sur le sol du couloir, devant la porte). */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[26%] w-[70%] -translate-x-1/2 rounded-[50%] blur-3xl"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(255,193,118,0.5), transparent 100%)",
        }}
        initial={false}
        animate={{ opacity: open ? 0 : 0.5 }}
        transition={{ duration: 0.8, ease: easeOutExpo }}
      />

      {/* ── Le dolly : cette couche seule est mise à l'échelle ───────────── */}
      <motion.div
        className="relative"
        style={{
          width: "var(--door-w)",
          aspectRatio: "0.7",
          /* La perspective est portée ici, et non par le plein écran : ce
             conteneur peut ainsi aplatir son sous-arbre pour l'agrandir sans
             priver les vantaux de leur profondeur. */
          perspective: "120vmax",
          /* Promotion en couche composée dès le survol, pas au clic : faite au
             moment du départ, elle coûtait une frame pile quand le mouvement
             commence. Ici elle est payée pendant que la main s'approche. */
          willChange: hovered || open ? "transform, opacity" : "auto",
        }}
        initial={false}
        animate={open ? { scale: reduced ? 1 : 2.8, opacity: 0 } : { scale: 1, opacity: 1 }}
        /* Échelle et opacité sont dissociées : le chambranle doit grossir
           franchement *avant* de s'effacer, sinon on ne voit pas qu'on le
           franchit — il se contente de disparaître. */
        transition={
          reduced
            ? { duration: 0.4, ease: easeOutExpo }
            : {
                // La caméra ne s'élance qu'une fois les vantaux bien écartés.
                scale: { duration: 1.5, delay: open ? 1 : 0, ease: easeDolly },
                opacity: { duration: 0.95, delay: open ? 1.55 : 0, ease: "linear" },
              }
        }
        onAnimationComplete={() => open && onEntered()}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {/* Encadrement et feuillure sont eux aussi évidés : sans cela, ces deux
              aplats opaques reboucheraient la baie derrière les vantaux. */}
          <div
            className="corridor-mask material-oak absolute -inset-[4%] rounded-t-[50%_42%] shadow-[0_3vmax_8vmax_rgba(0,0,0,0.9)]"
            aria-hidden="true"
          />
          <div
            className="corridor-mask absolute -inset-[1%] rounded-t-[50%_42%] bg-[#160c05]"
            aria-hidden="true"
          />
          {/* Clé de voûte. */}
          <div
            className="material-oak absolute left-1/2 top-[-9%] h-[7%] w-[13%] -translate-x-1/2 rounded-b-[5px] shadow-[0_1vmax_2vmax_rgba(0,0,0,0.8)]"
            aria-hidden="true"
          />

          {/* Baie : la salle est visible au travers, donc rien d'opaque ici.
              Seulement la lumière qu'elle projette, en fondu additif. */}
          <div className="absolute inset-0 overflow-hidden rounded-t-[50%_42%]" aria-hidden="true">
            <motion.div
              className="absolute inset-0 mix-blend-screen"
              style={{
                backgroundImage:
                  "radial-gradient(62% 56% at 50% 42%, rgba(255,238,203,0.5) 0%, rgba(255,199,132,0.28) 38%, rgba(190,110,50,0.1) 70%, transparent 100%)",
              }}
              initial={false}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 1.1, delay: open ? 0.15 : 0, ease: easeOutExpo }}
            />
          </div>

          {/* Les deux vantaux. Ils s'effacent quand la caméra s'élance : leur
              rotation est terminée, ils sont vus par la tranche, et leur
              sous-arbre 3D n'a plus à suivre l'agrandissement. */}
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
            initial={false}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.45, delay: open && !reduced ? 1 : 0, ease: easeOutExpo }}
          >
            <DoorLeaf side="left" open={open} hovered={hovered} pressed={open} />
            <DoorLeaf side="right" open={open} hovered={hovered} pressed={open} />
          </motion.div>
        </div>

        {/* Filet de lumière sous la porte, avant même l'ouverture. */}
        <motion.div
          className="absolute -bottom-[1%] left-[6%] h-[1.4%] w-[88%] rounded-full bg-[#ffc985] blur-[6px]"
          aria-hidden="true"
          initial={false}
          animate={{ opacity: open ? 0 : hovered ? 0.95 : 0.6 }}
          transition={spring.snappy}
        />

        {/* Plaque : à cheval sur les deux vantaux, donc rendue au-dessus. */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[18%] w-[62%] -translate-x-1/2"
          initial={false}
          animate={open ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
        >
          <DoorPlaque />
        </motion.div>

        {/* Commande unique : c'est elle qui porte l'accessibilité. */}
        <motion.button
          type="button"
          className="absolute inset-x-[10%] bottom-[14%] top-[42%] cursor-pointer rounded-2xl"
          onPointerEnter={arm}
          onPointerLeave={() => setHovered(false)}
          onFocus={arm}
          onBlur={() => setHovered(false)}
          onClick={onEnter}
          disabled={open}
          initial={false}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <motion.span
            className="absolute inset-x-0 bottom-0 block"
            animate={{ y: hovered ? -6 : 0 }}
            transition={spring.snappy}
          >
            <span className="font-display text-[calc(var(--door-w)*0.056)] leading-none tracking-wide text-[#ffe6bd] drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Entrer dans la salle
            </span>
            <span className="mx-auto mt-[calc(var(--door-w)*0.025)] block h-px w-[46%] bg-[#ffd79a]/50" />
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Vignettage et grain du couloir : fixes, ils ne font que s'effacer. */}
      <motion.div
        className="vignette grain pointer-events-none absolute inset-0"
        aria-hidden="true"
        {...fadeOnDolly}
      />
    </div>
  );
}
