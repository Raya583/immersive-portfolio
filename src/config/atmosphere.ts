/**
 * Atmosphere settings for The Void — subtle & dreamy. Bloom makes the bright
 * particles bleed into soft glow (reads as real light, not flat dots); fog
 * fades distant particles into the dark for depth. Kept gentle on purpose —
 * heavy bloom looks cheap, restraint looks expensive.
 */
export const ATMOSPHERE_CONFIG = {
  bloom: {
    /** Minimum brightness a pixel needs before it blooms (0-1). Higher = only the brightest glow. */
    luminanceThreshold: 0.35,
    /** Softness of that threshold edge. */
    luminanceSmoothing: 0.9,
    /** Glow strength. Gentle. */
    intensity: 0.7,
    /** Blur spread of the glow. */
    radius: 0.6,
  },
  fog: {
    color: "#05040a", // near-black with a faint violet cast
    /** Distance from camera where fog starts. */
    near: 6,
    /** Distance where particles are fully faded into the dark. */
    far: 26,
  },
} as const;
