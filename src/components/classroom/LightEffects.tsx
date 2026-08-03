/** Bruit déterministe : mêmes valeurs au rendu serveur et au rendu client. */
function noise(index: number, seed: number) {
  const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const BEAMS = [
  { x: 30, width: 16, delay: 0, duration: 13 },
  { x: 50, width: 18, delay: 2.4, duration: 11 },
  { x: 70, width: 16, delay: 4.8, duration: 15 },
];

const DUST_COUNT = 22;

/**
 * Couche atmosphérique posée par-dessus le volume de la salle :
 * rais de lumière, poussière en suspension, halo chaud et vignettage.
 *
 * Tout est en `opacity`/`transform` et `pointer-events: none` — aucune de ces
 * couches ne déclenche de layout ni n'intercepte le curseur.
 */
export function LightEffects() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Rais de lumière tombant des fenêtres vers le premier plan. */}
      {BEAMS.map((beam) => (
        <div
          key={beam.x}
          className="animate-beam absolute top-[6%] h-[86%] mix-blend-screen"
          style={
            {
              left: `${beam.x - beam.width / 2}%`,
              width: `${beam.width}%`,
              clipPath: "polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)",
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,219,164,0.4) 0%, rgba(255,205,140,0.16) 45%, transparent 88%)",
              filter: "blur(1.6vmax)",
              "--beam-delay": `${beam.delay}s`,
              "--beam-duration": `${beam.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Poussière : le détail qui rend la lumière « respirable ».
          Toutes les valeurs sont arrondies et unitées explicitement — sinon
          React sérialise le flottant différemment côté serveur et côté client,
          et l'hydratation échoue. */}
      {Array.from({ length: DUST_COUNT }, (_, index) => {
        const size = (1.5 + noise(index, 3) * 2.6).toFixed(2);
        return (
          <div
            key={index}
            /* Chaque grain est une couche composée à part. Sur téléphone, la
               moitié suffit à faire vivre la lumière et libère autant de
               mémoire graphique. */
            className={`animate-dust absolute rounded-full bg-[#ffe3b8] ${index >= 12 ? "hidden sm:block" : ""}`}
            style={
              {
                left: `${(18 + noise(index, 1) * 64).toFixed(2)}%`,
                top: `${(12 + noise(index, 2) * 62).toFixed(2)}%`,
                width: `${size}px`,
                height: `${size}px`,
                filter: "blur(0.5px)",
                "--dust-opacity": (0.22 + noise(index, 4) * 0.45).toFixed(3),
                "--dust-x": `${((noise(index, 5) - 0.5) * 90).toFixed(2)}px`,
                "--dust-duration": `${(11 + noise(index, 6) * 12).toFixed(2)}s`,
                "--dust-delay": `${(-noise(index, 7) * 16).toFixed(2)}s`,
              } as React.CSSProperties
            }
          />
        );
      })}

      {/* Halo chaud global : unifie la colorimétrie de la scène. */}
      <div className="absolute inset-0 bg-[radial-gradient(48%_38%_at_50%_26%,rgba(255,196,124,0.22),transparent_70%)] mix-blend-screen" />

      {/* Vignettage + grain argentique. */}
      <div className="vignette grain absolute inset-0" />
    </div>
  );
}
