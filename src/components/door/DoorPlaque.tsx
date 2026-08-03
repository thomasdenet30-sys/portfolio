import { teacher } from "@/data/projects";

/** Les rôles, coupés en deux lignes à peu près égales. */
const HALF = Math.ceil(teacher.roles.length / 2);
const ROLE_LINES = [
  teacher.roles.slice(0, HALF).join(" • "),
  teacher.roles.slice(HALF).join(" • "),
].filter(Boolean);

/**
 * Plaque de laiton vissée sur les battants.
 *
 * Toutes les dimensions dérivent de `--door-w` (voir `.door-scene`) : la plaque
 * garde donc exactement les mêmes proportions du 27 pouces au téléphone.
 *
 * Elle chevauche les deux vantaux : elle est rendue par-dessus, et se retire
 * d'elle-même au moment où la porte s'ouvre (voir `Door`).
 */
export function DoorPlaque() {
  return (
    <div className="material-brass relative rounded-[4px] px-[6%] py-[4%] shadow-[0_0.6vmax_1.6vmax_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,248,220,0.55),inset_0_-2px_4px_rgba(0,0,0,0.35)]">
      {/* Vis aux quatre coins. */}
      {[
        "left-[3%] top-[10%]",
        "right-[3%] top-[10%]",
        "bottom-[10%] left-[3%]",
        "bottom-[10%] right-[3%]",
      ].map((position) => (
        <span
          key={position}
          className={`absolute h-[calc(var(--door-w)*0.017)] w-[calc(var(--door-w)*0.017)] rounded-full bg-[#7a5c25] shadow-[inset_0_1px_1px_rgba(0,0,0,0.7)] ${position}`}
        />
      ))}

      <p className="engraved-deep text-center text-[clamp(0.72rem,calc(var(--door-w)*0.027),1rem)] font-semibold uppercase tracking-[0.22em] sm:tracking-[0.34em]">
        {teacher.room}
      </p>

      <p className="engraved-deep mt-[calc(var(--door-w)*0.016)] whitespace-nowrap text-center font-display text-[clamp(1.5rem,calc(var(--door-w)*0.068),2.6rem)] leading-none tracking-wide">
        {teacher.name}
      </p>

      <div className="mx-auto my-[calc(var(--door-w)*0.024)] h-px w-[62%] bg-[#4a3813]/70 shadow-[0_1px_0_rgba(255,244,210,0.4)]" />

      {/* Les rôles sont répartis en deux lignes explicites plutôt que laissés
          au retour automatique, qui abandonnait un « • » en fin de ligne. */}
      <p className="engraved-deep text-center text-[clamp(0.75rem,calc(var(--door-w)*0.026),1rem)] font-medium leading-relaxed tracking-[0.06em] sm:tracking-[0.1em]">
        {ROLE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
