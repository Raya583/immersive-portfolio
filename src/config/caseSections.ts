/**
 * ── CASE-STUDY SECTIONS ────────────────────────────────────────────────────
 * The sticky header's tabs, and the anchor ids they scroll to.
 *
 * ── ONE SOURCE OF TRUTH ────────────────────────────────────────────────────
 * This list drives BOTH the tab row and the `id` on each rendered section.
 * That matters more than it looks: a tab list written separately from the
 * markup drifts the moment a section gains a condition, and the symptom is a
 * tab that scrolls nowhere — which reads as a broken page rather than as
 * missing content.
 *
 * So: `has()` must mirror the JSX condition for that section EXACTLY. If you
 * change when a section renders in ForgePage, change its predicate here in the
 * same edit. Every project's tabs are checked against the DOM in the probe
 * (scratchpad/nav.mjs) for exactly this reason.
 *
 * ── ORDER ──────────────────────────────────────────────────────────────────
 * The array order is the DOM order, which is also the tab order and the order
 * the scroll-spy walks. Keep them in sync when a section moves.
 *
 * ── ADDING A SECTION ───────────────────────────────────────────────────────
 * Add an entry here, then put `id={CASE_IDS.yourId}` on the <section> in
 * ForgePage. Nothing else needs touching — tabs, scroll-spy and smooth-scroll
 * all read from this.
 */

import type { Project } from "@/content/portfolio";
import { logoFor } from "@/config/projectLogos";

export interface CaseSection {
  /** The anchor id, and the key the scroll-spy tracks. */
  id: string;
  /**
   * The TAB label — deliberately shorter than the section's own heading.
   * "Design Foundations" is a fine heading and a bad tab; the row has to fit.
   */
  label: string;
  /** Whether this project actually renders the section. Mirrors the JSX. */
  has: (p: Project) => boolean;
}

/** Ids as constants, so a tab and its section cannot drift apart by a typo. */
export const CASE_IDS = {
  top: "sec-top",
  brief: "sec-brief",
  challenge: "sec-challenge",
  landscape: "sec-landscape",
  approach: "sec-approach",
  process: "sec-process",
  designApproach: "sec-design-approach",
  focus: "sec-focus",
  role: "sec-role",
  tools: "sec-tools",
  system: "sec-system",
  audit: "sec-audit",
  reflections: "sec-reflections",
  engineering: "sec-engineering",
  closing: "sec-closing",
  foundations: "sec-foundations",
  logo: "sec-logo",
  feature: "sec-feature",
  asides: "sec-asides",
  outcome: "sec-outcome",
} as const;

const some = <T,>(a: T[] | undefined) => !!a && a.length > 0;

export const CASE_SECTIONS: CaseSection[] = [
  // The masthead. Always present — it is the title, so there is always
  // somewhere to go "back" to at the top of a long page.
  { id: CASE_IDS.top, label: "Overview", has: () => true },
  { id: CASE_IDS.brief, label: "Brief", has: (p) => !!p.brief },
  { id: CASE_IDS.challenge, label: "Challenge", has: (p) => some(p.challenge) },
  { id: CASE_IDS.landscape, label: "Landscape", has: (p) => !!p.landscape },
  { id: CASE_IDS.approach, label: "Approach", has: (p) => !!p.approach },
  { id: CASE_IDS.process, label: "Process", has: (p) => some(p.process) },
  {
    id: CASE_IDS.designApproach,
    label: "Design Approach",
    has: (p) => some(p.designApproach),
  },
  { id: CASE_IDS.focus, label: "Focus Areas", has: (p) => some(p.focusAreas) },
  { id: CASE_IDS.role, label: "Role", has: (p) => !!p.role.trim() },
  { id: CASE_IDS.tools, label: "The Tools", has: (p) => some(p.tools) },
  { id: CASE_IDS.audit, label: "The Audit", has: (p) => !!p.audit },
  {
    id: CASE_IDS.reflections,
    label: "Reflections",
    has: (p) => some(p.reflections),
  },
  {
    id: CASE_IDS.engineering,
    label: "Under the Hood",
    has: (p) => some(p.engineering),
  },
  { id: CASE_IDS.system, label: "System", has: (p) => !!p.designSystem },
  {
    id: CASE_IDS.foundations,
    label: "Foundations",
    has: (p) => !!p.foundations,
  },
  { id: CASE_IDS.logo, label: "Logo", has: (p) => !!logoFor(p.title) },
  { id: CASE_IDS.feature, label: "Key Feature", has: (p) => !!p.keyFeature },
  { id: CASE_IDS.asides, label: "Notes", has: (p) => some(p.asides) },
  { id: CASE_IDS.outcome, label: "Outcome", has: (p) => !!p.outcome },
  { id: CASE_IDS.closing, label: "Closing", has: (p) => !!p.closing },
];

/**
 * ── WHICH SECTIONS BECOME TABS ─────────────────────────────────────────────
 * A curated few per project — NOT every section on the page.
 *
 * Listing all fourteen made the bar a wall of words and pushed the last tab
 * off the right edge, which is the opposite of navigable. Four to six is the
 * number a reader can take in at a glance, so each project names its own.
 *
 * Everything left out is still ON the page and still reachable by scrolling —
 * a tab is a shortcut to the parts worth jumping to, not a table of contents.
 * The Brief, Challenge and Landscape read as one continuous set-up, so they
 * sit under Overview rather than each taking a tab.
 *
 * ── EDITING ────────────────────────────────────────────────────────────────
 * Keys are `CASE_IDS` names. Order here does not matter — tabs always render
 * in page order, so a list in the wrong order cannot produce a bar whose tabs
 * scroll backwards. An id whose section this project does not render is
 * dropped rather than shown as a dead tab.
 */
export type SectionKey = keyof typeof CASE_IDS;

export const PROJECT_TABS: Record<string, SectionKey[]> = {
  /** The set the brief asked for: the competition story and the craft. */
  FUTURX: ["top", "process", "designApproach", "foundations", "outcome"],

  /** Crustfolio's pull is the brand work and the one standout feature. */
  Crustfolio: ["top", "approach", "process", "foundations", "feature", "outcome"],

  COGMU: ["top", "approach", "process", "foundations", "outcome"],

  /**
   * DEXOVO's pull is the product, the audit and the engineering. Six tabs is
   * the ceiling this bar can hold, so Outcome and Closing are left off: both
   * sit at the very bottom, which is exactly where a reader who has scrolled
   * that far already is.
   */
  DEXOVO: ["top", "tools", "audit", "engineering", "system", "foundations"],
};

/**
 * For a project with no list of its own. Deliberately the generic spine of a
 * case study, so an unfinished project still gets a sensible bar.
 */
const DEFAULT_TABS: SectionKey[] = [
  "top",
  "approach",
  "process",
  "foundations",
  "outcome",
];

/**
 * The tabs for one project, in PAGE order.
 *
 * Filtered by `has()` as well as by the list: a project can name a section it
 * does not have (a shared default, or content removed later), and a tab that
 * scrolls nowhere is worse than a missing one.
 */
export const sectionsFor = (p: Project): CaseSection[] => {
  const wanted = new Set<string>(
    (PROJECT_TABS[p.title] ?? DEFAULT_TABS).map((k) => CASE_IDS[k]),
  );
  return CASE_SECTIONS.filter((s) => wanted.has(s.id) && s.has(p));
};

/** Every section the page renders, tab or not — used by the anchor checks. */
export const renderedSections = (p: Project): CaseSection[] =>
  CASE_SECTIONS.filter((s) => s.has(p));
