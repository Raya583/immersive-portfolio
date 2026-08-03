/**
 * ── THE COSMOS ─────────────────────────────────────────────────────────────
 * The big bang, and the deep-space sky it leaves behind: a Milky Way band,
 * thousands of stars, dust lanes, meteors, mouse parallax and click ripples.
 *
 * All of it is ONE Canvas 2D layer (see components/Cosmos.tsx). The sky is
 * painted ONCE into offscreen canvases and thereafter only *moved*, so a frame
 * costs a handful of drawImage calls however many thousand stars there are.
 *
 * The look is meant to be PHOTOGRAPHIC: dark and deep, dominated by star
 * texture rather than colour. If it ever starts reading as a purple haze, the
 * dial to turn down is `nebula.alpha`, not the star counts.
 */

export const COSMOS = {
  /**
   * ── SKY BASE ─────────────────────────────────────────────────────────────
   * Near-black with the faintest blue. Everything else is drawn additively on
   * top, so this is what "empty sky" looks like.
   */
  base: "#03040c",

  /**
   * ── THE GALACTIC BAND ────────────────────────────────────────────────────
   * The centrepiece: the Milky Way cutting diagonally across the frame.
   *
   *   angleDeg   — its tilt. -28 runs lower-left to upper-right.
   *   offset     — how far the band sits from centre, as a fraction of the
   *                screen height. Negative lifts it, positive drops it.
   *   thickness  — the glow's width, as a fraction of the smaller screen side.
   *   length     — how far it reaches, as a multiple of the screen diagonal.
   *   coreAt     — where the bright galactic core sits ALONG the band, 0-1.
   *   coreGlow   — brightness of that core.
   *   warm/cool  — the band's colours: warm cream/tan at the core, fading to
   *                dusty blue at the edges, like the real thing.
   *   dustLanes  — dark streaks cutting along the band. These are what stop it
   *                reading as a smooth gradient; without them it is just a
   *                glow. More lanes = more texture.
   */
  band: {
    angleDeg: -28,
    offset: -0.04,
    thickness: 0.34,
    length: 1.5,
    coreAt: 0.46,
    coreGlow: 0.95,
    warm: "#ffd9a8",
    mid: "#e6cfa6",
    cool: "#3f63a8",
    alpha: 0.55,
    dustLanes: 14,
    dustAlpha: 0.55,
  },

  /**
   * ── NEBULA ───────────────────────────────────────────────────────────────
   * Deliberately restrained now — a few deep colour clouds for depth, NOT the
   * main event. `alpha` is the master dial; drop it if the narration struggles.
   */
  nebula: {
    colors: ["#0e1a44", "#0c2a56", "#241a52", "#3a1f44"],
    blobs: 8,
    alpha: 0.2,
    blobRadius: [0.2, 0.5] as [number, number],
    resolution: 0.5,
    /** Darkens the middle so the narration always has something to sit on. */
    readabilityVignette: 0.45,
  },

  /**
   * ── STARS ────────────────────────────────────────────────────────────────
   * Dense. Three depth layers, each painted once into its own canvas, so the
   * per-frame cost is one drawImage per layer regardless of count.
   *
   *   count     — DENSITY per layer, desktop. This is the main "fullness" dial.
   *   bandBias  — what fraction of the layer's stars cluster along the galactic
   *               band instead of scattering evenly. This is what makes the
   *               band look like a river of stars rather than a painted glow.
   *   parallax  — how far the layer shifts with the mouse, in px. The depth cue.
   *   size      — [min, max] radius. Kept tiny on purpose: real skies are
   *               mostly pinpoints with a few standouts.
   *   alpha     — [min, max] brightness.
   *
   * `clusters` are small dense knots dropped along the band — the clumping that
   * makes a photographed sky look uneven rather than sprayed.
   */
  stars: {
    layers: [
      { count: 2600, bandBias: 0.55, parallax: 14, size: [0.25, 0.75] as [number, number], alpha: [0.18, 0.55] as [number, number] },
      { count: 1500, bandBias: 0.62, parallax: 52, size: [0.4, 1.1] as [number, number], alpha: [0.3, 0.8] as [number, number] },
      { count: 520, bandBias: 0.5, parallax: 138, size: [0.7, 2.0] as [number, number], alpha: [0.5, 1] as [number, number] },
    ],
    clusters: 26,
    clusterStars: [26, 90] as [number, number],
    clusterRadius: [10, 46] as [number, number],
    /** The handful redrawn each frame so they actually pulse. */
    twinklers: 120,
    twinkleSpeed: [0.5, 1.7] as [number, number],
    /** Star colours — mostly white, with hot blue and cool amber mixed in. */
    tints: ["#ffffff", "#ffffff", "#dce8ff", "#ffe6c8", "#bcd4ff", "#ffd0a0"],
    /** Everything scales by this below `mobileBreakpoint`. */
    mobileScale: 0.38,
    mobileBreakpoint: 700,
  },

  /**
   * ── METEORS ──────────────────────────────────────────────────────────────
   * Thin bright streaks, at random angles and intervals.
   *
   *   everyMs   — [min, max] gap between them. Raise for a quieter sky.
   *   lifeMs    — how long one takes to cross and burn out.
   *   length    — [min, max] trail length in px.
   *   speed     — [min, max] px/sec.
   *   angleDeg  — [min, max] direction of travel.
   */
  meteors: {
    everyMs: [2600, 7000] as [number, number],
    lifeMs: 1100,
    length: [140, 340] as [number, number],
    speed: [700, 1500] as [number, number],
    angleDeg: [18, 46] as [number, number],
    tint: "#ffffff",
  },

  /**
   * ── THE BANG ─────────────────────────────────────────────────────────────
   * Fired once, when the void ends.
   */
  bang: {
    coreMs: 620,
    shockMs: 1500,
    rings: 3,
    ringGapMs: 150,
    streaks: 190,
    streakMs: 1400,
    streakSpeed: [340, 1150] as [number, number],
    streakLength: [14, 70] as [number, number],
    reach: 1.25,
    /** Extra kick on the sky as the shock passes through it. */
    nebulaFlash: 0.6,
  },

  /**
   * ── MOUSE / DEPTH ────────────────────────────────────────────────────────
   * What makes this feel like a space you are inside rather than a picture of
   * one: every layer answers the pointer by a different amount, so moving the
   * mouse slides the near stars across the far ones.
   *
   *   drift   — MASTER multiplier on every parallax figure below. This is the
   *             one dial for "more/less 3D"; 0 disables look-around entirely.
   *             Per-layer depth is `stars.layers[].parallax`, in px at full
   *             deflection — currently 14 / 52 / 138, so the nearest layer
   *             travels ten times as far as the farthest.
   *   sky     — the nebula and galactic band. Deliberately the SMALLEST figure
   *             of all, smaller even than the far stars: it is the most distant
   *             thing in the scene, and if it keeps pace with the stars the
   *             depth reads as a flat sheet sliding around.
   *   twinkle — the pulsing foreground stars. The nearest thing there is.
   *   easing  — how fast the view catches the pointer, per second. LOWER is
   *             floatier; too low and it lags behind the cursor noticeably.
   *
   *   idle    — a slow continuous wander so the sky is alive even when the
   *             mouse is still. `amplitude` is a fraction of full deflection;
   *             the speeds are in cycles per second, and are deliberately
   *             mismatched so the two axes never resolve into a visible loop.
   *
   *   click   — the ripple thrown from a click: a ring, a spray of sparks, and
   *             a soft pulse through the sky.
   */
  mouse: {
    drift: 1.35,
    sky: 9,
    twinkle: 190,
    easing: 1.7,
    idle: {
      amplitude: 0.42,
      xSpeed: 0.028,
      ySpeed: 0.019,
    },
    click: {
      rippleMs: 1100,
      rippleRadius: 320,
      sparks: 34,
      sparkMs: 900,
      sparkSpeed: [90, 340] as [number, number],
      nebulaPulse: 0.26,
    },
  },

  /**
   * ── REDUCED MOTION ───────────────────────────────────────────────────────
   * What the scene does for someone whose system asks for less motion.
   *
   * It used to do the worst possible thing: paint a single frame and stop the
   * render loop outright. The sky froze solid, and because nothing was drawing
   * any more the pointer stopped doing anything at all — the handler still
   * fired, it just had no loop left to show the result. A dead picture.
   *
   * So the loop now ALWAYS runs. What reduced motion turns off is the motion
   * the viewer did not ask for — the idle wander, the meteors, the fast
   * twinkling — while parallax, which is a direct response to their own
   * pointer, is kept and damped rather than cut. Large parallax swings are a
   * genuine vestibular trigger, hence damped and not simply left alone.
   *
   *   respect        — set false to ignore the system setting entirely and
   *                    always run the sky at full strength.
   *   driftScale     — multiplier on `mouse.drift` when reduced. 0 removes
   *                    pointer parallax completely.
   *   idleAmplitude  — replaces `mouse.idle.amplitude`. 0 stops the wander
   *                    dead; a small value keeps the sky gently alive without
   *                    the wide sweep of the full setting, which is the point
   *                    of the accommodation rather than a frozen picture.
   *   twinkleScale   — multiplier on the twinkle rate; the stars still breathe,
   *                    just slowly, so the sky is never entirely still.
   *   meteors        — whether shooting stars still cross.
   */
  reducedMotion: {
    respect: true,
    driftScale: 0.4,
    idleAmplitude: 0.1,
    twinkleScale: 0.3,
    meteors: false,
  },
} as const;
