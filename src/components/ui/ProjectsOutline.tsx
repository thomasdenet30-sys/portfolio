import { projects, teacher } from "@/data/projects";

/**
 * Version texte de la promotion, rendue côté serveur et masquée visuellement.
 *
 * Elle existe pour deux publics : les moteurs de recherche, qui n'ouvriront
 * jamais la porte, et les lecteurs d'écran, à qui elle offre un accès direct
 * aux sites des projets sans passer par les fiches.
 */
export function ProjectsOutline() {
  return (
    <section className="sr-only" aria-label="Liste des projets, version texte">
      <h2>Les projets d&apos;{teacher.name}</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.discipline}</p>
            <p>{project.shortDescription}</p>
            {project.website ? (
              <a href={project.website} target="_blank" rel="noopener noreferrer">
                Découvrir {project.name} (nouvel onglet)
              </a>
            ) : (
              <p>Bientôt en ligne</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
