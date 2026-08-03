/**
 * ── SHIPS ──────────────────────────────────────────────────────────────────
 * A handful of vessels sailing the open water between the islands.
 *
 * ── THE COORDINATE SPACE ───────────────────────────────────────────────────
 * Identical to config/islands.ts: percentages of the map stage, not the
 * viewport. The boats render INSIDE the same `.map-frame` box the islands do,
 * precisely so that the numbers here and the numbers there can be compared
 * directly — which is the whole trick to keeping ships off the land.
 *
 * ── STAYING ON OPEN WATER ──────────────────────────────────────────────────
 * The map is full — the islands cover slightly over half the stage — so there
 * is no clear lane running the whole way across it. Each ship therefore gets a
 * LANE: a stretch of open sea it sails along, chosen to miss every island.
 * A ship fades in at `x0`, sails to `x1`, and fades out; it never simply pops
 * out of existence, and it never has to cross land to loop.
 *
 * These are the island boxes it has to stay clear of (from islands.ts):
 *
 *   Forge     x 31.5 → 68.5    y 31.1 → 74.9
 *   Sanctum   x 70.2 → 98.7    y 12.1 → 45.9
 *   Armory    x 70.9 → 97.9    y 60.5 → 92.5
 *   Origins   x  1.8 → 29.8    y 13.4 → 46.6
 *   Gate      x  2.1 → 29.6    y 62.7 → 95.3
 *
 * which leaves these four pockets of sea, and that is where the lanes are:
 *
 *   top centre      x 30 → 70, above the Forge      (y up to 31)
 *   bottom centre   x 30 → 71, below the Forge      (y from 75)
 *   left channel    x  0 → 31, between Origins and the Gate  (y 47 → 63)
 *   right channel   x 68 →100, between Sanctum and the Armory (y 46 → 60)
 *
 * ── KEEPING SHIPS OFF EACH OTHER ───────────────────────────────────────────
 * Ships in the same pocket share an x-lane, so sooner or later they WILL be at
 * the same x — their speeds differ, so any starting arrangement drifts apart
 * and back together over a few minutes. Spacing them by `phase` alone therefore
 * only looks right at first and collides later.
 *
 * What actually holds is vertical separation: two ships that share an x-lane
 * are given y values far enough apart that their boxes never meet, whatever the
 * phase. Ships in DIFFERENT pockets never share an x range at all, so they are
 * free. Keep a gap of at least ~2% of the stage between stacked ships, and
 * remember the bob and roll make a box slightly taller than the sprite.
 *
 * The ROUTE's boats (config/trail.ts) count too. They are not in this list, but
 * they sail the same water, and they were the cause of every collision the
 * first version of this layout shipped with.
 *
 * ── IF YOU MOVE AN ISLAND ──────────────────────────────────────────────────
 * Re-check the lanes. Nothing enforces this at runtime — a ship will happily
 * sail straight over an island if you leave its lane sitting on one. Remember
 * a ship's own size when checking. Its box is `width` wide, and tall by:
 *
 *     desktop (16:9)   width × (16/9) × (sprite h / sprite w)  =  width × 1.185 × aspect
 *     mobile  (3:4)    width × (3/4)  × (sprite h / sprite w)  =  width × 0.75  × aspect
 *
 * Note the sprite's OWN aspect — do not reuse the islands' 0.5 mobile factor,
 * which bakes in their 3:2 artwork. These ships are nearly square, so they come
 * out almost twice as tall as that shortcut predicts. On a phone the channels
 * of open sea are only ~7% of the stage tall, which is little more than one
 * ship, so this is the difference between sailing and running aground.
 */

export interface BoatLane {
  /** Sprite file in /public/images/boats. */
  src: string;
  /** Natural pixel size of that sprite — needed to work out its height. */
  natural: { w: number; h: number };
  /** Ship width as a % of stage width. Keep these SMALL; islands are 27-37%. */
  width: number;
  /** Sails from x0 to x1 at height y — all % of the stage. x1 < x0 sails left. */
  x0: number;
  x1: number;
  y: number;
  /** Seconds for one pass. Big numbers: these are meant to be barely moving. */
  crossS: number;
  /** Where in its own pass this ship starts, 0-1. Staggers them apart. */
  phase: number;
  /** Bob height, as a % of the ship's own height. The float on the swell. */
  bob: number;
  /** Degrees of roll at the top and bottom of the bob. Keep it under ~2. */
  tilt: number;
  /** Seconds for one rise-and-fall. Slower than you would think looks right. */
  bobS: number;
  /** Peak opacity. They sit in haze, so a little under 1 reads as distance. */
  opacity: number;
  /**
   * Retire a lane without deleting it. Defaults to on. See the layout proof
   * above `BOATS` for which channels have no clear band left.
   */
  enabled?: boolean;
  /** Narrow screens use a different island layout, so lanes move too.
   *  `null` keeps this ship off phones entirely — the portrait map is tight. */
  mobile: { x0: number; x1: number; y: number; width: number } | null;
}

/*
 * ── HOW THESE LANES WERE CHOSEN ──────────────────────────────────────────
 * By proof, not by eye.
 *
 * Two boxes can only ever touch if their X ranges overlap AND their Y bands
 * overlap. Ships that share a pocket share an x-lane by definition, and their
 * speeds differ, so sooner or later every pair IS at the same x — phase can
 * never keep them apart, only height can. So every lane below is laid out to
 * a single rule:
 *
 *     within a pocket, no two ships' y-bands overlap, and none overlaps the
 *     band the ROUTE's boats sweep through that same water.
 *
 * A band is the sprite's own height (`width x 16/9 x sprite h/w` on desktop),
 * and the layout holds at least 0.8% of the stage of clear water between every
 * pair. That is a guarantee rather than an arrangement that happens to look
 * right on the first pass.
 *
 * The route's own boats are the reason the southern lanes sit as low as they
 * do, and the reason `bow[3]` in config/trail.ts is shallow: a deeper bow on
 * the last leg drops the route to y 87.5 in the centre, straight through the
 * southern fleet.
 *
 * `enabled: false` retires a lane without deleting it. The eastern channel is
 * off because the route sails the length of it, and there is no band left.
 */
export const BOATS: BoatLane[] = [
  /*
   * ── NORTHERN WATER — above the Forge, x 30 → 70 ─────────────────────────
   * Four abreast, stacked 7.5% apart, alternating direction so the pocket
   * reads as traffic rather than a convoy. The lowest sits at y 27.5, which
   * keeps its hull clear of the route where it leaves the Sanctum.
   */
  {
    src: "/images/boats/boat-1.png",
    natural: { w: 516, h: 446 },
    width: 4.4,
    x0: 34,
    x1: 66,
    y: 5,
    crossS: 96,
    phase: 0,
    bob: 5,
    tilt: 1.2,
    bobS: 6.5,
    opacity: 0.95,
    mobile: { x0: 10, x1: 90, y: 29.4, width: 9 },
  },
  {
    src: "/images/boats/boat-2.png",
    natural: { w: 395, h: 418 },
    width: 3.8,
    x0: 66,
    x1: 34,
    y: 12.5,
    crossS: 118,
    phase: 0.35,
    bob: 4.4,
    tilt: 1.1,
    bobS: 7.2,
    opacity: 0.9,
    mobile: null,
  },
  {
    src: "/images/boats/boat-5.png",
    natural: { w: 256, h: 288 },
    width: 3.5,
    x0: 34,
    x1: 66,
    y: 20,
    crossS: 134,
    phase: 0.7,
    bob: 3.8,
    tilt: -1.3,
    bobS: 8.1,
    opacity: 0.82,
    mobile: null,
  },
  {
    src: "/images/boats/boat-4.png",
    natural: { w: 338, h: 351 },
    width: 3.8,
    x0: 66,
    x1: 34,
    y: 27.5,
    crossS: 132,
    phase: 0.45,
    bob: 6,
    tilt: 1.5,
    bobS: 5.2,
    opacity: 0.85,
    mobile: null,
  },

  /*
   * ── SOUTHERN WATER — below the Forge, x 30 → 71 ─────────────────────────
   * Only the water BELOW the route's last leg is free, which is why these two
   * sit low. They used to ride at y 79.9 and 88.3, where the route ran
   * straight over both of them.
   */
  {
    src: "/images/boats/boat-2.png",
    natural: { w: 395, h: 418 },
    width: 3.9,
    x0: 34,
    x1: 66,
    y: 88,
    crossS: 114,
    phase: 0.7,
    bob: 5.5,
    tilt: 1.3,
    bobS: 7.1,
    opacity: 0.92,
    mobile: null,
  },
  {
    src: "/images/boats/boat-5.png",
    natural: { w: 256, h: 288 },
    width: 3.2,
    x0: 66,
    x1: 34,
    y: 95.5,
    crossS: 140,
    phase: 0.15,
    bob: 5.5,
    tilt: 1.3,
    bobS: 4.9,
    opacity: 0.86,
    mobile: null,
  },

  /*
   * ── WESTERN CHANNEL — below Origins, x 0 → 31 ───────────────────────────
   * The water under Origins read as bare. The channel here is 27% of the
   * stage tall between the route's crossing above and its run down to the
   * Gate below, which is enough for two, stacked 6.4% apart.
   */
  {
    src: "/images/boats/boat-3.png",
    natural: { w: 385, h: 420 },
    width: 3.6,
    x0: 4,
    x1: 25,
    y: 53.4,
    crossS: 126,
    phase: 0.15,
    bob: 3.6,
    tilt: 1.4,
    bobS: 7.6,
    opacity: 0.86,
    mobile: null,
  },
  {
    src: "/images/boats/boat-4.png",
    natural: { w: 338, h: 351 },
    width: 3.2,
    x0: 25,
    x1: 4,
    y: 59.8,
    crossS: 142,
    phase: 0.55,
    bob: 3.2,
    tilt: -1.1,
    bobS: 8.6,
    opacity: 0.8,
    mobile: null,
  },

  /*
   * ── EASTERN CHANNEL — between the Sanctum and the Armory, x 68 → 100 ────
   * Off. The route runs the whole length of this channel on its way from
   * Origins to the Armory, and there is no clear band either side of it.
   */
  {
    src: "/images/boats/boat-3.png",
    natural: { w: 385, h: 420 },
    width: 3.8,
    x0: 73,
    x1: 96,
    enabled: false,
    y: 50,
    crossS: 126,
    phase: 0.6,
    bob: 5.5,
    tilt: 1.3,
    bobS: 5.8,
    opacity: 0.88,
    mobile: null,
  },
  {
    src: "/images/boats/boat-1.png",
    natural: { w: 516, h: 446 },
    width: 3.4,
    x0: 96,
    x1: 73,
    enabled: false,
    y: 57,
    crossS: 134,
    phase: 0.38,
    bob: 5.5,
    tilt: 1.4,
    bobS: 5.6,
    opacity: 0.8,
    mobile: null,
  },
];

export const BOAT_FADE_MS = 2400;
