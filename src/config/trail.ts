/**
 * ── THE TRAIL ──────────────────────────────────────────────────────────────
 * A dotted route across the map, showing the order the realm is meant to be
 * visited in.
 *
 * ── HOW THE PATH IS BUILT ──────────────────────────────────────────────────
 * The islands' own `x`/`y` from config/islands.ts ARE the waypoints — the
 * trail is derived from them, never written down again. Move an island and the
 * route follows it, which is the whole reason this file holds an order of ids
 * rather than a list of coordinates.
 *
 * Between each pair the path bows out into a curve rather than a straight
 * ruled line: a hand-drawn map route wanders. `bow` sets how far, and its SIGN
 * sets which side of the straight line it swings to.
 */

/** Section ids, in the order a first-time visitor should walk them. */
export const TRAIL_ORDER = [
  "home", // 1 · The Sanctum — the welcome
  "projects", // 2 · The Forge — the work
  "about", // 3 · Origins — the story
  "skills", // 4 · The Armory — the toolkit
  "contact", // 5 · The Gate — get in touch
] as const;

export const TRAIL = {
  /**
   * Curvature per leg, one entry per gap between waypoints (so one fewer than
   * the order above). Positive bows one way, negative the other; 0 is a
   * straight line. Roughly a fraction of the leg's own length.
   *
   * The signs alternate on purpose — a route that bows the same way every time
   * reads as a machine drew it.
   *
   * THE LAST LEG IS DELIBERATELY SHALLOW. At -0.16 the Armory→Gate curve sagged
   * to y 87.5 in the middle of the map, which is the southern shipping lane —
   * the route's boats sailed straight through the drifting fleet there. -0.05
   * holds it at y 81.5 and leaves the pocket below it clear. See the layout
   * proof at the top of config/boats.ts before deepening it again.
   */
  bow: [0.16, -0.14, 0.2, -0.05],

  /*
   * GOLD, not the deep red it started as. Maroon on this map is nearly the
   * same value as the deep blue water it crosses, so the route read as a faint
   * smudge; gold is far enough up in luminance to sit clearly on top, and it
   * matches the compass and border the map is already framed with.
   */
  color: "#e8bd5a",
  colorLight: "#ffe9b0",
  /** A dark halo, so the gold never washes out over pale surf. */
  glow: "rgba(28, 16, 4, 0.6)",

  /** Stroke width in px, held constant at any map size. */
  width: 2.6,
  /** Dot length and the gap after it, in px. Equal values give round dots. */
  dash: 1.5,
  gap: 9,

  /** Seconds for the dots to march one full cycle. Higher is slower. */
  speedS: 2.6,

  /** Overall strength. The trail is a suggestion, not the main event. */
  opacity: 0.85,

  /**
   * ── SHIPS ────────────────────────────────────────────────────────────────
   * Small boats sailing the route, so the trail reads as a journey being made
   * rather than a line that was drawn.
   *
   * They ride the SAME path element the dots do, via `<mpath>`, so a change to
   * `bow` or to an island's position moves the boats with the line. Two paths
   * that had to be kept in step would drift apart the first time either moved.
   */
  ships: {
    /** How many are out at once. Spaced evenly along the route. */
    count: 3,
    /**
     * Seconds for one boat to sail the whole trail. Higher is slower.
     *
     * Measured against the map's own drifting ships: at 34s these covered
     * about 93 px/sec while the drifting fleet moves at roughly 5 px/sec, so
     * they read as speedboats crossing a becalmed sea. 62s puts them near
     * 50 px/sec — clearly under way, and no longer at odds with every other
     * vessel on the water.
     */
    voyageS: 62,
    /**
     * The real boat artwork, the same set the drifting ships use. A drawn
     * hull never quite matched them, and two different boat styles on one map
     * reads as an oversight.
     */
    src: "/images/boats/boat-4.png",
    /**
     * Width in the map's 160x90 space. 1 unit is about 9px at 1440 wide.
     *
     * 6.4 lands these at roughly 58px, inside the 45-73px range the map's own
     * drifting ships occupy. At 3.6 they were 32px — visibly a smaller class
     * of boat than everything around them.
     */
    width: 6.4,
    /** The artwork's own aspect, so the hull is never squashed. */
    aspect: 338 / 351,
    opacity: 0.92,
  },

  /** Numbered markers at each stop. */
  markers: true,
  markerR: 9,
  markerFill: "#a87a1e",
  markerInk: "#fff4d6",
  /**
   * Nudges the marker up from the island's centre, as a % of the map's height.
   * It still sits over the artwork, which is the point — it is a pin on the
   * island, not a label beside it.
   */
  markerOffsetY: -9,
} as const;

/** The trail's knobs as CSS custom properties, for the map stage. */
export const trailVars = (): Record<string, string> => ({
  "--trail-color": TRAIL.color,
  "--trail-color-light": TRAIL.colorLight,
  "--trail-glow": TRAIL.glow,
  "--trail-w": `${TRAIL.width}px`,
  "--trail-dash": `${TRAIL.dash}px`,
  "--trail-gap": `${TRAIL.gap}px`,
  "--trail-speed": `${TRAIL.speedS}s`,
  "--trail-opacity": `${TRAIL.opacity}`,
  "--trail-marker-r": `${TRAIL.markerR}px`,
  "--trail-marker-fill": TRAIL.markerFill,
  "--trail-marker-ink": TRAIL.markerInk,
  "--trail-ship-opacity": `${TRAIL.ships.opacity}`,
  "--trail-voyage": `${TRAIL.ships.voyageS}s`,
});
