/**
 * Bibliothèque toute hauteur : caisson en noyer, tranches de livres, tablettes.
 * `shelves` règle la densité — plus il y en a, plus la bibliothèque paraît loin.
 */
export function Bookcase({
  className,
  style,
  shelves = 7,
}: {
  className?: string;
  style?: React.CSSProperties;
  shelves?: number;
}) {
  return (
    <div
      className={`material-walnut absolute shadow-[inset_0_0_2vmax_rgba(0,0,0,0.75)] ${className ?? ""}`}
      style={style}
    >
      <div className="material-books absolute inset-[2%]" />

      {/* Tablettes en chêne, réparties régulièrement. */}
      <div
        className="absolute inset-[2%]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 calc(100% / ${shelves} - 0.55vmax), #40260f calc(100% / ${shelves} - 0.55vmax) calc(100% / ${shelves}))`,
        }}
      />

      {/* Ombre propre : le fond du meuble est toujours plus sombre. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70" />
    </div>
  );
}
