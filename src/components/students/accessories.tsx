import type { Project } from "@/types/project";

/**
 * Accessoires : c'est ce qui donne son métier à chaque élève.
 * Bandeau = sport, cravate = immobilier, écharpe = rencontre,
 * casque = création, lunettes = sécurité.
 */
export function Accessory({ project }: { project: Project }) {
  const { accessory } = project.avatar;
  const { primary, accent, ink } = project.colors;

  switch (accessory) {
    case "headband":
      return (
        <g>
          <path
            d="M39 45C48 33 92 33 101 45L101 53C92 41 48 41 39 53Z"
            fill={accent}
            stroke={ink}
            strokeOpacity="0.25"
          />
          <path d="M39 45C48 33 92 33 101 45L101 48C92 36 48 36 39 48Z" fill="rgba(255,255,255,0.3)" />
        </g>
      );

    case "tie":
      return (
        <g>
          <path d="M62 99L70 105L78 99L80 108L70 113L60 108Z" fill={accent} />
          <path d="M64 112L70 108L76 112L74 132H66Z" fill={primary} />
          <path d="M64 112L70 108L76 112L75 118L70 115L65 118Z" fill="rgba(255,255,255,0.22)" />
        </g>
      );

    case "scarf":
      return (
        <g>
          <path
            d="M43 99C51 113 89 113 97 99C102 112 97 124 70 124C43 124 38 112 43 99Z"
            fill={accent}
          />
          <path d="M84 118C92 120 96 126 96 132H80C82 127 83 122 84 118Z" fill={primary} />
          <path
            d="M43 106C55 116 85 116 97 106"
            stroke="rgba(0,0,0,0.16)"
            strokeWidth="2.5"
            fill="none"
          />
        </g>
      );

    case "headphones":
      return (
        <g>
          <path
            d="M34 58C30 20 110 20 106 58"
            stroke={ink}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M34 58C30 20 110 20 106 58"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="26" y="50" width="16" height="26" rx="8" fill={ink} />
          <rect x="98" y="50" width="16" height="26" rx="8" fill={ink} />
          <rect x="30" y="55" width="8" height="16" rx="4" fill={accent} />
          <rect x="102" y="55" width="8" height="16" rx="4" fill={accent} />
        </g>
      );

    case "pen":
      return (
        /* Crayon glissé derrière l'oreille droite. */
        <g transform="rotate(24 104 50)">
          <rect x="99" y="22" width="9" height="30" rx="1.6" fill={accent} />
          <rect x="99" y="22" width="9" height="5" rx="1.6" fill={ink} fillOpacity="0.45" />
          <rect x="99" y="22" width="3" height="30" fill="#ffffff" fillOpacity="0.25" />
          <path d="M99 52H108L103.5 61Z" fill="#f2dcb8" />
          <path d="M101.8 57H105.2L103.5 61Z" fill={ink} />
        </g>
      );

    case "cap":
      return (
        <g>
          {/* Visière projetée vers le spectateur. Elle s'arrête juste au-dessus
              des sourcils : plus bas, elle mangerait toute l'expression. */}
          <ellipse cx="70" cy="35" rx="38" ry="6" fill={ink} fillOpacity="0.55" />
          <ellipse cx="70" cy="34" rx="38" ry="6" fill={accent} />
          {/* Calotte : elle coiffe le crâne (sommet à y ≈ 19) et descend
              jusqu'aux tempes, sinon elle flotte au-dessus de la tête. */}
          <path d="M33 40C34 -1 106 -1 107 40C104 32 36 32 33 40Z" fill={primary} />
          <path d="M70 6C84 6 95 12 101 24C92 15 82 13 68 14C57 15 46 20 39 28C45 13 56 6 70 6Z" fill="rgba(255,255,255,0.18)" />
          <circle cx="70" cy="5" r="4" fill={accent} />
        </g>
      );

    case "glasses":
      return (
        <g fill="none" stroke={ink} strokeWidth="2.6">
          <rect x="44" y="45" width="24" height="20" rx="7" fill="rgba(190,225,255,0.22)" />
          <rect x="72" y="45" width="24" height="20" rx="7" fill="rgba(190,225,255,0.22)" />
          <path d="M68 54H72" strokeLinecap="round" />
          <path d="M44 52L37 55" strokeLinecap="round" />
          <path d="M96 52L103 55" strokeLinecap="round" />
          <path d="M47 49L54 46" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    default:
      return null;
  }
}
