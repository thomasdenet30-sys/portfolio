/**
 * Pupitre d'amphithéâtre, vu depuis l'estrade : on aperçoit la tranche du
 * plateau puis le panneau frontal, qui porte la plaque gravée.
 *
 * `accent` pose un filet de couleur au ras du plateau — le seul endroit où
 * l'identité du projet déteint sur le mobilier.
 *
 * `uid` sert à suffixer les identifiants de dégradé : cinq pupitres coexistent
 * dans le document, et des `id` dupliqués casseraient le rendu comme l'audit.
 */
export function Desk({ uid, accent }: { uid: string; accent: string }) {
  const frontId = `desk-front-${uid}`;
  const topId = `desk-top-${uid}`;

  return (
    <svg viewBox="0 0 200 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={frontId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b4326" />
          <stop offset="55%" stopColor="#4a2c17" />
          <stop offset="100%" stopColor="#2c1a0c" />
        </linearGradient>
        <linearGradient id={topId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5c34" />
          <stop offset="100%" stopColor="#5e3a1f" />
        </linearGradient>
      </defs>

      {/* Tranche du plateau. */}
      <path d="M12 20H188L200 40H0Z" fill={`url(#${topId})`} />
      <path d="M12 20H188L189.2 22H10.8Z" fill="#a9754a" />

      {/* Panneau frontal. */}
      <rect x="0" y="38" width="200" height="52" rx="2" fill={`url(#${frontId})`} />
      <rect x="0" y="38" width="200" height="3" fill="#8a5c34" fillOpacity="0.75" />
      <rect x="0" y="43" width="200" height="1.6" fill={accent} fillOpacity="0.7" />

      {/* Rainures verticales du panneau. */}
      <g fill="#000000" fillOpacity="0.22">
        {[22, 62, 138, 178].map((x) => (
          <rect key={x} x={x} y="48" width="1.6" height="38" />
        ))}
      </g>

      {/* Piètement et ombre portée au sol. */}
      <path d="M8 90H192L186 100H14Z" fill="#1c1008" />
      <ellipse cx="100" cy="99" rx="104" ry="6" fill="#0b0603" fillOpacity="0.55" />
    </svg>
  );
}
