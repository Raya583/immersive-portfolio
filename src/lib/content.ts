/**
 * Guards for rendering résumé data honestly.
 *
 * Most optional fields in content/portfolio.ts are deliberately empty — the
 * résumé simply doesn't state them. The UI must drop those elements rather
 * than render a blank label or invent a value, so every optional field goes
 * through one of these first.
 */

/** True when a string actually carries content. */
export function filled(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** True when a list has at least one non-empty entry. */
export function anyFilled(values: readonly string[] | undefined): boolean {
  return Array.isArray(values) && values.some(filled);
}

/**
 * Drops empty links so `Object.entries` never yields a dead anchor.
 *
 * Takes a plain `object` rather than a Record: the link shapes in
 * portfolio.ts are named interfaces, and those carry no index signature.
 */
export function definedLinks(links: object | undefined): [string, string][] {
  if (!links) return [];
  return Object.entries(links).filter(
    (entry): entry is [string, string] => filled(entry[1]),
  );
}

/** Human labels for the link keys used in portfolio.ts. */
export const LINK_LABELS: Record<string, string> = {
  website: "Live site",
  prototype: "Figma prototype",
  repo: "Source",
  caseStudy: "Case study",
  certificate: "Certificate",
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "X",
  portfolio: "Portfolio",
  resume: "Résumé",
  behance: "Behance",
  dribbble: "Dribbble",
};
