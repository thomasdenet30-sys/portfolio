import Image from "next/image";
import { asset } from "@/lib/site";
import type { LogoSpec, Project } from "@/types/project";

/** Marques géométriques, toutes dessinées dans une grille 24 × 24. */
const MARKS: Record<LogoSpec["mark"], string> = {
  bolt: "M13.4 2 4 14.2h5.6L8.6 22 19 9.6h-5.7z",
  roof: "M2.6 11.2 12 3.4l9.4 7.8v8.4a1.2 1.2 0 0 1-1.2 1.2h-4.9v-6.2H8.7v6.2H3.8a1.2 1.2 0 0 1-1.2-1.2z",
  heart: "M12 21.2s-8.4-5.1-8.4-10.4A4.8 4.8 0 0 1 12 7.6a4.8 4.8 0 0 1 8.4 3.2c0 5.3-8.4 10.4-8.4 10.4z",
  spark: "M12 2.2l2.3 6.6 6.6 2.3-6.6 2.3L12 20l-2.3-6.6L3.1 11.1l6.6-2.3z",
  shield: "M12 2.2 20.3 5.4v6.2c0 5.2-3.5 9.6-8.3 11.4-4.8-1.8-8.3-6.2-8.3-11.4V5.4z",
  chart:
    "M3 20.2h18v1.9H3zM4.6 13.4h3.2v5.2H4.6zM10.4 8.6h3.2v10h-3.2zM16.2 4.2h3.2v14.4h-3.2z",
  tag: "M11.2 2.4H21a.8.8 0 0 1 .8.8v9.8L11.5 23.2 1.9 13.6zM17.4 6a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z",
  bulb: "M12 1.8a7 7 0 0 0-4 12.7v2.3h8v-2.3A7 7 0 0 0 12 1.8zM8.6 18.4h6.8v1.9H8.6zM9.6 21.4h4.8v1.4H9.6z",
};

/**
 * Pastille de logo.
 *
 * Quand le projet a une vraie icône, on l'affiche telle quelle : elle porte
 * déjà son fond, sa forme et son ombre, et la recolorer trahirait la marque.
 * Sinon, on retombe sur la marque dessinée, dans le dégradé du projet.
 */
export function ProjectLogo({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const { colors, logo, name } = project;

  if (logo.icon) {
    return (
      <span
        className={`relative block overflow-hidden rounded-[23%] shadow-[0_2px_10px_rgba(0,0,0,0.25)] ${className ?? ""}`}
        /* Fond aux couleurs de la marque pendant le chargement : le carré ne
           clignote pas en blanc, il apparaît déjà à la bonne teinte. */
        style={{ backgroundColor: colors.primary }}
      >
        <Image
          src={asset(logo.icon)}
          alt={`Logo ${name}`}
          fill
          sizes="80px"
          /* La fiche ne se monte qu'au clic : un chargement paresseux ajoute
             ici un temps mort visible, alors que l'image est déjà à l'écran. */
          priority
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={`relative inline-grid place-items-center overflow-hidden rounded-[28%] ${className ?? ""}`}
      style={{
        backgroundImage: `linear-gradient(140deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 6px rgba(0,0,0,0.28), 0 2px 10px ${colors.primary}55`,
      }}
      role="img"
      aria-label={`Logo ${name}`}
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
        <path d={MARKS[logo.mark]} fill="#ffffff" fillOpacity="0.95" />
      </svg>
      {/* Reflet vitré en diagonale. */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
    </span>
  );
}
