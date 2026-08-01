/**
 * ── SCROLL CURTAIN TIMING ──────────────────────────────────────────────────
 * The scroll is a TRANSITION, not a container: it unrolls to cover the screen,
 * holds for a "between worlds" beat, then wipes away sideways to reveal the
 * island's landing page underneath.
 *
 * These numbers are handed to CSS as custom properties AND drive the timers
 * that advance the phase machine, so the animation and the state can never
 * drift apart. One number, one beat:
 *
 *   unrollMs ─ rollers part, parchment grows down the screen
 *   holdMs   ─ the pause, with the island's name on the parchment
 *   wipeMs   ─ parchment collapses left-to-right, landing page revealed
 *   rollMs   ─ (on the way back) parchment rolls shut vertically
 *
 * Appearance lives in the `.curtain-*` rules in app/globals.css.
 */
export const CURTAIN_CONFIG = {
  /** Vertical unroll. The brief asked ~0.7s. */
  unrollMs: 700,
  /** The held beat. 0.8–1.2s reads as intentional rather than sluggish. */
  holdMs: 1000,
  /** Horizontal wipe, both directions (reveal and re-cover). */
  wipeMs: 700,
  /** Vertical roll-up on the way back out. Slightly quicker than the unroll. */
  rollMs: 620,
  /**
   * Extra time held after the roll before the curtain is removed. The roll is
   * the one beat that ends by UNMOUNTING — and it starts at the same moment the
   * landing page is torn down and the WebGL canvas is revealed, which can hitch
   * the main thread. Without this tail the parchment gets whipped away while
   * still part-open. Raise it if you ever see the curtain vanish mid-roll.
   */
  rollTailMs: 120,
  /** Delay before the island name fades onto the parchment during the hold. */
  markDelayMs: 200,
} as const;
