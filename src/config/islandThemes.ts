/**
 * ── ISLAND LANDING THEMES ──────────────────────────────────────────────────
 * One entry per island id (see config/islands.ts). Everything visual about a
 * landing page comes from here — <IslandLanding> is a single component driven
 * entirely by this config, so adding a themed world is a config edit, not a
 * new component.
 *
 * TO ADD OR RETHEME AN ISLAND:
 *   1. Point its `palette` at the colours you want. They become CSS custom
 *      properties on the page root, so every rule picks them up automatically.
 *      · bg       — the page backdrop. A full CSS gradient string, not a colour.
 *                   Keep every stop dark: the body scrolls across all of it.
 *      · heroGlow — gradient painted over the hero only, for a horizon light.
 *                   This is where a dramatic pale horizon belongs.
 *      · accent   — headings, rules, link borders, the effect's tint.
 *      · text     — body ink.
 *      · muted    — secondary text (eyebrow, captions).
 *      · panel    — translucent fill behind content blocks.
 *   2. Write `heroTitle` / `heroSubtitle` / `mood` (the small eyebrow line).
 *   3. Pick an `effect` from EFFECT_PRESETS below, or add a preset there, and
 *      a `scenery` layer ("winter" = branches + deer, "none" = nothing).
 *   4. Flip `themed` to true once it's had real design attention — it drives
 *      the "theme in progress" chip so unfinished worlds are obvious.
 *
 * WINTER is the finished template. The other four are deliberate placeholders.
 */
export type IslandEffect = keyof typeof EFFECT_PRESETS;

export interface IslandPalette {
  /** Page backdrop. Keep every stop DARK enough for `text` to stay readable —
      the body scrolls across the whole gradient, not just the top of it. */
  bg: string;
  /** Overlay painted on the hero only, for a horizon glow. A full gradient. */
  heroGlow: string;
  accent: string;
  text: string;
  muted: string;
  panel: string;
}

export interface IslandTheme {
  palette: IslandPalette;
  /** Small eyebrow line above the hero title. */
  mood: string;
  heroTitle: string;
  heroSubtitle: string;
  effect: IslandEffect;
  /** Extra silhouette layer for this world. "winter" adds branches + a deer. */
  scenery: "winter" | "none";
  /** False = still wearing the default theme; shows a "theme in progress" chip. */
  themed: boolean;
}

/**
 * ── AMBIENT PARTICLES ──────────────────────────────────────────────────────
 * Drawn on one lightweight canvas (AmbientEffect) from a single pre-rendered
 * soft sprite, so flakes have blurry edges without per-frame gradient work.
 *
 * Every particle gets a DEPTH (0 far → 1 near) that drives size, speed and
 * opacity together, which is what gives the fall its parallax. Motion is
 * delta-timed, so these look identical at 60 and 144 Hz.
 *
 *   count      ─ DENSITY. How many on screen at once.
 *   direction  ─ 1 falls, -1 rises
 *   size       ─ [far, near] radius in px. Widen the gap for more depth.
 *   speed      ─ [near, far] px/sec. Near flakes are the SLOW ones, so the
 *                first number is the slowest; raise both to quicken the fall.
 *   opacity    ─ [far, near]
 *   sway       ─ [min, max] px of sideways drift, per particle
 *   swaySpeed  ─ [min, max] radians/sec of that drift
 *   drift      ─ constant sideways wind, px/sec (negative blows left)
 *   softness   ─ 0 crisp disc → 1 pure haze. This is the star-vs-snow dial.
 *   color      ─ CSS colour; alpha comes from `opacity`
 */
export const EFFECT_PRESETS = {
  /** Calm, drifting snowfall — the winter island. */
  snow: {
    count: 260,
    direction: 1,
    size: [1.1, 5.5] as [number, number],
    speed: [26, 95] as [number, number],
    opacity: [0.28, 0.85] as [number, number],
    sway: [8, 34] as [number, number],
    swaySpeed: [0.25, 0.85] as [number, number],
    drift: -6,
    softness: 0.85,
    color: "rgba(255, 255, 255, 1)",
  },
  /** The neutral default: slow rising motes. Used by un-themed islands. */
  motes: {
    count: 60,
    direction: -1,
    size: [1, 3] as [number, number],
    speed: [8, 26] as [number, number],
    opacity: [0.14, 0.42] as [number, number],
    sway: [6, 16] as [number, number],
    swaySpeed: [0.15, 0.45] as [number, number],
    drift: 0,
    softness: 0.7,
    color: "rgba(255, 255, 255, 1)",
  },
  /** No particles at all. */
  none: {
    count: 0,
    direction: 1,
    size: [0, 0] as [number, number],
    speed: [0, 0] as [number, number],
    opacity: [0, 0] as [number, number],
    sway: [0, 0] as [number, number],
    swaySpeed: [0, 0] as [number, number],
    drift: 0,
    softness: 1,
    color: "rgba(255, 255, 255, 1)",
  },
} as const;

/**
 * ── WINTER SCENERY ─────────────────────────────────────────────────────────
 * The silhouette layer on the winter landing page: bare branches framing the
 * edges, and a deer that crosses now and then. All of it sits BEHIND the snow
 * and well behind the hero text — it should register as distant shadow, never
 * as illustration.
 */
export const WINTER_SCENERY = {
  branches: {
    /** How dark the branches read. Raise for a heavier frame. */
    opacity: 0.42,
    /** Blur in px — keeps them soft-edged and distant. */
    blur: 2.5,
    /** Seconds for one full sway cycle. Longer = lazier breeze. */
    swaySeconds: 13,
    /** Degrees of sway. Keep under ~1.5 or it reads as wobbling, not breeze. */
    swayDegrees: 0.9,
    color: "#040d1a",
  },
  deer: {
    opacity: 0.34,
    blur: 1.6,
    /** Seconds to cross the screen. */
    crossSeconds: 13,
    /** Seconds between the start of one crossing and the next. */
    everySeconds: 21,
    /** Seconds per gallop stride — also drives the body bounce. */
    strideSeconds: 0.62,
    /** How high the body lifts per stride, px. */
    bouncePx: 9,
    /** Height of the deer, px. */
    heightPx: 132,
    /** How far down the page it runs: 0 = top, 1 = bottom. */
    baseline: 0.72,
    color: "#04101f",
  },
} as const;

/** The placeholder palette every un-themed island borrows for now. */
const DEFAULT_PALETTE: IslandPalette = {
  bg: "linear-gradient(180deg, #201b30 0%, #2b2439 48%, #1d1928 100%)",
  heroGlow:
    "radial-gradient(ellipse 120% 65% at 50% 88%, rgba(227, 185, 138, 0.22) 0%, transparent 70%)",
  accent: "#e3b98a",
  text: "#efe7dc",
  muted: "rgba(239, 231, 220, 0.62)",
  panel: "rgba(255, 255, 255, 0.05)",
};

export const ISLAND_THEMES: Record<string, IslandTheme> = {
  /**
   * ✅ THE TEMPLATE — winter / "Innovation Lab".
   * Icy blues into a pale horizon, with falling snow. Copy this shape when
   * theming the others.
   */
  winter: {
    palette: {
      // Deep ice all the way down. The pale-horizon look lives in heroGlow
      // instead — as a page background it left white text on white ice.
      bg: "linear-gradient(180deg, #08182e 0%, #123659 48%, #0a1f38 100%)",
      heroGlow:
        "radial-gradient(ellipse 120% 65% at 50% 88%, rgba(168, 220, 245, 0.38) 0%, rgba(168, 220, 245, 0.09) 45%, transparent 72%)",
      accent: "#a8dcf5",
      text: "#eef7fc",
      muted: "rgba(238, 247, 252, 0.66)",
      panel: "rgba(173, 216, 240, 0.09)",
    },
    mood: "Where cold air keeps ideas sharp",
    heroTitle: "Innovation Lab",
    heroSubtitle:
      "A quiet workshop above the snowline — where half-formed hunches are given room to freeze solid, crack open, and become something worth building.",
    effect: "snow",
    scenery: "winter",
    themed: true,
  },

  // ── TODO: theme these four ────────────────────────────────────────────────
  // Each currently borrows DEFAULT_PALETTE and the neutral `motes` effect.
  // Give each its own palette, hero copy and effect, then set themed: true.

  /** TODO: theme me — music/rhythm. Try warm dusk + drifting embers. */
  floaty: {
    palette: DEFAULT_PALETTE,
    mood: "PLACEHOLDER — the island's one-line mood",
    heroTitle: "Rhythm Island",
    heroSubtitle:
      "PLACEHOLDER — a sentence or two setting the scene for this world. Replace when this island gets its own theme.",
    effect: "motes",
    scenery: "none",
    themed: false,
  },

  /** TODO: theme me — the maker's bench. Try sawdust motes + lamplight. */
  poly: {
    palette: DEFAULT_PALETTE,
    mood: "PLACEHOLDER — the island's one-line mood",
    heroTitle: "Workshop",
    heroSubtitle:
      "PLACEHOLDER — a sentence or two setting the scene for this world. Replace when this island gets its own theme.",
    effect: "motes",
    scenery: "none",
    themed: false,
  },

  /** TODO: theme me — play and experiment. Try bright canopy greens. */
  treehouse: {
    palette: DEFAULT_PALETTE,
    mood: "PLACEHOLDER — the island's one-line mood",
    heroTitle: "Playground",
    heroSubtitle:
      "PLACEHOLDER — a sentence or two setting the scene for this world. Replace when this island gets its own theme.",
    effect: "motes",
    scenery: "none",
    themed: false,
  },

  /** TODO: theme me — memory and campfire. Try night sky + rising sparks. */
  camping: {
    palette: DEFAULT_PALETTE,
    mood: "PLACEHOLDER — the island's one-line mood",
    heroTitle: "Memory Island",
    heroSubtitle:
      "PLACEHOLDER — a sentence or two setting the scene for this world. Replace when this island gets its own theme.",
    effect: "motes",
    scenery: "none",
    themed: false,
  },
};

export function getIslandTheme(id: string | null): IslandTheme | undefined {
  return id ? ISLAND_THEMES[id] : undefined;
}
