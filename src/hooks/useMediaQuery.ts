"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * S'abonne à une media query.
 *
 * Passe par `useSyncExternalStore` plutôt que par un effet : la taille du
 * viewport est un état extérieur à React, et le lire dans un effet
 * déclencherait un rendu en cascade à chaque montage.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // Le serveur ne connaît pas le viewport : il suppose le format paysage.
    () => false,
  );
}

/** Vrai quand l'écran est plus haut que large : téléphone tenu droit. */
export function usePortrait(): boolean {
  return useMediaQuery("(max-aspect-ratio: 1/1)");
}
