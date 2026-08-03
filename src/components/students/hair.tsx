import type { AvatarSpec } from "@/types/project";

/**
 * Coiffures, dessinées dans le même repère que la tête
 * (ellipse centrée en 70,54 — rayons 31 × 35, donc sommet du crâne à y ≈ 19).
 *
 * Piège des courbes de Bézier cubiques : le sommet réel d'une courbe n'atteint
 * jamais ses points de contrôle. Pour un sommet à y ≈ 17 avec des extrémités à
 * y = 52, il faut placer les contrôles vers y = 5 — sinon la chevelure passe
 * *sous* le crâne et le personnage paraît chauve.
 */
export function Hair({ spec }: { spec: AvatarSpec }) {
  const { hair, hairStyle } = spec;
  const sheen = "rgba(255,255,255,0.13)";
  const shade = "rgba(0,0,0,0.24)";

  switch (hairStyle) {
    case "buzz":
      return (
        <g>
          <path d="M37 58C38 4 102 4 103 58C101 30 39 30 37 58Z" fill={hair} />
          <path d="M37 58C38 4 102 4 103 58C102 34 96 22 70 22C44 22 38 34 37 58Z" fill={shade} />
        </g>
      );

    case "short":
      return (
        <g>
          <path d="M39 54C40 3 100 3 101 54C100 29 41 29 39 54Z" fill={hair} />
          <path d="M70 20C84 20 93 26 97 36C89 27 80 25 68 26C58 27 49 32 43 39C48 26 57 20 70 20Z" fill={sheen} />
        </g>
      );

    case "wavy":
      return (
        <g>
          <path
            d="M38 54C34 0 106 0 102 54C107 68 104 90 99 99C102 76 96 59 91 49C83 39 57 39 49 49C44 59 38 76 41 99C36 90 33 68 38 54Z"
            fill={hair}
          />
          <path d="M46 42C54 28 86 28 94 42C86 33 54 33 46 42Z" fill={sheen} />
        </g>
      );

    case "curly":
      return (
        <g fill={hair}>
          <path d="M38 56C39 2 101 2 102 56C101 30 39 30 38 56Z" />
          {[
            [46, 28, 12],
            [58, 19, 13],
            [72, 15, 14],
            [86, 20, 13],
            [97, 31, 11],
            [39, 40, 10],
            [101, 42, 10],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );

    case "bun":
      return (
        <g>
          <circle cx="70" cy="17" r="12" fill={hair} />
          <circle cx="66" cy="14" r="4" fill="rgba(255,255,255,0.08)" />
          <path d="M39 54C40 6 100 6 101 54C100 31 41 31 39 54Z" fill={hair} />
          <path d="M52 30C58 24 82 24 88 30C80 27 60 27 52 30Z" fill={shade} />
        </g>
      );

    case "long":
    default:
      return (
        <g>
          <path
            d="M37 56C36 1 104 1 103 56C103 76 101 96 99 108C96 92 96 70 92 55C88 40 52 40 48 55C44 70 44 92 41 108C39 96 37 76 37 56Z"
            fill={hair}
          />
          <path d="M46 42C54 28 86 28 94 42C86 34 54 34 46 42Z" fill={sheen} />
        </g>
      );
  }
}
