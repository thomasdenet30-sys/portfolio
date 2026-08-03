import { Bookcase } from "./Bookcase";

/**
 * Mur latéral, articulé sur le bord du viewport et couché vers le fond.
 *
 * C'est lui qui fabrique l'essentiel de la sensation de profondeur : sans les
 * deux murs qui fuient, la salle redevient une image plate.
 */
export function SideWall({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div
      className="material-walnut absolute"
      style={{
        [isLeft ? "left" : "right"]: 0,
        top: "var(--wall-top)",
        width: "var(--room-depth)",
        height: "var(--wall-height)",
        transformOrigin: isLeft ? "0% 50%" : "100% 50%",
        transform: `rotateY(${isLeft ? 90 : -90}deg)`,
      }}
    >
      {/* Deux hautes bibliothèques, la plus proche du fond mieux éclairée. */}
      <Bookcase
        style={{
          [isLeft ? "right" : "left"]: "6%",
          top: "12%",
          width: "30%",
          height: "64%",
        }}
        shelves={9}
      />
      <Bookcase
        style={{
          [isLeft ? "right" : "left"]: "42%",
          top: "16%",
          width: "24%",
          height: "58%",
        }}
        shelves={8}
      />

      {/* Lambris bas continu. */}
      <div className="material-oak absolute inset-x-0 bottom-0 top-[76%]" />

      {/* Dégradé de lumière : clair côté fenêtres, noir vers l'entrée. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to ${isLeft ? "right" : "left"}, rgba(6,3,1,0.95) 0%, rgba(6,3,1,0.7) 38%, rgba(6,3,1,0.24) 78%, rgba(255,200,140,0.08) 100%)`,
        }}
      />
    </div>
  );
}
