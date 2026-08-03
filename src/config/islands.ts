/**
 * ── ISLAND MAP ─────────────────────────────────────────────────────────────
 * The five lands, their placement, and where each one will lead.
 *
 * ── COORDINATE SPACE ───────────────────────────────────────────────────────
 * Positions are PERCENTAGES of the map stage, not the viewport. The stage is a
 * fixed-aspect box (16:9 on desktop, 3:4 on phones) sized to fit the screen,
 * so these numbers hold their arrangement at every window size — nothing needs
 * recalculating when the browser resizes.
 *
 *   x, y  — the CENTRE of the island, 0-100 across the stage.
 *   width — the island's width as a % of stage width. Its height follows from
 *           the artwork's own 3:2 ratio, so you only ever set one number.
 *
 * ── NUDGING THEM ───────────────────────────────────────────────────────────
 * Every island is one entry below. Move one by editing x/y; resize it with
 * `width`. `mobile` overrides all three on narrow screens, where the stage
 * turns portrait and the desktop arrangement would not fit.
 *
 * Keep the boxes from overlapping: the IMAGE BOX is what receives the pointer,
 * so two overlapping boxes means the one on top silently steals hover from its
 * neighbour.
 *
 * And do not expect the artwork to hide a tight fit. Measured from the alpha
 * channel, the painted island fills 94% of its box's width and 91% of its
 * height — margins of only 0.5-6%, not the generous frame they appear to have.
 * The gap you set between two boxes is very nearly the gap you will see.
 *
 * ── THE ONE PIECE OF MATHS ─────────────────────────────────────────────────
 * `width` is a % of stage WIDTH, but a box's height is a % of stage HEIGHT, and
 * the two are not the same unit. Height follows from the artwork's 3:2 ratio
 * and the stage's own aspect:
 *
 *     desktop (16:9)   height% = width% × (16/9) × (2/3) = width% × 1.185
 *     mobile  (3:4)    height% = width% × (3/4) × (2/3) = width% × 0.5
 *
 * So on desktop every box is ~19% TALLER than it is wide in stage units. This
 * is why a layout can look fine as x/y numbers and still collide: two islands
 * 24% wide sitting 26% apart vertically DO overlap. It is also why the islands
 * cannot simply be stacked — see the size ceiling below.
 *
 * ── WHAT CAPS THE SIZES ────────────────────────────────────────────────────
 * At these widths the Forge is ~44% of the stage tall, and every satellite's
 * vertical range overlaps it. So all four have to clear it HORIZONTALLY, and
 * the whole layout lives or dies on one inequality — with G the gap between
 * boxes and E the margin at the screen edge:
 *
 *     2 × Wsatellite  +  Wforge   ≤   100 − 2G − 2E
 *
 * There is no way around it. Putting a satellite directly above or below the
 * Forge instead runs it off the top or bottom edge at any useful size, and the
 * stage is 16:9, so vertical room is the scarce one.
 *
 * Currently 2(27.75) + 37 = 92.5, leaving 7.5 for gaps and edges: gaps of
 * ~1.7-1.9% and edge margins of ~1.3-2.1%. That is close to the ceiling. To go
 * bigger you must spend gap, and at ~1.7% the channel of ocean between the
 * Forge and its neighbours is already down to roughly 30px on a 1440px screen.
 *
 * ── THE ARRANGEMENT ────────────────────────────────────────────────────────
 * The Forge anchors the middle, with the other four in the corners at
 * deliberately uneven sizes and heights — Origins sits a little lower than
 * Sanctum, Gate a little lower than Armory — so it reads as a discovered world
 * rather than a grid.
 *
 * Extents at these values, as % of the stage:
 *
 *   Forge     x 31.5 → 68.5    y 31.1 → 74.9
 *   Sanctum   x 70.2 → 98.7    y 12.1 → 45.9
 *   Armory    x 70.9 → 97.9    y 60.5 → 92.5
 *   Origins   x  1.8 → 29.8    y 13.4 → 46.6
 *   Gate      x  2.1 → 29.6    y 62.7 → 95.3
 *
 * Two clearances worth preserving if you nudge these:
 *   · nothing above y≈12%, which is where the opening title sits.
 *   · nothing past y≈97%, or the label under it clips at the bottom edge.
 *
 * ── MOBILE ─────────────────────────────────────────────────────────────────
 * Portrait uses a different composition, not a squeezed copy of the desktop
 * one: two on top, the Forge as a wide band across the middle, two below —
 * keeping each island in the same corner it occupies on desktop. A portrait
 * stage has vertical room to spare and none to waste sideways, which is the
 * reverse of the problem above, so the Forge can be much wider here (68%).
 *
 * The top pair sits at y 14.5 and the bottom pair at y 85 rather than tighter
 * against the Forge, which leaves two clear channels of sea across the map at
 * y 25.8→33 and y 67→73.8. The ships in config/boats.ts sail those channels,
 * so pulling these rows back in will run them aground.
 *
 * ── RISE ORDER ─────────────────────────────────────────────────────────────
 * `order` is the position in the staggered rise at line 5. The centre lands
 * first and the others follow around it.
 */

export interface IslandRegion {
  /** Section this will open once the pages exist. Logged on click for now. */
  id: string;
  /** Themed name shown on the map. */
  name: string;
  /** Resting artwork. */
  image: string;
  /** Hover artwork — same framing, glowing. Preloaded alongside the base. */
  glow: string;
  x: number;
  y: number;
  width: number;
  mobile: { x: number; y: number; width: number };
  order: number;
}

export const ISLANDS: IslandRegion[] = [
  {
    // The castle-city, anchoring the middle. Centred horizontally and set a
    // little low, so the eye lands here first. Its width is what the four
    // satellites have to share the remaining stage around — see the ceiling
    // note at the top before growing it.
    id: "projects",
    name: "The Forge",
    image: "/images/islands/cityland.png",
    glow: "/images/islands/citylandglow.png",
    x: 50,
    y: 53,
    width: 37,
    mobile: { x: 50, y: 50, width: 68 },
    order: 0,
  },
  {
    // Green peaks, north-east. The largest of the four satellites, and the
    // highest — it holds the top-right quarter on its own.
    id: "home",
    name: "The Sanctum",
    image: "/images/islands/mountainland.png",
    glow: "/images/islands/mountainlandglow.png",
    x: 84.4,
    y: 29,
    width: 28.5,
    mobile: { x: 74, y: 14.5, width: 45 },
    order: 1,
  },
  {
    // Golden desert, south-east. Smallest, and sits a little higher than the
    // Gate opposite it — the deliberate break in the symmetry.
    id: "skills",
    name: "The Armory",
    image: "/images/islands/desertland.png",
    glow: "/images/islands/desertlandglow.png",
    x: 84.4,
    y: 76.5,
    width: 27,
    mobile: { x: 74, y: 85, width: 45 },
    order: 2,
  },
  {
    // Deep forest, north-west. Shares its column with the Gate below it.
    id: "about",
    name: "Origins",
    image: "/images/islands/forestland.png",
    glow: "/images/islands/forestlandglow.png",
    x: 15.8,
    y: 30,
    width: 28,
    mobile: { x: 26, y: 14.5, width: 45 },
    order: 3,
  },
  {
    // The frozen shore, south-west. Lowest on the map, and the closest thing
    // to the bottom edge — its box ends at y 95.3%, with the label inside it.
    id: "contact",
    name: "The Gate",
    image: "/images/islands/iceland.png",
    glow: "/images/islands/icelandglow.png",
    x: 15.8,
    y: 79,
    width: 27.5,
    mobile: { x: 26, y: 85, width: 45 },
    order: 4,
  },
];

/** The ocean backdrop the islands sit on. */
export const MAP_BACKGROUND = "/images/islands/background.png";

/**
 * ── TIMING ─────────────────────────────────────────────────────────────────
 *   crossFadeMs  — the starfield dissolving into the ocean. Slow on purpose:
 *                  this is the void becoming a world, not a scene change.
 *   textDelayMs  — how far into that cross-fade line 4 starts typing, so the
 *                  screen is never just sitting there mid-dissolve.
 *   riseMs       — one island's climb into place.
 *   riseStagger  — gap between each island starting, in `order`.
 *   riseDrift    — how far below its resting place an island starts, in px.
 *   riseScale    — how small it starts. 1 = no scale-in.
 *   labelDelayMs — beat after an island lands before its name fades up.
 *   line5DelayMs — how long after the islands start rising line 5 begins, so
 *                  the text arrives while they are still settling.
 *
 * ── THE OUTRO ──────────────────────────────────────────────────────────────
 * The narration bows out and leaves the map to itself. Timed from the moment
 * line 5 has finished typing — NOT from when the islands settle, which happens
 * a good second and a half earlier; starting the fade there would wipe the line
 * away while it was still being written.
 *
 *   outroHoldMs — how long the finished line lingers before it starts to go.
 *   outroFadeMs — the fade itself. The text unmounts once it completes.
 */
export const MAP_TIMING = {
  crossFadeMs: 3400,
  textDelayMs: 1900,
  riseMs: 1150,
  riseStagger: 190,
  riseDrift: 34,
  riseScale: 0.9,
  labelDelayMs: 620,
  line5DelayMs: 900,
  outroHoldMs: 1500,
  outroFadeMs: 1000,
} as const;
