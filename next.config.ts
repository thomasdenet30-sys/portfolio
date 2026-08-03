import type { NextConfig } from "next";

/**
 * GitHub Pages ne sert que des fichiers statiques : pas de serveur Next, donc
 * pas d'optimiseur d'images à l'exécution. D'où `output: "export"` et
 * `images.unoptimized` — les logos sont déjà dimensionnés à la main dans
 * `public/logos/`.
 *
 * Le site vit sous un sous-chemin (`/portfolio`), passé par variable
 * d'environnement plutôt qu'écrit en dur : `npm run dev` continue ainsi de
 * répondre à la racine.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Chaque route devient un dossier avec son `index.html` : c'est ce que
  // GitHub Pages sert sans réécriture.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
