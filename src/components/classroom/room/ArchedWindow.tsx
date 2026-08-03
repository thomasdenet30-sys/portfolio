/**
 * Haute fenêtre cintrée. Trois d'entre elles éclairent toute la salle :
 * la lueur (`box-shadow` diffuse) est ce qui donne la lumière chaude au décor.
 */
export function ArchedWindow({ height }: { height: string }) {
  return (
    <div
      /* Largeur en `vmax`, hauteur en `vh` : chacune suit l'axe qui la
         concerne. Un pourcentage du mur (très large et très haut) étirait la
         fenêtre en meurtrière en portrait ; un `aspect-ratio` fixe l'écrasait
         sur les écrans larges. Ce couple d'unités tient les deux. */
      className="material-walnut relative shrink-0 rounded-t-full p-[1.5%] shadow-[0_0_2vmax_rgba(0,0,0,0.55)]"
      style={{ width: "18vmax", height }}
    >
      {/* Embrasure : le renfoncement qui prouve l'épaisseur du mur. */}
      <div className="absolute inset-0 rounded-t-full shadow-[inset_0_0_1.4vmax_rgba(0,0,0,0.8)]" />

      <div className="material-glass relative h-full w-full overflow-hidden rounded-t-full shadow-[0_0_9vmax_2vmax_rgba(255,203,131,0.42)]">
        <div className="window-mullions absolute inset-0" />
        {/* Reflet oblique sur le verre. */}
        <div className="absolute -inset-1/4 rotate-[18deg] bg-gradient-to-b from-white/45 via-white/5 to-transparent" />
      </div>
    </div>
  );
}
