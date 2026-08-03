/**
 * Parquet et plafond : deux plans horizontaux construits à l'identique.
 *
 * Chacun est articulé sur son arête haute puis basculé de −90° : le bord
 * inférieur de l'élément part alors vers le fond de la salle.
 */
export function FloorPlane() {
  return (
    <div
      className="material-floor absolute"
      style={{
        left: "-35%",
        top: "105%",
        width: "170%",
        height: "var(--room-depth)",
        transformOrigin: "50% 0%",
        transform: "rotateX(-90deg)",
      }}
    >
      {/* Reflet chaud des fenêtres, au fond, et pénombre au premier plan. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(255,199,133,0.2) 0%, rgba(0,0,0,0.35) 46%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      {/* Traînées lumineuses tombant des trois fenêtres. */}
      <div
        className="absolute inset-x-0 top-0 h-[62%]"
        style={{
          backgroundImage:
            "radial-gradient(22% 60% at 34% 0%, rgba(255,206,142,0.28), transparent 70%), radial-gradient(22% 62% at 50% 0%, rgba(255,206,142,0.3), transparent 70%), radial-gradient(22% 60% at 66% 0%, rgba(255,206,142,0.28), transparent 70%)",
        }}
      />
    </div>
  );
}

export function CeilingPlane() {
  return (
    <div
      className="material-walnut absolute"
      style={{
        left: "-35%",
        top: "var(--wall-top)",
        width: "170%",
        height: "var(--room-depth)",
        transformOrigin: "50% 0%",
        transform: "rotateX(-90deg)",
      }}
    >
      {/* Poutres apparentes, perpendiculaires à la profondeur. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 1.1vmax, transparent 1.1vmax 9vmax)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(255,196,128,0.14) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.92) 100%)",
        }}
      />
    </div>
  );
}
