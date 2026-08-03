/**
 * ── PROJECT CERTIFICATES ───────────────────────────────────────────────────
 * The public proof of a win, linked from the top of a case study.
 *
 * ── WHERE TO ADD ONE ───────────────────────────────────────────────────────
 * Add a line to `PROJECT_CERTIFICATES` below, keyed by the project's title
 * exactly as in content/portfolio.ts. That is the only edit needed — the
 * button appears on its own, and a project with no certificate shows nothing.
 *
 * ── TWO SOURCES, ONE ANSWER ────────────────────────────────────────────────
 * Some certificate URLs already live in `achievements[].links.certificate` in
 * content/portfolio.ts, because the résumé files them under the AWARD rather
 * than under the project. Crustfolio's and FuturX's were both sitting there
 * unused before this existed.
 *
 * So the lookup checks the explicit map first and falls back to the credential
 * linked to that project through FORGE.credentials. That means:
 *
 *   • a project that wins something with a certificate gets the button for
 *     free, with no edit here at all;
 *   • the map still wins when set, so a project can point at a different
 *     document than its award's;
 *   • the URL is never written down twice in two places that can disagree.
 */

import { achievements } from "@/content/portfolio";
import { FORGE } from "@/config/sections";

/**
 * Explicit per-project certificates — overrides only. See the note inside.
 */
export const PROJECT_CERTIFICATES: Record<string, string> = {
  /*
   * Empty, and correctly so: all three certificates now ride on their award
   * records in content/portfolio.ts, which is where the résumé files them and
   * where the badge reads its placement from. COGMU was listed here until it
   * gained an achievement record of its own — keeping the URL in both places
   * would have been two facts that could disagree.
   *
   * Add an entry only for a project whose certificate ISN'T its award's: a
   * project with no placement, or one pointing at a different document.
   */
};

/** The certificate URL for a project, explicit or inherited from its award. */
export const certificateFor = (title: string): string | undefined => {
  const explicit = PROJECT_CERTIFICATES[title];
  if (explicit) return explicit;

  for (const name of FORGE.credentials[title] ?? []) {
    const cert = achievements.find((a) => a.title === name)?.links?.certificate;
    if (cert) return cert;
  }
  return undefined;
};
