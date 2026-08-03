"use client";

import { MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import { startTransition, useCallback, useEffect, useState } from "react";
import { Door } from "@/components/door/Door";
import { PointerProvider } from "@/components/providers/PointerProvider";
import { ProjectsOutline } from "@/components/ui/ProjectsOutline";
import { RoomHud } from "@/components/ui/RoomHud";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { playChime, playCreak, playLatch, setRoomOpen } from "@/lib/audio";
import type { Project } from "@/types/project";

/* La salle et la fiche projet ne servent pas au premier écran : les charger
   au démarrage allongerait pour rien l'hydratation, donc le LCP de la porte.
   Elles sont donc découpées hors du bundle initial. */
const Classroom = dynamic(
  () => import("@/components/classroom/Classroom").then((m) => m.Classroom),
  { ssr: false },
);

const ProjectModal = dynamic(
  () => import("@/components/project/ProjectModal").then((m) => m.ProjectModal),
  { ssr: false },
);

/**
 * Trois états, un seul chemin :
 *   « seuil »     la porte fermée, seule à l'écran
 *   « passage »   la porte s'ouvre, la salle se découvre derrière
 *   « salle »     le seuil est démonté, on est entré
 */
type Phase = "seuil" | "passage" | "salle";

export function Experience() {
  const [phase, setPhase] = useState<Phase>("seuil");
  const [selected, setSelected] = useState<Project | null>(null);
  const [hintSeen, setHintSeen] = useState(false);
  /* Une fois ouverte, la fiche reste montée : c'est `AnimatePresence`, à
     l'intérieur, qui joue la sortie. La démonter ici la ferait disparaître
     d'un coup. */
  const [cardEverOpened, setCardEverOpened] = useState(false);
  /**
   * La salle est construite *avant* qu'on ouvre, cachée derrière les vantaux.
   *
   * Monter sept élèves, cinq faces de décor et vingt-deux poussières coûte
   * environ 150 ms de rendu. Payé au clic, ce coût tombait en plein début
   * d'animation et se voyait. Payé pendant que le visiteur regarde la porte,
   * il ne se voit pas du tout.
   */
  const [roomBuilt, setRoomBuilt] = useState(false);

  /**
   * Construction anticipée, mais jamais avant que la page soit entièrement
   * chargée : lancée plus tôt, elle repoussait le LCP et gonflait le temps de
   * blocage. On attend donc `load`, puis le premier moment d'inactivité.
   *
   * `startTransition` rend la construction interruptible : React la découpe et
   * rend la main au navigateur entre deux morceaux, au lieu de monopoliser le
   * fil principal pendant 150 ms d'affilée.
   */
  useEffect(() => {
    let idle = 0;
    const schedule = () => {
      const build = () => startTransition(() => setRoomBuilt(true));
      idle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(build, { timeout: 4000 })
          : window.setTimeout(build, 800);
    };

    if (document.readyState === "complete") {
      schedule();
      return () => window.cancelIdleCallback?.(idle);
    }
    window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      window.cancelIdleCallback?.(idle);
    };
  }, []);

  /* Survol ou focus de la poignée : on n'attend plus le temps mort. */
  const buildRoom = useCallback(() => {
    startTransition(() => setRoomBuilt(true));
  }, []);

  const enter = useCallback(() => {
    playLatch();
    window.setTimeout(playCreak, 170);
    /* L'acoustique s'ouvre au rythme des vantaux : le murmure de l'amphi, jusque
       là étouffé par le chêne, se dégage pendant qu'ils tournent. */
    setRoomOpen(true);
    setRoomBuilt(true);
    setPhase("passage");
  }, []);

  const select = useCallback((project: Project) => {
    playChime();
    setHintSeen(true);
    setCardEverOpened(true);
    setSelected(project);
  }, []);

  const close = useCallback(() => setSelected(null), []);

  return (
    /* `reducedMotion="user"` : Motion neutralise alors tous les déplacements et
       rotations pour qui a désactivé les animations, et ne conserve que les
       fondus. Une seule ligne remplace un `useReducedMotion()` dans chacun des
       douze composants animés. */
    <MotionConfig reducedMotion="user">
      <PointerProvider>
        <main className="fixed inset-0 overflow-hidden">
          {/* Tant que la porte est fermée, la salle existe déjà mais reste
              entièrement masquée par les vantaux. */}
          {roomBuilt ? <Classroom onSelect={select} /> : null}

          {/* L'interface est montée dès le passage — un composant de plus à
              construire à l'arrivée ferait sauter une frame — mais elle ne se
              révèle qu'une fois le seuil franchi, sans quoi le titre
              transparaîtrait dans l'embrasure. */}
          {phase !== "seuil" ? (
            <RoomHud visible={phase === "salle"} hintVisible={!hintSeen} />
          ) : null}

          {phase !== "salle" ? (
            <Door
              open={phase !== "seuil"}
              onEnter={enter}
              onPrefetch={buildRoom}
              onEntered={() => setPhase("salle")}
            />
          ) : null}

          {cardEverOpened ? <ProjectModal project={selected} onClose={close} /> : null}

          <div className="pointer-events-none absolute right-4 top-4 z-40 sm:right-6 sm:top-6">
            <SoundToggle />
          </div>
        </main>

        <ProjectsOutline />
      </PointerProvider>
    </MotionConfig>
  );
}
