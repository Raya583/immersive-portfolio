/**
 * ── OPENING CINEMATIC ──────────────────────────────────────────────────────
 * Two lines of narration, each waiting on the viewer before it moves on:
 *
 *   void   → line 1 types onto black
 *   (click / Enter) → light bursts, stars scatter, line 2 types
 *   (click / Enter) → second burst dissolves into the map
 *
 * Edit the two lines below to change what it says. Timings are in ms.
 *
 * The cinematic plays once per browser session — coming back from a section
 * page drops you straight onto the map rather than replaying it (the flag is
 * kept under `sessionKey`).
 */
export const CINEMATIC = {
  lines: [
    "Every world begins as an idea.",
    "…and imagination gives it form.",
  ],

  /** Milliseconds per character of the typewriter. Higher = slower. */
  typeSpeedMs: 52,
  /** Beat after a line finishes before the "continue" cue appears. */
  cueDelayMs: 500,
  /** How long the white burst takes to bloom and fade. */
  burstMs: 900,
  /** Stars fading and scattering into place. */
  starfieldMs: 1400,
  /** The map's fade-and-scale-in once the second burst clears. */
  mapRevealMs: 1600,

  /** Number of stars in the field. They are DOM nodes, so keep it sensible. */
  starCount: 140,

  sessionKey: "atlas-opening-seen",
} as const;
