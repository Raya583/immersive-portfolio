/**
 * Seeded randomness.
 *
 * Every scattered thing in this project — stars, dust lanes, drifting clouds —
 * is placed from one of these rather than `Math.random()`. The reason is
 * hydration: these components render on the server first, and unseeded
 * randomness would place things differently there than in the browser, so React
 * would tear the markup down and rebuild it on arrival. A seed makes the layout
 * a pure function of that seed, identical on both sides.
 *
 * Change a seed to reshuffle an arrangement you don't like; the same seed always
 * gives back the same one.
 */

export type Rand = () => number;

/** Small, fast, well-distributed PRNG. Same seed, same sequence, everywhere. */
export function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A value somewhere in [min, max]. */
export const span = (rand: Rand, range: readonly [number, number]) =>
  range[0] + rand() * (range[1] - range[0]);

/** One item from a list. */
export const pick = <T,>(rand: Rand, list: readonly T[]): T =>
  list[Math.floor(rand() * list.length)] as T;
