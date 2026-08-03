import { ArchedWindow } from "./ArchedWindow";
import { Bookcase } from "./Bookcase";

/**
 * Mur du fond, à `--room-depth` de la caméra.
 *
 * Il est volontairement plus grand que le viewport (170 % × 132 %) : à cette
 * distance la perspective le réduit d'environ 40 %, et il doit malgré tout
 * couvrir tout le champ.
 */
export function BackWall() {
  return (
    <div
      className="material-walnut absolute"
      style={{
        left: "-35%",
        top: "var(--wall-top)",
        width: "170%",
        height: "var(--wall-height)",
        transform: "translateZ(calc(var(--room-depth) * -1))",
      }}
    >
      {/* Corniche haute : marque le très haut plafond. */}
      <div className="material-oak absolute inset-x-0 top-[7%] h-[2.2%] shadow-[0_0.6vmax_1.2vmax_rgba(0,0,0,0.55)]" />

      {/* Trois fenêtres cintrées, centrées et espacées proportionnellement. */}
      <div className="absolute inset-x-0 top-[13%] flex items-start justify-center gap-[2.4vmax]">
        <ArchedWindow height="60vh" />
        <ArchedWindow height="65vh" />
        <ArchedWindow height="60vh" />
      </div>

      {/* Bibliothèques encadrant les fenêtres. */}
      <Bookcase
        style={{ left: "12%", top: "11%", width: "16%", height: "62%" }}
        shelves={8}
      />
      <Bookcase
        style={{ right: "12%", top: "11%", width: "16%", height: "62%" }}
        shelves={8}
      />

      {/* Lambris bas + plinthe. */}
      <div className="material-oak absolute inset-x-0 bottom-0 top-[73%]">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0 3px, transparent 3px 4.5%)",
          }}
        />
        <div className="material-oak absolute inset-x-0 top-0 h-[7%] shadow-[0_0.4vmax_0.8vmax_rgba(0,0,0,0.5)]" />
      </div>

      {/* Lumière rasante venue des fenêtres. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 45% at 50% 34%, rgba(255,214,150,0.34), transparent 72%)",
        }}
      />
      {/* Les angles du mur restent dans l'ombre. */}
      <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_50%_40%,transparent_45%,rgba(10,5,2,0.72)_100%)]" />
    </div>
  );
}
