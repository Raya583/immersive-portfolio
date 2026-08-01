/**
 * ── PROJECT CONTENT ────────────────────────────────────────────────────────
 * This is the file to edit when writing real case studies. Everything below is
 * PLACEHOLDER copy so the scroll is testable today — replace the strings, keep
 * the shape.
 *
 * Keyed by island id (see config/islands.ts): floaty · poly · treehouse ·
 * camping · winter. An island with no entry here simply won't open a scroll.
 *
 * Writing notes:
 *   · `problem` / `role` / `impact` read best at 1-3 sentences.
 *   · `process` is a paragraph; the scroll body scrolls if it overflows.
 *   · `links` is optional — omit the key entirely for none.
 *   · `confidential: true` adds an NDA note at the foot of the scroll. Use it
 *     when the work can be described but not shown.
 */
export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  problem: string;
  role: string;
  process: string;
  impact: string;
  links?: ProjectLink[];
  confidential?: boolean;
}

export const PROJECTS: Record<string, Project> = {
  floaty: {
    title: "Rhythm Island",
    problem:
      "PLACEHOLDER — Describe the problem this project set out to solve, and who was feeling it. What was broken, slow, confusing, or missing before the work started?",
    role: "PLACEHOLDER — Your role, the shape of the team, and the span of time. Be specific about what you personally owned versus what you contributed to.",
    process:
      "PLACEHOLDER — How the work actually went. What you tried first, what you learned that changed the direction, the constraint that forced a decision, and how the final approach came together. This is the section that earns the reader's trust, so give it room — the scroll will scroll if it needs to.",
    impact:
      "PLACEHOLDER — What changed as a result. Numbers where you have them, honest qualitative outcomes where you don't.",
    links: [
      { label: "Live site", url: "https://example.com" },
      { label: "Case study", url: "https://example.com" },
    ],
  },

  poly: {
    title: "Workshop",
    problem:
      "PLACEHOLDER — The problem behind this build. What made it worth doing at all?",
    role: "PLACEHOLDER — What you owned here: research, architecture, interface, the whole thing?",
    process:
      "PLACEHOLDER — The path from first sketch to shipped. Include at least one thing that went wrong and what it taught you — the failures are usually the most interesting part of a workshop.",
    impact:
      "PLACEHOLDER — Where it landed, and what you'd do differently with another month.",
    links: [{ label: "Source", url: "https://example.com" }],
  },

  treehouse: {
    title: "Playground",
    problem:
      "PLACEHOLDER — The itch this experiment scratched. Playground projects don't need a business case, but they do need a question.",
    role: "PLACEHOLDER — Solo build, collaboration, or a fork of someone else's idea?",
    process:
      "PLACEHOLDER — What you were testing and how you tested it. Which techniques were new to you, and which ones turned out to be dead ends worth remembering.",
    impact:
      "PLACEHOLDER — What you carried forward from it into real work.",
  },

  camping: {
    title: "Memory Island",
    problem:
      "PLACEHOLDER — The problem, framed from the user's side rather than the company's.",
    role: "PLACEHOLDER — Your part in it, and who you worked alongside.",
    process:
      "PLACEHOLDER — The approach, the constraints you designed within, and the moment the shape of the solution became clear.",
    impact:
      "PLACEHOLDER — Outcomes, adoption, and anything that surprised you after launch.",
    confidential: true,
  },

  winter: {
    title: "Innovation Lab",
    problem:
      "PLACEHOLDER — The open-ended brief or the hunch you decided to chase.",
    role: "PLACEHOLDER — How much of this was yours, and what you leaned on others for.",
    process:
      "PLACEHOLDER — The exploration: what you prototyped, what you measured, and how you decided when to stop.",
    impact:
      "PLACEHOLDER — What came of it — shipped, shelved, or spun into something else. All three are worth writing up honestly.",
    links: [{ label: "Write-up", url: "https://example.com" }],
    confidential: true,
  },
};

export function getProject(id: string | null): Project | undefined {
  return id ? PROJECTS[id] : undefined;
}
