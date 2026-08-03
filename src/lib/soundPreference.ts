/**
 * Préférence d'ambiance sonore, conservée d'une visite à l'autre.
 *
 * Exposée comme un store externe (`useSyncExternalStore`) plutôt que lue dans
 * un effet : c'est bien un système extérieur à React, et le lire dans un effet
 * provoquerait un rendu en cascade à chaque montage.
 */

const STORAGE_KEY = "salle-de-cours:son";

const listeners = new Set<() => void>();
let cached: boolean | null = null;

function read(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    // Mode privé ou stockage refusé : on retombe simplement sur « coupé ».
    return false;
  }
}

export function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getSnapshot(): boolean {
  if (cached === null) cached = read();
  return cached;
}

/** Le serveur ne connaît pas la préférence : il rend toujours « coupé ». */
export function getServerSnapshot(): boolean {
  return false;
}

export function setPreference(next: boolean) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Sans stockage, la préférence vaut pour la session en cours.
  }
  listeners.forEach((listener) => listener());
}
