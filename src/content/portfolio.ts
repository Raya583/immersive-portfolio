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
    hook: "A companion for every game in the franchise.",
    // TODO: no artwork yet — add e.g.
    //   thumbnail: "/images/projects/x/cover.png"
    description:
      "A Pokémon companion app, currently in development, aimed at providing crystal-clear information for players across every game in the franchise. It focuses on simplifying gameplay with accurate data, guides and insights to support trainers throughout their journey.",
    role: "", // TODO: not stated on the résumé
    tech: [], // TODO: not stated on the résumé
    impact: "", // TODO: still in development — no outcome stated
    links: {
      prototype:
        "https://www.figma.com/proto/ibnduIw9wewPz169Dk24Xz/pokemon?node-id=245-6979&p=f&t=MmvqAxbxlO6lMMMc-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=6%3A3",
    },
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
