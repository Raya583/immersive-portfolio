/** Small shared easing/interpolation helpers for the creation sequence. */

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothRange(x: number, inMin: number, inMax: number): number {
  return Math.min(Math.max((x - inMin) / (inMax - inMin), 0), 1);
}

/** Frame-rate-independent easing alpha for a given time constant (seconds). */
export function easeAlpha(seconds: number, delta: number): number {
  return 1 - Math.exp(-(1 / seconds) * 6 * delta);
}
