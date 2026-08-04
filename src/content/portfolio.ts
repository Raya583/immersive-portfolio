/**
 * ── PORTFOLIO CONTENT ──────────────────────────────────────────────────────
 * Everything here is transcribed from YASHWARDHAN_SINGH.pdf (extracted
 * 2026-08-02). Nothing has been invented: where the resume is silent, the
 * field is left empty with a `TODO:` comment saying exactly what is missing.
 *
 * The résumé is a single page with these sections: Objective, Education,
 * Skills, Projects, Achievements, Extracurricular Activities. There is no
 * dated employment history — see the note on `experience` below.
 */

export interface ProfileLinks {
  linkedin?: string;
  instagram?: string;
  github?: string;
  twitter?: string;
  resume?: string;
  portfolio?: string;
  behance?: string;
  dribbble?: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  /**
   * The portrait THE SANCTUM shows. Drop the file under public/ and put its
   * path here. If the file is missing the page falls back to a monogram in the
   * same ring rather than a broken image, so the layout never collapses.
   */
  photo?: string;
  /** The paragraph under the name on THE SANCTUM. */
  intro?: string;
  location: string;
  email: string;
  phone: string;
  links: ProfileLinks;
}

export interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  location: string;
  highlights: string[];
}

export interface ProjectLinks {
  /**
   * A REAL, DEPLOYED, WORKING app. Not a prototype, not a marketing site.
   *
   * Kept separate from `website` and `prototype` on purpose: those three are
   * genuinely different claims, and collapsing them loses the one that is
   * hardest to earn. A Figma prototype is a picture that responds to clicks; a
   * live app is a thing that runs. The case study labels them differently and
   * only this one gets the LIVE badge.
   */
  liveApp?: string;
  website?: string;
  prototype?: string;
  repo?: string;
  caseStudy?: string;
}

export interface Project {
  title: string;
  /** The full write-up. Shown on the project's own case-study view. */
  description: string;
  /**
   * One line for the quest-log list — a compression of `description`, not a
   * new claim. The list is meant to be scanned, so keep it under ~60 chars;
   * the depth belongs in `description`.
   */
  hook?: string;
  /**
   * Thumbnail for the quest-log row, e.g. "/images/projects/cogmu/cover.png".
   * Drop the file under public/images/projects/<project>/ and put the path
   * here. Leave it out and the row shows an ornate placeholder instead, so the
   * list stays consistent while artwork is still missing.
   */
  thumbnail?: string;
  /**
   * Supporting shots for the case study, shown under the write-up. Same
   * convention as `thumbnail` — drop files under
   * public/images/projects/<project>/ and list their paths here. Omit or leave
   * empty and the gallery simply is not rendered.
   */
  gallery?: {
    src: string;
    alt: string;
    /**
     * Portrait artwork — a phone or a held tablet. Consecutive tall entries are
     * PAIRED side by side on the case study; without this they each take a full
     * screen of height on their own and the page turns into a scroll.
     */
    tall?: boolean;
  }[];
  /**
   * The quest-log row's image, when it should differ from the case-study hero.
   * Falls back to `thumbnail`.
   */
  rowThumbnail?: string;

  /**
   * ── THE WRITE-UP ─────────────────────────────────────────────────────────
   * The four titled sections on a case-study page, in the order they appear:
   * THE BRIEF, MY ROLE, THE APPROACH, THE OUTCOME. Each renders only if it has
   * something in it, so a half-written case study degrades to whatever is
   * actually there rather than showing empty headings.
   */
  /**
   * A line under the title — what this was, in one breath.
   */
  overview?: string;
  /** The problem the project set out to solve. */
  brief?: string;
  /**
   * What made it hard. Each entry is a labelled point, not a paragraph, so the
   * page can set the label apart from the explanation.
   */
  challenge?: { label: string; body: string }[];
  /**
   * How it was actually done, phase by phase. Write only what HAPPENED — a
   * two-hour live event has no user testing in it, and claiming otherwise is
   * the fastest way to lose a reader who has run one.
   */
  process?: { phase: string; body: string }[];
  /**
   * The design METHODOLOGY, as distinct from `process`.
   *
   * `process` is the narrative — what happened, in the order it happened. This
   * is the lens: the phases the work moved through and the methods used in
   * each. A project can have either, both, or neither, and the two are
   * rendered as separate sections precisely because they answer different
   * questions — "what did you do?" and "how do you work?".
   *
   * Same honesty rule as `process`: list only methods that were actually
   * used. A phase with no real methods behind it should have an empty array
   * rather than a plausible-sounding one.
   */
  designApproach?: { phase: string; body: string; methods: string[] }[];
  /** The visual direction, and why it was chosen. */
  foundations?: string;
  /**
   * The palette, as named chips. PER PROJECT — the case study used to draw
   * these from four hard-coded labels, so every project claimed Crustfolio's
   * cream/tomato/mozzarella/espresso whatever colours it actually used.
   */
  palette?: { name: string; hex: string }[];
  /**
   * The type, as a specimen. `sample` is rendered IN the project's own heading
   * font, so the specimen shows the face rather than describing it.
   */
  typography?: {
    headingName: string;
    bodyName: string;
    note: string;
    sample: string;
  };
  /**
   * ── A PRODUCT MADE OF SECTIONS ───────────────────────────────────────────
   * For work that is not one screen but several connected tools, each worth
   * showing on its own.
   *
   * `process` cannot carry this: it is a narrative of what happened, in order,
   * and it has nowhere to put artwork. This is the opposite shape — a set of
   * peers, each with its own shots, in no particular sequence.
   *
   * `shots` are that tool's own screens. Two reads best: one wide establishing
   * shot and one detail. More than that and the section stops being scannable
   * and becomes the gallery it was meant to replace.
   */
  tools?: {
    /** The tool's number in the product, e.g. "01". Shown as a label. */
    n: string;
    name: string;
    body: string;
    shots?: { src: string; alt: string }[];
  }[];

  /**
   * ── THE DESIGN SYSTEM ────────────────────────────────────────────────────
   * The rules the work runs on, as rules — distinct from `foundations`, which
   * is the palette and the type.
   *
   * `swatches` are rendered as real elements rather than as a picture of
   * swatches, so the colours are inspectable and the labels are selectable
   * text. A screenshot of a palette is the one place a case study can get away
   * with an image and shouldn't.
   */
  designSystem?: {
    intro: string;
    rules: { label: string; body: string }[];
    /**
     * ── A THREE-ROLE COLOUR SYSTEM ─────────────────────────────────────────
     * One entry per type, carrying all three colours that type owns, because
     * the point being made is the RELATIONSHIP between them:
     *
     *   badge     the vivid pill. Canonical, and what identifies the type.
     *   card      a pale tint at near-uniform lightness, for light surfaces.
     *   gradient  [light, dark], deliberately desaturated. The backdrop that
     *             artwork sits on, and what the badge has to survive against.
     *
     * The specimen renders the badge ON the gradient for exactly that reason:
     * three colours listed side by side prove nothing, and the whole system
     * rests on the vivid one still reading against the muted one.
     */
    swatches?: {
      name: string;
      badge: string;
      card: string;
      gradient: [string, string];
    }[];
    note?: string;
  };

  /**
   * ── AN AUDIT ─────────────────────────────────────────────────────────────
   * A measured before-and-after. Numbers, not adjectives.
   *
   * This exists because "I refactored my design system" is a claim and
   * "1,481 copies of one badge became 1 component with 18 variants" is
   * evidence. Only fill it in where the counts were actually taken.
   */
  audit?: {
    intro: string;
    /** Column headings, so a table that is not before/after can say so. */
    columns?: { before: string; after: string };
    rows: { label: string; before: string; after: string }[];
    /** What the numbers meant, under the table. */
    note?: string;
    /** Where it went next. Paragraphs. */
    after?: string[];
  };

  /** What the work taught, in hindsight. Honest ones only. */
  reflections?: { title: string; body: string }[];

  /**
   * ── HOW IT WAS BUILT ─────────────────────────────────────────────────────
   * The technical decisions worth telling a NON-ENGINEER about.
   *
   * `title` is the claim in plain language and should read on its own: a
   * recruiter skimming headings should still come away with the point. `body`
   * is the explanation, and it is the one place on a case-study page where
   * naming a mechanism is the whole value, so it does not get dumbed down
   * either. The pair is what makes this legible to both readers.
   */
  engineering?: { title: string; body: string }[];

  /**
   * The last word. One or two short paragraphs of position rather than
   * evidence, after the argument has been made.
   */
  closing?: { title: string; body: string };

  /**
   * A legal or attribution note for the foot of the page. Fan work, licensed
   * data and borrowed assets all belong here, and it renders LAST so it reads
   * as a footnote rather than as part of the argument.
   */
  disclaimer?: string;

  /** The single idea the work turns on. Paired with the artwork. */
  keyFeature?: { title: string; body: string };
  /**
   * Small callouts — a name's meaning, a constraint worth stating, anything
   * that is a paragraph rather than a section. Rendered between the write-up
   * and the outcome.
   */
  asides?: { title: string; body: string }[];
  /** Team and event, shown under the title. */
  credit?: string;
  /** What the work concentrated on — a scannable list, not prose. */
  focusAreas?: string[];
  /**
   * What already existed, and what studying it changed. `competitors` renders
   * as chips rather than a sentence, so the set can be taken in at a glance.
   */
  landscape?: {
    intro: string;
    competitors: string[];
    takeaway: string;
  };
  /** What you did on it. */
  role: string;
  /** How it was solved — the idea the work turned on. */
  approach?: string;
  /** What came of it. Prose; `impact` below is the numbers version. */
  outcome?: string;

  tech: string[];
  /** A metric, if there is one. Distinct from `outcome`, which is written. */
  impact: string;
  links?: ProjectLinks;
  confidential?: boolean;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  dates: string;
  /** Free-text extra the résumé carries, e.g. a CGPA. */
  note?: string;
}

/**
 * The résumé's Achievements section — competition placements, each with its
 * own certificate. It maps to none of the other fields, so it keeps its own.
 */
export interface Achievement {
  title: string;
  event: string;
  placement: string;
  description: string;
  links?: ProjectLinks & { certificate?: string };
}

// ── PROFILE ────────────────────────────────────────────────────────────────

export const profile: Profile = {
  name: "Yashwardhan Singh",
  /*
   * The ARROW is the point: it states an evolution rather than a job. Kept as
   * one string so the whole positioning is edited in one place — THE SANCTUM
   * splits it on the arrow to style the two halves differently.
   */
  title: "UI/UX Designer → AI Product Engineer",
  tagline: "Design. Build. Ship.",
  /*
   * NOT IN THE REPO YET. Add the file at public/images/me.jpg and it appears
   * with no other change; until then THE SANCTUM shows a monogram in the same
   * frame. Portrait or square crops both work — the frame is a circle and the
   * image is centred on it.
   */
  photo: "/images/me.jpg",
  /**
   * The intro on THE SANCTUM. Deliberately TWO LINES — the "Yash's Realm"
   * headline already sets the concept, and the stat strip below carries the
   * range. A paragraph here would say all three things a third time.
   */
  intro:
    "Designer turned AI Product Engineer, building digital experiences from " +
    "first pixel to final deployment. Design, code and AI, built end to end.",
  // TODO: not on the résumé. His college (DSCE) is in Bengaluru, but that is
  // an inference — fill in the city you actually want shown.
  location: "",
  email: "yashrathore583@gmail.com",
  phone: "+91-6394672303",
  /*
   * ── CONTACT ──────────────────────────────────────────────────────────────
   * `email`, `phone` and these links are what THE GATE renders. A method with
   * an empty value is simply not shown, so removing one here removes its card
   * — there is no second list to keep in step.
   */
  links: {
    linkedin: "https://linkedin.com/in/yashwardhan-singh-15963b279",
    // Not on the résumé — supplied directly for the contact page.
    instagram: "https://www.instagram.com/rathoreyash.ig",
    // TODO: the résumé lists no GitHub, Twitter/X, hosted résumé, personal
    // site, Behance or Dribbble. Add whichever you want linked.
  },
};



// ── THE ARMORY ─────────────────────────────────────────────────────────────

/**
 * Skills and tools, as collected gear.
 *
 * Deliberately NO proficiency levels or scores. A badge says "I work with
 * this"; a number claims a measurement nobody took, and the first reader who
 * knows the field will ask how it was arrived at.
 *
 * `icon` picks one of the small original marks drawn in ArmoryPage — they are
 * shapes, not brand logos, which stay out of trademark territory and stay
 * consistent with each other.
 */
export type ArmoryIcon =
  | "compass"   // research, direction-finding
  | "blueprint" // structure, architecture
  | "pen"       // drawing, craft
  | "spark"     // ideas, AI
  | "code"      // building
  | "gem";      // tools and equipment

export interface ArmoryGroup {
  id: string;
  heading: string;
  /** One line under the heading. Optional. */
  note?: string;
  icon: ArmoryIcon;
  /**
   * The signature group — given a lit panel and a brighter treatment.
   *
   * Exactly one group should carry this. Two "standouts" is none, and the
   * whole point of the flag is that one category is the differentiator.
   */
  featured?: boolean;
  items: string[];
}

export const armory = {
  heading: "Tools of the trade",
  intro:
    "Everything I reach for when an idea needs to become something real. " +
    "The thinking, the craft, and the code.",
  groups: [
    {
      id: "design",
      heading: "Design & UX",
      note: "Abilities",
      icon: "compass",
      items: [
        "UX Research",
        "Information Architecture",
        "Wireframing",
        "Prototyping",
        "Interaction Design",
        "Usability Testing",
        "UI Design",
        "Design Systems",
      ],
    },
    {
      id: "tools",
      heading: "Tools",
      note: "Equipment",
      icon: "gem",
      items: ["Figma", "FigJam", "Canva", "Flutter", "Google AI Studio", "Notion"],
    },
    {
      id: "build",
      heading: "Build & Code",
      note: "The engineering side",
      icon: "code",
      items: ["Frontend Development", "Backend Development", "C/C++"],
    },
    {
      /*
       * THE SIGNATURE GROUP.
       *
       * Deliberately framed as capabilities rather than tool names — "knows
       * Claude" is a line on a CV, but "takes an idea to a working prototype
       * faster" is the thing worth hiring. The named tool sits last, as
       * evidence for the claims above it rather than as the claim itself.
       */
      id: "ai",
      heading: "AI & Development",
      note: "Idea to implementation, faster",
      icon: "spark",
      featured: true,
      items: [
        "AI-Assisted Product Development",
        "AI-Assisted Prototyping",
        "Prompt Engineering",
        "Design-to-Code Workflows",
        "AI-Assisted Front-End Development",
        "Rapid Product Experimentation",
        // Three separate badges rather than one "Claude & Claude Code" label:
        // every other entry on this page is one badge per thing, and a badge
        // holding a list reads as a label that outgrew its box.
        "Claude",
        "Claude Code",
        "Claude Design",
      ],
    },
    {
      id: "bonus",
      heading: "Bonus",
      note: "Everything else I bring",
      icon: "pen",
      items: ["Content Writing", "Public Speaking / MC"],
    },
  ] as ArmoryGroup[],
} as const;

// ── ORIGINS ────────────────────────────────────────────────────────────────

/**
 * THE ORIGINS page — the story, in the order it should be read.
 *
 * Every section is its own field rather than one array of blocks, because the
 * page renders them differently: prose reads as prose, experience as a
 * timeline, talents as cards. A generic list would force one shape onto all of
 * them, and the whole point of this page is that the shape follows the
 * content.
 *
 * Headings live here beside their copy, so retitling a section is one edit in
 * one place.
 */
export interface OriginsExperience {
  org: string;
  role: string;
  period: string;
  place?: string;
  body?: string;
}

export interface OriginsRole {
  name: string;
  role: string;
  body?: string;
}

export type BeyondIcon = "piano" | "dance" | "mic" | "star";

export interface OriginsTalent {
  icon: BeyondIcon;
  label: string;
  body: string;
}

export interface OriginsSchool {
  school: string;
  detail?: string;
  period: string;
}

export const origins = {
  roots: {
    heading: "Roots",
    body:
      "I grew up in Kanpur, Uttar Pradesh, and did my schooling there. Then I " +
      "found my way to Bengaluru to chase design and building things.",
  },

  spark: {
    heading: "The Spark",
    body:
      "Honestly, I never planned this. When I first came to Bengaluru, I " +
      "wasn't sure where I was headed. Design wasn't even on my radar. Then, " +
      "in my second year, I stumbled into UI/UX through a competition a " +
      "senior was hosting. The project was COGMU, and something just clicked. " +
      "That first taste of designing under pressure, solving real problems, " +
      "and watching an idea come alive. I was hooked. I'd found the thing I " +
      "didn't know I was looking for, and I never put it down.",
  },

  whoIAm: {
    heading: "Who I Am",
    body:
      "Once I found design, I realized it fit me perfectly. I've always been " +
      "drawn to my creative side. I have a strong imagination, a sharp eye, and " +
      "a clear vision for what I want to build. Design is where I come alive: " +
      "understanding people, finding real problems, and turning insight into " +
      "experiences that feel intuitive, accessible, and meaningful.",
  },

  experience: {
    heading: "Experience",
    /**
     * CHRONOLOGICAL — earliest first, so the timeline reads top-down as a
     * journey rather than as a CV. The rest of this page moves forward too
     * (roots to direction), and a section running backwards inside it fought
     * that narrative.
     */
    items: [
      {
        org: "Vyadh Design Studio",
        role: "UI/UX Designer · Internship",
        period: "Sep 2025 – Jan 2026",
        place: "Bengaluru (Remote)",
        body:
          "My first internship, where I got hands-on with real UI/UX design " +
          "work.",
      },
      {
        org: "Studio Eclora",
        role: "UI/UX Designer",
        period: "Jan 2026 – May 2026",
        body:
          "Designing user-centered interfaces and digital experiences for " +
          "clients.",
      },
      {
        org: "VRtam Studios",
        role: "UI/UX Developer · Internship",
        period: "Jun 2026 – Present",
        place: "Bengaluru (Remote)",
        body:
          "Working alongside a talented AR/VR team as a full-stack builder, " +
          "doing front-end and back-end powered by AI. There is always a " +
          "designer's edge to it, so strong design technique runs through it. VRtam is " +
          "a platform delivering immersive storytelling experiences, with a " +
          "whole ecosystem built around it.",
      },
    ] as OriginsExperience[],
  },

  leadership: {
    heading: "Leadership & Community",
    note: "at DSCE",
    items: [
      {
        name: "Mudita",
        role: "Social Responsibility Cell · Content Team & Lead",
        body: "Driving social-impact initiatives and content.",
      },
      { name: "LitSoc DSI", role: "Literature Society · Member" },
      {
        name: "Center of Performing Arts",
        role: "Media Team · Designer",
        body: "Visual identity for performing-arts events.",
      },
    ] as OriginsRole[],
  },

  beyond: {
    heading: "Beyond the Screen",
    items: [
      {
        icon: "piano",
        label: "Trained Pianist",
        body: "Five years of practice and a Junior Diploma.",
      },
      {
        icon: "dance",
        label: "Dancer",
        body: "With a string of dance competitions behind me.",
      },
      {
        icon: "mic",
        label: "MC / Public Speaker",
        body: "Hosting events since my first year of college.",
      },
      {
        icon: "star",
        label: "All-rounder",
        body: "Creativity, energy, and range brought to everything.",
      },
    ] as OriginsTalent[],
  },

  dreams: {
    heading: "Dreams & Inspiration",
    body:
      "I'm inspired by the design, technology, and pop culture of South Korea " +
      "and Japan, and I dream of building experiences there someday. My dream " +
      "company is Samsung, where design, technology and culture meet.",
  },

  headed: {
    heading: "Where I'm Headed",
    body:
      "I'm growing into an AI Product Engineer, able to take an idea from " +
      "first pixel to final deployment: design, frontend, backend, and " +
      "beyond. My goal is to build products that are simple, impactful, and " +
      "genuinely improve people's lives.",
  },

  /**
   * The last page of the book. Not a section heading — a sign-off, so the
   * story closes rather than simply running out.
   */
  closing: {
    heading: "The story continues",
    body:
      "Still building, still learning, still chasing the next thing that " +
      "clicks. If you have something worth making, the next page is yours.",
  },

  education: {
    heading: "Education",
    /** Oldest first — an education timeline reads as a journey forward. */
    items: [
      { school: "Delhi Public School, Kanpur", period: "2014–2023" },
      {
        school: "Dayananda Sagar College of Engineering (DSCE), Bengaluru",
        detail: "B.E. Electrical & Electronics",
        period: "2023–2027",
      },
    ] as OriginsSchool[],
  },
} as const;

// ── ABOUT ──────────────────────────────────────────────────────────────────

/**
 * Drafted from the résumé's OBJECTIVE section, lightly tightened for the web.
 * The claims are all his own; nothing has been added.
 */
export const about =
  "A UI/UX designer who wants to build digital experiences that combine " +
  "creativity, usability and technical understanding. Coming from an " +
  "Electrical Engineering background, I focus on user-centred solutions that " +
  "are visually clear, intuitive and impactful. Currently building projects " +
  "that sharpen my design thinking, research and prototyping, and looking for " +
  "opportunities to contribute fresh ideas and learn from real-world work.";

// ── EXPERIENCE ─────────────────────────────────────────────────────────────

/**
 * ⚠️ The résumé has NO employment history. These three come from its
 * EXTRACURRICULAR ACTIVITIES section — one design-studio role and two campus
 * positions — which is the closest thing it carries to experience.
 *
 * TODO: every `dates` and `location` below is blank because the résumé gives
 * neither. Fill them in, or drop this section and present these as
 * "Involvement" instead of "Experience".
 */
export const experience: ExperienceItem[] = [
  {
    company: "Vyadh Design Studio",
    role: "UI/UX Designer, core member",
    dates: "", // TODO: not on the résumé
    location: "", // TODO: not on the résumé
    highlights: [
      "Core member of Vyadh Design Studio, a design studio startup, working as a UI/UX Designer.",
    ],
  },
  {
    company: "Mudita, DSCE Social Responsibility Cell",
    role: "Functional Lead",
    dates: "", // TODO: not on the résumé
    location: "", // TODO: not on the résumé
    highlights: [
      "One of the main functional leads, organising social drives, volunteering events and awareness programmes.",
    ],
  },
  {
    company: "Center of Performing Arts, DSCE",
    role: "Designer, Media Team",
    dates: "", // TODO: not on the résumé
    location: "", // TODO: not on the résumé
    highlights: ["Member of the Media Team, contributing as a Designer."],
  },
];

// ── PROJECTS ───────────────────────────────────────────────────────────────

/**
 * `hook` is a one-line compression of that entry's own `description`, for the
 * quest-log list. `thumbnail` is the row's cover image — none exist yet, so
 * every entry currently falls back to the placeholder frame.
 *
 * TODO on every entry: the résumé gives no per-project tech stack, no
 * statement of your role, and no outcomes/metrics. `tech`, `role` and `impact`
 * are therefore left empty rather than guessed at. The résumé's global tool
 * list is in `skills` below, but it does not say which project used what.
 */
export const projects: Project[] = [
  {
    title: "COGMU",
    hook: "Name the song stuck in your head.",
    /*
     * The HERO. This had been set to cogmu-2 to change the row image, back
     * before `rowThumbnail` existed — which made the hero and the first gallery
     * entry the same file, and left cover.png (the transparent MacBook)
     * referenced nowhere at all. Hero and row are separate fields now.
     */
    thumbnail: "/images/projects/cogmu/cover.png",
    /** The quest-log row keeps the MacBook Pro shot. */
    rowThumbnail: "/images/projects/cogmu/cogmu-2.png",
    gallery: [
      {
        src: "/images/projects/cogmu/cogmu-2.png",
        alt: "COGMU's search results on a laptop, listing matched tracks with cover art",
      },
      {
        src: "/images/projects/cogmu/cogmu-3.png",
        alt: "COGMU shown on a desktop display, with the recognition flow open",
      },
      {
        src: "/images/projects/cogmu/cogmu-4.png",
        alt: "COGMU on a tablet, showing a matched song with its listening options",
      },
    ],
    credit: "Team Phoenix · Designathon, CSBS Dept., DSCE",
    overview:
      "A music-recognition app reimagined as a journey, not a guessing game. " +
      "Designed and built in 1-2 hours during a live designathon, and awarded " +
      "2nd place.",
    brief: "Design a music-recognition app that helps people identify songs.",
    challenge: [
      {
        label: "Finding the song is a dead end",
        body:
          "Tools like Shazam and Google's hum-to-search already identify a " +
          "song, but the experience ends there. Finding the song should be " +
          "the start of something, not a dead end.",
      },
    ],
    approach:
      "I designed COGMU as a connected flow rather than a one-shot lookup. " +
      "You find the song stuck in your head, then move seamlessly onward, with " +
      "Spotify and Apple Music integrated directly so discovery flows straight " +
      "into listening without leaving the app.",
    process: [
      {
        phase: "Understand",
        body:
          "Parsed the brief (a music-recognition app) and studied what already " +
          "exists: Shazam, Google's hum-to-search.",
      },
      {
        phase: "Spot the gap",
        body:
          "Those tools find the song, then stop. The experience dead-ends " +
          "right at the interesting moment.",
      },
      {
        phase: "Reframe",
        body:
          "Finding the song should be the START of a journey, not the end.",
      },
      {
        phase: "Design the flow",
        body:
          "Built a connected experience where discovery flows straight into " +
          "listening, with Spotify and Apple Music integrated directly inside " +
          "the app.",
      },
      {
        phase: "Brand it",
        body:
          "A subtle lavender palette for a Gen-Z audience, and a name that " +
          "captures the idea: COGMU = Cognition + Music.",
      },
    ],
    foundations:
      "A soft, subtle lavender palette chosen deliberately for a Gen-Z " +
      "audience: calm, modern and current.",
    // These are the page's ACTUAL colours — edit here and the swatches move.
    palette: [
      { name: "Lavender", hex: "#C9B8F5" },
      { name: "Soft Purple", hex: "#8F79EC" },
      { name: "Off-White", hex: "#F4F1FB" },
      { name: "Deep Plum", hex: "#150F26" },
    ],
    typography: {
      headingName: "SF Pro",
      bodyName: "SF Pro Text",
      note: "Apple's system face, the one a music app on your phone is already set in.",
      sample: "Every song starts somewhere.",
    },
    asides: [
      {
        title: "The Name",
        body: "COGMU = Cognition + Music, the recognition of music.",
      },
    ],
    outcome: "Took 2nd place at the designathon.",
    description:
      "A music-recognition app that helps you identify songs stuck in your mind, even if you only remember the tune, and instantly find the track. It stores your search history and connects with your preferred music-streaming apps, making discovery and listening effortless.",
    role: "", // TODO: not stated separately from `approach` above
    tech: [], // TODO: not stated on the résumé (it ships on Vercel — web?)
    impact: "", // TODO: no metric stated — `outcome` above carries the result
    links: { website: "https://cogmu.vercel.app/" },
  },
  {
    title: "DEXOVO",
    hook: "The Pokédex that answers the next question.",
    /*
     * One image doing both jobs: the case study's hero and the quest-log row.
     *
     * The tablet is the only mockup that survives BOTH sizes. The laptop shots
     * are wide enough that at a 260px row the screen collapses to a smudge,
     * and the phone shots read fine small but waste most of a hero on
     * background. The iPad sits large in its own frame, so the grid is legible
     * at both, and its wood and fabric are warm enough to belong to a maroon
     * page rather than fighting it.
     */
    thumbnail: "/images/projects/dexovo/mock-tablet-wood.webp",
    rowThumbnail: "/images/projects/dexovo/mock-tablet-wood.webp",
    overview:
      "A traditional Pokédex answers one question: what is this Pokémon? " +
      "Dexovo answers that, and then keeps going. What will Brock actually " +
      "send out, at what level, knowing what moves? What team should I build " +
      "in Emerald if I picked Treecko? Will my six beat Sabrina? A shipped " +
      "React and Vite app on live PokeAPI data, not a design file: five " +
      "connected tools over 1,025 Pokémon, 140 Gym Leaders, 2,223 items and " +
      "10 regions.",
    brief:
      "A dex is a database problem wearing a UI, and every one of them faces " +
      "the same three constraints. Every design decision here traces back to " +
      "them.",
    challenge: [
      {
        label: "Identity at thumbnail size",
        body:
          "A user scrolling a grid of 1,025 entries needs to know what " +
          "something is before they read its name. Type has to be legible at " +
          "145px.",
      },
      {
        label: "Two types, one card",
        body:
          "Most creatures have two types. A single card has to encode a pair " +
          "without becoming ambiguous or ugly.",
      },
      {
        label: "Data nobody asked to read",
        body:
          "Stats, moves by game version, evolution conditions, encounter " +
          "rates. All of it matters to someone, none of it should be the " +
          "first thing you see.",
      },
    ],

    /*
     * ── THE FIVE TOOLS ───────────────────────────────────────────────────
     * Peers, not a sequence: the numbering is the product's own and a reader
     * can start anywhere. One shot each, except Builder, which gets two
     * because it is the only section making an argument rather than listing.
     */
    tools: [
      {
        n: "01",
        name: "Pokédex",
        body:
          "Search and filter all 1,025 Pokémon. The filters compose rather " +
          "than replace each other, so region, type, form and rarity stack " +
          "into one query, and the live count tells you what you are about to " +
          "get before you commit to it.",
        shots: [
          {
            src: "/images/projects/dexovo/web-pokedex-grid.webp",
            alt: "The Pokédex grid showing the national dex, each card tinted by its primary type",
          },
        ],
      },
      {
        n: "02",
        name: "Builder Dex",
        body:
          "The standout. Give it a game and a starter and it recommends a " +
          "six-Pokémon team scored against that game's actual Gym Leaders, " +
          "with every pick justified by name: answers Brock, Giovanni, " +
          "Lt. Surge. Or build your own and it analyses the party you have, " +
          "reporting a matchup percentage per gym, your type coverage, and " +
          "the weaknesses your six happen to share. It gives advice and shows " +
          "its working.",
        shots: [
          {
            src: "/images/projects/dexovo/web-builder-suggested-team.webp",
            alt: "A recommended six-Pokémon team, each pick justified against named Gym Leaders",
          },
          {
            src: "/images/projects/dexovo/web-builder-own-analysis.webp",
            alt: "Live analysis of a self-built team: type coverage, shared weaknesses, and a matchup percentage for each gym",
          },
        ],
      },
      {
        n: "03",
        name: "Gymdex",
        body:
          "All 140 Gym Leaders, with parties that are specific to the version " +
          "you are playing. Red and Blue Brock is not Yellow Brock, and the " +
          "sheet tells you which one you are looking at rather than averaging " +
          "the two into something that exists in no game.",
        shots: [
          {
            src: "/images/projects/dexovo/web-gymdex-leaders.webp",
            alt: "The Gym Leaders index, each card coloured by that leader's type specialism",
          },
        ],
      },
      {
        n: "04",
        name: "Mapdex",
        body:
          "Ten regions, browsable by place: cities, routes, caves, water, " +
          "forests and landmarks. Every location carries its own encounter " +
          "table, listing what you can catch there, in which game, by which " +
          "method and at what rate.",
        shots: [
          {
            src: "/images/projects/dexovo/web-mapdex-region.webp",
            alt: "A region map with places marked and browsable by type",
          },
        ],
      },
      {
        n: "05",
        name: "Itemdex",
        body:
          "All 2,223 items, grouped the way the games group them, and reusing " +
          "the same card, badge and sheet primitives as everything else in " +
          "the product.",
        shots: [
          {
            src: "/images/projects/dexovo/web-itemdex-grid.webp",
            alt: "The Itemdex grid, showing items grouped across their pockets",
          },
        ],
      },
    ],

    /*
     * ── THE HEART OF THE STORY ───────────────────────────────────────────
     * The audit is the strongest thing here because it is the only part that
     * is measured rather than argued. Every number was counted in the real
     * Figma file.
     */
    audit: {
      intro:
        "I built it wrong first. I designed it screen by screen in Figma, " +
        "which worked until it did not. At 86 screens I audited my own file " +
        "and found that the design system I thought I had been maintaining " +
        "had quietly drifted.",
      rows: [
        { label: "Design tokens", before: "0", after: "50" },
        {
          label: "Type badges, none of them components",
          before: "1,481 copies",
          after: "1 component, 18 variants",
        },
        { label: "Copy-pasted app headers", before: "42", after: "1 component" },
        {
          label: "Distinct geometries for one sprite slot",
          before: "33",
          after: "1",
        },
        { label: "Duplicate search icons", before: "29", after: "0" },
        {
          label: "Card colour rule",
          before: "none",
          after: "primary type wins",
        },
        { label: "Total nodes", before: "23,834", after: "19,200" },
      ],
      note:
        "The symptom was card colour. Sampling every card showed Dark-types " +
        "rendering on cyan and Steel on pink, while the badges were 98% " +
        "consistent. The system existed. It had just never been written down, " +
        "so it only held where I happened to remember it.",
      after: [
        "Rebuilding it as tokens and components fixed the drift, and then " +
          "exposed the real ceiling: every card needed its sprite placed by " +
          "hand, which capped the design at 104 Pokémon out of 1,025. No " +
          "amount of Figma discipline solves that one.",
        "So the design system stopped being the artefact and became the " +
          "specification, and I implemented it in React against PokeAPI. All " +
          "1,025 appear at runtime with their artwork. The ceiling was gone.",
      ],
    },

    reflections: [
      {
        title: "Tokens first, not last",
        body:
          "The type colour system was the thing every other decision depended " +
          "on, and I built it after 86 screens instead of before one.",
      },
      {
        title: "Depth beats breadth",
        body:
          "86 screens at 80% is worth less than eight at 100%. Nobody counts " +
          "screens; everyone notices unfinished ones.",
      },
      {
        title: "Consistent is not designed",
        body:
          "Fixing the drift made everything uniform. It did not make any " +
          "individual choice better. Those are separate jobs and I conflated " +
          "them.",
      },
    ],

    engineering: [
      {
        title: "1,025 Pokémon in 18 requests",
        body:
          "The obvious way to build a dex is to ask the API about each " +
          "Pokémon in turn, which is 1,025 requests before anything appears " +
          "on screen. Asking about each TYPE instead is 18, and each answer " +
          "carries three things at once: every Pokémon of that type, the " +
          "slot ordering that the card colour rule depends on, and the full " +
          "type-effectiveness chart. The thing that makes the grid fast is " +
          "the same thing that makes Builder's scoring possible, and both " +
          "came out of one decision about which question to ask.",
      },
      {
        title: "Data the API does not have",
        body:
          "PokeAPI has no trainer or gym data in it at all, so Gymdex could " +
          "not be built from it. I extracted all 140 Gym Leaders, with their " +
          "levels, species and movesets, from the games' own source by way of " +
          "the pret disassemblies. Generation 1 does not store movesets at " +
          "all: it derives them from a Pokémon's level at runtime, so I " +
          "reproduced that algorithm rather than guessing. Brock's Onix shows " +
          "the moves you will actually face.",
      },
      {
        title: "It says so instead of guessing",
        body:
          "Some of this data genuinely does not exist: item locations, and " +
          "encounters for Paldea and Hisui. The app names the gap and moves " +
          "on. An empty panel reads as a bug and an invented number reads as " +
          "a fact, and the third option costs one line of copy.",
      },
    ],

    designSystem: {
      intro:
        "Eighteen type colours cannot all be distinct at readable contrast, " +
        "so I stopped trying and split the jobs instead. The badge " +
        "identifies; the card sets mood; the gradient stays behind the art.",
      rules: [
        {
          label: "The badge identifies, the card sets mood",
          body:
            "Pastel tints for Ice and Dragon land close enough to be " +
            "indistinguishable, and no amount of tuning separates eighteen of " +
            "them. Near-identical tints stop mattering the moment something " +
            "else is authoritative, so the badge carries the exact type and " +
            "the card is free to be atmosphere.",
        },
        {
          label: "The primary type wins",
          body:
            "For dual types, the first slot decides the card. A Water and " +
            "Steel Empoleon gets a water card. One rule, no ambiguity, and it " +
            "matches the order PokeAPI already returns type slots in, so it " +
            "is enforced by the data rather than by hand.",
        },
        {
          label: "Three greys, three hues",
          body:
            "Normal, Steel and Dark are all grey at badge level, and derived " +
            "mechanically their card tints collapse into one colour. Each was " +
            "given a hue instead: Normal warm, Steel cool, Dark warm-brown, " +
            "with Dark set deliberately darker than the other seventeen " +
            "because at uniform lightness it reads as beige.",
        },
        {
          label: "One type, three jobs",
          body:
            "Each type ends up owning three colours, because it has three " +
            "jobs to do. The badge is the vivid one and the canonical one. " +
            "The card tint is pale and holds a near-uniform lightness, so a " +
            "grid of them reads as one surface. The gradient is deliberately " +
            "desaturated, because it is the backdrop artwork sits on and its " +
            "job is to stay behind the sprite and behind the badge.",
        },
      ],
      /*
       * All eighteen, straight from the app's own src/tokens.css. The badge
       * values mirror the Figma "Dexovo Tokens" collection, so they are the
       * canonical brand colours; the other two are derived roles.
       */
      swatches: [
        {
          name: "Normal",
          badge: "#AFAFAF",
          card: "#CECCC5",
          gradient: ["#8A8477", "#625D53"],
        },
        {
          name: "Fire",
          badge: "#F81B1B",
          card: "#E29C9C",
          gradient: ["#C4603A", "#8E3A22"],
        },
        {
          name: "Water",
          badge: "#1B5DF8",
          card: "#9CB1E2",
          gradient: ["#4F7FB5", "#345D8C"],
        },
        {
          name: "Grass",
          badge: "#4A7E66",
          card: "#AFD0C1",
          gradient: ["#557D45", "#365D37"],
        },
        {
          name: "Electric",
          badge: "#F7DA3B",
          card: "#E2D79C",
          gradient: ["#D2A72F", "#96721E"],
        },
        {
          name: "Ice",
          badge: "#56F0FE",
          card: "#9CDCE2",
          gradient: ["#5E9BA8", "#3E717C"],
        },
        {
          name: "Fighting",
          badge: "#E66B00",
          card: "#DFB79F",
          gradient: ["#A85A45", "#7A3A2B"],
        },
        {
          name: "Poison",
          badge: "#944EAB",
          card: "#CBA7D7",
          gradient: ["#76517D", "#51365C"],
        },
        {
          name: "Ground",
          badge: "#BE5C07",
          card: "#D6C094",
          gradient: ["#A07C4C", "#6F5433"],
        },
        {
          name: "Flying",
          badge: "#BDE3FF",
          card: "#9CC5E2",
          gradient: ["#6E86B5", "#4A5F8A"],
        },
        {
          name: "Psychic",
          badge: "#F2437D",
          card: "#E29CB3",
          gradient: ["#A45479", "#71374F"],
        },
        {
          name: "Bug",
          badge: "#75AC11",
          card: "#C9E29C",
          gradient: ["#6E8A3C", "#4C6428"],
        },
        {
          name: "Rock",
          badge: "#907D5B",
          card: "#C3B098",
          gradient: ["#8A704E", "#665038"],
        },
        {
          name: "Ghost",
          badge: "#7F1AA8",
          card: "#CE9CE2",
          gradient: ["#6B5A8E", "#453860"],
        },
        {
          name: "Dragon",
          badge: "#0793BE",
          card: "#9CD2E2",
          gradient: ["#5A5FA8", "#3A3E7A"],
        },
        {
          name: "Dark",
          badge: "#392C2C",
          card: "#A38C85",
          gradient: ["#5A4A45", "#3A2F2C"],
        },
        {
          name: "Steel",
          badge: "#757575",
          card: "#B9C4D0",
          gradient: ["#7A8894", "#566169"],
        },
        {
          name: "Fairy",
          badge: "#FF68E1",
          card: "#E29CD4",
          gradient: ["#B06A96", "#7E4569"],
        },
      ],
      note:
        "Fifty-four colours, and the whole system had to survive being read " +
        "at 145px in a grid of 1,025 cards, which is the size that decides " +
        "whether any of it works. It is not perfectly tidy: Dragon's badge is " +
        "a cyan that came from Figma while its gradient is the indigo the " +
        "series has always used, and the two diverge more than any other " +
        "pair. Flying's badge is pale enough that the app's own white label " +
        "sits on it at low contrast, which is a real defect rather than a " +
        "stylistic choice.",
    },

    foundations:
      "An oxblood shell, so the eighteen type colours have somewhere dark to " +
      "sit, with the two Poké Ball colours doing the accent work. The " +
      "fifty-four badges, tints and gradients above are the real system; " +
      "these four are the shell they all live in.",
    palette: [
      { name: "Shell", hex: "#211514" },
      { name: "Ink", hex: "#17100F" },
      { name: "Poké Ball Yellow", hex: "#F7C928" },
      { name: "Poké Ball Red", hex: "#D9102F" },
    ],
    typography: {
      headingName: "Port Lligat Sans",
      bodyName: "Inter",
      note:
        "A rounded, even-stroked display face for headings and every number, " +
        "with Inter underneath for anything read in quantity. The display " +
        "face has warmth without being a cartoon, which is the line this " +
        "subject has to walk.",
      sample: "One rule, eighteen types.",
    },

    /*
     * What the sections above did not place: the two remaining mockups feed
     * the wide slots, and the two phone shots pair off below them so the
     * responsive work is shown rather than claimed.
     */
    gallery: [
      {
        src: "/images/projects/dexovo/mock-laptop-desk.webp",
        alt: "Dexovo's Pokédex open on a laptop, in use at a desk by a window",
      },
      {
        src: "/images/projects/dexovo/mock-phone-hand.webp",
        alt: "A Pokémon entry held in one hand, the page taking its whole background from the primary type",
      },
      {
        src: "/images/projects/dexovo/mob-pokedex-grid.webp",
        alt: "The Pokédex grid on a phone, reflowed to two cards across",
        tall: true,
      },
      {
        src: "/images/projects/dexovo/mob-builder-own-analysis.webp",
        alt: "Builder Dex's team analysis on a phone, with the gym matchup list stacked",
        tall: true,
      },
    ],

    outcome:
      "A shipped React and Vite app running on live PokeAPI data: 1,025 " +
      "Pokémon, 140 Gym Leaders, 2,223 items and 10 regions, all present at " +
      "runtime. The design system that started as 86 drifting Figma screens " +
      "is now 50 tokens and a component set that the data enforces rather " +
      "than my memory.",
    closing: {
      title: "The idea behind it",
      body:
        "It treats the games as the subject, not just the species list. And " +
        "where the data to answer a question does not exist, it says so " +
        "instead of guessing.",
    },
    description:
      "A Pokémon companion app built as five connected tools over live PokeAPI data: a Pokédex for all 1,025 species, a Builder Dex that scores a team against a game's actual Gym Leaders, plus Gymdex, Mapdex and Itemdex. Designed as a system in Figma, audited when that system drifted, then rebuilt in React so the rules are enforced by the data.",
    role:
      "Everything: product thinking, information architecture, the design " +
      "system, the interface, the data extraction, and the React " +
      "implementation.",
    tech: ["React", "Vite", "PokeAPI", "Figma", "Design tokens"],
    impact:
      "1,025 Pokémon at runtime, up from the 104 the hand-placed Figma design " +
      "could reach.",
    /*
     * The live build, NOT the Figma prototype it replaced. Linking the
     * prototype here would undercut the whole page: the audit's punchline is
     * that the Figma file topped out at 104 of 1,025 Pokemon and the React
     * implementation did not. The prototype URL is preserved in the comment
     * below if it is ever wanted as a historical artefact.
     *
     * prototype: "https://www.figma.com/proto/ibnduIw9wewPz169Dk24Xz/pokemon?node-id=245-6979"
     */
    links: {
      liveApp: "https://dexovo.vercel.app/",
    },
    disclaimer:
      "Unofficial fan concept, built as a design exercise. Data and sprites " +
      "from PokeAPI. Pokémon © Nintendo / Game Freak / The Pokémon Company. " +
      "Not affiliated with or endorsed by Nintendo, and not for commercial use.",
  },
  {
    title: "FUTURX",
    hook: "Find the right college, by what actually matters.",
    thumbnail: "/images/projects/futurx/cover.webp",
    gallery: [
      {
        src: "/images/projects/futurx/futurx-2.webp",
        alt: "FuturX's college search results open on a tablet, filters down the left",
      },
      {
        src: "/images/projects/futurx/futurx-3.webp",
        alt: "A FuturX university detail page on a phone, showing key highlights",
        tall: true,
      },
      {
        src: "/images/projects/futurx/futurx-4.webp",
        alt: "FuturX's search results held on a tablet",
        tall: true,
      },
    ],
    // The row shows the tablet shot; the hero keeps the landing-page scene.
    rowThumbnail: "/images/projects/futurx/futurx-2.webp",
    credit: "With Akshadha Singh",
    overview:
      "A UX redesign of FuturX, a career-counselling platform, restructuring " +
      "complex user journeys into a clear, intuitive experience. Placed 2nd " +
      "nationally at the ECLearnix Quick Solvathon 2025, competing against 714 " +
      "teams across India.",
    brief:
      "Simplify the complex user journeys of FuturX, a career-counselling " +
      "platform, and improve its usability, hierarchy, and overall experience.",
    challenge: [
      {
        label: "Complex, tangled user journeys",
        body: "Flows were hard to navigate.",
      },
      {
        label: "Weak visual hierarchy & information flow",
        body: "Content wasn't guiding users clearly.",
      },
      {
        label: "Friction in onboarding & login",
        body: "The entry experience needed to be smoother.",
      },
    ],
    landscape: {
      intro:
        "Before redesigning, we studied the leading college-discovery " +
        "platforms to understand what worked, what frustrated users, and where " +
        "FuturX could stand apart.",
      competitors: [
        "CollegeDekho",
        "Shiksha",
        "CollegeDunia",
        "Careers360",
        "Unstop",
      ],
      takeaway:
        "Across these platforms, the recurring problems were cluttered " +
        "information hierarchy, overwhelming search and filter flows, and " +
        "heavy onboarding. That shaped our focus on clarity, " +
        "simpler journeys, and a cleaner, more guided experience.",
    },
    process: [
      {
        phase: "Round 1: Design Submission",
        body:
          "714 teams via Unstop. We simplified FuturX's complex user journeys, " +
          "improved visual hierarchy and information flow, enhanced onboarding " +
          "and login, and built intuitive, user-centered screens in Figma. Our " +
          "clarity of approach earned a spot in the final shortlist.",
      },
      {
        phase: "Round 2: Live Jury Presentation",
        body:
          "We presented our complete design system live, explained our " +
          "restructuring logic, and justified our design decisions. We were " +
          "judged on UX reasoning, innovation, communication, and on whether " +
          "we could defend our choices. Strong teamwork and clear thinking earned us 2nd place " +
          "nationally.",
      },
    ],
    /*
     * The methodology behind the two rounds above. Discover → Deliver, with
     * the methods that were genuinely used under each — the benchmarking in
     * DISCOVER is the same study written up in `landscape`, and DELIVER is the
     * jury presentation from Round 2, seen as a design activity rather than as
     * a competition beat.
     */
    designApproach: [
      {
        phase: "Discover",
        body:
          "Understood the problem space and users. Studied FuturX's existing " +
          "flows and benchmarked leading college-discovery platforms " +
          "(CollegeDekho, Shiksha, CollegeDunia, Careers360, Unstop) to find " +
          "what frustrated users.",
        methods: ["Competitive analysis", "Heuristic review of existing flows"],
      },
      {
        phase: "Define",
        body:
          "Pinpointed the core problems: cluttered information hierarchy, " +
          "overwhelming search/filter flows, and heavy onboarding. Framed " +
          "clear goals around clarity, simpler journeys, and a guided " +
          "experience.",
        methods: [
          "Problem framing",
          "Information architecture",
          "User journey mapping",
        ],
      },
      {
        phase: "Ideate",
        body:
          "Explored solutions for restructuring the platform, rethinking " +
          "navigation, hierarchy, onboarding, and search, plus innovation " +
          "concepts like dashboards, personalization, and gamification.",
        methods: ["Ideation", "Flow sketching", "Wireframing"],
      },
      {
        phase: "Design",
        body:
          "Built intuitive, user-centered high-fidelity screens and a complete " +
          "design system in Figma: a landing page redesign, streamlined " +
          "onboarding/login, and cleaner search & filter flows.",
        methods: [
          "UI design",
          "Design system",
          "High-fidelity prototyping (Figma)",
        ],
      },
      {
        phase: "Deliver",
        body:
          "Presented the complete design system and restructuring logic to the " +
          "jury, justified every decision, and placed 2nd nationally.",
        methods: [
          "Design system documentation",
          "Live presentation",
          "Design rationale",
        ],
      },
    ],
    focusAreas: [
      "Landing page redesign & improved information hierarchy",
      "Enhanced onboarding & login experience",
      "Better search and filter flows",
      "Innovation-driven concepts: dashboards, personalization, gamification, and mobile-first design",
    ],
    foundations:
      "A complete design system built for usability, accessibility, and a " +
      "clean, user-first experience.",
    palette: [
      { name: "Deep Navy", hex: "#0A1729" },
      { name: "Bright Blue", hex: "#2F80FF" },
      { name: "Off-White", hex: "#EDF3FB" },
      { name: "Charcoal", hex: "#131C29" },
    ],
    typography: {
      headingName: "Inter",
      bodyName: "Inter",
      note: "A neutral, highly legible sans. The right voice for a platform that has to be trusted.",
      sample: "Choose your path.",
    },
    outcome:
      "🥈 2nd Place nationally at the ECLearnix Quick Solvathon 2025, out of " +
      "714 teams, designed with my teammate Akshadha Singh.",
    description:
      "A college-surfing website designed to help students discover and compare colleges by course, location, ranking and personal preference. It guides students through a customised selection journey, making it easier to shortlist the best-fit colleges for their goals.",
    role: "", // TODO: not stated separately from the process above
    tech: [], // TODO: not stated on the résumé
    impact: "", // TODO: no metric beyond the placement — `outcome` carries it
    links: {
      prototype:
        "https://www.figma.com/proto/s2WpRTnpTLi7YJTqcvjAgv/futurx?node-id=14-8812&p=f&t=hDMSWwDHZAh75PTZ-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=14%3A8812&show-proto-sidebar=1",
    },
  },
  {
    // Promoted out of `achievements`, where the résumé filed it — it is a
    // finished piece with a live prototype. It still appears under
    // achievements too, because the 1st-place win is its own fact.
    title: "Crustfolio",
    hook: "A pizza portfolio. One slice, one story.",
    thumbnail: "/images/projects/crustfolio/cover.png",
    gallery: [
      {
        src: "/images/projects/crustfolio/crustfolio-2.png",
        alt: "Crustfolio's slice pages on a tablet, showing a Classic Margherita entry and the Top Shelf Champions section",
      },
      {
        src: "/images/projects/crustfolio/crustfolio-3.png",
        alt: "Crustfolio open on a laptop, showing a slice's story alongside its ingredients",
      },
    ],
    description:
      "An immersive pizza-portfolio website telling each slice's story, ingredients and flavour profile through an interactive experience. Built for the Figma IT event at IGNITE, where it took 1st place.",
    overview:
      "A concept portfolio for a pizzeria, reimagined so every pizza tells its " +
      "own story. Designed and built during a live 1-2 hour Figma designathon " +
      ", and awarded 1st place.",
    brief:
      "Design a pizzeria portfolio where each pizza presents itself " +
      "compellingly, turning an ordinary menu into something that makes each " +
      "pizza want to be chosen.",
    challenge: [
      {
        label: "A menu is just a list",
        body:
          "Traditional pizza menus are flat and forgettable; nothing makes one " +
          "pizza stand out.",
      },
      {
        label: "No emotional hook",
        body:
          "Customers scan and forget; there's no story or character to connect " +
          "with.",
      },
      {
        label: "No reference to build on",
        body:
          "There was no existing 'pizza-perspective' design, so it had to be " +
          "created from scratch.",
      },
    ],
    process: [
      {
        phase: "Understand",
        body:
          "Parsed the brief and found the core insight: a menu is forgettable, " +
          "so give each pizza a voice.",
      },
      {
        phase: "Explore",
        body:
          "Looked for existing pizza-perspective designs, found none, and " +
          "committed to an original concept from scratch.",
      },
      {
        phase: "Design",
        body:
          "Led the visual direction and user journey; built a system where each " +
          "slice narrates its own story.",
      },
      {
        phase: "Deliver",
        body:
          "Designed and prototyped a coherent, presentable interface within the " +
          "event's tight time limit.",
      },
    ],
    foundations:
      "The direction is deliberately appetising: warm cream paper, espresso " +
      "text, a tomato red carrying the things that matter and a mozzarella gold " +
      "for the smaller marks. The headings are set in a soft, slightly wonky " +
      "serif rather than a neutral one. The type had to have as much character " +
      "as the pizzas it introduces, because the whole concept rests on them " +
      "reading as personalities rather than as menu items.",
    palette: [
      { name: "Cream", hex: "#FAF2E4" },
      { name: "Tomato", hex: "#C03A26" },
      { name: "Mozzarella", hex: "#E0A12A" },
      { name: "Espresso", hex: "#2E211A" },
    ],
    typography: {
      headingName: "Crimson Text",
      bodyName: "Karla",
      note: "An elegant book serif: warm, editorial and appetising set large.",
      sample: "Every slice tells a story.",
    },
    keyFeature: {
      title: "Every slice, a story",
      body:
        "Each pizza narrates its own ingredients, flavour, and character, " +
        "turning the menu into a cast of characters rather than a static list.",
    },
    role:
      "Led the visual direction and user journey. I defined how each pizza's " +
      "story unfolds and shaped the overall look and flow of the experience.",
    approach:
      "Built the concept around one strong idea: each pizza slice narrates its " +
      "own story: its ingredients, flavour and character. That single " +
      "narrative device tied the interface together and turned an ordinary " +
      "menu into an experience.",
    outcome:
      "Won 1st place at the designathon. Proof that one strong concept, " +
      "executed clearly under pressure, beats complexity.",
    tech: [], // TODO: not stated on the résumé
    impact: "", // TODO: no metric stated — `outcome` above carries the result
    links: {
      prototype:
        "https://www.figma.com/proto/w26zpVzyOPu6vkH7j7Rj7a/crustfolio?node-id=1-26&p=f&t=LjWVxholR1OhLqp6-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A26&show-proto-sidebar=1",
    },
  },
];

// ── SKILLS ─────────────────────────────────────────────────────────────────

/**
 * Grouped exactly as the résumé groups them. Note it files Flutter under
 * "Tools/Platforms" rather than as a framework, so it is left there.
 *
 * TODO: no frameworks/libraries are listed (React, Next.js and so on), and no
 * proficiency levels. Add them if you want that shown.
 */
export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["C", "C++"],
  },
  {
    label: "Design",
    items: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "User Interface Design",
      "User Experience Design",
    ],
  },
  {
    label: "Tools & Platforms",
    items: ["Figma", "Canva", "Flutter", "Google AI Studio"],
  },
];

// ── EDUCATION ──────────────────────────────────────────────────────────────

export const education: EducationItem[] = [
  {
    school: "Dayananda Sagar College of Engineering",
    degree: "Bachelor of Engineering in Electrical and Electronics Engineering",
    dates: "2023 – 2027",
    note: "CGPA 7.45",
  },
];

// ── ACHIEVEMENTS ───────────────────────────────────────────────────────────

/**
 * Four competition placements. Three of them produced real, linkable work —
 * Respira, Seva Sahyog and Crustfolio — which arguably belong in `projects`
 * as well; they are kept here because that is where the résumé puts them.
 */
export const achievements: Achievement[] = [
  {
    title: "Respira",
    event: "IEEE IDEATHON, IEEE PELS & IES Student Congress, DSCE",
    placement: "3rd place",
    description:
      "An idea-pitching event. Presented Respira, a microplastic monitoring and alert system with a live-tracking dashboard.",
    links: {
      certificate:
        "https://drive.google.com/file/d/1nN239N3RvApWbTe_fZ9RINrdIFIiYPlZ/view?usp=drivesdk",
    },
  },
  {
    /*
     * NOT on the résumé — the PDF's Achievements section lists only the four
     * below, and files COGMU under Projects with a live site instead. Supplied
     * by Yashwardhan on 2026-08-03, along with the correction that it placed
     * 2nd. The event is taken from COGMU's own `credit` line rather than
     * invented; if the designathon has a formal name, put it here.
     */
    title: "COGMU",
    event: "Designathon, CSBS Dept., DSCE",
    placement: "2nd place",
    description:
      "A live 1-2 hour designathon with Team Phoenix. Designed COGMU, a " +
      "music-recognition app that identifies a song from the fragment stuck " +
      "in your head and hands you straight to it.",
    links: {
      certificate:
        "https://drive.google.com/file/d/15iXNZ1K0RdPqmWRH1QHCuJ6vEKoGF8Yb/view?usp=drivesdk",
      website: "https://cogmu.vercel.app/",
    },
  },
  {
    /*
     * 2nd place, corrected from the résumé by Yashwardhan on 2026-08-03.
     *
     * The PDF this file was transcribed from says "Secured the 1st place at
     * the ECLearnix Quick SOLVATHON Challenge 2025". It is wrong, and so was
     * every page that repeated it. Noted here so nobody "fixes" this back to
     * match the source document — the résumé itself needs the correction too.
     */
    title: "FuturX revamp",
    event: "ECLearnix Quick SOLVATHON Challenge 2025",
    placement: "2nd place",
    description:
      "A national-level event against teams from across India. Revamped FuturX, a college-surfing website helping students explore and choose colleges more effectively.",
    links: {
      certificate:
        "https://drive.google.com/file/d/1ICLTXk8TQJ7fCoh8lByXE1CWL8SfdP7l/view?usp=drivesdk",
    },
  },
  {
    title: "Seva Sahyog",
    event: "IEEE CREATHON, IEEE PES, DSCE",
    placement: "2nd place",
    description:
      "A 24-hour medical-domain hackathon. Built a smart ambulance dispatch system.",
    links: {
      certificate:
        "https://drive.google.com/file/d/1ardKQQ4lReQAKciYf1aiHb7h-wqhJZne/view?usp=drivesdk",
    },
  },
  {
    title: "Crustfolio",
    event: "Figma IT event at IGNITE, Computer Science & Design Dept., DSCE",
    placement: "1st place",
    description:
      "Created Crustfolio, an immersive pizza-portfolio website telling each slice's story, ingredients and flavour profile through an interactive experience.",
    links: {
      certificate:
        "https://drive.google.com/file/d/1XENf-L527OzR5xJlyQ1GhfPppB4pjOvh/view?usp=drivesdk",
      prototype:
        "https://www.figma.com/proto/w26zpVzyOPu6vkH7j7Rj7a/crustfolio?node-id=1-26&p=f&t=LjWVxholR1OhLqp6-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A26&show-proto-sidebar=1",
    },
  },
];
