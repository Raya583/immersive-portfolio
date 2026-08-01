/**
 * ── CHERRY BLOSSOM ATMOSPHERE ──────────────────────────────────────────────
 * Falling petals on the island MAP only (not the landing pages). The framing
 * branches that used to live here are gone — map-bg.png supplies them, along
 * with the sky, clouds and mountains (see config/backdrop.ts).
 *
 * The petals are one canvas — never DOM nodes. At the default count that is
 * ~900 sprites a frame, so the engine is built to draw each one with a single
 * drawImage from a pre-rendered atlas: no per-petal transforms, no gradients,
 * no state changes in the loop.
 *
 * Clicks pass straight through the overlay to the islands.
 *
 * NOTE: burstAt() on the petal engine is still wired up and works — it just has
 * nothing calling it now that the clickable branches are gone. Hook it to any
 * element that wants to throw a handful of petals.
 */
export const SAKURA_CONFIG = {
  /** Story step the map unlocks at — the overlay appears with it. */
  appearAtStep: 4,
  /**
   * Held back until the camera has finished flattening into the map view
   * (MAP_CONFIG delaySeconds + flightSeconds ≈ 7.4s), so petals don't drift
   * over the cinematic.
   */
  fadeDelayMs: 7400,
  fadeMs: 2600,

  petals: {
    /** ── DENSITY ──────────────────────────────────────────────────────────
     *  Ambient petals on screen. The engine allocates count + burstPool slots
     *  once at startup and never allocates again, so raising this costs memory
     *  up front and fill-rate per frame — nothing else. */
    count: 900,
    /** Narrow viewports get far fewer; phones have the least fill-rate to spare. */
    mobileCount: 260,
    mobileBreakpoint: 768,

    /** ── BURST ────────────────────────────────────────────────────────────
     *  Petals released per click on a tree, and how many burst petals can be
     *  in flight at once. Bursts recycle through the pool oldest-first, so
     *  clicking repeatedly can never grow the particle count. */
    burstCount: 90,
    burstPool: 420,
    /** Initial outward speed range, px/sec. */
    burstSpeed: [90, 260] as [number, number],
    /** How fast that impulse bleeds off into a normal drift, per second. */
    burstDecay: 1.9,
    /** Upward bias on the burst, so it puffs before it falls. */
    burstLift: 60,

    /** ── MOTION ───────────────────────────────────────────────────────────
     *  size is the petal's length in px; speed is how fast it falls. */
    size: [5, 14] as [number, number],
    speed: [14, 46] as [number, number],
    /** Sideways sine drift: amplitude px, then rate in radians/sec. */
    sway: [12, 52] as [number, number],
    swaySpeed: [0.25, 0.95] as [number, number],
    /** Spin (radians/sec) and flutter — flutter squashes the petal as it
     *  turns edge-on, which is what makes it tumble rather than slide. */
    spin: [0.5, 2.4] as [number, number],
    flutterSpeed: [1.2, 3.4] as [number, number],
    /** Constant wind, px/sec. Negative blows left. */
    drift: -14,

    /** Soft pink tones. Each becomes one row of the sprite atlas; alpha is
     *  baked in, so the draw loop never touches globalAlpha.
     *  These are deliberately saturated: against the golden-hour sky, paler
     *  pinks wash out and the petals start reading as white specks. */
    tints: [
      "rgba(255, 183, 214, 0.95)",
      "rgba(247, 150, 190, 0.9)",
      "rgba(233, 118, 168, 0.78)",
      "rgba(255, 208, 227, 0.62)",
    ],
  },

} as const;
