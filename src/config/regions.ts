/**
 * ── MAP REGIONS ────────────────────────────────────────────────────────────
 * The five zones of the continent, each a clickable hotspot on the map hub.
 *
 * ── COORDINATE SPACE ───────────────────────────────────────────────────────
 * Every number below is in the map image's own pixels: 1536 x 1024. The SVG
 * overlay uses `viewBox="0 0 1536 1024"` sitting exactly on top of the image,
 * so these coordinates scale with it automatically at every screen size — you
 * can measure a point in any image editor and paste it straight in.
 *
 * ── TUNING THE HOTSPOTS ────────────────────────────────────────────────────
 * `polygon` traces the terrain. They are hand-estimated from the artwork and
 * deliberately loose — a hotspot only has to feel like it covers its zone.
 * To refine one, open the PNG at 1536x1024, read off the corners you want and
 * replace the pairs. Points are [x, y]; keep them in order around the shape.
 *
 * ── TUNING THE LABELS ──────────────────────────────────────────────────────
 * `label` is where the region's name sits, in the same pixel space. It is the
 * CENTRE of the label, so nudge x/y to slide it around its zone. `align`
 * shifts the text box when a label would otherwise run off the map edge.
 */

export interface Region {
  /** Route segment — the section page lives at /{id}. */
  id: string;
  /** Themed name shown on the map. */
  name: string;
  /** What the region actually is, shown under the name. */
  kicker: string;
  /** One line of flavour, used on the section page header. */
  blurb: string;
  /** Label centre, in map pixels (1536 x 1024). */
  label: { x: number; y: number };
  /** Hotspot outline, in map pixels. */
  polygon: [number, number][];
}

export const REGIONS: Region[] = [
  {
    // Snow-capped mountains along the northern edge.
    id: "sanctum",
    name: "The Sanctum",
    kicker: "Home",
    blurb: "The high peaks where the work is named.",
    label: { x: 782, y: 196 },
    polygon: [
      [548, 262],
      [660, 132],
      [772, 28],
      [904, 82],
      [1046, 190],
      [1128, 300],
      [1064, 392],
      [880, 412],
      [686, 386],
      [520, 336],
    ],
  },
  {
    // Green plains and the citadel at the heart of the continent.
    id: "forge",
    name: "The Forge",
    kicker: "Projects",
    blurb: "Where ideas are hammered into working things.",
    label: { x: 752, y: 536 },
    polygon: [
      [538, 402],
      [700, 372],
      [872, 386],
      [982, 452],
      [1004, 574],
      [908, 668],
      [742, 700],
      [604, 646],
      [508, 528],
    ],
  },
  {
    // Dark forest down the western flank.
    id: "origins",
    name: "Origins",
    kicker: "About",
    blurb: "The old wood the road out of here started from.",
    label: { x: 292, y: 452 },
    polygon: [
      [286, 148],
      [440, 224],
      [516, 380],
      [478, 566],
      [370, 700],
      [232, 736],
      [126, 596],
      [92, 424],
      [158, 256],
    ],
  },
  {
    // Golden desert filling the east.
    id: "armory",
    name: "The Armory",
    kicker: "Skills & Honours",
    blurb: "Tools kept sharp, and the trophies they won.",
    label: { x: 1232, y: 432 },
    polygon: [
      [1142, 196],
      [1300, 246],
      [1428, 366],
      [1462, 500],
      [1372, 632],
      [1206, 700],
      [1050, 606],
      [994, 452],
      [1036, 288],
    ],
  },
  {
    // Harbour and coastline across the south.
    id: "gate",
    name: "The Gate",
    kicker: "Contact",
    blurb: "The harbour. Ships leave from here — send word.",
    label: { x: 760, y: 862 },
    polygon: [
      [470, 812],
      [600, 706],
      [760, 704],
      [944, 716],
      [1112, 806],
      [1010, 904],
      [852, 986],
      [686, 1004],
      [530, 928],
    ],
  },
];

/** Natural size of public/images/world-map.png — the SVG viewBox. */
export const MAP_SIZE = { width: 1536, height: 1024 } as const;

export function getRegion(id: string): Region | undefined {
  return REGIONS.find((region) => region.id === id);
}
