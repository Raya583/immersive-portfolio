/**
 * ── PROJECT LOGOS ──────────────────────────────────────────────────────────
 * Each project's own brand mark, and what it means.
 *
 * Keyed by project title exactly as in content/portfolio.ts — the same
 * convention as projectThemes.ts and projectFlair.ts. A project with no entry
 * renders no logo and no "The Logo" section, which is the correct default: an
 * empty frame where a mark should be reads as a broken page.
 *
 * ── THE PLATE ──────────────────────────────────────────────────────────────
 * A transparent logo is drawn in ONE ink, and that ink was chosen against the
 * background the brand normally sits on — which is not necessarily the
 * background of its case study here.
 *
 * Measured from the actual files (decoding pixels, not headers):
 *
 *   futurx/logo.svg       ink luminance  27/255   dark navy
 *   crustfolio/logo.svg   ink luminance 161/255   orange→gold
 *   cogmu/logo.svg        light wordmark, drawn for a dark surface
 *
 * All three are vector now. The two measurements above were taken from the
 * PNGs these replaced; the artwork is identical (same 312x50 and 104x32
 * geometry, same fills), so the plate decisions they drove still hold — and
 * FUTURX's mark rendered on its own #0a1729 page is very nearly invisible,
 * which is the whole argument for its light plate.
 *
 * FUTURX's mark is near-black and its page is near-black, so without a light
 * plate behind it the logo is invisible. Hence `plate` rather than a single
 * hard-coded container: the treatment is a per-project decision driven by the
 * artwork, not by the theme.
 */

export interface ProjectLogo {
  /** Public path. SVG wherever the project supplied one — it stays crisp. */
  src: string;
  /**
   * Intrinsic pixel size. Both are needed to reserve the right box before the
   * image loads; the ratio is what drives the rendered width.
   */
  width: number;
  height: number;
  /** Described, not decorative — the mark is the subject of its own section. */
  alt: string;
  /**
   * What sits behind the mark.
   *   "light"   — a near-white plate, for dark ink on a dark page.
   *   "surface" — the theme's own raised surface.
   *   "none"    — straight onto the page.
   */
  plate: "light" | "surface" | "none";
  /** Why the mark looks the way it does. */
  rationale: string;
}

export const PROJECT_LOGOS: Record<string, ProjectLogo> = {
  /**
   * Two signposts, exported from Figma as "Container" — the same default frame
   * name COGMU's export carried, which is why the two arrived looking like one
   * file in two formats. They are different marks; the 104x32 vs 154x40
   * geometry is what tells them apart.
   *
   * Dark navy ink on a page of nearly the same navy, so this one gets the
   * light plate.
   */
  FUTURX: {
    src: "/images/projects/futurx/logo.svg",
    width: 104,
    height: 32,
    alt: "The FuturX logo: two signposts pointing in different directions, beside the FuturX wordmark",
    plate: "light",
    rationale:
      "Two signposts pointing in different directions, a crossroads made into " +
      "a mark. It speaks to the platform's purpose: every student stands " +
      "before many paths, and FUTURX helps them choose which future to walk " +
      "toward.",
  },

  /**
   * A circle holding a sound wave, with the wave built from stacked strokes of
   * rising amplitude, so it reads as motion rather than as a static squiggle.
   *
   * Its wordmark is near-white, drawn for a dark surface, which is exactly
   * what COGMU's deep-plum page is.
   */
  COGMU: {
    src: "/images/projects/cogmu/logo.svg",
    width: 154,
    height: 40,
    alt: "The Cogmu logo: a sound wave inside a circle, beside the Cogmu wordmark",
    plate: "surface",
    rationale:
      "A single sound wave held inside a circle, the visual heartbeat of " +
      "music being recognised. It captures the whole idea in one mark: COGMU, " +
      "from Cognition + Music, the moment a melody becomes known.",
  },

  Crustfolio: {
    src: "/images/projects/crustfolio/logo.svg",
    width: 312,
    height: 50,
    alt: "The CrustFolio logo: the CrustFolio wordmark in a warm orange-to-gold serif",
    plate: "surface",
    rationale:
      "Warm orange at its core, the colour of melted mozzarella, golden " +
      "crust, and wood-fired warmth. The name itself is a fold: Crust (the " +
      "pizza) meets folio (the portfolio), so the brand tastes like what it " +
      "presents.",
  },
};

export const logoFor = (title: string): ProjectLogo | undefined =>
  PROJECT_LOGOS[title];
