import { brownNoise, whiteNoise } from "./noise";

/**
 * L'ambiance d'un amphi d'école de commerce, entièrement synthétisée.
 *
 * Ce module est chargé à la demande, une fois seulement que le visiteur a
 * activé le son : il n'a rien à faire dans le bundle initial.
 *
 * ── Le murmure ───────────────────────────────────────────────────────────
 * Cinq « voix » tournent en parallèle. Chacune est du bruit filtré par deux
 * bandes passantes calées sur les formants de la parole (F1 vers 350–600 Hz,
 * F2 vers 900–1700 Hz), dont l'amplitude est modulée à un rythme syllabique
 * (3 à 5 Hz) lui-même modulé beaucoup plus lentement — quelqu'un parle, puis
 * se tait. À distance on ne perçoit plus les attaques des syllabes, seulement
 * cette ondulation : c'est elle qui fait entendre une conversation plutôt
 * qu'un souffle filtré.
 */

export interface Ambience {
  stop: () => void;
  pauseEvents: () => void;
  resumeEvents: () => void;
}

interface VoiceSpec {
  f1: number;
  f2: number;
  /** Rythme syllabique, en Hz. */
  syllable: number;
  /** Rythme des phrases : on parle, puis on écoute. */
  phrase: number;
  pan: number;
  level: number;
}

const VOICES: VoiceSpec[] = [
  { f1: 420, f2: 1150, syllable: 3.7, phrase: 0.09, pan: -0.62, level: 0.05 },
  { f1: 520, f2: 1450, syllable: 4.3, phrase: 0.062, pan: 0.48, level: 0.042 },
  { f1: 340, f2: 900, syllable: 3.1, phrase: 0.113, pan: -0.24, level: 0.046 },
  { f1: 600, f2: 1700, syllable: 4.9, phrase: 0.077, pan: 0.71, level: 0.034 },
  { f1: 470, f2: 1300, syllable: 2.7, phrase: 0.131, pan: 0.06, level: 0.04 },
];

function startWalla(audio: AudioContext, out: AudioNode) {
  // Deux sources partagées : une seule rendrait toutes les voix corrélées.
  const sources = [whiteNoise(audio, 3), whiteNoise(audio, 3)].map((buffer) => {
    const node = audio.createBufferSource();
    node.buffer = buffer;
    node.loop = true;
    return node;
  });

  const oscillators: OscillatorNode[] = [];

  VOICES.forEach((voice, index) => {
    const envelope = audio.createGain();
    // Base 0,5 et modulations 0,28 + 0,20 : le gain oscille entre 0,02 et 0,98
    // de `level`, jamais en négatif — un gain négatif inverserait la phase pour
    // rien.
    envelope.gain.value = voice.level * 0.5;

    // Syllabes × phrasé : deux sinus incommensurables, donc jamais de boucle
    // audible.
    [voice.syllable, voice.phrase].forEach((frequency, depthIndex) => {
      const lfo = audio.createOscillator();
      lfo.frequency.value = frequency;
      const depth = audio.createGain();
      depth.gain.value = voice.level * (depthIndex === 0 ? 0.28 : 0.2);
      lfo.connect(depth).connect(envelope.gain);
      lfo.start();
      oscillators.push(lfo);
    });

    const panner = audio.createStereoPanner();
    panner.pan.value = voice.pan;

    sources[index % sources.length].connect(envelope);

    [voice.f1, voice.f2].forEach((frequency, formantIndex) => {
      const formant = audio.createBiquadFilter();
      formant.type = "bandpass";
      formant.frequency.value = frequency;
      formant.Q.value = formantIndex === 0 ? 7 : 5;

      // Le formant dérive : sans cela on entend un filtre, pas une voix.
      const drift = audio.createOscillator();
      drift.frequency.value = 0.21 + index * 0.043;
      const driftDepth = audio.createGain();
      driftDepth.gain.value = frequency * 0.16;
      drift.connect(driftDepth).connect(formant.frequency);
      drift.start();
      oscillators.push(drift);

      const trim = audio.createGain();
      trim.gain.value = formantIndex === 0 ? 1 : 0.55;

      envelope.connect(formant).connect(trim).connect(panner);
    });

    panner.connect(out);
  });

  sources.forEach((source) => source.start());

  return () => {
    sources.forEach((source) => source.stop());
    oscillators.forEach((osc) => osc.stop());
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   LES BRUITS DE SALLE
   ═══════════════════════════════════════════════════════════════════════════ */

/** Une frappe de clavier : le clic de la touche, puis le choc sourd dessous. */
function keystroke(audio: AudioContext, out: AudioNode, at: number, level: number) {
  const click = audio.createBufferSource();
  click.buffer = whiteNoise(audio, 0.05);
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2200 + Math.random() * 1600;
  band.Q.value = 1.6;
  const clickGain = audio.createGain();
  clickGain.gain.setValueAtTime(level, at);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.022);
  click.connect(band).connect(clickGain).connect(out);
  click.start(at);
  click.stop(at + 0.05);

  const thock = audio.createOscillator();
  thock.type = "sine";
  thock.frequency.setValueAtTime(190 + Math.random() * 60, at);
  const thockGain = audio.createGain();
  thockGain.gain.setValueAtTime(level * 0.5, at);
  thockGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.035);
  thock.connect(thockGain).connect(out);
  thock.start(at);
  thock.stop(at + 0.05);
}

/** Une feuille qu'on tourne : bruit large balayé, avec deux froissements. */
function paper(audio: AudioContext, out: AudioNode, at: number) {
  const source = audio.createBufferSource();
  source.buffer = whiteNoise(audio, 0.6);
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(1100, at);
  band.frequency.exponentialRampToValueAtTime(3600, at + 0.34);
  band.Q.value = 0.9;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.05, at + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.016, at + 0.16);
  gain.gain.exponentialRampToValueAtTime(0.042, at + 0.23);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.42);
  source.connect(band).connect(gain).connect(out);
  source.start(at);
  source.stop(at + 0.6);
}

/** Un stylo qu'on clique : deux impulsions très courtes. */
function penClick(audio: AudioContext, out: AudioNode, at: number) {
  [0, 0.11].forEach((offset, index) => {
    const source = audio.createBufferSource();
    source.buffer = whiteNoise(audio, 0.03);
    const band = audio.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = index === 0 ? 3800 : 3100;
    band.Q.value = 3;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.05, at + offset);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + offset + 0.012);
    source.connect(band).connect(gain).connect(out);
    source.start(at + offset);
    source.stop(at + offset + 0.03);
  });
}

/** Une chaise qui grince sous quelqu'un qui se réinstalle. */
function chair(audio: AudioContext, out: AudioNode, at: number) {
  const osc = audio.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(88 + Math.random() * 30, at);
  osc.frequency.exponentialRampToValueAtTime(150, at + 0.4);
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 520;
  band.Q.value = 8;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.035, at + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);

  const wobble = audio.createOscillator();
  wobble.frequency.value = 9;
  const wobbleDepth = audio.createGain();
  wobbleDepth.gain.value = 14;
  wobble.connect(wobbleDepth).connect(osc.frequency);

  osc.connect(band).connect(gain).connect(out);
  osc.start(at);
  wobble.start(at);
  osc.stop(at + 0.55);
  wobble.stop(at + 0.55);
}

/**
 * Programmateur à l'avance : toutes les 300 ms on remplit la seconde à venir.
 *
 * Les événements sont calés sur l'horloge audio, pas sur `setTimeout` : c'est
 * la seule façon d'obtenir un placement régulier quand le fil principal est
 * occupé à animer la salle.
 */
function startEvents(audio: AudioContext, out: AudioNode) {
  let nextEventAt = audio.currentTime + 0.6;

  const fill = () => {
    const horizon = audio.currentTime + 1.2;
    while (nextEventAt < horizon) {
      const roll = Math.random();

      if (roll < 0.5) {
        // Une salve de frappe : quelqu'un prend des notes sur son portable.
        const strokes = 3 + Math.floor(Math.random() * 10);
        const level = 0.03 + Math.random() * 0.035;
        let at = nextEventAt;
        for (let i = 0; i < strokes; i += 1) {
          keystroke(audio, out, at, level * (0.75 + Math.random() * 0.5));
          at += 0.06 + Math.random() * 0.11;
        }
        nextEventAt = at + 0.3 + Math.random() * 1.6;
      } else if (roll < 0.68) {
        paper(audio, out, nextEventAt);
        nextEventAt += 0.9 + Math.random() * 2.4;
      } else if (roll < 0.8) {
        penClick(audio, out, nextEventAt);
        nextEventAt += 1.2 + Math.random() * 3;
      } else if (roll < 0.9) {
        chair(audio, out, nextEventAt);
        nextEventAt += 1.6 + Math.random() * 3.5;
      } else {
        // Un silence : sans creux, la salle sonne comme une boucle.
        nextEventAt += 1.5 + Math.random() * 3;
      }
    }
  };

  fill();
  const timer = window.setInterval(fill, 300);
  return () => window.clearInterval(timer);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ASSEMBLAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function startAmbience(audio: AudioContext, out: AudioNode): Ambience {
  // Fond d'air de la pièce.
  const air = audio.createBufferSource();
  air.buffer = brownNoise(audio);
  air.loop = true;
  const airFilter = audio.createBiquadFilter();
  airFilter.type = "lowpass";
  airFilter.frequency.value = 360;
  airFilter.Q.value = 0.6;
  const airGain = audio.createGain();
  airGain.gain.value = 0.42;

  // Respiration très lente du filtre : la pièce « vit » sans se répéter.
  const breath = audio.createOscillator();
  breath.frequency.value = 0.06;
  const breathDepth = audio.createGain();
  breathDepth.gain.value = 90;
  breath.connect(breathDepth).connect(airFilter.frequency);

  // Ventilation : le bourdon continu qu'on n'entend plus au bout d'une minute.
  const hvacGain = audio.createGain();
  hvacGain.gain.value = 0.03;
  const hvac = [52, 78, 104].map((frequency, index) => {
    const osc = audio.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency;
    osc.detune.value = index * 5 - 5;
    osc.connect(hvacGain);
    osc.start();
    return osc;
  });

  air.connect(airFilter).connect(airGain).connect(out);
  hvacGain.connect(out);
  air.start();
  breath.start();

  const stopWalla = startWalla(audio, out);
  /* Le programmateur est mis en pause quand le son est coupé : sans cela il
     continuerait à créer des dizaines de nœuds par minute pour rien. */
  let stopEvents = startEvents(audio, out);
  let eventsRunning = true;

  return {
    pauseEvents() {
      if (!eventsRunning) return;
      stopEvents();
      eventsRunning = false;
    },
    resumeEvents() {
      if (eventsRunning) return;
      stopEvents = startEvents(audio, out);
      eventsRunning = true;
    },
    stop() {
      if (eventsRunning) stopEvents();
      stopWalla();
      air.stop();
      breath.stop();
      hvac.forEach((osc) => osc.stop());
    },
  };
}
