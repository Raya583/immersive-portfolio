/**
 * The narration script for the creation cinematic. Each step is one line plus
 * per-step targets for the staged visual beats:
 *   - starAppear: 0 → 1, star visibility
 *   - burst:      0 → 1, radial sky-burst expansion
 *   - day:        0 → 1, overall daylight (atmospheric sky + lighting)
 *   - clouds:     0 → 1, drifting clouds filling the sky
 *
 * Every line is click-to-continue — the viewer paces the whole story.
 */
export interface StoryStep {
  text: string;
  starAppear: number;
  burst: number;
  day: number;
  clouds: number;
}

/**
 * Korean is paired with the English rather than replacing it, so the line
 * still reads on its own:
 *   오직 상상            — "only imagination"
 *   창조가 시작되었다      — "creation began"
 *   상상이 현실을 만든다   — "imagination creates reality" (the site's philosophy)
 * Hangul has no glyphs in Hylia Serif; the .font-hylia stack falls back to a
 * Korean serif for those characters (see globals.css / Narration.tsx).
 */
export const STORY: readonly StoryStep[] = [
  { text: "In the beginning, there was nothing.", starAppear: 0, burst: 0, day: 0, clouds: 0 },
  { text: "Only imagination. 오직 상상.", starAppear: 1, burst: 0, day: 0, clouds: 0 },
  { text: "And imagination began to create. 창조가 시작되었다.", starAppear: 1, burst: 1, day: 0.7, clouds: 0 },
  { text: "Piece by piece, a world took shape.", starAppear: 0, burst: 1, day: 1, clouds: 0 },
  { text: "Every world begins as an idea. 상상이 현실을 만든다.", starAppear: 0, burst: 1, day: 1, clouds: 1 },
] as const;

/** Seconds visuals take to ease toward a step's targets. Higher = slower/gentler. */
export const STORY_EASE_SECONDS = 3.0;

/** Burst expansion time. Higher = slower, more graceful reveal. */
export const BURST_EASE_SECONDS = 2.4;

/** Typewriter speed — seconds per character. Higher = slower typing. */
export const TYPEWRITER_SPEED = 0.13;
