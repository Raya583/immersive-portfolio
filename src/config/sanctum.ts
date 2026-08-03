/**
 * ── THE SANCTUM ────────────────────────────────────────────────────────────
 * The home island: who he is, at the top of the mountain.
 *
 * ── WHERE THE WORDS LIVE ───────────────────────────────────────────────────
 * The name, title, tagline, intro paragraph and portrait all come from
 * `profile` in content/portfolio.ts. This file holds only what is specific to
 * THIS page — the call to action, the palette, and the weather.
 *
 * The same split every island page uses: content in portfolio.ts, presentation
 * in config.
 */

export const SANCTUM = {
  /**
   * The headline, in two parts: a small kicker over a large statement. Split
   * because they are styled nothing alike — "Welcome to" is a whisper and
   * "Yash's Realm" is the door swinging open.
   */
  kicker: "Welcome to",
  realm: "Yash's Realm",
  /**
   * The actions. Both TRAVEL to another island rather than merely closing the
   * page — arriving at a portfolio's front door and being sent back to a map
   * with no suggestion of where to go next is a dead end.
   *
   * `target` is a section id from config/sections.ts.
   */
  cta: { label: "Explore my work", target: "projects" },
  /**
   * ── THE CHARACTER SHEET ──────────────────────────────────────────────────
   * Range, as a stat block rather than a sentence. `level` out of `statMax`.
   *
   * These are a self-assessment, not a measurement — which is exactly what a
   * character sheet is, and why the diamonds read as flavour rather than as a
   * claim to have benchmarked anything.
   */
  /**
   * Diamonds, not numbers.
   *
   * A rating out of five reads as a self-assessment, which is exactly what it
   * is. A precise figure like "78" invites the question of how it was
   * measured, and there is no honest answer — the pips say the same thing
   * without claiming a precision nobody has.
   */
  statMax: 5,
  stats: [
    { label: "Design", level: 5 },
    { label: "Code", level: 4 },
    { label: "AI", level: 4 },
    { label: "Build", level: 5 },
  ] as { label: string; level: number }[],

  /**
   * ONE quest, then two quiet links. Three equal buttons gave the reader three
   * equal decisions; a hub should say what to do next and let the rest wait.
   */
  quest: {
    label: "Current quest",
    action: "Explore selected work",
    target: "projects",
  },
  secondary: [
    { label: "My story", target: "about" },
    { label: "Get in touch", target: "contact" },
  ] as { label: string; target: string }[],

  /**
   * The portrait's caption, in the style of a character card. `name` is the
   * short form — the full one is already the byline under the headline.
   */
  portrait: {
    name: "Yashwardhan",
    className: "Class · Product Engineer",
    /**
     * "ornate" gives the nameplate its cut-corner banner, gold rule and side
     * diamonds. "plain" is the bare two lines, for a quieter page.
     */
    nameplate: "ornate" as "ornate" | "plain",
    /**
     * The frame's silhouette, as a `border-radius` — horizontal radii before
     * the slash, vertical after.
     *
     * The dome's VERTICAL radius is the number that matters. At 55% it was
     * taller than half the box, which is what made the old frame read as an
     * egg with a flat bottom; 38% gives a dome that meets the sides cleanly.
     * The bottom corners are properly rounded too — a soft top over near-square
     * corners was the other half of the awkwardness.
     */
    shape: "50% 50% 26% 26% / 40% 40% 12% 12%",
    /** Width : height. Nearer square than the old 3/3.7, which was narrow. */
    ratio: "4 / 4.7",
  },

  /** Bottom-right, atmospheric. Not a card — a note in the margin. */
  exploring: {
    label: "Currently exploring",
    focus: "AI × Creative Engineering",
    updated: "Last updated · 2026",
  },
} as const;

/**
 * Serene and elevated: cold stone and sky, with one warm sunrise accent for
 * anything that acts. The warm mark is the point — an entirely cool palette on
 * a welcome page reads as distant rather than as calm.
 */
export const SANCTUM_PALETTE = {
  bg: "#101c28",
  bgDeep: "#080f18",
  panel: "rgba(38, 60, 82, 0.5)",
  panelDeep: "rgba(20, 36, 54, 0.5)",

  /** Warm off-white, not pure white — it sits on cold stone without glaring. */
  ink: "#f4f1ea",
  inkSoft: "rgba(226, 231, 238, 0.84)",
  inkFaint: "rgba(190, 203, 216, 0.62)",

  /** Sunrise on the peak. */
  accent: "#e8b06a",
  accentSoft: "rgba(232, 176, 106, 0.15)",
  accentEdge: "rgba(232, 176, 106, 0.6)",
  accentInk: "#20160a",
  /** The cool counterpart, for the ring and the smaller marks. */
  accent2: "#9fc4de",

  line: "rgba(168, 198, 222, 0.22)",
  lineStrong: "rgba(180, 208, 230, 0.46)",
} as const;

export const SANCTUM_SCENE = {
  /**
   * ── WHICH BACKDROP ───────────────────────────────────────────────────────
   * "image"  — the full-bleed painting at `backdrop.image.src`.
   * "island" — the original floating mountainland cut-out, configured under
   *            `mountain` below.
   *
   * TO REVERT to the island: change this one word to "island". Nothing else
   * needs touching — the `mountain` block is still here and still wired up,
   * and both share the same parallax, scrim and weather.
   */
  backdrop: {
    mode: "image" as "image" | "island",
    image: {
      src: "/images/sanctum-bg.png",
      /*
       * The painting is a BRIGHT daylight scene and the page's type is
       * off-white. Dimming it here — rather than piling more scrim on top —
       * keeps the sky readable as sky instead of as grey fog.
       */
      grade: "saturate(0.9) brightness(0.5) contrast(1.06)",
      opacity: 0.86,
      blurPx: 1.5,
      /** % scaled past the viewport, so parallax never reveals an edge. */
      overscan: 9,
    },
  },

  /**
   * The mountain cut-out. Used when `backdrop.mode` is "island". Anchored from
   * the TOP because the peak sits high in the artwork, so bottom-anchoring
   * buries it below the fold at any size worth showing.
   */
  mountain: {
    src: "/images/islands/mountainland.png",
    glow: "/images/islands/mountainlandglow.png",
    /** % of viewport width. */
    width: 128,
    mobileWidth: 280,
    /** % of the art's own height, offset from the top. Negative lifts. */
    top: -4,
    mobileTop: 2,
    opacity: 0.54,
    blurPx: 2.2,
    /** A CSS `filter` on the IMAGE — never an overlay, which would tint the
     *  page behind it too and draw a visible rectangle. */
    grade: "saturate(0.8) brightness(0.9) contrast(1.03)",
    glowOpacity: 0.32,
  },

  /**
   * The scrim between the mountain and the words. Weighted to the LEFT, where
   * the column sits, so the right of the peak stays clean.
   */
  scrim: { opacity: 0.94, reach: 58 },

  /**
   * Clouds drifting past the peak — the page's main movement.
   *
   * Wide, soft and slow. Each is a stretched radial blob rather than a drawn
   * shape: at this blur a cloud is a gradient, and trying to give it an
   * outline is what makes canvas clouds look like grey worms.
   */
  clouds: {
    count: 14,
    mobileCount: 7,
    /** Width in px; height is a fraction of it. */
    size: [260, 680] as [number, number],
    flatten: 0.24,
    /** Drift, px/sec. Signed — some cross the other way. */
    speed: [5, 19] as [number, number],
    /*
     * Nearly double the old 0.05-0.14. At that strength the clouds were
     * technically moving and visually absent — the page read as a still
     * photograph with a faint shimmer over it.
     */
    opacity: [0.09, 0.24] as [number, number],
  },

  /**
   * ── MIST ─────────────────────────────────────────────────────────────────
   * Low fog rolling across the mountain's flanks, separate from the clouds
   * above the summit.
   *
   * Two populations rather than one taller cloud layer: mist is wider, slower,
   * flatter and lives in a different BAND of the page, so combining them into
   * one set of numbers means neither reads correctly. `band` is the fraction
   * of viewport height it occupies, measured from the top.
   */
  mist: {
    count: 12,
    mobileCount: 6,
    size: [520, 1240] as [number, number],
    /** Flatter than clouds — fog spreads sideways. */
    flatten: 0.13,
    speed: [7, 22] as [number, number],
    opacity: [0.06, 0.17] as [number, number],
    band: [0.44, 0.98] as [number, number],
  },

  /**
   * Light off the summit, as a few wide shafts.
   *
   * CSS gradients rather than canvas: a god-ray is a soft wedge that barely
   * moves, so paying a JS frame for it every 16ms buys nothing the compositor
   * cannot do on its own.
   */
  rays: {
    /** How many shafts. Odd numbers fan more naturally than even ones. */
    count: 5,
    /** Where they originate, as % of the viewport. */
    originX: 52,
    originY: -6,
    /** Overall strength. */
    opacity: 0.5,
    /** Seconds for one full breathe in-and-out. */
    breatheS: 14,
    /**
     * The whole fan also SWEEPS, rocking this many degrees over `sweepS`.
     * Breathing alone reads as flickering; it is the slow change of angle that
     * makes it look like light moving over a mountain.
     */
    sweepDeg: 4,
    sweepS: 26,
    color: "rgba(255, 226, 178, 0.5)",
  },

  /**
   * The sunrise itself — a warm bloom sitting on the peak, pulsing very
   * slowly. This is what stops the scene reading grey; the rays are the
   * light's path, and this is its source.
   */
  sunGlow: {
    /*
     * Position as % of the viewport. y sits ON the peak (which lands ~10%
     * down) rather than above it — at y:6 with a 68vw diameter most of the
     * bloom was off the top edge, warming the sky instead of the mountain.
     */
    x: 54,
    y: 13,
    /** Diameter as % of viewport width. */
    size: 74,
    color: "rgba(255, 198, 128, 0.58)",
    opacity: 0.7,
    /** Seconds for one swell. Long — a sunrise is not a strobe. */
    pulseS: 13,
  },

  /** Slow motes of light, so the air itself has something in it. */
  motes: {
    count: 54,
    mobileCount: 22,
    size: [1, 3.2] as [number, number],
    /** Negative rises. Light goes up. */
    speed: [-18, -5] as [number, number],
    sway: [12, 52] as [number, number],
    swaySpeed: [0.03, 0.1] as [number, number],
    opacity: [0.14, 0.55] as [number, number],
    /**
     * Each mote breathes between `twinkle[0]` and 1 of its own opacity, at its
     * own rate. Without it 54 dots of fixed brightness read as a texture
     * rather than as points of light — the variation is the whole effect.
     * Set twinkle[0] to 1 to switch it off.
     */
    twinkle: [0.25, 1] as [number, number],
    twinkleSpeed: [0.15, 0.55] as [number, number],
  },

  /** The hero's proportions. The portrait is a focal point, so it is big. */
  hero: {
    /** Portrait diameter, in rem. */
    portraitRem: 17,
    mobilePortraitRem: 11,
    /**
     * Where the square crop sits on the photograph, as `object-position`.
     *
     * me.jpg is 1242x1706, so a square crop leaves 464px of vertical slack and
     * the Y% chooses which band of it shows. His face sits at ~47% of the
     * frame, which puts the crop top at 181px — 39% of the slack. The default
     * 50%/22% left him in the bottom of the circle under a wall of brick.
     */
    portraitFocus: "50% 39%",
    /** Seconds each element waits before its entrance. */
    stagger: 0.13,
  },

  /**
   * ── POINTER PARALLAX ──────────────────────────────────────────────────────
   * Lighter than THE GATE's. That page is a blizzard you look into; this one is
   * a summit you stand on, and a calm view should barely move.
   */
  parallax: {
    /** px of drift at the nearest cloud layer. */
    clouds: 34,
    /** px for the mountain. Least — it is furthest away. */
    mountain: 13,
    /** px for the mist, which sits in front of the mountain. */
    mist: 24,
    /** px for the motes, which sit nearest the viewer. */
    motes: 46,
    /** How fast the eased pointer catches up, per second. */
    easing: 2.8,
    /** No hovering cursor on a touch screen. */
    mobileScale: 0,
    reducedScale: 0.22,
  },
} as const;

/** The palette and scene as CSS custom properties, for the page wrapper. */
export const sanctumVars = (): Record<string, string> => ({
  "--sn-bg": SANCTUM_PALETTE.bg,
  "--sn-bg-deep": SANCTUM_PALETTE.bgDeep,
  "--sn-panel": SANCTUM_PALETTE.panel,
  "--sn-panel-deep": SANCTUM_PALETTE.panelDeep,
  "--sn-ink": SANCTUM_PALETTE.ink,
  "--sn-ink-soft": SANCTUM_PALETTE.inkSoft,
  "--sn-ink-faint": SANCTUM_PALETTE.inkFaint,
  "--sn-accent": SANCTUM_PALETTE.accent,
  "--sn-accent-soft": SANCTUM_PALETTE.accentSoft,
  "--sn-accent-edge": SANCTUM_PALETTE.accentEdge,
  "--sn-accent-ink": SANCTUM_PALETTE.accentInk,
  "--sn-accent2": SANCTUM_PALETTE.accent2,
  "--sn-line": SANCTUM_PALETTE.line,
  "--sn-line-strong": SANCTUM_PALETTE.lineStrong,

  "--sn-mtn-w": `${SANCTUM_SCENE.mountain.width}vw`,
  "--sn-mtn-w-mobile": `${SANCTUM_SCENE.mountain.mobileWidth}vw`,
  "--sn-mtn-top": `${SANCTUM_SCENE.mountain.top}%`,
  "--sn-mtn-top-mobile": `${SANCTUM_SCENE.mountain.mobileTop}%`,
  "--sn-mtn-opacity": `${SANCTUM_SCENE.mountain.opacity}`,
  "--sn-mtn-blur": `${SANCTUM_SCENE.mountain.blurPx}px`,
  "--sn-mtn-grade": SANCTUM_SCENE.mountain.grade,
  "--sn-mtn-glow-opacity": `${SANCTUM_SCENE.mountain.glowOpacity}`,
  "--sn-scrim-opacity": `${SANCTUM_SCENE.scrim.opacity}`,
  "--sn-scrim-reach": `${SANCTUM_SCENE.scrim.reach}%`,

  "--sn-bg-grade": SANCTUM_SCENE.backdrop.image.grade,
  "--sn-bg-opacity": `${SANCTUM_SCENE.backdrop.image.opacity}`,
  "--sn-bg-blur": `${SANCTUM_SCENE.backdrop.image.blurPx}px`,
  "--sn-bg-overscan": `${SANCTUM_SCENE.backdrop.image.overscan}%`,

  "--sn-rays-x": `${SANCTUM_SCENE.rays.originX}%`,
  "--sn-rays-y": `${SANCTUM_SCENE.rays.originY}%`,
  "--sn-rays-opacity": `${SANCTUM_SCENE.rays.opacity}`,
  "--sn-rays-breathe": `${SANCTUM_SCENE.rays.breatheS}s`,
  "--sn-rays-color": SANCTUM_SCENE.rays.color,
  "--sn-rays-sweep": `${SANCTUM_SCENE.rays.sweepDeg}deg`,
  "--sn-rays-sweep-s": `${SANCTUM_SCENE.rays.sweepS}s`,

  "--sn-sun-x": `${SANCTUM_SCENE.sunGlow.x}%`,
  "--sn-sun-y": `${SANCTUM_SCENE.sunGlow.y}%`,
  "--sn-sun-size": `${SANCTUM_SCENE.sunGlow.size}vw`,
  "--sn-sun-color": SANCTUM_SCENE.sunGlow.color,
  "--sn-sun-opacity": `${SANCTUM_SCENE.sunGlow.opacity}`,
  "--sn-sun-pulse": `${SANCTUM_SCENE.sunGlow.pulseS}s`,

  "--sn-portrait": `${SANCTUM_SCENE.hero.portraitRem}rem`,
  "--sn-portrait-mobile": `${SANCTUM_SCENE.hero.mobilePortraitRem}rem`,
  "--sn-portrait-focus": SANCTUM_SCENE.hero.portraitFocus,
  "--sn-portrait-shape": SANCTUM.portrait.shape,
  "--sn-portrait-ratio": SANCTUM.portrait.ratio,
  "--sn-stagger": `${SANCTUM_SCENE.hero.stagger}s`,

});
