import type { Vec3 } from "@/types/three";

/**
 * ── GOLDEN HOUR ────────────────────────────────────────────────────────────
 * Everything the dusk mood is made of: the sky gradient, where the sun sits,
 * the warm light it throws, and the sparse cloud deck under the islands.
 *
 * All of it fades in with the story's `day` value, so the void → stars → burst
 * opening is untouched; the burst reveals THIS sky rather than a flat blue
 * (the burst shader evaluates the same gradient function, so there's no colour
 * pop when it fades away).
 *
 * Void-state colours and fog still live in config/creation.ts.
 */
export const SKY_CONFIG = {
  /**
   * ── SKY COLOURS ── the four gradient stops, tune these first ─────────────
   * The gradient runs up the SCREEN — 0.0 is the bottom edge, 1.0 the top —
   * rather than along a world direction. That is deliberate: the map camera
   * looks nearly straight down, so a true directional sky would fill the frame
   * with the region under the horizon and the golden hour would never be seen.
   *
   * Keep all four light and luminous. Darkening any of them reads as night,
   * not dusk, and the islands stop feeling lit from the sky.
   */
  gradient: {
    /** Top of the frame — soft dusky lavender-blue. */
    top: "#8286c4",
    /** Upper middle — warm rose/peach, the heart of the golden hour. */
    mid: "#f4a58c",
    /** The glowing amber band — the "horizon" of the wash. */
    horizon: "#ffc27a",
    /** Bottom of the frame — warm dusty rose haze under the islands. */
    bottom: "#d9948d",
    /** Screen height of the amber band. */
    horizonStop: 0.34,
    /** Screen height where the rose peaks. Must sit above horizonStop. */
    midStop: 0.68,
  },

  /**
   * ── SUN ──────────────────────────────────────────────────────────────────
   * `direction` aims the directional light: direction[1] IS the sun's height,
   * 0.45 ≈ 27° above the horizon. Drop it toward 0.2 for a lower, fierier sun
   * — but below ~0.35 the islands' top faces go dark in the overhead view.
   *
   * `screenPos` is where the glow sits in the frame (0,0 bottom-left), kept
   * separate because the sky is a screen-space wash.
   */
  sun: {
    direction: [0.78, 0.45, 0.44] as Vec3,
    /** How far out along that direction the directional light is parked. */
    distance: 60,
    /** Where the halo blooms, in screen UV. */
    screenPos: [0.68, 0.3] as [number, number],
    /** Colour of the halo bleeding around the sun. */
    glowColor: "#ffdfaf",
    /** Halo strength. 0 turns it off entirely. Above ~0.5 it blows out white
        once bloom gets hold of it. */
    glow: 0.35,
    /** Halo size, in screen heights. */
    glowRadius: 0.42,
  },

  /**
   * ── DAYTIME LIGHTING ─────────────────────────────────────────────────────
   * The director eases from the void's cold light to these as `day` rises.
   * The hemisphere light is what keeps the islands readable from above once
   * the sun is this low — warm from the sky, cool violet bounce from below.
   */
  light: {
    sunColor: "#ffd2a1",
    sunIntensity: 1.9,
    ambientColor: "#ffd9c4",
    ambientIntensity: 0.75,
    hemiSkyColor: "#ffc48f",
    hemiGroundColor: "#4a3b63",
    hemiIntensity: 0.7,
  },

  /**
   * ── CLOUDS ───────────────────────────────────────────────────────────────
   * A sparse deck of big soft blobs drifting FAR BELOW the floating islands —
   * from the bird's-eye map you look down past the islands onto them. Each is
   * a single camera-agnostic plane with a noise-shaped alpha and a radial
   * feather, so the quad's edges never show.
   *
   * CLOUD COUNT = the length of `layout`. Add or remove an entry to change it;
   * keep it in the 3-5 range — more reads as clutter, which is what went wrong
   * with the earlier close-up volumetric attempt.
   */
  clouds: {
    /** Where the light catches them. */
    warmTint: "#ffc98a",
    /** Their shaded side, pulled toward the sky's rose. */
    coolTint: "#d79ab0",
    /** Master opacity for the whole deck. */
    opacity: 0.75,
    /** Size of the noise features. Higher = smaller, busier wisps. */
    noiseScale: 2.1,
    /** How fast the shapes drift, in noise units/sec. Deliberately glacial. */
    driftSpeed: 0.012,
    /**
     * Noise cutoff: LOWER = more cloud. The 4-octave fbm behind this averages
     * ~0.47 and rarely tops 0.8, so keep coverage + softness under ~0.65 or the
     * clouds never reach full density and read as a faint smudge.
     */
    coverage: 0.32,
    /** Width of the fade at that cutoff. Higher = softer, vaguer edges. */
    softness: 0.28,
    /**
     * Per-cloud placement. `position` is [x, y, z] — y is well below the
     * islands (which sit at y 0), `size` is [width, depth] in world units.
     * `seed` just decorrelates the noise so no two look alike.
     */
    layout: [
      { position: [-38, -46, 26] as Vec3, size: [170, 95] as [number, number], seed: 0.13, opacity: 0.9 },
      { position: [44, -58, -18] as Vec3, size: [200, 120] as [number, number], seed: 0.61, opacity: 0.75 },
      { position: [6, -38, -52] as Vec3, size: [140, 90] as [number, number], seed: 0.29, opacity: 0.6 },
      { position: [-20, -66, -4] as Vec3, size: [230, 140] as [number, number], seed: 0.87, opacity: 0.5 },
    ],
  },
} as const;

/** World position for the directional light — the sun direction, pushed out. */
export const SUN_POSITION: Vec3 = [
  SKY_CONFIG.sun.direction[0] * SKY_CONFIG.sun.distance,
  SKY_CONFIG.sun.direction[1] * SKY_CONFIG.sun.distance,
  SKY_CONFIG.sun.direction[2] * SKY_CONFIG.sun.distance,
];
