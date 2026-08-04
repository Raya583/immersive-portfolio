/**
 * ── PROJECT FLAIR ──────────────────────────────────────────────────────────
 * The small delights on a case-study page: whatever falls past the background,
 * and whoever is sitting on the furniture.
 *
 * Keyed by project title, exactly as in content/portfolio.ts — same convention
 * as config/projectThemes.ts. A project with no entry gets nothing, which is
 * the correct default: flair should be a decision, not something every page
 * inherits by accident.
 *
 * Both are decoration. Neither takes a pointer event, and both sit under the
 * content's stacking level.
 */

/**
 * What can drift past a case-study page. Each is drawn from scratch — see
 * components/flair/DriftField.tsx.
 *
 * Named `drift` rather than `food` because it stopped being food the moment a
 * music app wanted headphones.
 */
export type DriftKind =
  | "slice"
  | "tomato"
  | "pepper"
  | "note"
  | "headphones"
  | "cap"
  | "pokeball"
  | "spark";

export interface DriftField {
  /** Desktop count. */
  count: number;
  mobileCount: number;
  /**
   * Relative frequency of each shape, and the colours that shape draws with.
   * Weights are proportions, not percentages.
   *
   * `colors` is positional, and each kind reads it differently:
   *   slice       [cheese, crust, sauce, pepperoni]
   *   tomato      [body, shade, leaf]
   *   pepper      [flesh, seed]
   *   note        [ink]
   *   headphones  [ink]
 *   pokeball    [top, bottom, band]
 *   spark       [ink]
   */
  mix: { kind: DriftKind; weight: number; colors: string[] }[];
  /** Size in px, roughly the widest dimension. */
  size: [number, number];
  /** Fall speed, px/sec. Negative rises. */
  speed: [number, number];
  /** Sideways drift, px, and how fast it oscillates in cycles/sec. */
  sway: [number, number];
  swaySpeed: [number, number];
  /** Tumble, in rotations/sec. Signed. */
  spin: [number, number];
  opacity: [number, number];
}

/**
 * Where a cat is sitting. Each value is a spot the case study offers; adding a
 * cat is choosing a perch and a pose, and adding a NEW perch means adding the
 * anchor in ForgePage's case-study markup too.
 */
export type CatPerch = "title" | "links" | "challenge" | "feature" | "outcome";
export type CatPose = "sitting" | "curled" | "peeking";

export interface Cat {
  perch: CatPerch;
  pose: CatPose;
  /** Height in px. These are meant to be small. */
  size: number;
  /** Mirror it, so a cat can face into the page from either side. */
  flip?: boolean;
  /** Seconds of offset on its idle animations, so they never move in unison. */
  delay: number;
  /** Coat. */
  color: string;
  /** What a screen reader is told, if anything. Empty means decorative. */
  label?: string;
}

/**
 * ── A BRANDED ROW ──────────────────────────────────────────────────────────
 * A project's row in the quest log, dressed in that project's own colours — a
 * taste of the page before you open it.
 *
 * Only rows with a `row` entry get this. The rest keep the plain treatment and
 * their accent stripe, which is deliberate: a log where every row shouts is a
 * log where none of them do, and these should arrive one at a time as each
 * project earns an identity.
 */
export interface RowBranding {
  /** Panel fill. Warm enough to read as the project, light enough to read on. */
  panel: string;
  border: string;
  borderHover: string;
  /** The bloom thrown when the row is under the pointer. */
  glow: string;
  /**
   * ── COLOUR ROLES ─────────────────────────────────────────────────────────
   * Named rather than hard-coded, so the row's scheme can be inverted by
   * swapping values here and nowhere else. `ink` is the title and headline
   * colour; `badgeBg`/`badgeInk` are the award pill.
   */
  ink: string;
  inkSoft: string;
  badgeBg: string;
  badgeInk: string;
  /** Hairline around the thumbnail and the numeral. */
  trim: string;
  /** Set the row's title in the project's own display face. */
  brandTitle: boolean;
  /** Anything drifting INSIDE the row, clipped to it. Omit for a calm row. */
  drift?: {
    count: number;
    mobileCount: number;
    mix: { kind: DriftKind; weight: number; colors: string[] }[];
    /** Shape size in px. Small — the row is only so tall. */
    size: [number, number];
    /** Sideways drift, px/sec. Signed; some go the other way. */
    speed: [number, number];
    /** Vertical bob height in px and cycles/sec. */
    bob: [number, number];
    bobSpeed: [number, number];
    /** Tumble, rotations/sec. */
    spin: [number, number];
    opacity: [number, number];
  };
  /** One cat, in the row. */
  cat?: {
    pose: CatPose;
    size: number;
    color: string;
    delay: number;
    flip?: boolean;
    /** Which end of the row it sits at. */
    at: "left" | "right";
  };
}

/**
 * The mark inside a project's call-to-action button. A pizza slice belongs to
 * the pizzeria and nowhere else — this was hard-coded for every project until
 * COGMU arrived and put a slice on a music app.
 */
export type CtaIcon = "slice" | "note";

export interface ProjectFlair {
  ctaIcon?: CtaIcon;
  drift?: DriftField;
  cats?: Cat[];
  row?: RowBranding;
}

export const PROJECT_FLAIR: Record<string, ProjectFlair> = {
  /**
   * DEXOVO — oxblood, with capture spheres and sparks drifting through it.
   *
   * ── WHY THE SPHERES RISE ─────────────────────────────────────────────────
   * A thrown ball goes up. Falling ones would read as dropped, which is the
   * same reasoning as FUTURX's caps below, and it is the difference between a
   * field that feels like the subject and one that feels like weather.
   *
   * ── WHY THERE ARE TWO SHAPES ─────────────────────────────────────────────
   * Spheres alone tile: the eye finds the repeat within a second or two
   * because every one of them is the same silhouette at a different size. The
   * sparks are three to one against, so they read as an accent on a field of
   * spheres rather than as a second field.
   */
  DEXOVO: {
    drift: {
      count: 15,
      mobileCount: 7,
      mix: [
        {
          kind: "pokeball",
          weight: 3,
          // [top, bottom, band]. The pale half is warm off-white rather than
          // pure white — #fff on oxblood is a hole, and these sit behind text.
          colors: ["#d9102f", "#efe2e2", "#17100f"],
        },
        { kind: "spark", weight: 1, colors: ["#f7c928"] },
      ],
      /*
       * The floor is 16. Below roughly 14px the band and the button collapse
       * into one dark smear and the sphere reads as a plain dot — the seam is
       * the entire reason it is recognisable.
       */
      size: [16, 42],
      // Negative rises. Slow: a fast one reads as an error, not as a throw.
      speed: [-26, -9],
      sway: [14, 50],
      swaySpeed: [0.04, 0.12],
      // A sphere is radially symmetric apart from its seam, so a little spin
      // is what tells you it is turning at all.
      spin: [-0.09, 0.09],
      /*
       * 0.08-0.2, lower than FUTURX's 0.11-0.28. These shapes carry a
       * saturated red where the caps were a desaturated blue, and equal alpha
       * on this page put them level with the body copy.
       */
      opacity: [0.08, 0.2],
    },

    row: {
      /**
       * The row, in the app's own colours: the oxblood shell, and the yellow
       * header bar it puts its mark on. The gradient runs toward red on the
       * right so the row has somewhere to go under the pointer.
       */
      panel:
        "linear-gradient(104deg, rgba(23, 16, 15, 0.96) 0%, rgba(59, 31, 29, 0.95) 52%, rgba(134, 22, 37, 0.92) 100%)",
      border: "rgba(247, 201, 40, 0.45)",
      borderHover: "rgba(247, 201, 40, 0.95)",
      glow: "rgba(217, 16, 47, 0.55)",
      ink: "#f8efe6",
      inkSoft: "rgba(238, 214, 206, 0.86)",
      // The award pill in Pokéball yellow, with the shell colour as its ink.
      badgeBg: "#f7c928",
      badgeInk: "#211514",
      trim: "rgba(247, 201, 40, 0.42)",
      brandTitle: true,
      /**
       * Spheres inside the row too, brighter than the page field: the row is a
       * small dark panel, and the page's 0.08 floor is invisible at this size.
       */
      drift: {
        count: 13,
        mobileCount: 6,
        mix: [
          {
            kind: "pokeball",
            weight: 3,
            colors: ["#e42747", "#f4e8e8", "#1c1211"],
          },
          { kind: "spark", weight: 1, colors: ["#ffe98a"] },
        ],
        // Same floor problem as the page field, tighter ceiling: the row is
        // only so tall.
        size: [12, 24],
        speed: [-13, 14],
        bob: [3, 9],
        bobSpeed: [0.07, 0.2],
        spin: [-0.09, 0.09],
        opacity: [0.24, 0.5],
      },
    },
  },

  /**
   * FUTURX — dark navy, with graduation caps drifting up through it.
   *
   * Still no cat. The drift is the one flourish this project gets: it is the
   * serious one of the set, and caps are on-subject rather than decorative —
   * the whole platform exists to get students to that moment.
   */
  FUTURX: {
    /**
     * ── THE CAP TOSS ─────────────────────────────────────────────────────────
     * Mortarboards drifting UPWARD, not falling — a thrown cap is the single
     * image everyone has of finishing school, and it is the thing FuturX helps
     * students get to. Falling caps would read as dropped ones.
     *
     * Pale blue on the navy page, and kept LOW: 0.08–0.22 against a dark
     * background is enough to notice on a still frame without competing with
     * body copy. Crustfolio's pizza runs at 0.12–0.30 on cream, which is a
     * lighter page — the same numbers here would be far louder.
     */
    drift: {
      count: 16,
      mobileCount: 7,
      mix: [
        { kind: "cap", weight: 1, colors: ["#cfe0ff", "#7fb2ff", "#9dc2f2"] },
      ],
      /*
       * The floor is 22, not 15. Below roughly 20px the board, crown and
       * tassel collapse into one blob and the shape reads as a plain diamond —
       * a mortarboard needs the tassel legible to be a mortarboard at all.
       * Fewer, slightly larger caps beat more unrecognisable ones.
       */
      size: [22, 52],
      // Negative rises. Slow — these are meant to be barely moving.
      speed: [-30, -10],
      sway: [16, 56],
      swaySpeed: [0.04, 0.13],
      // Barely any tumble; a spinning cap stops reading as a cap.
      spin: [-0.05, 0.05],
      opacity: [0.11, 0.28],
    },

    row: {
      /**
       * Caps inside the row too, brighter than the page field — the row's own
       * navy panel is darker than the page and it is a much smaller area, so
       * the page's opacity would be invisible here.
       */
      drift: {
        count: 12,
        mobileCount: 6,
        mix: [
          { kind: "cap", weight: 1, colors: ["#dbe9ff", "#8fbcff", "#a8c8f5"] },
        ],
        // Same floor problem, tighter ceiling: the row is only so tall.
        size: [14, 26],
        speed: [-13, 14],
        bob: [3, 9],
        bobSpeed: [0.07, 0.2],
        spin: [-0.05, 0.05],
        opacity: [0.24, 0.46],
      },
      panel:
        "linear-gradient(104deg, rgba(10, 23, 41, 0.96) 0%, rgba(16, 42, 78, 0.94) 46%, rgba(24, 74, 148, 0.93) 100%)",
      border: "rgba(127, 178, 255, 0.5)",
      borderHover: "rgba(170, 208, 255, 0.95)",
      glow: "rgba(47, 128, 255, 0.55)",
      ink: "#eaf2ff",
      inkSoft: "rgba(206, 226, 252, 0.86)",
      badgeBg: "#dceaff",
      badgeInk: "#0d2a52",
      trim: "rgba(127, 178, 255, 0.75)",
      brandTitle: true,
    },
  },

  /**
   * COGMU — lavender, and deliberately quiet.
   *
   * Nothing falls through this row and no cat sits in it. Crustfolio's is the
   * loud one; if every branded row shouted, none of them would read as
   * distinct. A calm row is a real option, not an unfinished one.
   */
  COGMU: {
    ctaIcon: "note",
    /**
     * Headphones and notes drifting UP through the dark, rather than falling.
     * Music rises; pizza does not.
     */
    drift: {
      count: 26,
      mobileCount: 11,
      mix: [
        { kind: "note", weight: 6, colors: ["#c9b8f5"] },
        { kind: "headphones", weight: 3, colors: ["#8f79ec"] },
      ],
      size: [14, 36],
      speed: [-34, -11],
      sway: [18, 62],
      swaySpeed: [0.04, 0.15],
      spin: [-0.08, 0.08],
      opacity: [0.16, 0.42],
    },
    row: {
      /*
       * DARK-DOMINANT, the inverse of the pale version it replaced — deep plum
       * carrying light lavender type, so the row previews the page it opens.
       *
       * To go back to the light version: panel takes the cream→lavender ramp,
       * border rgba(109,90,224,.4), ink #2f2650, badge #6d5ae0 on #f6f3ff.
       */
      panel:
        "linear-gradient(104deg, rgba(38, 26, 74, 0.94) 0%, rgba(54, 36, 104, 0.93) 46%, rgba(78, 52, 148, 0.92) 100%)",
      border: "rgba(201, 184, 245, 0.5)",
      borderHover: "rgba(220, 208, 255, 0.95)",
      glow: "rgba(143, 121, 236, 0.55)",
      ink: "#efeafd",
      inkSoft: "rgba(220, 210, 250, 0.86)",
      badgeBg: "#dfd6fb",
      badgeInk: "#2b1f52",
      trim: "rgba(201, 184, 245, 0.65)",
      /** Headphones and notes, contained to the row. */
      drift: {
        count: 14,
        mobileCount: 7,
        mix: [
          { kind: "note", weight: 6, colors: ["#d8cdfb"] },
          { kind: "headphones", weight: 4, colors: ["#b7a4f2"] },
        ],
        size: [12, 26],
        speed: [-13, 15],
        bob: [3, 9],
        bobSpeed: [0.07, 0.22],
        spin: [-0.07, 0.07],
        opacity: [0.24, 0.5],
      },
      brandTitle: true,
    },
  },

  Crustfolio: {
    ctaIcon: "slice",
    /**
     * Slices, tomatoes and peppers drifting down like petals.
     *
     * Denser than a decorative dusting, because this page is meant to read as
     * a food brand — but kept low-opacity, because it is still a case study
     * and the words underneath have to win.
     */
    drift: {
      count: 34,
      mobileCount: 14,
      // Slices lead; the vegetables season it.
      mix: [
        { kind: "slice", weight: 5, colors: ["#f4cf7f", "#d9a25a", "#c8402c", "#a32d1c"] },
        { kind: "tomato", weight: 3, colors: ["#d8402c", "#a82a1c", "#5f9e46"] },
        { kind: "pepper", weight: 2, colors: ["#4e9b3f", "#eef0d2"] },
      ],
      size: [18, 44],
      speed: [14, 46],
      sway: [16, 58],
      swaySpeed: [0.05, 0.18],
      spin: [-0.16, 0.16],
      opacity: [0.12, 0.3],
    },

    /**
     * Two. One on the title and one on the button — enough that the page has
     * someone living in it, few enough that they stay a surprise.
     */
    cats: [
      {
        perch: "title",
        pose: "sitting",
        size: 44,
        delay: 0,
        color: "#3a2a1e",
        label: "",
      },
      {
        perch: "links",
        pose: "curled",
        size: 30,
        delay: 1.6,
        color: "#8a5a34",
        label: "",
      },
    ],

    /** Crustfolio's row in the quest log, in Crustfolio's colours. */
    row: {
      /*
       * RED-DOMINANT. To go back to the peach panel with red type, swap the
       * two groups: panel/border/glow take the cream values and ink/badge take
       * the red ones. Nothing outside this block needs to change.
       *
       *   peach version:  panel cream→peach, border rgba(192,58,38,.6),
       *                   ink #c03a26, badgeBg #c03a26, badgeInk #fff6ea
       */
      panel:
        "linear-gradient(104deg, rgba(178, 48, 30, 0.95) 0%, rgba(200, 66, 40, 0.94) 44%, rgba(224, 96, 58, 0.93) 100%)",
      border: "rgba(255, 226, 196, 0.6)",
      borderHover: "rgba(255, 240, 220, 0.95)",
      glow: "rgba(255, 150, 90, 0.5)",
      ink: "#fff2e2",
      inkSoft: "rgba(255, 232, 210, 0.88)",
      badgeBg: "#ffe9cf",
      badgeInk: "#a8301c",
      trim: "rgba(255, 226, 196, 0.5)",
      brandTitle: true,
      drift: {
        count: 16,
        mobileCount: 8,
        mix: [
          { kind: "slice", weight: 1, colors: ["#ffeec2", "#f6d29a", "#e8825e", "#c5462c"] },
        ],
        size: [13, 30],
        speed: [-14, 16],
        bob: [3, 9],
        bobSpeed: [0.08, 0.24],
        spin: [-0.1, 0.1],
        opacity: [0.26, 0.52],
      },
      cat: {
        pose: "sitting",
        size: 30,
        // A cream cat, so it shows against the red panel.
        color: "#ffe6c8",
        delay: 0.6,
        flip: true,
        at: "right",
      },
    }
  },
};

export const flairFor = (title: string): ProjectFlair =>
  PROJECT_FLAIR[title] ?? {};

export const catsAt = (flair: ProjectFlair, perch: CatPerch): Cat[] =>
  (flair.cats ?? []).filter((c) => c.perch === perch);
