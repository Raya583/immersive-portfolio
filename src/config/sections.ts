/**
 * ── SECTIONS & THE SCROLL TRANSITION ───────────────────────────────────────
 * What happens when you click an island, and what you land on.
 *
 * ── THE SEQUENCE ───────────────────────────────────────────────────────────
 * Going in:
 *   zoomMs    the map pushes in toward the island you clicked
 *   openMs    a scroll unrolls SIDEWAYS from the centre until it fills the screen
 *   holdMs    it holds — the loading beat; the page mounts behind it here
 *   closeMs   it collapses TOP AND BOTTOM to the centre, revealing the page
 *
 * Coming back the same thing runs in reverse: the scroll unrolls VERTICALLY,
 * holds, then retracts sideways to reveal the map, which pulls back out.
 *
 * The axes are deliberately opposite on the way in and the way out. It reads as
 * one physical object being opened and put away again rather than two unrelated
 * wipes, and it means the page is never revealed by the same motion that
 * covered the map.
 */

export const TRANSITION = {
  /** Map pushes in toward the clicked island. */
  zoomMs: 600,
  /** How far in. 1 = no zoom. */
  zoomScale: 2.15,

  /** Scroll unrolls sideways to cover the screen. */
  openMs: 700,
  /** The loading beat, held wide open. */
  holdMs: 1000,
  /** Scroll collapses vertically, revealing the page. */
  closeMs: 700,
  /**
   * The beat the map is visible for when travelling from one island straight
   * to another (THE SANCTUM's call to action). Without it the closing and
   * opening wipes run back to back and read as one long stutter rather than as
   * leaving somewhere and arriving somewhere else.
   */
  travelPauseMs: 420,
  /**
   * How thick the scroll is when fully rolled up, at the centre of the screen.
   * Not zero: a rolled scroll has a spine, and starting from a visible sliver
   * with its rollers together is what makes the motion read as UNROLLING from
   * the middle rather than a rectangle fading in.
   */
  closedStrip: "1.6vmin",

  /** How long the section page takes to settle in once revealed. */
  pageFadeMs: 500,
} as const;

/**
 * ── THE FIVE DESTINATIONS ──────────────────────────────────────────────────
 * `id` matches the island ids in config/islands.ts.
 *
 * `built: false` lands on the placeholder in components/sections/ComingSoon —
 * the transition is identical, only the page behind it differs. Flip the flag
 * when a page exists and add its component to SectionOverlay's switch.
 */
export interface SectionMeta {
  id: string;
  /** The name on the map, and on the scroll as it opens. */
  name: string;
  /** One line under the page title. */
  subtitle: string;
  built: boolean;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: "projects",
    name: "The Forge",
    subtitle: "Where the work is made",
    built: true,
  },
  // Every island is written now. The placeholder page below is kept for any
  // section added in future, so a new entry degrades gracefully.
  { id: "home", name: "The Sanctum", subtitle: "The heart of the realm", built: true },
  { id: "about", name: "Origins", subtitle: "Where it began", built: true },
  { id: "skills", name: "The Armory", subtitle: "Tools of the craft", built: true },
  { id: "contact", name: "The Gate", subtitle: "Ways through", built: true },
];

export const sectionById = (id: string | null) =>
  SECTIONS.find((s) => s.id === id) ?? null;

/**
 * ── THE FORGE ──────────────────────────────────────────────────────────────
 * The page itself reads everything from src/content/portfolio.ts — titles,
 * descriptions, links, achievements. EDIT THE CONTENT THERE, not here. This
 * block only decides ordering and which credential belongs to which project.
 *
 * Anything the résumé does not carry (role, tech, impact are `""`/`[]` on most
 * entries) is simply not rendered. Nothing is invented to fill a gap.
 */
export const FORGE = {
  /** Order the projects appear in. Titles must match portfolio.ts exactly. */
  order: ["COGMU", "Crustfolio", "FUTURX", "DEXOVO"] as string[],

  /**
   * Competition wins to show on a project's card, by project title →
   * achievement titles. Both of these are real placements from the résumé's
   * achievements list; the mapping is here because portfolio.ts files them
   * separately from the projects they belong to.
   */
  credentials: {
    COGMU: ["COGMU"],
    Crustfolio: ["Crustfolio"],
    FUTURX: ["FuturX revamp"],
  } as Record<string, string[]>,

  /** Shown under the page title. */
  intro:
    "Four things built end to end: a music-recognition app, an award-winning " +
    "interactive portfolio, a college-finder, and a companion app in progress.",
} as const;
