/**
 * Placement automatique des élèves dans l'amphithéâtre.
 *
 * Les rangées du fond sont plus larges, plus hautes et plus petites : c'est ce
 * gradient qui crée la profondeur. Rien n'est codé en dur côté données — on
 * passe le nombre de projets, on récupère des coordonnées en pourcentage.
 *
 * ── Portrait ─────────────────────────────────────────────────────────────
 * Un téléphone tenu droit manque de largeur et déborde de hauteur : c'est
 * l'inverse d'un écran d'ordinateur. On y répartit donc la même promotion sur
 * **plus de rangs, moins peuplés**. Quatre élèves côte à côte sur 390 px de
 * large, cela fait des pupitres de 55 px : leur plaque gravée devient
 * illisible, ce qui vide le concept de son sens.
 */

export interface Seat {
  /** 0 = premier rang (le plus proche). */
  row: number;
  /** Position horizontale du centre du pupitre, en % de la largeur. */
  x: number;
  /** Position verticale de la ligne du pupitre, en % de la hauteur. */
  y: number;
  /** Échelle du groupe élève + pupitre. */
  scale: number;
  /** Rotation Y : les élèves des bords se tournent vers le centre. */
  turn: number;
  /** Ordre de superposition (les rangs avant passent devant). */
  z: number;
}

export type Layout = "landscape" | "portrait";

/**
 * Largeur d'un pupitre, par format.
 *
 * Une seule expression ne peut pas servir les deux : en portrait `15vmax` vaut
 * 15 % de la *hauteur*, soit 127 px sur un iPhone — plus étroit que les 40 %
 * de largeur qu'on veut réellement. Sur un grand écran, à l'inverse, `40vw`
 * donnerait des pupitres démesurés. Le format tranche donc explicitement.
 */
export const DESK_WIDTH: Record<Layout, string> = {
  landscape: "15vmax",
  portrait: "40vw",
};

/** Arrangements dessinés à la main : ils se lisent mieux qu'un calcul générique. */
const ARRANGEMENTS: Record<Layout, Record<number, number[]>> = {
  landscape: {
    1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [2, 3], 6: [2, 4],
    7: [3, 4], 8: [3, 5], 9: [2, 3, 4], 10: [3, 3, 4], 11: [3, 4, 4], 12: [3, 4, 5],
  },
  portrait: {
    1: [1], 2: [2], 3: [1, 2], 4: [2, 2], 5: [2, 3], 6: [2, 2, 2],
    7: [2, 2, 3], 8: [2, 3, 3], 9: [2, 3, 4], 10: [3, 3, 4], 11: [3, 4, 4], 12: [3, 4, 5],
  },
};

/** Géométrie des rangs, par format. */
const GEOMETRY: Record<
  Layout,
  { frontY: number; backY: number; frontSpread: number; backSpread: number; backScale: number }
> = {
  landscape: { frontY: 78, backY: 48, frontSpread: 22, backSpread: 27, backScale: 0.72 },
  // En portrait : rangs plus resserrés horizontalement, étalés verticalement.
  portrait: { frontY: 80, backY: 44, frontSpread: 22, backSpread: 31, backScale: 0.75 },
};

/** Au-delà du tableau : trois rangs équilibrés, le plus large au fond. */
function fallbackRows(total: number): number[] {
  const base = Math.floor(total / 3);
  const rest = total % 3;
  return [base, base + (rest > 1 ? 1 : 0), base + (rest > 0 ? 1 : 0)].filter((n) => n > 0);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function rowsFor(total: number, layout: Layout) {
  return ARRANGEMENTS[layout][total] ?? fallbackRows(total);
}

export function buildSeating(total: number, layout: Layout = "landscape"): Seat[] {
  if (total <= 0) return [];
  const rows = rowsFor(total, layout);
  const geo = GEOMETRY[layout];
  const lastRow = Math.max(rows.length - 1, 1);
  const seats: Seat[] = [];

  rows.forEach((count, row) => {
    // t = 0 au premier rang, 1 au dernier.
    const t = rows.length === 1 ? 0.25 : row / lastRow;
    const rowY = lerp(geo.frontY, geo.backY, t);
    // Le fond ne descend pas sous ~0,7 : en dessous, les plaques gravées
    // deviennent illisibles, ce qui coûterait plus que le gain de profondeur.
    const rowScale = lerp(1, geo.backScale, t);
    const spread = lerp(geo.frontSpread, geo.backSpread, t);

    for (let i = 0; i < count; i += 1) {
      // u ∈ [-1, 1] : -1 tout à gauche, 0 au centre, 1 tout à droite.
      const u = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
      seats.push({
        row,
        x: 50 + u * spread,
        // Léger arc : les places de bord sont plus près, donc plus basses.
        y: rowY + u * u * 1.8,
        scale: rowScale * (1 + u * u * 0.04),
        turn: -u * 15,
        z: (rows.length - row) * 10,
      });
    }
  });

  return seats;
}

/** Bandes de gradins à dessiner derrière chaque rangée. */
export function buildTiers(total: number, layout: Layout = "landscape") {
  const rows = rowsFor(total, layout);
  const geo = GEOMETRY[layout];
  const lastRow = Math.max(rows.length - 1, 1);
  return rows.map((_, row) => {
    const t = rows.length === 1 ? 0.25 : row / lastRow;
    return { y: lerp(geo.frontY, geo.backY, t), depth: lerp(1, geo.backScale, t) };
  });
}
