/**
 * ── DRIFTING CLOUDS ────────────────────────────────────────────────────────
 * Soft weather crossing the island map, so the world has some motion in it
 * once the cinematic has finished and the map is just sitting there.
 *
 * ── HOW THEY ARE MADE ──────────────────────────────────────────────────────
 * Not images and not a canvas: each cloud is ONE element whose background is a
 * handful of overlapping radial gradients, heavily blurred so the lumps melt
 * into each other. That keeps the whole effect at zero network cost, and — more
 * to the point — the only thing that animates is a `transform`, which the
 * compositor moves on its own without waking JavaScript or re-painting a single
 * pixel. Ten drifting clouds cost about as much as one.
 *
 * ── THE TWO DECKS ──────────────────────────────────────────────────────────
 * Clouds run in front of AND behind the islands, which is what sells them as
 * weather rather than wallpaper. The front deck is deliberately the thinner and
 * fainter of the two: it passes over the artwork and the names, so anything
 * heavier there would cost legibility. If the labels ever start to get lost,
 * `front.opacity` is the dial — not `count`.
 *
 * Neither deck ever takes a pointer event; see `.cloud-layer` in globals.css.
 */

export interface CloudDeck {
  /** How many clouds on this deck. A handful is plenty — they overlap. */
  count: number;
  /** [min, max] opacity. The front deck stays low so labels survive it. */
  opacity: [number, number];
  /** [min, max] width, as % of the viewport. These are big and soft. */
  width: [number, number];
  /** Height as a fraction of width. Below 1 for the flat, stretched look. */
  squash: [number, number];
  /**
   * [min, max] seconds for one full journey — and note that the journey is
   * LONGER than the screen: a cloud starts fully off the left edge and ends
   * fully off the right, so it travels (100vw + its own width). A 70vw-wide
   * cloud on a 80s journey therefore takes about 80 × 100/170 ≈ 47s to cross
   * the visible screen. Bigger number = slower.
   */
  crossS: [number, number];
  /** [min, max] vertical band they occupy, as % of viewport height. */
  band: [number, number];
  /** Softness. The whole illusion rests on this being generous. */
  blurPx: [number, number];
}

export const CLOUDS = {
  /**
   * Behind the islands: bigger, denser, slower. The weather they sit in.
   *
   * This deck can be raised freely — it passes UNDER the islands and their
   * names, so no amount of it costs legibility. It only changes the sea. The
   * painted ocean is busy enough that anything under ~0.2 simply disappears
   * into it and the map goes back to looking still.
   */
  back: {
    count: 7,
    opacity: [0.3, 0.55],
    width: [55, 95],
    squash: [0.3, 0.46],
    crossS: [58, 92],
    band: [2, 84],
    blurPx: [26, 46],
  } satisfies CloudDeck,

  /**
   * In front: fewer, fainter, faster — a wisp passing close to the eye. Faster
   * because it is nearer; that speed difference against the back deck is what
   * gives the two any sense of depth.
   *
   * THIS is the deck that can cost legibility, since it crosses the island art
   * and the name plaques. If the labels ever start getting lost, `opacity` here
   * is the dial to turn down — not `count`, and never the back deck.
   */
  front: {
    count: 3,
    opacity: [0.1, 0.2],
    width: [60, 100],
    squash: [0.24, 0.38],
    crossS: [52, 78],
    band: [6, 78],
    blurPx: [34, 58],
  } satisfies CloudDeck,

  /** Reshuffle every cloud's size, height and speed by changing this. */
  seed: 0xc10d,

  /** How long the decks take to fade up once the ocean has arrived. */
  fadeInMs: 2600,
} as const;
