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
  description: string;
  role: string;
  tech: string[];
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
  title: "UI/UX Designer",
  tagline: "Create. Refine. Elevate.",
  // TODO: not on the résumé. His college (DSCE) is in Bengaluru, but that is
  // an inference — fill in the city you actually want shown.
  location: "",
  email: "yashrathore583@gmail.com",
  phone: "+91-6394672303",
  links: {
    linkedin: "http://www.linkedin.com/in/yashwardhan-singh-15963b279",
    // TODO: the résumé lists no GitHub, Twitter/X, hosted résumé, personal
    // site, Behance or Dribbble. Add whichever you want linked.
  },
};

// ── ABOUT ──────────────────────────────────────────────────────────────────

/**
 * Drafted from the résumé's OBJECTIVE section, lightly tightened for the web.
 * The claims are all his own; nothing has been added.
 */
export const about =
  "A UI/UX designer who wants to build digital experiences that combine " +
  "creativity, usability and technical understanding. Coming from an " +
  "Electrical Engineering background, I focus on user-centred solutions that " +
  "are visually clear, intuitive and impactful — currently building projects " +
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
    role: "UI/UX Designer — core member",
    dates: "", // TODO: not on the résumé
    location: "", // TODO: not on the résumé
    highlights: [
      "Core member of Vyadh Design Studio, a design studio startup, working as a UI/UX Designer.",
    ],
  },
  {
    company: "Mudita — DSCE Social Responsibility Cell",
    role: "Functional Lead",
    dates: "", // TODO: not on the résumé
    location: "", // TODO: not on the résumé
    highlights: [
      "One of the main functional leads, organising social drives, volunteering events and awareness programmes.",
    ],
  },
  {
    company: "Center of Performing Arts, DSCE",
    role: "Designer — Media Team",
    dates: "", // TODO: not on the résumé
    location: "", // TODO: not on the résumé
    highlights: ["Member of the Media Team, contributing as a Designer."],
  },
];

// ── PROJECTS ───────────────────────────────────────────────────────────────

/**
 * TODO on every entry: the résumé gives no per-project tech stack, no
 * statement of your role, and no outcomes/metrics. `tech`, `role` and `impact`
 * are therefore left empty rather than guessed at. The résumé's global tool
 * list is in `skills` below, but it does not say which project used what.
 */
export const projects: Project[] = [
  {
    title: "COGMU",
    description:
      "A music-recognition app that helps you identify songs stuck in your mind, even if you only remember the tune, and instantly find the track. It stores your search history and connects with your preferred music-streaming apps, making discovery and listening effortless.",
    role: "", // TODO: not stated on the résumé
    tech: [], // TODO: not stated on the résumé (it ships on Vercel — web?)
    impact: "", // TODO: no outcome or metric on the résumé
    links: { website: "https://cogmu.vercel.app/" },
  },
  {
    title: "DEXOVO",
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
    description:
      "A college-surfing website designed to help students discover and compare colleges by course, location, ranking and personal preference. It guides students through a customised selection journey, making it easier to shortlist the best-fit colleges for their goals.",
    role: "", // TODO: not stated on the résumé
    tech: [], // TODO: not stated on the résumé
    // The résumé does not frame this as impact, but FuturX is the project he
    // revamped to win the ECLearnix SOLVATHON — see `achievements`.
    impact: "", // TODO: confirm how you want the SOLVATHON win credited here
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
    description:
      "An immersive pizza-portfolio website telling each slice's story, ingredients and flavour profile through an interactive experience. Built for the Figma IT event at IGNITE, where it took 1st place.",
    role: "", // TODO: not stated on the résumé
    tech: [], // TODO: not stated on the résumé
    impact: "", // TODO: beyond the 1st-place win, no outcome stated
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
    degree: "Bachelor of Engineering — Electrical and Electronics Engineering",
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
    event: "IEEE IDEATHON — IEEE PELS & IES Student Congress, DSCE",
    placement: "3rd place",
    description:
      "An idea-pitching event. Presented Respira, a microplastic monitoring and alert system with a live-tracking dashboard.",
    links: {
      certificate:
        "https://drive.google.com/file/d/1nN239N3RvApWbTe_fZ9RINrdIFIiYPlZ/view?usp=drivesdk",
    },
  },
  {
    title: "FuturX revamp",
    event: "ECLearnix Quick SOLVATHON Challenge 2025",
    placement: "1st place",
    description:
      "A national-level event against teams from across India. Revamped FuturX, a college-surfing website helping students explore and choose colleges more effectively.",
    links: {
      certificate:
        "https://drive.google.com/file/d/1ICLTXk8TQJ7fCoh8lByXE1CWL8SfdP7l/view?usp=drivesdk",
    },
  },
  {
    title: "Seva Sahyog",
    event: "IEEE CREATHON — IEEE PES, DSCE",
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
    event: "Figma IT event at IGNITE — Computer Science & Design Dept., DSCE",
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
