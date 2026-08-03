import { BackWall } from "./room/BackWall";
import { CeilingPlane, FloorPlane } from "./room/FloorPlane";
import { SideWall } from "./room/SideWall";

/**
 * Le volume de la salle : cinq plans assemblés en CSS 3D.
 *
 * Toute la géométrie dérive de deux variables (`--room-depth`,
 * `--room-perspective`) exprimées en `vmax`, donc proportionnelles au viewport :
 * la salle garde exactement les mêmes proportions sur un 27" et sur un iPhone.
 *
 * L'ordre du DOM est l'ordre de profondeur — le fond d'abord.
 */
export function Background() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        perspective: "var(--room-perspective)",
        perspectiveOrigin: "50% 44%",
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        <BackWall />
        <SideWall side="left" />
        <SideWall side="right" />
        <CeilingPlane />
        <FloorPlane />
      </div>
    </div>
  );
}
