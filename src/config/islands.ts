import type { Vec3 } from "@/types/three";

/**
 * The five islands, laid out as a readable bird's-eye MAP.
 *
 * ── HOW THE NUMBERS WERE PICKED ────────────────────────────────────────────
 * The models come from different creators, so their raw .glb sizes are wildly
 * different. Measured world-space bounding boxes at scale 1:
 *
 *   model          base footprint   base height   top of model (y)
 *   floaty              0.75            0.66            0.25
 *   poly-island       118.89           37.54           34.94
 *   treehouse          77.98           94.23           73.10
 *   camping             1.01            1.86            0.40
 *   winter             12.74           13.50            9.37
 *
 * ("footprint" = the larger of the model's X/Z extent — what you actually see
 * from above.) Every `scale` below is therefore TARGET_FOOTPRINT / base
 * footprint, so all five read as roughly the same size on the map instead of
 * poly and treehouse swallowing the others.
 *
 * ── WHAT TO TWEAK ──────────────────────────────────────────────────────────
 *   · one island too big/small → edit its `scale` (see TARGET_FOOTPRINT below)
 *   · islands too close/far    → edit SPREAD_X / SPREAD_Z below
 *   · a label clipping into geometry → edit that island's `labelHeight`
 *   · the whole map not fitting in frame → MAP_CONFIG.camera in config/map.ts
 */
export interface IslandConfig {
  id: string;
  /** Themed name shown on the floating map label. */
  name: string;
  model: string;
  position: Vec3;
  scale: number;
  rotation: Vec3;
  appearAtStep: number;
  /** World units above the island's origin to float its name label. */
  labelHeight: number;
}

/**
 * ONE ISLAND AT A TIME:
 *   0 = floaty · 1 = poly · 2 = treehouse · 3 = camping · 4 = winter
 * Set to null to show all five in their final positions.
 */
export const SOLO_MODE: number | null = null;

/**
 * ── SIZE KNOB ──────────────────────────────────────────────────────────────
 * How wide each island should read on the map, in world units. To resize the
 * whole set, change this and rescale every `scale` below by the same ratio.
 * To resize ONE island, just nudge its `scale` — the value in the comment
 * beside it is the footprint that scale produces.
 */
export const TARGET_FOOTPRINT = 8;

/**
 * ── SPACING KNOBS ──────────────────────────────────────────────────────────
 * A quincunx: four islands on the corners, one in the middle. These are the
 * half-extents of the layout, so the corner islands sit 2·SPREAD_X apart in X
 * and 2·SPREAD_Z apart in Z. With TARGET_FOOTPRINT = 8 the tightest gap
 * (corner → centre, ~18.6 units) leaves ~10 units of clear space.
 *
 * Raising these spreads the map out — raise MAP_CONFIG.camera height to match,
 * or the outer islands will drift out of frame.
 */
const SPREAD_X = 15;
const SPREAD_Z = 11;

/**
 * Y is kept level at 0 across the board: on a top-down map, height differences
 * only muddy the read. Per-island `labelHeight` already accounts for how tall
 * each model stands above its origin (measured tops in the table above).
 */
const ALL_ISLANDS: IslandConfig[] = [
  // id/name              model                          position (x, y, z)                scale     rotation        step  labelHeight
  // scale = 8 / 0.75 → footprint 8.0, stands 2.6 tall
  { id: "floaty",    name: "Rhythm Island",  model: "/models/floaty.glb",      position: [-SPREAD_X, 0,  SPREAD_Z], scale: 10.67,  rotation: [0,  0.4, 0], appearAtStep: 4, labelHeight: 5.2 },
  // scale = 8 / 118.89 → footprint 8.0, stands 2.4 tall
  { id: "poly",      name: "Workshop",       model: "/models/poly-island.glb", position: [-SPREAD_X, 0, -SPREAD_Z], scale: 0.067,  rotation: [0, -0.3, 0], appearAtStep: 4, labelHeight: 5.0 },
  // scale = 8 / 77.98 → footprint 8.0, stands 7.5 tall (tall tree — high label)
  { id: "treehouse", name: "Playground",     model: "/models/treehouse.glb",   position: [ SPREAD_X, 0, -SPREAD_Z], scale: 0.103,  rotation: [0,  0.8, 0], appearAtStep: 4, labelHeight: 10.0 },
  // scale = 8 / 1.01 → footprint 8.0, stands 3.1 tall
  { id: "camping",   name: "Memory Island",  model: "/models/camping.glb",     position: [ SPREAD_X, 0,  SPREAD_Z], scale: 7.94,   rotation: [0, -0.6, 0], appearAtStep: 4, labelHeight: 5.8 },
  // scale = 8 / 12.74 → footprint 8.0, stands 5.9 tall
  { id: "winter",    name: "Innovation Lab", model: "/models/winter.glb",      position: [        0, 0,         0], scale: 0.628,  rotation: [0,  0.2, 0], appearAtStep: 4, labelHeight: 8.4 },
];

export const ISLANDS: readonly IslandConfig[] =
  SOLO_MODE === null
    ? ALL_ISLANDS
    : [{ ...ALL_ISLANDS[SOLO_MODE]!, position: [0, 0, 0] }];

/**
 * The order the dotted trail visits the islands in. On the quincunx above this
 * runs around three sides of the square and then turns inward to finish at the
 * centre island, so no leg of the trail ever crosses another:
 *
 *     poly ─────────── treehouse        (back)
 *      │                   │
 *      │      winter       │            (centre = journey's end)
 *      │        ↖          │
 *    floaty            camping          (front)
 *
 * Ids must exist in ALL_ISLANDS; the path renderer skips any id that isn't
 * currently on screen (e.g. while in SOLO_MODE).
 */
export const JOURNEY: readonly string[] = [
  "floaty",
  "poly",
  "treehouse",
  "camping",
  "winter",
] as const;

export const ISLAND_APPEAR_SECONDS = 2.6;
export const ISLAND_STAGGER_SECONDS = 0.35;
export const ISLAND_SPIN_SPEED = 0.15;
