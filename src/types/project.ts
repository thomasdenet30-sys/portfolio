/**
 * Modèle de données unique du portfolio.
 *
 * Tout le rendu (personnage, logo, visuel de la fiche, ambiance chromatique)
 * est GÉNÉRÉ à partir de ces objets : aucune image n'est stockée.
 * Ajouter un projet = ajouter un objet dans `src/data/projects.ts`.
 */

/** Tempérament visuel : pilote la posture et l'expression au repos. */
export type Personality =
  | "athletic"
  | "elegant"
  | "romantic"
  | "creative"
  | "trustworthy"
  | "analytical"
  | "resourceful";

/** Palette du projet. Toutes les couleurs sont en hexadécimal. */
export interface ProjectColors {
  /** Couleur dominante : logo, tenue, accents de la fiche. */
  primary: string;
  /** Couleur secondaire : dégradés, reflets, détails. */
  accent: string;
  /** Couleur d'encre : texte sur fond clair (contraste AA garanti). */
  ink: string;
  /** Fond clair de la fiche projet. */
  surface: string;
}

/** Recette du personnage. Le SVG est assemblé à partir de ces traits. */
export interface AvatarSpec {
  skin: string;
  hair: string;
  hairStyle: "short" | "bun" | "wavy" | "curly" | "buzz" | "long";
  accessory:
    | "headband"
    | "tie"
    | "scarf"
    | "headphones"
    | "glasses"
    | "pen"
    | "cap"
    | "none";
  /** Couleur du haut du vêtement. */
  outfit: string;
}

/**
 * Logo du projet.
 *
 * `mark` est la marque dessinée par défaut. Dès qu'un vrai logo existe, il la
 * remplace — sous l'une ou l'autre forme, parfois les deux :
 *
 *  · `icon`     visuel carré (icône d'app, favicon). Sert à la pastille posée
 *               à côté du nom, et de filigrane sur le grand visuel.
 *  · `wordmark` logotype large. Ne va que sur le grand visuel : compressé dans
 *               une pastille carrée, il deviendrait illisible.
 *
 * Un `wordmark` est posé sur le dégradé de marque, donc sur un fond coloré :
 * il doit être en version claire.
 */
export interface LogoSpec {
  /** 1 à 2 caractères affichés au centre du monogramme. */
  glyph: string;
  mark: "bolt" | "roof" | "heart" | "spark" | "shield" | "chart" | "tag" | "bulb";
  icon?: string;
  wordmark?: string;
}

/** Recette du grand visuel de la fiche projet. */
export interface ImageSpec {
  motif: "grid" | "arcs" | "rings" | "waves" | "shield";
  from: string;
  to: string;
}

export interface Project {
  id: string;
  name: string;
  /**
   * Nom gravé sur le pupitre, si le nom complet n'y tient pas.
   * Une plaque du dernier rang n'accueille qu'une douzaine de caractères
   * avant de devenir illisible.
   */
  shortName?: string;
  avatar: AvatarSpec;
  logo: LogoSpec;
  image: ImageSpec;
  /** Une phrase, à la troisième personne, sans point-virgule. */
  shortDescription: string;
  /**
   * URL absolue ouverte dans un nouvel onglet.
   * Chaîne vide si le projet n'est pas encore en ligne : la fiche remplace
   * alors le bouton par une mention, plutôt que de pointer dans le vide.
   */
  website: string;
  personality: Personality;
  colors: ProjectColors;
  /** Deux ou trois mots affichés sous le nom dans la fiche. */
  discipline: string;
  /** Projet encore en chantier : un liseré et une mention l'indiquent. */
  inProgress?: boolean;
}
