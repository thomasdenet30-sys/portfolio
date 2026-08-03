"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { disableAudio, enableAudio } from "@/lib/audio";
import { spring } from "@/lib/motion";
import {
  getServerSnapshot,
  getSnapshot,
  setPreference,
  subscribe,
} from "@/lib/soundPreference";

/**
 * Interrupteur d'ambiance sonore.
 *
 * Coupé par défaut, à dessein : un son qui démarre tout seul est intrusif, et
 * les navigateurs le bloquent de toute façon hors interaction. Le contexte
 * audio n'est donc créé qu'au premier geste.
 */
export function SoundToggle() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /* Visiteur qui revient avec le son déjà activé : la politique d'autoplay
     interdit de reprendre le contexte audio avant une interaction. On attend
     donc le premier geste, quel qu'il soit. */
  useEffect(() => {
    if (!enabled) return;
    const resume = () => void enableAudio();
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [enabled]);

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    if (next) void enableAudio();
    else disableAudio();
    setPreference(next);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label="Ambiance sonore"
      className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-[#f3e3b2]/25 bg-black/35 px-3 py-2 text-xs font-medium tracking-wide text-[#f3e3b2] backdrop-blur-sm transition-colors duration-200 hover:border-[#f3e3b2]/50 hover:bg-black/50 sm:px-4"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
        {enabled ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <path d="M16 9.5 21 15M21 9.5 16 15" />
        )}
      </svg>

      {/* Le libellé s'efface sur petit écran ; `aria-label` porte le nom. */}
      <span className="hidden sm:inline">Ambiance sonore</span>

      {/* Témoin d'état, doublé par `aria-pressed` pour les lecteurs d'écran. */}
      <span className="relative block h-4 w-7 rounded-full bg-[#f3e3b2]/20">
        <motion.span
          className="absolute top-0.5 block h-3 w-3 rounded-full bg-[#f3e3b2]"
          animate={{ x: enabled ? 14 : 2 }}
          transition={spring.snappy}
        />
      </span>
    </button>
  );
}
