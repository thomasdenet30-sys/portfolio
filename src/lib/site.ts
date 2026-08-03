/**
 * Adresse du site et préfixe des fichiers statiques.
 *
 * Le site est publié sous un sous-chemin (`/portfolio` sur GitHub Pages).
 * `next/link` gère ce préfixe tout seul, mais **pas** `next/image` : le `src`
 * d'une image locale doit le porter explicitement. D'où `asset()`.
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Préfixe un chemin de `public/` : `asset("/logos/x.svg")`. */
export const asset = (path: string) => `${BASE_PATH}${path}`;
