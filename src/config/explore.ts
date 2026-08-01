/**
 * Free-explore mode settings. Once the creation cinematic finishes, the camera
 * unlocks and the user can orbit around the world of islands.
 */
export const EXPLORE_CONFIG = {
  unlockAtStep: 4,
  orbit: {
    /**
     * Where the camera starts when explore unlocks — FRONT, slightly raised.
     * Pulled back far enough to take in the whole island spread before the map
     * transition lifts it overhead (see MAP_CONFIG in config/map.ts); any
     * closer and the camera sits inside the front row of islands.
     */
    startPosition: [0, 8, 34] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    minDistance: 6,
    maxDistance: 60,
    minPolar: 0.2,
    maxPolar: 1.5,
    enablePan: false,
    autoRotate: false,
    dampingFactor: 0.08,
  },
} as const;
