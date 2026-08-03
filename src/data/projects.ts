import type { Project } from "@/types/project";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  LA PROMOTION
 * ─────────────────────────────────────────────────────────────────────────
 *  Chaque objet devient automatiquement un élève assis dans l'amphithéâtre :
 *  personnage SVG, logo, pupitre gravé et fiche projet sont dérivés d'ici.
 *
 *  L'ORDRE COMPTE : les premiers de la liste occupent le premier rang.
 *  Avec sept élèves, `lib/seating.ts` forme un rang de trois devant et un
 *  rang de quatre au fond.
 *
 *  Les palettes sont celles des vrais sites et des vraies applications, pas
 *  des couleurs choisies au jugé : bleu marine de nousproprio.com, vert néon
 *  de LEBONPLAN, émeraude du simulateur, et les icônes d'app pour le reste.
 *
 *  ⚠️  Sans `website`, la fiche affiche « Bientôt en ligne » plutôt qu'un lien
 *      mort. Seul SaveBack est dans ce cas, le temps qu'il ait une adresse.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  // ── Premier rang ────────────────────────────────────────────────────────
  {
    id: "fitclash",
    name: "FitClash",
    discipline: "Sport · Défi",
    personality: "athletic",
    shortDescription:
      "FitClash transforme le poids du corps en terrain de jeu : on bat ses records et on défie ses amis.",
    website: "https://apps.apple.com/fr/app/fit-clash/id6781624053",
    colors: {
      primary: "#FF1E2D",
      accent: "#FF6A00",
      ink: "#3F0409",
      surface: "#FFF2F1",
    },
    avatar: {
      skin: "#E8B48C",
      hair: "#2C1A12",
      hairStyle: "buzz",
      accessory: "headband",
      outfit: "#FF1E2D",
    },
    logo: { glyph: "F", mark: "bolt", icon: "/logos/fitclash.png" },
    image: { motif: "arcs", from: "#FF1E2D", to: "#FF6A00" },
  },
  {
    id: "nousproprio",
    name: "NousProprio",
    discipline: "Immobilier · Accompagnement",
    personality: "elegant",
    shortDescription:
      "NousProprio aide à trouver la bonne direction pour son projet immobilier, en trois minutes.",
    website: "https://www.nousproprio.com",
    colors: {
      primary: "#12295C",
      accent: "#9ECAFF",
      ink: "#0A1936",
      surface: "#F2F6FD",
    },
    avatar: {
      skin: "#C98A62",
      hair: "#17110C",
      hairStyle: "short",
      accessory: "tie",
      outfit: "#12295C",
    },
    logo: { glyph: "N", mark: "roof", wordmark: "/logos/nousproprio.png" },
    image: { motif: "grid", from: "#12295C", to: "#3D6FB8" },
  },
  {
    id: "datenow",
    name: "DateNow",
    discipline: "Rencontre · Vidéo",
    personality: "romantic",
    shortDescription:
      "DateNow réunit deux profils compatibles pour cinq minutes de live flouté : le match n'existe que si le rendez-vous a plu.",
    website: "https://apps.apple.com/fr/app/datenow/id6772715654",
    colors: {
      primary: "#FF4F8B",
      accent: "#7C5CFF",
      ink: "#4A0B2A",
      surface: "#FFF0F6",
    },
    avatar: {
      skin: "#F0C7A8",
      hair: "#6B2F1E",
      hairStyle: "wavy",
      accessory: "scarf",
      outfit: "#FF4F8B",
    },
    logo: { glyph: "D", mark: "heart", icon: "/logos/datenow.png" },
    image: { motif: "rings", from: "#FF4F8B", to: "#7C5CFF" },
  },

  // ── Deuxième rang ───────────────────────────────────────────────────────
  {
    id: "simulateur-bourse",
    name: "Simulateur Bourse",
    shortName: "Simulateur",
    discipline: "Finance · Projection",
    personality: "analytical",
    shortDescription:
      "Simulateur Bourse montre ce qu'un placement rapporte vraiment une fois les années passées, en rendement réel.",
    website: "https://thomasdenet30-sys.github.io/simulateur-epargne/",
    colors: {
      primary: "#12B886",
      accent: "#63E6BE",
      ink: "#06382A",
      surface: "#EDFCF6",
    },
    avatar: {
      skin: "#8D5A3B",
      hair: "#120C22",
      hairStyle: "bun",
      accessory: "glasses",
      outfit: "#12B886",
    },
    logo: { glyph: "S", mark: "chart", icon: "/logos/simulateur.svg" },
    image: { motif: "waves", from: "#0E9A73", to: "#63E6BE" },
  },
  {
    id: "ideamarket",
    name: "IdéaMarket",
    discipline: "Marketplace · Idées",
    personality: "creative",
    shortDescription:
      "IdéaMarket ouvre un marché aux idées de business : on y vend celles qu'on ne réalisera pas, on y achète celles qu'on attendait.",
    website: "https://thomasdenet30-sys.github.io/ideamarket/",
    colors: {
      primary: "#A855F7",
      accent: "#FCD34D",
      ink: "#3B0764",
      surface: "#FAF5FF",
    },
    avatar: {
      skin: "#F2D2B6",
      hair: "#7A3E12",
      hairStyle: "curly",
      accessory: "pen",
      outfit: "#A855F7",
    },
    logo: {
      glyph: "I",
      mark: "bulb",
      icon: "/logos/ideamarket.svg",
      wordmark: "/logos/ideamarket-wordmark.svg",
    },
    /* Violet profond plutôt que violet → jaune : le logotype d'IdéaMarket a une
       partie rose clair, illisible sur un panneau pâle. */
    image: { motif: "grid", from: "#4C1D95", to: "#C084FC" },
  },
  {
    id: "lebonplan",
    name: "LEBONPLAN",
    discipline: "Communauté · Bons plans",
    personality: "resourceful",
    shortDescription:
      "LEBONPLAN recense les bons plans et les remet en circulation, pour que personne ne passe à côté.",
    website: "https://thomasdenet30-sys.github.io/lebonplan/",
    colors: {
      primary: "#00C46E",
      accent: "#00FF8C",
      ink: "#04170E",
      surface: "#ECFEF4",
    },
    avatar: {
      skin: "#A96C43",
      hair: "#241610",
      hairStyle: "short",
      accessory: "cap",
      outfit: "#00C46E",
    },
    logo: {
      glyph: "L",
      mark: "bolt",
      icon: "/logos/lebonplan.svg",
      wordmark: "/logos/lebonplan-wordmark.svg",
    },
    image: { motif: "arcs", from: "#04170E", to: "#00C46E" },
  },
  {
    id: "saveback",
    name: "SaveBack",
    discipline: "En cours d'écriture",
    personality: "trustworthy",
    inProgress: true,
    // ⚠️ À réécrire dès que le projet a sa promesse : on ne décrit pas ce
    //    qu'on ne connaît pas encore.
    shortDescription:
      "SaveBack est le petit dernier de la promotion : il est encore sur les bancs, et son histoire s'écrit en ce moment même.",
    website: "",
    colors: {
      primary: "#1C5FD6",
      accent: "#37C6E8",
      ink: "#08234F",
      surface: "#EFF6FF",
    },
    avatar: {
      skin: "#EBC49A",
      hair: "#3B2A1A",
      hairStyle: "long",
      accessory: "headphones",
      outfit: "#1C5FD6",
    },
    logo: { glyph: "S", mark: "shield" },
    image: { motif: "shield", from: "#1C5FD6", to: "#37C6E8" },
  },
];

/** Identité de l'enseignant, affichée sur la plaque de la porte. */
export const teacher = {
  name: "Alexandre Thomas",
  room: "Salle de cours",
  roles: ["Enseignant", "Entrepreneur", "Créateur d'applications"],
} as const;
