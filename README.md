# Salle de cours — portfolio d'Alexandre Thomas

Le visiteur arrive devant une double porte de chêne. Il l'ouvre. Derrière :
un amphithéâtre où chaque projet est assis à un pupitre, comme un ancien élève.

**En ligne :** <https://thomasdenet30-sys.github.io/portfolio/>

```bash
npm run dev     # http://localhost:3000
npm run build   # export statique dans out/
```

## Déploiement

Chaque `push` sur `main` déclenche `.github/workflows/deploy.yml`, qui construit
l'export et le publie sur GitHub Pages.

Le site est servi sous le sous-chemin `/portfolio`, passé au build par deux
variables d'environnement (`NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_SITE_URL`).
En local elles sont vides, donc `npm run dev` répond bien à la racine.

⚠️ `next/image` n'applique **pas** le `basePath` tout seul : les images locales
passent par `asset()` (`src/lib/site.ts`). Toute nouvelle `<Image>` pointant sur
`public/` doit faire de même, sinon elle sera introuvable une fois en ligne.

Pages ne servant que du statique, il n'y a pas d'optimiseur d'images à
l'exécution : les fichiers de `public/logos/` sont dimensionnés à la main.

## La promotion

| Rang | Projet | Adresse | Logo |
| --- | --- | --- | --- |
| 1ᵉʳ | FitClash | App Store | icône d'app |
| 1ᵉʳ | NousProprio | `nousproprio.com` | logotype du site |
| 1ᵉʳ | DateNow | App Store | icône d'app |
| 2ᵉ | Simulateur Bourse | GitHub Pages | favicon du site |
| 2ᵉ | IdéaMarket | GitHub Pages | icône + logotype |
| 2ᵉ | LEBONPLAN | GitHub Pages | icône + logotype |
| 2ᵉ | SaveBack *(en cours)* | **aucune** | marque dessinée |

Les palettes et les logos viennent des vrais projets : icônes iOS de FitClash et
DateNow, logotype et bleu marine de nousproprio.com, favicon émeraude du
simulateur, kits de marque d'IdéaMarket et de LEBONPLAN (variantes « dark »,
c'est-à-dire à texte clair, puisqu'elles se posent sur un fond coloré). Les
fichiers sont dans `public/logos/`.

Un logotype se pose **au-dessus** du voile lumineux du visuel et exige un
panneau assez sombre : c'est pourquoi le dégradé d'IdéaMarket est un violet
profond et non son violet → jaune de marque, où sa partie rose disparaissait.

Un lien vers l'App Store affiche « Télécharger sur l'App Store » plutôt que
« Découvrir le projet ».

## À compléter avant la mise en ligne

1. **SaveBack** — pas encore de lien (voulu), et sa description est un texte
   d'attente assumé, à réécrire dès que la promesse du projet est arrêtée.
   Sans `website`, sa fiche affiche « Bientôt en ligne » plutôt qu'un lien mort.
2. **Le domaine** — `metadataBase` dans `src/app/layout.tsx` et `url` dans le
   JSON‑LD de `src/app/page.tsx`.

## Ajouter un projet

Un seul endroit : `src/data/projects.ts`. Copiez un bloc, changez les valeurs.

Le personnage, son logo, sa plaque gravée, le visuel de sa fiche et sa place
dans l'amphithéâtre sont **entièrement dérivés de cet objet** — il n'y a aucune
image à produire. Le placement des rangées se recalcule tout seul
(`lib/seating.ts` connaît des dispositions dessinées à la main jusqu'à 12 élèves,
puis bascule sur une répartition automatique en trois rangs).

Les valeurs disponibles :

| Champ | Effet |
| --- | --- |
| `avatar.hairStyle` | `short` · `bun` · `wavy` · `curly` · `buzz` · `long` |
| `avatar.accessory` | `headband` · `tie` · `scarf` · `headphones` · `glasses` · `pen` · `cap` · `none` |
| `personality` | posture et expression au repos : `athletic`, `elegant`, `romantic`, `creative`, `trustworthy`, `analytical`, `resourceful` |
| `logo.mark` | marque dessinée par défaut : `bolt` · `roof` · `heart` · `spark` · `shield` · `chart` · `tag` · `bulb` |
| `logo.icon` | vrai logo carré (`/logos/…`) : remplace la marque dans la pastille **et** sur le grand visuel |
| `logo.wordmark` | logotype large, en version **claire** : va sur le grand visuel uniquement, car il serait illisible dans une pastille carrée |
| `image.motif` | `grid` · `arcs` · `rings` · `waves` · `shield` |
| `shortName` | nom gravé sur le pupitre si le nom complet n'y tient pas (≈ 11 caractères) |
| `website: ""` | projet pas encore public : la fiche affiche « Bientôt en ligne » |
| `inProgress` | ajoute un point lumineux sur la plaque et une pastille « En cours » |
| `colors.ink` / `colors.surface` | fond et texte de la fiche — gardez du **très sombre sur du très clair**, c'est ce qui garantit le contraste AA du bouton d'action |

## Architecture

```
src/
  app/            layout (métadonnées, police), page (JSON-LD), design system CSS
  components/
    Experience    la machine à trois états : seuil → passage → salle
    door/         Door · DoorLeaf · DoorHandle · DoorPlaque
    classroom/    Classroom · Background · CameraAnimation · LightEffects
      room/       les cinq faces du volume : murs, sol, plafond, fenêtres, bibliothèques
    students/     StudentCard · StudentCharacter · Desk · hair · accessories
    project/      ProjectModal · ProjectLogo · ProjectVisual
    ui/           RoomHud · SoundToggle · ProjectsOutline
  data/           les projets et l'identité de l'enseignant
  hooks/          useGaze (suivi du regard) · useFocusTrap
  lib/            motion (vocabulaire d'animation) · seating · audio · soundPreference
  types/          le modèle Project
```

## Choix techniques

**Pas de Three.js.** La salle est un volume CSS 3D : cinq plans assemblés dans un
conteneur en `perspective`, dont toute la géométrie dérive de deux variables en
`vmax` — les proportions sont donc identiques sur un 27 pouces et sur un
téléphone. Un canvas WebGL plein écran aurait coûté environ un demi‑méga‑octet de
runtime et rendu le 100 en performance inatteignable, pour une scène statique.

**Aucun fichier audio.** L'ambiance d'amphi est synthétisée en direct par la
Web Audio API : cinq « voix » de bruit filtré aux formants de la parole
(F1 350–600 Hz, F2 900–1700 Hz) modulées à un rythme syllabique lui-même modulé
au rythme des phrases, plus des claviers, des feuilles qu'on tourne, des stylos
et des chaises programmés sur l'horloge audio. Le tout passe par un passe-bas
qui n'ouvre qu'avec les vantaux — derrière du chêne, on n'entend que les graves.
`ambience.ts` est chargé à la demande : qui laisse le son coupé ne le télécharge
jamais.

Les personnages sont du SVG assemblé à la volée et les matières (chêne, laiton,
verre, tranches de livres) des dégradés CSS superposés. Seuls les vrais logos
des projets sont des fichiers.

**Ce qui bouge ne provoque jamais de rendu React.** Le regard des élèves et le
mouvement de caméra sont pilotés par des `MotionValue` alimentées par un seul
écouteur de pointeur cadencé au rAF. Tout est animé en `transform` et `opacity`,
donc composité par le GPU.

**La salle est chargée à la demande, puis construite d'avance.** Elle et la fiche
projet sortent du bundle initial pour ne pas alourdir le premier écran. Mais dès
que le fil principal est libre — ou au survol de la poignée — la salle est
montée, invisible derrière les vantaux fermés. Ses ~150 ms de rendu sont ainsi
payées pendant que le visiteur regarde la porte, et non au moment où il
l'ouvre.

**Le dolly ne porte que sur le chambranle.** La première version mettait à
l'échelle le plan plein écran : chaque frame devait recalculer le masque du
couloir, le grain en `mix-blend-mode` et trois flous à une taille différente, et
l'ouverture tombait à **24 images par seconde**. Aujourd'hui le couloir, le grain
et le vignettage ne bougent plus — ils s'effacent — les vantaux disparaissent dès
que la caméra s'élance, et seul le chambranle grandit. Mesuré sur cinq
ouvertures : **60 FPS, aucune frame au-dessus de 18 ms**.

**La baie est une vraie ouverture.** Le couloir est percé au `mask-composite` de
la silhouette exacte de la porte, si bien que la salle — montée dès le clic — se
découvre *à travers* les vantaux qui tournent, au lieu d'apparaître d'un coup
une fois le couloir démonté.

## Accessibilité

- Chaque élève est un `<button>` : survol et focus clavier déclenchent la même
  réaction. L'amphithéâtre se parcourt entièrement au clavier.
- La fiche projet piège le focus, se ferme sur `Échap` et rend le focus à l'élève.
- Le franchissement du seuil déplace le focus sur le titre de la salle.
- `MotionConfig reducedMotion="user"` : pour qui a désactivé les animations
  système, il ne reste que des fondus.
- Une version texte de la promotion (`ProjectsOutline`) est rendue côté serveur
  et masquée visuellement — elle sert aux lecteurs d'écran comme aux moteurs de
  recherche, qui ne franchiront jamais la porte.

## Lighthouse

Mesuré sur le build de production (`next start`, en local) :

| | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | --- | --- | --- | --- |
| **Desktop** | **100** | **100** | **100** | **100** |
| **Mobile** | 96–97 | **100** | **100** | **100** |

Sur mobile, **toutes les métriques sont à 1,00 sauf le LCP** : FCP 0,8 s,
Speed Index 0,8 s, TBT 30 ms, CLS 0. Le LCP (≈ 2,6–2,7 s simulées) plafonne donc
le score à 96 ou 97 selon les passages — la différence entre les deux est du
bruit de mesure sur la frontière d'arrondi, pas une régression. L'audit mobile simule
un processeur quatre fois plus lent : le délai vient presque entièrement de
l'hydratation de la scène, pas du réseau (toutes les ressources sont chargées en
moins de 200 ms, CLS à 0, TBT à 50 ms). Le TTFB mesuré ici est celui d'un
`next start` local ; derrière un CDN, la page étant pré‑rendue statiquement, il
tombe très bas.

⚠️ La construction anticipée de la salle est déclenchée **après l'événement
`load`**, puis au premier temps mort, et enveloppée dans un `startTransition`.
Lancée plus tôt ou d'un bloc, elle repoussait le LCP de 0,6 s à 1,0 s et faisait
tripler le temps de blocage. Si vous touchez à ce planning, remesurez.
