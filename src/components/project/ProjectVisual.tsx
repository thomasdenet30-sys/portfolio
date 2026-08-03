import Image from "next/image";
import { asset } from "@/lib/site";
import type { ImageSpec, Project } from "@/types/project";

/** Motifs de fond, dessinés dans une grille 100 × 100 étirée à la demande. */
function Motif({ motif }: { motif: ImageSpec["motif"] }) {
  switch (motif) {
    case "grid":
      return (
        <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.5">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />
          ))}
        </g>
      );

    case "arcs":
      return (
        <g fill="none" stroke="#ffffff" strokeOpacity="0.24" strokeWidth="1.6">
          {[18, 32, 46, 60, 74].map((r) => (
            <path key={r} d={`M${100 - r} 100A${r} ${r} 0 0 1 100 ${100 - r}`} />
          ))}
        </g>
      );

    case "rings":
      return (
        <g fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.2">
          {[10, 20, 30, 40, 52].map((r) => (
            <circle key={r} cx="72" cy="30" r={r} />
          ))}
        </g>
      );

    case "waves":
      return (
        <g fill="none" stroke="#ffffff" strokeOpacity="0.24" strokeWidth="1.4">
          {[20, 36, 52, 68, 84].map((y) => (
            <path key={y} d={`M-5 ${y}Q20 ${y - 12} 45 ${y}T95 ${y}T145 ${y}`} />
          ))}
        </g>
      );

    case "shield":
    default:
      return (
        <g fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.3">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${50 - i * 12} ${8 + i * 6}L${72 + i * 8} ${20 + i * 6}v${16 + i * 6}c0 ${18 + i * 5} -${10 + i * 3} ${26 + i * 6} -${22 + i * 8} ${32 + i * 6}`}
            />
          ))}
        </g>
      );
  }
}

/**
 * Grand visuel de la fiche projet : le dégradé de la marque, son motif, et son
 * logo posé en haut à gauche comme sur une plaque.
 *
 * Trois niveaux de repli, du plus fidèle au plus générique : le logotype du
 * site s'il existe, sinon l'icône de l'application, sinon l'initiale géante.
 */
export function ProjectVisual({ project }: { project: Project }) {
  const { image, logo, colors } = project;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundImage: `linear-gradient(145deg, ${image.from} 0%, ${image.to} 100%)` }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <Motif motif={image.motif} />
      </svg>

      {/* Sans vrai logo : l'initiale géante, débordant volontairement du cadre.
          Elle reste sous le voile lumineux, c'est une texture. */}
      {!logo.wordmark && !logo.icon ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[14%] -right-[4%] select-none font-display leading-none text-white/20"
          style={{ fontSize: "min(34vh, 22rem)" }}
        >
          {logo.glyph}
        </span>
      ) : null}

      {/* Lumière chaude : le visuel reste dans l'ambiance de la salle. Le halo
          clair est décalé vers la droite pour ne pas délaver le logo, posé en
          haut à gauche. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(62% 55% at 72% 16%, rgba(255,255,255,0.26), transparent 68%), linear-gradient(200deg, transparent 40%, ${colors.ink}66 100%)`,
        }}
      />

      {/* Le logo passe *au-dessus* du voile lumineux — dessous, un logotype
          clair se délavait jusqu'à disparaître — et au-dessus du personnage,
          rendu par la fiche juste après ce composant : sans `z-10` il lui
          mangeait la fin du mot, très visible sur mobile où le panneau est bas.
          Le cadre est dimensionné en largeur avec un rapport fixe ; une hauteur
          en pourcentage réduisait le logotype à quelques pixels. */}
      {logo.wordmark ? (
        <div
          className="absolute left-[5%] top-[6%] z-10 w-[66%] drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]"
          style={{ aspectRatio: "4 / 1" }}
        >
          <Image
            src={asset(logo.wordmark)}
            alt=""
            fill
            sizes="(max-width: 768px) 60vw, 24rem"
            priority
            className="object-contain object-left"
          />
        </div>
      ) : logo.icon ? (
        <div className="absolute left-[6%] top-[7%] z-10 aspect-square w-[21%] overflow-hidden rounded-[23%] shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
          <Image
            src={asset(logo.icon)}
            alt=""
            fill
            sizes="(max-width: 768px) 20vw, 8rem"
            priority
            className="object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
