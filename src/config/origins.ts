/**
 * ── ORIGINS ────────────────────────────────────────────────────────────────
 * The forest island: where the story is told.
 *
 * ── WHERE THE WORDS LIVE ───────────────────────────────────────────────────
 * Every heading and paragraph is in `origins` in content/portfolio.ts. This
 * file holds only the look — the palette and the weather — which is the same
 * split every island page uses.
 */

/**
 * Forest at dusk. Deep green ink over near-black, with warm firefly gold as
 * the single accent.
 *
 * The gold is doing real work: a wholly green page reads as murky, and one
 * warm light in a cold wood is the whole image the page is chasing.
 */
export const ORIGINS_PALETTE = {
  bg: "#0b1a14",
  bgDeep: "#050e0a",
  panel: "rgba(30, 58, 44, 0.5)",
  panelDeep: "rgba(14, 32, 24, 0.55)",

  /** Warm off-white — paper under a lamp, not clinical white. */
  ink: "#f1f3ea",
  inkSoft: "rgba(219, 231, 220, 0.84)",
  inkFaint: "rgba(178, 200, 184, 0.6)",

  /** Firefly light. */
  accent: "#e9c46a",
  accentSoft: "rgba(233, 196, 106, 0.15)",
  accentEdge: "rgba(233, 196, 106, 0.6)",
  accentInk: "#1d1706",
  /** The cool counterpart — moss and canopy. */
  accent2: "#8fc9a0",

  line: "rgba(150, 200, 168, 0.2)",
  lineStrong: "rgba(160, 210, 178, 0.44)",
} as const;

export const ORIGINS_SCENE = {
  /**
   * ── WHICH BACKDROP ───────────────────────────────────────────────────────
   * "image"  — the full-bleed painting at `backdrop.image.src`.
   * "island" — the original forestland cut-out, configured under `island`.
   *
   * TO REVERT to the forest cut-out: change this one word to "island".
   * Nothing else needs touching — the `island` block is still here and still
   * wired up, and both share the same parallax, scrim, fireflies and mist.
   */
  backdrop: {
    mode: "image" as "image" | "island",
    image: {
      src: "/images/origins-bg.png",
      /*
       * A bright daylight sky behind a LONG page of body copy. Graded hard on
       * the image itself — the scrim alone would have to be so heavy to tame
       * it that the picture would stop being a picture.
       */
      /*
       * Was brightness(0.38) with a heavy scrim over the top, which between
       * them buried the painting. The image now carries most of its own
       * legibility work — a lighter grade plus much less wash — and the
       * darkening that remains is concentrated behind the text column rather
       * than spread across the whole page.
       */
      grade: "saturate(0.9) brightness(0.72) contrast(1.04)",
      opacity: 0.95,
      blurPx: 1,
      /** % scaled past the viewport, so parallax never reveals an edge. */
      overscan: 9,
    },
  },

  /**
   * The forest island cut-out. Used when `backdrop.mode` is "island".
   *
   * Sits at the BOTTOM rather than the top: this page scrolls a long way, and
   * a canopy anchored to the top edge scrolls out of the reader's mind after
   * the first section. Fixed to the lower edge it stays present the whole way
   * down, like ground under the words.
   */
  island: {
    src: "/images/islands/forestland.png",
    glow: "/images/islands/forestlandglow.png",
    /** % of viewport width. */
    width: 132,
    mobileWidth: 260,
    /** % of the art's own height hanging below the bottom edge. */
    sink: 30,
    opacity: 0.42,
    blurPx: 2.6,
    /**
     * A CSS `filter` on the IMAGE — never a tinted overlay, which would
     * recolour the page behind it and draw a visible rectangle.
     */
    grade: "saturate(0.72) brightness(0.52) contrast(1.06) hue-rotate(-8deg)",
    glowOpacity: 0.26,
  },

  /**
   * The scrim.
   *
   * `floor` is the minimum darkness applied across the WHOLE viewport, on top
   * of the left-weighted gradient. It exists because this page scrolls ~2700px
   * against a FIXED backdrop: a purely left-weighted scrim keeps the opening
   * readable and then leaves later sections sitting on whatever part of the
   * picture happens to be bright.
   */
  /**
   * ── THE SCRIM, IN TWO PARTS ──────────────────────────────────────────────
   * `page` is the whole-viewport wash and is now deliberately light: it exists
   * to stop the picture competing, not to hide it.
   *
   *   opacity  overall strength of the page wash
   *   reach    how far across the page its dark side extends, as a %
   *   floor    a flat minimum over the whole viewport
   *
   * `column` is the local darkening that sits behind the TEXT only, so the
   * open right-hand side of the page keeps the painting at full strength.
   * Raise `column` first if anything is hard to read — it costs nothing
   * visually where there is no text.
   */
  scrim: { opacity: 0.72, reach: 48, floor: 0.14, column: 0.62 },

  /**
   * ── FIREFLIES ────────────────────────────────────────────────────────────
   * Slow drifting points of warm light that BLINK — each on its own phase and
   * rate, so the wood twinkles rather than pulsing as one organism.
   *
   * `blinkFloor` is how far down each dims. Set it to 1 for steady lights.
   */
  fireflies: {
    count: 38,
    mobileCount: 16,
    size: [1.2, 3] as [number, number],
    /** Drift, px/sec. They wander rather than fall. */
    driftX: [-14, 14] as [number, number],
    driftY: [-11, -2] as [number, number],
    sway: [14, 52] as [number, number],
    swaySpeed: [0.05, 0.16] as [number, number],
    opacity: [0.3, 0.9] as [number, number],
    blinkFloor: 0.05,
    blinkSpeed: [0.18, 0.7] as [number, number],
  },

  /**
   * ── LEAVES ───────────────────────────────────────────────────────────────
   * Falling and swaying, tumbling slowly as they go. Drawn as two arcs meeting
   * at a point with a midrib — a leaf shape rather than a coloured rectangle,
   * which is what makes it read as a wood and not as confetti.
   */
  leaves: {
    count: 16,
    mobileCount: 7,
    /** Length in px. */
    size: [9, 20] as [number, number],
    /** Fall speed, px/sec. */
    speed: [12, 34] as [number, number],
    sway: [22, 72] as [number, number],
    swaySpeed: [0.06, 0.2] as [number, number],
    /** Tumble, rotations/sec. Signed. */
    spin: [-0.22, 0.22] as [number, number],
    opacity: [0.16, 0.42] as [number, number],
    /** Picked per leaf: autumn golds through deep canopy green. */
    colors: ["#c8a24a", "#a8894a", "#7fa96a", "#5e8f5a", "#d0b063"],
  },

  /** Ground mist between the trunks, drifting sideways. */
  mist: {
    color: "rgba(140, 190, 160, 0.16)",
    driftS: 52,
    opacity: 0.6,
  },

  /** Shafts of dusk light through the canopy. */
  rays: {
    count: 4,
    originX: 62,
    originY: -8,
    opacity: 0.34,
    breatheS: 16,
    sweepDeg: 3,
    sweepS: 30,
    color: "rgba(233, 196, 106, 0.4)",
  },

  /**
   * ── POINTER PARALLAX ──────────────────────────────────────────────────────
   * Leaves are nearest, then fireflies, then the island furthest away. The
   * GAPS between these are the depth cue.
   */
  parallax: {
    leaves: 44,
    fireflies: 30,
    island: 14,
    easing: 2.9,
    /** No hovering cursor on a touch screen. */
    mobileScale: 0,
    reducedScale: 0.22,
  },

  /** Seconds each section waits before its entrance. */
  stagger: 0.08,
} as const;

/** The palette and scene as CSS custom properties, for the page wrapper. */
export const originsVars = (): Record<string, string> => ({
  "--or-bg": ORIGINS_PALETTE.bg,
  "--or-bg-deep": ORIGINS_PALETTE.bgDeep,
  "--or-panel": ORIGINS_PALETTE.panel,
  "--or-panel-deep": ORIGINS_PALETTE.panelDeep,
  "--or-ink": ORIGINS_PALETTE.ink,
  "--or-ink-soft": ORIGINS_PALETTE.inkSoft,
  "--or-ink-faint": ORIGINS_PALETTE.inkFaint,
  "--or-accent": ORIGINS_PALETTE.accent,
  "--or-accent-soft": ORIGINS_PALETTE.accentSoft,
  "--or-accent-edge": ORIGINS_PALETTE.accentEdge,
  "--or-accent-ink": ORIGINS_PALETTE.accentInk,
  "--or-accent2": ORIGINS_PALETTE.accent2,
  "--or-line": ORIGINS_PALETTE.line,
  "--or-line-strong": ORIGINS_PALETTE.lineStrong,

  "--or-island-w": `${ORIGINS_SCENE.island.width}vw`,
  "--or-island-w-mobile": `${ORIGINS_SCENE.island.mobileWidth}vw`,
  "--or-island-sink": `${ORIGINS_SCENE.island.sink}%`,
  "--or-island-opacity": `${ORIGINS_SCENE.island.opacity}`,
  "--or-island-blur": `${ORIGINS_SCENE.island.blurPx}px`,
  "--or-island-grade": ORIGINS_SCENE.island.grade,
  "--or-island-glow-opacity": `${ORIGINS_SCENE.island.glowOpacity}`,

  "--or-scrim-opacity": `${ORIGINS_SCENE.scrim.opacity}`,
  "--or-scrim-reach": `${ORIGINS_SCENE.scrim.reach}%`,
  "--or-scrim-floor": `${ORIGINS_SCENE.scrim.floor}`,
  "--or-scrim-column": `${ORIGINS_SCENE.scrim.column}`,

  "--or-bg-grade": ORIGINS_SCENE.backdrop.image.grade,
  "--or-bg-opacity": `${ORIGINS_SCENE.backdrop.image.opacity}`,
  "--or-bg-blur": `${ORIGINS_SCENE.backdrop.image.blurPx}px`,
  "--or-bg-overscan": `${ORIGINS_SCENE.backdrop.image.overscan}%`,

  "--or-mist-color": ORIGINS_SCENE.mist.color,
  "--or-mist-drift": `${ORIGINS_SCENE.mist.driftS}s`,
  "--or-mist-opacity": `${ORIGINS_SCENE.mist.opacity}`,

  "--or-rays-x": `${ORIGINS_SCENE.rays.originX}%`,
  "--or-rays-y": `${ORIGINS_SCENE.rays.originY}%`,
  "--or-rays-opacity": `${ORIGINS_SCENE.rays.opacity}`,
  "--or-rays-breathe": `${ORIGINS_SCENE.rays.breatheS}s`,
  "--or-rays-color": ORIGINS_SCENE.rays.color,
  "--or-rays-sweep": `${ORIGINS_SCENE.rays.sweepDeg}deg`,
  "--or-rays-sweep-s": `${ORIGINS_SCENE.rays.sweepS}s`,

  "--or-stagger": `${ORIGINS_SCENE.stagger}s`,
});
