import type { Ambience } from "./ambience";
import { brownNoise } from "./noise";

/**
 * Graphe audio et sons ponctuels du seuil.
 *
 * Rien n'est téléchargé : le loquet, le grincement et la cloche sont
 * synthétisés. La rumeur de la salle, elle, vit dans `ambience.ts`, chargé à la
 * demande la première fois qu'on active le son — le visiteur qui laisse le son
 * coupé ne paie pas un octet de synthèse.
 *
 * ── Le seuil ─────────────────────────────────────────────────────────────
 * Tout ce qui vient de la salle passe par un passe-bas qui n'ouvre qu'au moment
 * où la porte s'ouvre : derrière un battant de chêne on n'entend que les
 * graves. Le loquet et le grincement, eux, se produisent de notre côté et ne
 * sont pas filtrés — d'où deux bus séparés.
 *
 * Le contexte n'est créé qu'au premier geste utilisateur (politique autoplay).
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
/** Ce qui se passe de notre côté de la porte : loquet, grincement, cloche. */
let doorBus: GainNode | null = null;
/** Tout ce qui vient de la salle, et qui traverse donc le battant. */
let roomBus: GainNode | null = null;
let muffle: BiquadFilterNode | null = null;
let ambience: Ambience | null = null;
let doorIsOpen = false;

const MUFFLED_HZ = 420;
const OPEN_HZ = 9000;

function ensureGraph(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtor) return null;

  ctx = new AudioCtor();

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  doorBus = ctx.createGain();
  doorBus.connect(master);

  muffle = ctx.createBiquadFilter();
  muffle.type = "lowpass";
  muffle.frequency.value = doorIsOpen ? OPEN_HZ : MUFFLED_HZ;
  muffle.Q.value = 0.6;
  muffle.connect(master);

  roomBus = ctx.createGain();
  roomBus.gain.value = doorIsOpen ? 1 : 0.55;
  roomBus.connect(muffle);

  return ctx;
}

/**
 * Active l'ambiance. À n'appeler que depuis un gestionnaire d'événement.
 *
 * L'ordre compte : le contexte est créé et repris **avant** le `import()`.
 * Safari exige que `resume()` parte du geste lui-même ; attendre le chargement
 * d'un module d'abord ferait perdre l'autorisation.
 */
export async function enableAudio() {
  const audio = ensureGraph();
  if (!audio || !master || !roomBus) return;
  if (audio.state === "suspended") await audio.resume();

  master.gain.cancelScheduledValues(audio.currentTime);
  master.gain.setTargetAtTime(0.5, audio.currentTime, 1.2);

  if (ambience) {
    ambience.resumeEvents();
    return;
  }
  const { startAmbience } = await import("./ambience");
  ambience = startAmbience(audio, roomBus);
}

export function disableAudio() {
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
  ambience?.pauseEvents();
}

/**
 * Ouvre — ou referme — l'acoustique de la salle.
 *
 * Porte fermée, on n'entend de l'amphi que ce qui traverse le chêne : les
 * graves. La montée du passe-bas est calée sur le débattement des vantaux.
 */
export function setRoomOpen(open: boolean) {
  doorIsOpen = open;
  if (!ctx || !muffle || !roomBus) return;
  const now = ctx.currentTime;
  muffle.frequency.cancelScheduledValues(now);
  muffle.frequency.setValueAtTime(muffle.frequency.value, now);
  muffle.frequency.exponentialRampToValueAtTime(open ? OPEN_HZ : MUFFLED_HZ, now + 1.3);
  roomBus.gain.cancelScheduledValues(now);
  roomBus.gain.setTargetAtTime(open ? 1 : 0.55, now, 0.5);
}

/** Grincement long d'un lourd battant en chêne. */
export function playCreak() {
  const audio = ctx;
  if (!audio || !doorBus) return;
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(74, now);
  osc.frequency.exponentialRampToValueAtTime(190, now + 1.25);

  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 620;
  band.Q.value = 7;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.18);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

  // Micro-vibrato : c'est ce qui fait « bois » plutôt que « sirène ».
  const wobble = audio.createOscillator();
  wobble.frequency.value = 11;
  const wobbleDepth = audio.createGain();
  wobbleDepth.gain.value = 26;
  wobble.connect(wobbleDepth).connect(osc.frequency);

  osc.connect(band).connect(gain).connect(doorBus);
  osc.start(now);
  wobble.start(now);
  osc.stop(now + 1.6);
  wobble.stop(now + 1.6);
}

/** Claquement sec du loquet en laiton. */
export function playLatch() {
  const audio = ctx;
  if (!audio || !doorBus) return;
  const now = audio.currentTime;

  const source = audio.createBufferSource();
  source.buffer = brownNoise(audio, 0.2);

  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2400;
  band.Q.value = 3;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  source.connect(band).connect(gain).connect(doorBus);
  source.start(now);
  source.stop(now + 0.2);
}

/** Petite cloche à l'ouverture d'une fiche projet. */
export function playChime() {
  const audio = ctx;
  if (!audio || !doorBus) return;
  const now = audio.currentTime;
  const bus = doorBus;

  [880, 1320, 1760].forEach((frequency, index) => {
    const osc = audio.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency;
    const gain = audio.createGain();
    const peak = 0.07 / (index + 1);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1 - index * 0.2);
    osc.connect(gain).connect(bus);
    osc.start(now);
    osc.stop(now + 1.2);
  });
}
