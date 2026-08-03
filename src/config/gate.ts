/**
 * ── THE GATE ───────────────────────────────────────────────────────────────
 * The contact island: the way out of the realm, and the way to reach him.
 *
 * ── WHERE THE DETAILS LIVE ─────────────────────────────────────────────────
 * Not here. Every address, number and URL comes from `profile` in
 * content/portfolio.ts — this file only decides how they are PRESENTED: the
 * order, the labels, which icon, and which one is the primary call to action.
 *
 * A method with no value in `profile` produces no card. That is the whole
 * mechanism: `methods()` reads the profile and drops anything empty, so
 * deleting a link there deletes its button here with nothing else to update.
 */

import { profile } from "@/content/portfolio";

export type GateIcon = "mail" | "phone" | "linkedin" | "instagram";

export interface ContactMethod {
  id: string;
  icon: GateIcon;
  /** The small caption above the value. */
  label: string;
  /** What the reader sees — the real address, not "click here". */
  value: string;
  href: string;
  /** Off-site links open in a new tab; mailto: and tel: must NOT. */
  external: boolean;
  /**
   * The one card that gets the solid treatment. Email is it: everything else
   * is a way of asking someone to move to another app first.
   */
  primary?: boolean;
}

export const GATE = {
  /** Sits under the island's own title. */
  heading: "Let's work together",
  invitation:
    "The gate is open. Whether it's a role, a project, or a question about " +
    "something on this map, send a note and I'll write back.",
  /** Under the buttons, so the page ends on a human line rather than a list. */
  footnote: "Usually replies within a day.",
} as const;

/**
 * The contact cards, in the order they should be read: the direct ways to
 * reach a person first, the places to go look at one after.
 */
export const methods = (): ContactMethod[] => {
  const { email, phone, links } = profile;

  const all: (ContactMethod | null)[] = [
    email
      ? {
          id: "email",
          icon: "mail",
          label: "Email",
          value: email,
          href: `mailto:${email}`,
          external: false,
          primary: true,
        }
      : null,

    phone
      ? {
          id: "phone",
          icon: "phone",
          label: "Phone",
          value: phone,
          // tel: wants no spaces or dashes; the label keeps them for reading.
          href: `tel:${phone.replace(/[^\d+]/g, "")}`,
          external: false,
        }
      : null,

    links.linkedin
      ? {
          id: "linkedin",
          icon: "linkedin",
          label: "LinkedIn",
          value: "Yashwardhan Singh",
          href: links.linkedin,
          external: true,
        }
      : null,

    links.instagram
      ? {
          id: "instagram",
          icon: "instagram",
          label: "Instagram",
          // The handle, taken from the URL rather than written twice.
          value: `@${links.instagram.replace(/\/+$/, "").split("/").pop()}`,
          href: links.instagram,
          external: true,
        }
      : null,
  ];

  return all.filter((m): m is ContactMethod => m !== null);
};

/**
 * ── THE FROZEN SHORE ───────────────────────────────────────────────────────
 * The Gate's weather and its palette, in one place.
 *
 * The island on the map is the ice island, so the page is a snowfield: the
 * same artwork sitting low on the horizon, snow falling past it, and a cold
 * blue grade over everything.
 */

export const GATE_SCENE = {
  /**
   * ── WHICH BACKDROP ───────────────────────────────────────────────────────
   * "image"  — the full-bleed painting at `backdrop.image.src`.
   * "island" — the original floating iceland cut-out, configured under
   *            `island` below.
   *
   * TO REVERT to the cut-out: change this one word to "island". Nothing else
   * needs touching — the `island` block is still here and still wired up, and
   * both share the same parallax, scrim, snow and mist.
   */
  backdrop: {
    mode: "image" as "image" | "island",
    image: {
      src: "/images/gate-bg.png",
      /*
       * A bright daylight snowfield behind off-white type. Dimmed and cooled
       * on the IMAGE — never as a tinted overlay, which would recolour the
       * page behind it and draw a visible rectangle.
       */
      grade: "saturate(0.82) brightness(0.46) contrast(1.08)",
      opacity: 0.88,
      blurPx: 1.5,
      /** % scaled past the viewport, so parallax never reveals an edge. */
      overscan: 9,
    },
  },

  /**
   * The frozen mountain cut-out. Used when `backdrop.mode` is "island". Same
   * file the map uses.
   *
   * ── ANCHORED FROM THE TOP ────────────────────────────────────────────────
   * The peak sits about 10% down the artwork, so anchoring from the TOP is
   * what puts it high on the page. Anchored from the bottom — as it was — the
   * peak lands below the fold at any size big enough to be impressive, and all
   * you see is the shoreline.
   *
   * `width` is over 100vw deliberately: the art is a complete floating island
   * seen from above, and cropping its oval edge off both sides is what turns
   * it from an object sitting ON the page into a landscape the page is on.
   */
  island: {
    src: "/images/islands/iceland.png",
    glow: "/images/islands/icelandglow.png",
    /** % of viewport width. */
    width: 138,
    mobileWidth: 300,
    /** % of the island's own height, offset from the top edge. Negative lifts. */
    top: -5,
    /*
     * Positive on a phone. At 300vw the art is three viewports wide, so its
     * height dwarfs the screen — the same -5% that frames the peak nicely on a
     * desktop pushed the summit clean off the top edge there.
     */
    mobileTop: 2,
    opacity: 0.5,
    /** Pushes it behind the text. A little goes a long way. */
    blurPx: 2.2,
    /**
     * Colour grade applied to the artwork itself, as a CSS `filter` value.
     * NOT an overlay: a translucent box with a blend mode recolours the page
     * behind it too, which drew a visible rectangle across the page.
     */
    grade: "saturate(0.82) brightness(0.86) contrast(1.04)",
    /** The glow plate behind it. */
    glowOpacity: 0.3,
  },

  /**
   * The scrim between the mountain and the words.
   *
   * A backdrop this large and this detailed will eat body copy without one.
   * Weighted to the LEFT, where the column of text sits, so the right-hand
   * side of the peak stays clean and impressive — the standard treatment for
   * type over a photograph, and the reason the art can be this prominent.
   */
  scrim: {
    /** Overall strength, 0-1. */
    opacity: 0.92,
    /** How far across the page the dark side reaches, as a %. */
    reach: 62,
  },

  /**
   * ── POINTER PARALLAX ──────────────────────────────────────────────────────
   * How much each layer drifts with the cursor. The GAPS between these are the
   * depth cue — near snow moves most, the mountain least, which is what reads
   * as looking into a space rather than at a picture.
   */
  parallax: {
    /** px of drift at the NEAREST snow layer. Far flakes get a fraction. */
    snow: 54,
    /** px of drift for the mountain. Much less — it is furthest away. */
    island: 18,
    /** How fast the eased pointer catches up, per second. Higher = snappier. */
    easing: 3.2,
    /**
     * Flakes shove away from the cursor inside this radius, by up to
     * `strength` px. Set strength to 0 for parallax without the swirl.
     */
    repelRadius: 150,
    repelStrength: 30,
    /** Touch screens have no hovering cursor to parallax against. */
    mobileScale: 0,
    /** Motion-sensitive visitors keep the depth, at a fraction of the travel. */
    reducedScale: 0.25,
  },

  /**
   * Falling snow.
   *
   * Two populations in one canvas: `count` small crisp flakes in the middle
   * distance, and `bokeh` large out-of-focus ones drifting nearer the viewer.
   * Depth is what stops snow reading as static on a screen — a single size at
   * a single speed looks like noise.
   */
  snow: {
    count: 110,
    mobileCount: 44,
    /** Radius in px. */
    size: [0.9, 2.6] as [number, number],
    /** Fall speed, px/sec. */
    speed: [14, 46] as [number, number],
    /** Sideways drift in px, and its rate in cycles/sec. */
    sway: [10, 44] as [number, number],
    swaySpeed: [0.04, 0.15] as [number, number],
    opacity: [0.28, 0.85] as [number, number],
  },

  /** The soft, close, out-of-focus flakes. Few — they are punctuation. */
  bokeh: {
    count: 14,
    mobileCount: 6,
    size: [5, 13] as [number, number],
    speed: [7, 20] as [number, number],
    sway: [18, 62] as [number, number],
    swaySpeed: [0.03, 0.09] as [number, number],
    opacity: [0.05, 0.15] as [number, number],
  },

  /** Cold ground mist, drifting sideways across the lower page. */
  mist: {
    bands: 3,
    color: "rgba(150, 205, 232, 0.2)",
    /** Seconds for one crossing. Slow — this should never draw the eye. */
    driftS: 46,
    opacity: 0.5,
  },
} as const;

/**
 * The icy palette, emitted as CSS custom properties onto the page wrapper —
 * the same mechanism `themeVars()` uses for a project's case study, so the
 * section header's title and back button pick these up too rather than
 * carrying a second hard-coded set.
 *
 * ── THE ACCENT ─────────────────────────────────────────────────────────────
 * Ice cyan, not the lantern gold this page opened with. Gold reads warm and
 * welcoming, which suited a "gateway" but fights a snowfield — one warm mark
 * in a frozen scene looks like a mistake rather than a choice.
 *
 * To go back to gold: accent "#e0a94e", accentSoft "rgba(224,169,78,.14)",
 * accentEdge "rgba(224,169,78,.66)". Nothing else needs touching.
 */
export const GATE_PALETTE = {
  /** Page base, darkest at the bottom. */
  bg: "#071a26",
  bgDeep: "#04101a",
  /** Panel fills. */
  panel: "rgba(18, 52, 74, 0.62)",
  panelDeep: "rgba(9, 30, 45, 0.58)",

  ink: "#f0f7fb",
  inkSoft: "rgba(219, 236, 246, 0.84)",
  inkFaint: "rgba(196, 220, 236, 0.6)",

  accent: "#7fdcef",
  accentSoft: "rgba(127, 220, 239, 0.14)",
  accentEdge: "rgba(127, 220, 239, 0.62)",
  accentInk: "#04212b",

  line: "rgba(160, 214, 238, 0.24)",
  lineStrong: "rgba(170, 224, 246, 0.5)",
} as const;

export const gateVars = (): Record<string, string> => ({
  // Scene numbers the stylesheet needs, so island size/tint stay tunable here.
  "--gate-island-w": `${GATE_SCENE.island.width}vw`,
  "--gate-island-w-mobile": `${GATE_SCENE.island.mobileWidth}vw`,
  "--gate-island-top": `${GATE_SCENE.island.top}%`,
  "--gate-island-top-mobile": `${GATE_SCENE.island.mobileTop}%`,
  "--gate-scrim-opacity": `${GATE_SCENE.scrim.opacity}`,
  "--gate-scrim-reach": `${GATE_SCENE.scrim.reach}%`,
  "--gate-island-opacity": `${GATE_SCENE.island.opacity}`,
  "--gate-island-blur": `${GATE_SCENE.island.blurPx}px`,
  "--gate-island-grade": GATE_SCENE.island.grade,
  "--gate-island-glow-opacity": `${GATE_SCENE.island.glowOpacity}`,

  "--gate-bg-grade": GATE_SCENE.backdrop.image.grade,
  "--gate-bg-opacity": `${GATE_SCENE.backdrop.image.opacity}`,
  "--gate-bg-blur": `${GATE_SCENE.backdrop.image.blurPx}px`,
  "--gate-bg-overscan": `${GATE_SCENE.backdrop.image.overscan}%`,
  "--gate-mist-color": GATE_SCENE.mist.color,
  "--gate-mist-drift": `${GATE_SCENE.mist.driftS}s`,
  "--gate-mist-opacity": `${GATE_SCENE.mist.opacity}`,
  "--gate-bg": GATE_PALETTE.bg,
  "--gate-bg-deep": GATE_PALETTE.bgDeep,
  "--gate-panel": GATE_PALETTE.panel,
  "--gate-panel-deep": GATE_PALETTE.panelDeep,
  "--gate-ink": GATE_PALETTE.ink,
  "--gate-ink-soft": GATE_PALETTE.inkSoft,
  "--gate-ink-faint": GATE_PALETTE.inkFaint,
  "--gate-accent": GATE_PALETTE.accent,
  "--gate-accent-soft": GATE_PALETTE.accentSoft,
  "--gate-accent-edge": GATE_PALETTE.accentEdge,
  "--gate-accent-ink": GATE_PALETTE.accentInk,
  "--gate-line": GATE_PALETTE.line,
  "--gate-line-strong": GATE_PALETTE.lineStrong,
});

