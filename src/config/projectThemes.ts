/**
 * ── PER-PROJECT THEMES ─────────────────────────────────────────────────────
 * A case-study page wears its PROJECT's identity, not the site's. Open
 * Crustfolio and you should be looking at something warm and edible; the
 * Forge's dark smithy belongs to the hub you came from, and stops at the door.
 *
 * ── ADDING A THEME ─────────────────────────────────────────────────────────
 * Add an entry keyed by the project's title, exactly as it appears in
 * content/portfolio.ts. Everything below is emitted as CSS custom properties on
 * the page wrapper, so a new theme is this file only — no CSS to write.
 *
 * A project with no entry falls back to `DEFAULT_THEME`, which is the site's
 * own cream-and-sage palette. Nothing breaks by being unthemed.
 *
 * ── FONTS ──────────────────────────────────────────────────────────────────
 * `heading` and `body` take a CSS font stack. The variables come from
 * app/layout.tsx, which is where `next/font` loads and self-hosts them; a theme
 * wanting a face that is not loaded there has to add it there first.
 */

export interface ProjectTheme {
  /** Page background, and the paper cards sit slightly lighter than it. */
  bg: string;
  bgDeep: string;
  surface: string;
  surfaceAlt: string;

  /** Text. `ink` is body copy; `heading` is display type. */
  ink: string;
  inkSoft: string;
  inkFaint: string;
  headingInk: string;

  /** Primary accent — the one that carries the brand. */
  accent: string;
  accentSoft: string;
  accentInk: string;
  /** Secondary accent, for smaller marks. */
  accent2: string;
  accent2Soft: string;

  line: string;
  lineStrong: string;

  /** Font stacks. See the note above. */
  headingFont: string;
  bodyFont: string;
  /** Tracking on display headings; warm serifs usually want very little. */
  headingTracking: string;
  /** Weight for display headings. Rounded faces want more than a serif does. */
  headingWeight?: string;

  radius: string;
  shadow: string;
  shadowLift: string;
}

export const DEFAULT_THEME: ProjectTheme = {
  bg: "#e9e3d7",
  bgDeep: "#ddd5c5",
  surface: "#fbf8f2",
  surfaceAlt: "#f5f1e7",
  ink: "#38342c",
  inkSoft: "#6d675b",
  inkFaint: "#98917f",
  headingInk: "#2f2b23",
  accent: "#6f8b7d",
  accentSoft: "rgba(111, 139, 125, 0.14)",
  accentInk: "#ffffff",
  accent2: "#a8842f",
  accent2Soft: "rgba(168, 132, 47, 0.12)",
  line: "rgba(84, 92, 96, 0.18)",
  lineStrong: "rgba(84, 92, 96, 0.32)",
  headingFont: "var(--font-fraunces), Georgia, serif",
  bodyFont: "var(--font-dm-sans), system-ui, sans-serif",
  headingTracking: "-0.01em",
  headingWeight: "600",
  radius: "14px",
  shadow:
    "0 1px 1px rgba(72,62,44,.05), 0 3px 6px rgba(72,62,44,.05), 0 10px 24px rgba(72,62,44,.07)",
  shadowLift:
    "0 2px 4px rgba(72,62,44,.07), 0 8px 18px rgba(72,62,44,.08), 0 22px 48px rgba(72,62,44,.12)",
};

/**
 * A theme that is only an accent so far.
 *
 * The quest log tints every row with its project's accent, so a project needs
 * one long before it needs a whole page identity. This gives it that without
 * pretending the rest has been decided.
 */
const accentOnly = (accent: string, accentSoft: string): ProjectTheme => ({
  ...DEFAULT_THEME,
  accent,
  accentSoft,
});

export const PROJECT_THEMES: Record<string, ProjectTheme> = {
  // TODO: placeholder accent — a plausible starting point, not a decision.
  // Promote to a full theme like the three below when its page gets built.
  DEXOVO: accentOnly("#1f8a70", "rgba(31, 138, 112, 0.12)"),

  /**
   * FUTURX — an ed-tech platform, and the strongest project here. Deep indigo
   * with a vibrant purple doing the work, matching the neon of its own hero
   * shot; Inter throughout, because a product people have to trust with a
   * decision this big should not be shouting in a display face.
   */
  FUTURX: {
    /*
     * Deep navy, not purple. FUTURX sat next to COGMU in the same violet
     * family and the two read as one project at a glance — a career platform
     * should look like something you would trust with a decision, which is
     * blue's job, and it puts real distance between the two pages.
     *
     * Dark theme, so surfaces sit LIGHTER than the page and the ink is
     * off-white — the inverse of a paper theme.
     */
    bg: "#0a1729",
    bgDeep: "#050c17",
    surface: "rgba(255, 255, 255, 0.055)",
    surfaceAlt: "rgba(255, 255, 255, 0.035)",

    ink: "#e6eefb",
    inkSoft: "rgba(210, 226, 247, 0.78)",
    inkFaint: "rgba(168, 190, 220, 0.56)",
    headingInk: "#f4f8ff",

    accent: "#2f80ff",
    accentSoft: "rgba(47, 128, 255, 0.16)",
    accentInk: "#05101f",
    accent2: "#7fb2ff",
    accent2Soft: "rgba(127, 178, 255, 0.16)",

    line: "rgba(150, 184, 230, 0.18)",
    lineStrong: "rgba(150, 184, 230, 0.34)",

    headingFont: "var(--font-inter), system-ui, sans-serif",
    bodyFont: "var(--font-inter), system-ui, sans-serif",
    headingTracking: "-0.03em",
    headingWeight: "700",

    radius: "16px",
    shadow:
      "0 1px 2px rgba(0,0,0,.4), 0 6px 18px rgba(0,0,0,.35), 0 18px 44px rgba(0,0,0,.35)",
    shadowLift:
      "0 2px 6px rgba(0,0,0,.45), 0 12px 30px rgba(0,0,0,.45), 0 30px 70px rgba(0,0,0,.5)",
  },

  /**
   * COGMU — a music app for a Gen-Z audience. Soft lavender paper, deep violet
   * ink, and a contemporary grotesque; the project's own screens are lavender,
   * so its case study is too.
   */
  COGMU: {
    /*
     * Deep plum rather than pale lavender: the product's own screens are dark
     * and lit from within, so its case study is too. Everything below is the
     * inverse of a paper theme — surfaces sit LIGHTER than the page, and the
     * ink is off-white.
     */
    bg: "#150f26",
    bgDeep: "#0c0819",
    surface: "rgba(255, 255, 255, 0.055)",
    surfaceAlt: "rgba(255, 255, 255, 0.035)",

    ink: "#ece7fa",
    inkSoft: "rgba(220, 212, 245, 0.78)",
    inkFaint: "rgba(190, 180, 224, 0.55)",
    headingInk: "#f6f3ff",

    accent: "#8f79ec",
    accentSoft: "rgba(143, 121, 236, 0.16)",
    accentInk: "#120e22",
    accent2: "#c9b8f5",
    accent2Soft: "rgba(201, 184, 245, 0.16)",

    line: "rgba(190, 176, 240, 0.18)",
    lineStrong: "rgba(190, 176, 240, 0.34)",

    /*
     * SF Pro — the SYSTEM stack, not a webfont. On Apple hardware this is the
     * real thing; elsewhere it falls through to whatever that platform's UI
     * face is, which is the correct behaviour for a system stack and the
     * reason nothing is loaded for it in layout.tsx.
     */
    headingFont:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, "Segoe UI", sans-serif',
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, "Segoe UI", sans-serif',
    headingTracking: "-0.02em",
    headingWeight: "700",

    radius: "18px",
    shadow:
      "0 1px 2px rgba(0,0,0,.4), 0 6px 18px rgba(0,0,0,.35), 0 18px 44px rgba(0,0,0,.35)",
    shadowLift:
      "0 2px 6px rgba(0,0,0,.45), 0 12px 30px rgba(0,0,0,.45), 0 30px 70px rgba(0,0,0,.5)",
  },

  /**
   * CRUSTFOLIO — the pizzeria's own branding, not the site's.
   *
   * Taken from the project: a high-contrast display serif over warm cream, deep
   * espresso text, tomato red on anything that acts, and a mozzarella gold for
   * the smaller marks. Opening this page should feel like stepping into the
   * Crustfolio site rather than into another page of this portfolio — which is
   * the whole point of per-project themes.
   */
  Crustfolio: {
    // Cream paper, warmed slightly toward the crust end.
    bg: "#faf2e4",
    bgDeep: "#efe0c8",
    surface: "#fffbf3",
    surfaceAlt: "#fdf3e3",

    // Espresso, not black — it sits on cream without going cold.
    ink: "#2e211a",
    inkSoft: "#665043",
    inkFaint: "#9d8874",
    headingInk: "#241811",

    accent: "#c03a26",
    accentSoft: "rgba(192, 58, 38, 0.09)",
    accentInk: "#fffbf3",
    accent2: "#e0a12a",
    accent2Soft: "rgba(224, 161, 42, 0.15)",

    line: "rgba(112, 76, 50, 0.18)",
    lineStrong: "rgba(112, 76, 50, 0.34)",

    /*
     * The project sets its own headline in a display serif, so this does too.
     * Playfair's high contrast is what makes it read as a food brand rather
     * than as a document; Karla underneath keeps the body copy plain and warm.
     */
    headingFont: "var(--font-crimson), Georgia, serif",
    bodyFont: "var(--font-karla), system-ui, sans-serif",
    headingTracking: "-0.012em",
    headingWeight: "600",

    radius: "14px",
    shadow:
      "0 1px 1px rgba(94,58,32,.05), 0 3px 7px rgba(94,58,32,.06), 0 12px 28px rgba(94,58,32,.09)",
    shadowLift:
      "0 2px 5px rgba(94,58,32,.08), 0 10px 22px rgba(94,58,32,.1), 0 26px 54px rgba(94,58,32,.14)",
  },
};

export const themeFor = (title: string): ProjectTheme =>
  PROJECT_THEMES[title] ?? DEFAULT_THEME;

/** The theme as CSS custom properties, for the page wrapper's `style`. */
export const themeVars = (t: ProjectTheme): Record<string, string> => ({
  "--pt-bg": t.bg,
  "--pt-bg-deep": t.bgDeep,
  "--pt-surface": t.surface,
  "--pt-surface-alt": t.surfaceAlt,
  "--pt-ink": t.ink,
  "--pt-ink-soft": t.inkSoft,
  "--pt-ink-faint": t.inkFaint,
  "--pt-heading-ink": t.headingInk,
  "--pt-accent": t.accent,
  "--pt-accent-soft": t.accentSoft,
  "--pt-accent-ink": t.accentInk,
  "--pt-accent2": t.accent2,
  "--pt-accent2-soft": t.accent2Soft,
  "--pt-line": t.line,
  "--pt-line-strong": t.lineStrong,
  "--pt-heading-font": t.headingFont,
  "--pt-body-font": t.bodyFont,
  "--pt-heading-tracking": t.headingTracking,
  "--pt-heading-weight": t.headingWeight ?? "600",
  "--pt-radius": t.radius,
  "--pt-shadow": t.shadow,
  "--pt-shadow-lift": t.shadowLift,
});
