/**
 * Stylized sky for the creation cinematic — drei's atmospheric Sky, tuned for
 * a clean, clear blue (low haze) with no cloud-like brightness near the
 * horizon. Beauty from clear light, not fake clouds.
 */
export const SCENERY_CONFIG = {
  sky: {
    // Sun higher and more overhead for an even, clear daytime blue.
    sunPosition: [0.4, 0.6, -1] as [number, number, number],
    turbidity: 2,        // low haze — clean sky, no cloud-like murk
    rayleigh: 1.2,       // blue depth
    mieCoefficient: 0.002, // low = tight sun, no big hazy glow
    mieDirectionalG: 0.7,
    distance: 450000,
    easeSeconds: 3.2,
  },
} as const;
