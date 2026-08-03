/**
 * ── THE ARMORY ─────────────────────────────────────────────────────────────
 * The desert island: the vault where the gear is kept.
 *
 * ── WHERE THE WORDS LIVE ───────────────────────────────────────────────────
 * Every group and badge is in `armory` in content/portfolio.ts. This file
 * holds only the look — the palette and the weather — the same split every
 * island page uses.
 */

/**
 * Sunlit sand and bronze. Warm the whole way through, with one cooler shadow
 * tone so the gold has something to sit against — an entirely warm palette
 * goes flat and muddy, with nothing for the badges to lift off.
 */
export const ARMORY_PALETTE = {
  bg: "#1c1408",
  bgDeep: "#100b04",
  panel: "rgba(86, 62, 26, 0.42)",
  panelDeep: "rgba(46, 32, 12, 0.5)",

  /** Warm off-white, like paper in sunlight. */
  ink: "#f7efdd",
  inkSoft: "rgba(238, 224, 198, 0.84)",
  inkFaint: "rgba(210, 188, 150, 0.62)",

  /** Struck gold. */
  accent: "#e6b34c",
  accentSoft: "rgba(230, 179, 76, 0.14)",
  accentEdge: "rgba(230, 179, 76, 0.6)",
  accentInk: "#1c1204",
  /** Bronze, for the quieter marks. */
  accent2: "#c08a45",

  line: "rgba(214, 172, 106, 0.22)",
  lineStrong: "rgba(226, 186, 122, 0.46)",
} as const;

export const ARMORY_SCENE = {
  /**
   * ── WHICH BACKDROP ───────────────────────────────────────────────────────
   * "image"  — the full-bleed painting at `backdrop.image.src`.
   * "island" — the original desertland cut-out, configured under `island`.
   *
   * TO REVERT: change this one word to "island". The `island` block below is
   * intact and still wired up, and both share the same parallax and scrim.
   */
  backdrop: {
    mode: "image" as "image" | "island",
    image: {
      src: "/images/armory-bg.png",
      /*
       * The painting is a bright golden-hour desert, and this page is already
       * gold from the badges up. Left alone the two stack into one yellow
       * wash with no contrast anywhere. Saturation comes down and a small
       * hue-rotate cools it toward bronze, which leaves the ACCENT gold as the
       * brightest warm thing on the page — where it belongs.
       */
      grade: "saturate(0.6) brightness(0.5) contrast(1.06) hue-rotate(-6deg)",
      opacity: 0.9,
      blurPx: 1.5,
      /** % scaled past the viewport, so parallax never reveals an edge. */
      overscan: 9,
    },
  },

  /**
   * The desert island cut-out. Used when `backdrop.mode` is "island".
   * Anchored LOW: this page is a list of gear, and the
   * dunes belong under it as ground rather than over it as a ceiling.
   */
  island: {
    src: "/images/islands/desertland.png",
    glow: "/images/islands/desertlandglow.png",
    /** % of viewport width. */
    width: 128,
    mobileWidth: 250,
    /** % of the art's own height hanging below the bottom edge. */
    sink: 32,
    opacity: 0.4,
    blurPx: 2.6,
    /** A CSS `filter` on the IMAGE — never a tinted overlay, which would
     *  recolour the page behind it and draw a visible rectangle. */
    grade: "saturate(0.8) brightness(0.5) contrast(1.06) hue-rotate(4deg)",
    glowOpacity: 0.28,
  },

  /**
   * The scrim. `floor` is a flat wash over the whole viewport — this page
   * scrolls past a FIXED backdrop, so a purely left-weighted gradient would
   * leave the lower groups sitting on whatever happens to be bright.
   */
  scrim: { opacity: 0.78, reach: 52, floor: 0.2 },

  /**
   * ── SAND ─────────────────────────────────────────────────────────────────
   * Dust carried on a light wind: drifting mostly sideways, rising a little,
   * catching the sun. Faster and flatter than snow — sand does not fall
   * straight down, it travels.
   */
  dust: {
    count: 70,
    mobileCount: 28,
    size: [0.7, 2.2] as [number, number],
    /** px/sec. Positive drifts right; the wind here blows one way. */
    driftX: [12, 46] as [number, number],
    driftY: [-9, 3] as [number, number],
    sway: [8, 34] as [number, number],
    swaySpeed: [0.06, 0.2] as [number, number],
    opacity: [0.12, 0.5] as [number, number],
  },

  /** A few larger, softer motes nearer the viewer. */
  bokeh: {
    count: 12,
    mobileCount: 5,
    size: [4, 11] as [number, number],
    driftX: [6, 20] as [number, number],
    driftY: [-5, 2] as [number, number],
    sway: [14, 46] as [number, number],
    swaySpeed: [0.03, 0.1] as [number, number],
    opacity: [0.04, 0.12] as [number, number],
  },

  /**
   * Heat shimmer: a slow horizontal wobble low on the page, done as a CSS
   * transform on a masked band rather than a per-pixel distortion — the real
   * thing needs a shader, and this reads the same at a fraction of the cost.
   */
  shimmer: { opacity: 0.5, periodS: 7, ampPx: 5 },

  /** Sun glare, high and warm. */
  glare: {
    x: 62,
    y: 4,
    size: 70,
    color: "rgba(255, 206, 130, 0.5)",
    opacity: 0.6,
    pulseS: 12,
  },

  /**
   * ── POINTER PARALLAX ─────────────────────────────────────────────────────
   * Bokeh nearest, dust behind it, the dunes furthest. The GAPS are the depth.
   */
  parallax: {
    bokeh: 44,
    dust: 28,
    island: 12,
    easing: 3,
    /** No hovering cursor on a touch screen. */
    mobileScale: 0,
    reducedScale: 0.22,
  },

  /** Seconds each group waits before its entrance. */
  stagger: 0.09,
} as const;

export const armoryVars = (): Record<string, string> => ({
  "--ar-bg": ARMORY_PALETTE.bg,
  "--ar-bg-deep": ARMORY_PALETTE.bgDeep,
  "--ar-panel": ARMORY_PALETTE.panel,
  "--ar-panel-deep": ARMORY_PALETTE.panelDeep,
  "--ar-ink": ARMORY_PALETTE.ink,
  "--ar-ink-soft": ARMORY_PALETTE.inkSoft,
  "--ar-ink-faint": ARMORY_PALETTE.inkFaint,
  "--ar-accent": ARMORY_PALETTE.accent,
  "--ar-accent-soft": ARMORY_PALETTE.accentSoft,
  "--ar-accent-edge": ARMORY_PALETTE.accentEdge,
  "--ar-accent-ink": ARMORY_PALETTE.accentInk,
  "--ar-accent2": ARMORY_PALETTE.accent2,
  "--ar-line": ARMORY_PALETTE.line,
  "--ar-line-strong": ARMORY_PALETTE.lineStrong,

  "--ar-island-w": `${ARMORY_SCENE.island.width}vw`,
  "--ar-island-w-mobile": `${ARMORY_SCENE.island.mobileWidth}vw`,
  "--ar-island-sink": `${ARMORY_SCENE.island.sink}%`,
  "--ar-island-opacity": `${ARMORY_SCENE.island.opacity}`,
  "--ar-island-blur": `${ARMORY_SCENE.island.blurPx}px`,
  "--ar-island-grade": ARMORY_SCENE.island.grade,
  "--ar-island-glow-opacity": `${ARMORY_SCENE.island.glowOpacity}`,

  "--ar-scrim-opacity": `${ARMORY_SCENE.scrim.opacity}`,
  "--ar-scrim-reach": `${ARMORY_SCENE.scrim.reach}%`,
  "--ar-scrim-floor": `${ARMORY_SCENE.scrim.floor}`,

  "--ar-bg-grade": ARMORY_SCENE.backdrop.image.grade,
  "--ar-bg-opacity": `${ARMORY_SCENE.backdrop.image.opacity}`,
  "--ar-bg-blur": `${ARMORY_SCENE.backdrop.image.blurPx}px`,
  "--ar-bg-overscan": `${ARMORY_SCENE.backdrop.image.overscan}%`,

  "--ar-shimmer-opacity": `${ARMORY_SCENE.shimmer.opacity}`,
  "--ar-shimmer-period": `${ARMORY_SCENE.shimmer.periodS}s`,
  "--ar-shimmer-amp": `${ARMORY_SCENE.shimmer.ampPx}px`,

  "--ar-glare-x": `${ARMORY_SCENE.glare.x}%`,
  "--ar-glare-y": `${ARMORY_SCENE.glare.y}%`,
  "--ar-glare-size": `${ARMORY_SCENE.glare.size}vw`,
  "--ar-glare-color": ARMORY_SCENE.glare.color,
  "--ar-glare-opacity": `${ARMORY_SCENE.glare.opacity}`,
  "--ar-glare-pulse": `${ARMORY_SCENE.glare.pulseS}s`,

  "--ar-stagger": `${ARMORY_SCENE.stagger}s`,
});
