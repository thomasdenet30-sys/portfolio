import { Experience } from "@/components/Experience";
import { projects, teacher } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

/**
 * Données structurées : elles décrivent la personne et ses projets aux moteurs
 * de recherche, qui ne franchiront jamais la porte.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: teacher.name,
  jobTitle: teacher.roles.join(", "),
  url: SITE_URL,
  // Les projets sans adresse publique sont décrits sans `url` : un lien vide
  // ferait échouer la validation des données structurées.
  worksFor: projects.map((project) => ({
    "@type": "Organization",
    name: project.name,
    description: project.shortDescription,
    ...(project.website ? { url: project.website } : {}),
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Contenu statique issu de `data/projects.ts` : rien d'utilisateur ici.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Experience />
    </>
  );
}
