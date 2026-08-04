"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { FORGE } from "@/config/sections";
import { achievements, projects, type Project } from "@/content/portfolio";
import { themeFor } from "@/config/projectThemes";
import { catsAt, flairFor } from "@/config/projectFlair";
import { logoFor } from "@/config/projectLogos";
import { CASE_IDS } from "@/config/caseSections";
import { certificateFor } from "@/config/certificates";
import { CaseNav } from "./CaseNav";
import { Cats } from "../flair/Cat";
import { RowFlair } from "../flair/RowFlair";

/**
 * THE FORGE — the projects section, as a quest log.
 *
 * Two views, one component. The LIST is a game menu: one ornate row per
 * project, artwork first, a single line of text, an award seal if there is one.
 * Choosing a row opens its CASE STUDY, which is where the full write-up, the
 * credential and the real links live.
 *
 * ── EVERY WORD COMES FROM portfolio.ts ─────────────────────────────────────
 * Titles, hooks, descriptions, links and placements are all read from
 * src/content/portfolio.ts, which is transcribed from the résumé. `role`,
 * `tech` and `impact` are empty on every entry because the résumé does not
 * state them; those blocks are OMITTED rather than filled with a guess or a
 * "TBD". They will appear on their own once the content file has them.
 *
 * ── THUMBNAILS ─────────────────────────────────────────────────────────────
 * A row uses `project.thumbnail` if the entry has one. None do yet, so every
 * row falls back to `QuestPlaceholder` — an ornate empty frame in the same
 * style, so a half-illustrated list still looks deliberate rather than broken.
 */

const ordered = (): Project[] => {
  const byTitle = new Map(projects.map((p) => [p.title, p]));
  const listed = FORGE.order
    .map((t) => byTitle.get(t))
    .filter((p): p is Project => Boolean(p));
  // Anything added to portfolio.ts but missing from FORGE.order still shows up.
  const rest = projects.filter((p) => !FORGE.order.includes(p.title));
  return [...listed, ...rest];
};

const credentialsFor = (title: string) =>
  (FORGE.credentials[title] ?? [])
    .map((a) => achievements.find((x) => x.title === a))
    .filter((a): a is (typeof achievements)[number] => Boolean(a));

/**
 * The call-to-action links, strongest claim FIRST.
 *
 * A live deployed app outranks a prototype of the same thing, so it leads and
 * gets its own label: "Open the live app" is a different promise from "Open
 * the prototype", and a reader who clicks the second expecting the first is
 * entitled to feel misled.
 */
const linksOf = (project: Project) => {
  const l = project.links;
  if (!l) return [];
  return [
    { href: l.liveApp, label: "Open the live app" },
    { href: l.website, label: "Visit the site" },
    { href: l.prototype, label: "Open the prototype" },
    { href: l.repo, label: "Source" },
    { href: l.caseStudy, label: "Read the case study" },
  ].filter((x): x is { href: string; label: string } => Boolean(x.href));
};

/** A project is "live" when it has a deployed build you can actually use. */
const isLive = (project: Project) => Boolean(project.links?.liveApp);

/** An empty frame, for entries whose artwork does not exist yet. */
function QuestPlaceholder({ title }: { title: string }) {
  return (
    <span className="quest-thumb-empty" aria-hidden="true">
      <span className="quest-crest">
        <span className="quest-crest-letter font-hylia">{title.charAt(0)}</span>
      </span>
      <span className="quest-thumb-note">Uncharted</span>
    </span>
  );
}

function QuestRow({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (title: string) => void;
}) {
  const creds = credentialsFor(project.title);
  // The row previews the project's own colour. Same value the case-study page
  // uses, from the same config, so the two can never drift apart.
  const theme = themeFor(project.title);
  // A project only gets a branded row once it has an identity to preview.
  const branding = flairFor(project.title).row;

  return (
    <li className="quest-item">
      <button
        type="button"
        className="quest-row"
        data-branded={branding ? "" : undefined}
        style={
          {
            "--row-accent": theme.accent,
            "--row-accent-soft": theme.accentSoft,
            ...(branding
              ? {
                  "--row-panel": branding.panel,
                  "--row-border": branding.border,
                  "--row-border-hover": branding.borderHover,
                  "--row-glow": branding.glow,
                  "--row-ink": branding.ink,
                  "--row-ink-soft": branding.inkSoft,
                  "--row-badge-bg": branding.badgeBg,
                  "--row-badge-ink": branding.badgeInk,
                  "--row-trim": branding.trim,
                  ...(branding.brandTitle
                    ? { "--row-title-font": theme.headingFont }
                    : null),
                }
              : null),
          } as CSSProperties
        }
        onClick={() => onOpen(project.title)}
        aria-label={`${project.title} — open case study`}
      >
        {/* Behind the row's own content — see `.row-flair` in globals.css. */}
        {branding && <RowFlair branding={branding} />}

        <span className="quest-index font-hylia" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="quest-thumb">
          {project.rowThumbnail ?? project.thumbnail ? (
            <Image
              src={(project.rowThumbnail ?? project.thumbnail) as string}
              alt=""
              fill
              sizes="(max-width: 700px) 40vw, 260px"
              className="quest-thumb-img"
            />
          ) : (
            <QuestPlaceholder title={project.title} />
          )}
          <span className="quest-thumb-frame" aria-hidden="true" />
        </span>

        <span className="quest-body">
          <span
            className={branding?.brandTitle ? "quest-title" : "quest-title font-hylia"}
          >
            {project.title}
          </span>
          {project.hook && <span className="quest-hook">{project.hook}</span>}
          {(creds.length > 0 || isLive(project)) && (
            <span className="quest-seals">
              {isLive(project) && (
                <span className="quest-seal quest-seal-live">
                  <span className="quest-seal-mark" aria-hidden="true">
                    ●
                  </span>
                  Live app
                </span>
              )}
              {creds.map((c) => (
                <span key={c.title} className="quest-seal">
                  <span className="quest-seal-mark" aria-hidden="true">
                    ★
                  </span>
                  {c.placement}
                </span>
              ))}
            </span>
          )}
        </span>

        <span className="quest-chevron font-hylia" aria-hidden="true">
          ›
        </span>
      </button>
    </li>
  );
}

/**
 * Readable ink for a coloured pill: whichever of the two candidates actually
 * contrasts more with the swatch, measured rather than guessed.
 *
 * ── WHY THIS IS COMPUTED AND NOT CONFIGURED ────────────────────────────────
 * The badge colours come from the PROJECT's data and can be any hue. DEXOVO's
 * own stylesheet puts white on all eighteen of its types, which on the pale
 * ones (Electric, Ice, Flying) lands near 1.6:1 and makes the label a ghost.
 * Reproducing that faithfully would be reproducing a bug.
 *
 * ── WHY MAX-CONTRAST AND NOT A LIGHTNESS THRESHOLD ─────────────────────────
 * The first version of this switched on relative luminance crossing a fixed
 * threshold. That is the usual shortcut and it was wrong here: at 0.45 it sent
 * nine of the eighteen to white, including Normal at 2.19:1 and Fairy at
 * 2.52:1. Computing both ratios and taking the better one has no threshold to
 * tune and cannot be wrong in that particular way.
 *
 * One of the eighteen still lands fractionally under 4.5:1 on its best option
 * (Ground, at 4.45) because a mid-tone saturated orange has no good answer.
 * Changing the swatch itself to fix that would misrepresent the product's
 * palette, which is the thing this specimen exists to show.
 */
const INK_DARK = "#12090a";
const INK_LIGHT = "#ffffff";

/** WCAG relative luminance. */
const luminance = (hex: string): number => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const ch = (i: number) => {
    const v = parseInt(full.slice(i * 2, i * 2 + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(0) + 0.7152 * ch(1) + 0.0722 * ch(2);
};

const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

const pillInk = (hex: string): string =>
  contrast(hex, INK_DARK) >= contrast(hex, INK_LIGHT) ? INK_DARK : INK_LIGHT;

/** The little mark inside a call-to-action, chosen per project. */
function CtaMark({ kind }: { kind?: "slice" | "note" }) {
  if (!kind) return null;
  if (kind === "note") {
    return (
      <svg className="cs-link-mark" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M10 18V6.5l9-2V16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="18" r="2.6" fill="currentColor" />
        <circle cx="16.5" cy="16" r="2.6" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className="cs-link-mark" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M12 2 L21 20 A10 10 0 0 1 3 20 Z" fill="var(--pt-accent2, #e8a723)" />
      <path
        d="M12 2 L21 20 A10 10 0 0 1 3 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="13" r="1.7" fill="currentColor" />
      <circle cx="14.4" cy="17" r="1.4" fill="currentColor" />
    </svg>
  );
}

/**
 * The written case study, in the order it reads. Only sections with something
 * in them are rendered — a half-written entry shows what exists rather than a
 * column of empty headings.
 */
const writeUp = (project: Project) =>
  [
    { title: "The Brief", body: project.brief },
    { title: "My Role", body: project.role },
    { title: "The Approach", body: project.approach },
    { title: "The Outcome", body: project.outcome },
  ].filter((s): s is { title: string; body: string } =>
    Boolean(s.body && s.body.trim()),
  );

function CaseStudy({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const creds = credentialsFor(project.title);
  const links = linksOf(project);
  const shots = project.gallery ?? [];
  const flair = flairFor(project.title);
  const logo = logoFor(project.title);
  const certificate = certificateFor(project.title);

  /**
   * ── WHERE THE ARTWORK GOES ────────────────────────────────────────────────
   * Split by ORIENTATION before anything is placed.
   *
   * The two single-image slots between sections are full-column, which suits a
   * landscape shot and wastes a screen of height on a portrait one. Filling
   * them in gallery order put a phone screenshot in a slot meant for a laptop
   * and left its partner stranded, so the pair never formed.
   *
   * Landscape shots feed those slots; portrait shots go to the flow below,
   * where consecutive ones pair up side by side.
   */
  const wide = shots.filter((s) => !s.tall);
  const tall = shots.filter((s) => s.tall);

  const rest: (typeof shots)[] = [
    ...wide.slice(2).map((s) => [s]),
    ...tall.reduce<(typeof shots)[]>((groups, shot) => {
      const last = groups[groups.length - 1];
      if (last && last.length === 1) {
        last.push(shot);
        return groups;
      }
      groups.push([shot]);
      return groups;
    }, []),
  ];
  const hasTech = project.tech.length > 0;
  const hasImpact = project.impact.trim().length > 0;

  // Opening a quest replaces everything on screen, so the keyboard has to come
  // with it — otherwise focus is left on a row that no longer exists.
  useEffect(() => {
    headingRef.current?.focus();
  }, [project.title]);

  return (
    <article className="cs">
      {/*
        The sticky header. It carries the back button now, which is why there
        is no longer a separate one here — on a page this long a single button
        at the very top is exactly the thing that made leaving hard.
      */}
      <CaseNav project={project} onBack={onBack} />

      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <header className="cs-head" id={CASE_IDS.top}>
        {/*
          The project's own mark, leading the page.

          Plain <img> rather than next/image: these are 2–11 KB, so there is
          nothing to optimise, and COGMU's is an SVG — which next/image refuses
          to serve unless `dangerouslyAllowSVG` is turned on in next.config.
          Width and height are the intrinsic pixel size, so the box is reserved
          before it loads and the masthead does not jump.
        */}
        {logo && (
          <p className={`cs-logo cs-logo-${logo.plate}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="cs-logo-img"
            />
          </p>
        )}

        {/*
          The credential row: the award badge, and the proof of it.

          One row rather than two, so the certificate reads as belonging to the
          win beside it. A project can have either on its own — COGMU has a
          certificate and no award record, Crustfolio and FUTURX have both.
        */}
        {(creds.length > 0 || certificate) && (
          <p className="cs-award">
            {creds.map((c) => (
              <span key={c.title} className="cs-award-mark">
                {c.placement} · {c.event}
              </span>
            ))}

            {certificate && (
              <a
                className="cs-cert"
                href={certificate}
                target="_blank"
                rel="noopener noreferrer"
              >
                View certificate
                <svg
                  className="cs-cert-arrow"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  aria-hidden="true"
                >
                  <path
                    d="M8 16 L16 8 M9.5 8 H16 V14.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Named for a screen reader, which cannot see the arrow. */}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </p>
        )}

        {/*
          The LIVE mark. Only one project on this site is a running product
          rather than a design artefact, and that is the single most useful
          thing a recruiter can learn from this page — so it is stated before
          the title rather than left to be inferred from a link label.
        */}
        {isLive(project) && (
          <p className="cs-live">
            <span className="cs-live-dot" aria-hidden="true" />
            Live app
          </p>
        )}

        <h3 className="cs-title" ref={headingRef} tabIndex={-1}>
          {project.title}
          {/* Perches. Each anchor is `position: relative`; the cat is absolute
              against it, so it sits ON the element rather than near it. */}
          <Cats cats={catsAt(flair, "title")} />
        </h3>

        {project.credit && <p className="cs-credit">{project.credit}</p>}

        {project.overview && <p className="cs-overview">{project.overview}</p>}

        {links.length > 0 && (
          <p className="cs-links">
            <Cats cats={catsAt(flair, "links")} />
            {links.map((l) => (
              <a
                key={l.href}
                className="cs-link"
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {/* The project's own mark, if it has one. Decorative — the
                    label beside it is what a screen reader reads. */}
                <CtaMark kind={flair.ctaIcon} />
                {l.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            ))}
          </p>
        )}
      </header>

      {/* The hero shot, straight after the masthead. */}
      {project.thumbnail && (
        <figure className="cs-hero">
          <Image
            src={project.thumbnail}
            alt={`${project.title} shown on a tablet`}
            width={1600}
            height={1200}
            sizes="(max-width: 700px) 92vw, 62rem"
            className="cs-hero-img"
            priority
          />
        </figure>
      )}

      {project.brief && (
        <section className="cs-block" id={CASE_IDS.brief}>
          <h4 className="cs-label">The Brief</h4>
          <p className="cs-lede">{project.brief}</p>
        </section>
      )}

      {project.challenge && project.challenge.length > 0 && (
        <section className="cs-block" id={CASE_IDS.challenge}>
          <h4 className="cs-label">The Challenge</h4>
          <ul className="cs-challenge">
            <Cats cats={catsAt(flair, "challenge")} />
            {project.challenge.map((c) => (
              <li key={c.label} className="cs-challenge-item">
                <h5 className="cs-challenge-label">{c.label}</h5>
                <p className="cs-body">{c.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.landscape && (
        <section className="cs-block" id={CASE_IDS.landscape}>
          <h4 className="cs-label">The Landscape</h4>
          <p className="cs-body cs-body-wide">{project.landscape.intro}</p>

          <ul className="cs-competitors">
            {project.landscape.competitors.map((c) => (
              <li key={c} className="cs-competitor">
                {c}
              </li>
            ))}
          </ul>

          <p className="cs-takeaway">{project.landscape.takeaway}</p>
        </section>
      )}

      {project.approach && (
        <section className="cs-block" id={CASE_IDS.approach}>
          <h4 className="cs-label">The Approach</h4>
          <p className="cs-lede">{project.approach}</p>
        </section>
      )}

      {project.process && project.process.length > 0 && (
        <section className="cs-block" id={CASE_IDS.process}>
          <h4 className="cs-label">The Process</h4>
          <ol className="cs-process">
            {project.process.map((step, i) => (
              <li key={step.phase} className="cs-step">
                <span className="cs-step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="cs-step-text">
                  <h5 className="cs-step-phase">{step.phase}</h5>
                  <p className="cs-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/*
        The METHODOLOGY, deliberately sitting after The Process rather than
        before it. Its last phase ends on winning the competition, which only
        reads properly once the two rounds above have been described.
      */}
      {project.designApproach && project.designApproach.length > 0 && (
        <section className="cs-block cs-block-wide" id={CASE_IDS.designApproach}>
          <h4 className="cs-label">Design Approach</h4>
          <ol className="cs-phases">
            {project.designApproach.map((p, i) => (
              <li key={p.phase} className="cs-phase">
                <div className="cs-phase-rail" aria-hidden="true">
                  <span className="cs-phase-dot">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="cs-phase-body">
                  <h5 className="cs-phase-name">{p.phase}</h5>
                  <p className="cs-body">{p.body}</p>
                  {p.methods.length > 0 && (
                    <ul className="cs-methods">
                      {p.methods.map((m) => (
                        <li key={m} className="cs-method">
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {project.focusAreas && project.focusAreas.length > 0 && (
        <section className="cs-block" id={CASE_IDS.focus}>
          <h4 className="cs-label">Focus Areas</h4>
          <ul className="cs-focus">
            {project.focusAreas.map((f) => (
              <li key={f} className="cs-focus-item">
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* First supporting shot, breaking up the reading. */}
      {wide[0] && (
        <figure className="cs-shot">
          <Image
            src={wide[0].src}
            alt={wide[0].alt}
            width={1600}
            height={1200}
            sizes="(max-width: 700px) 92vw, 62rem"
            className="cs-shot-img"
          />
        </figure>
      )}

      {project.role.trim() && (
        <section className="cs-block" id={CASE_IDS.role}>
          <h4 className="cs-label">My Role</h4>
          <p className="cs-lede">{project.role}</p>
        </section>
      )}

      {/*
        ── THE TOOLS ────────────────────────────────────────────────────────
        For a product that is several connected tools rather than one screen.
        Each gets its number, its explanation and its own shots, so the set can
        be read as peers instead of as a sequence.
      */}
      {project.tools && project.tools.length > 0 && (
        <section className="cs-block cs-block-wide" id={CASE_IDS.tools}>
          <h4 className="cs-label">The Tools</h4>
          <ol className="cs-tools">
            {project.tools.map((t) => (
              <li key={t.name} className="cs-tool">
                <div className="cs-tool-head">
                  <span className="cs-tool-n" aria-hidden="true">
                    {t.n}
                  </span>
                  <h5 className="cs-tool-name">{t.name}</h5>
                </div>
                <p className="cs-body cs-tool-body">{t.body}</p>
                {t.shots && t.shots.length > 0 && (
                  <ul
                    className={
                      t.shots.length > 1
                        ? "cs-tool-shots cs-tool-shots-pair"
                        : "cs-tool-shots"
                    }
                  >
                    {t.shots.map((s) => (
                      <li key={s.src} className="cs-tool-shot">
                        <Image
                          src={s.src}
                          alt={s.alt}
                          width={2000}
                          height={1250}
                          sizes={
                            t.shots!.length > 1
                              ? "(max-width: 820px) 92vw, 30rem"
                              : "(max-width: 820px) 92vw, 62rem"
                          }
                          className="cs-shot-img"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/*
        ── THE AUDIT ────────────────────────────────────────────────────────
        A real <table> with a real <caption>: this is tabular data, and a grid
        of divs would read to a screen reader as an undifferentiated list of
        numbers with no idea which column any of them belong to.
      */}
      {project.audit && (
        <section className="cs-block cs-block-wide" id={CASE_IDS.audit}>
          <h4 className="cs-label">The Audit</h4>
          <p className="cs-lede">{project.audit.intro}</p>

          <div className="cs-table-scroll">
            <table className="cs-audit">
              <caption className="sr-only">
                Design system audit, before and after
              </caption>
              <thead>
                <tr>
                  <th scope="col">Measured</th>
                  <th scope="col">{project.audit.columns?.before ?? "Before"}</th>
                  <th scope="col">{project.audit.columns?.after ?? "After"}</th>
                </tr>
              </thead>
              <tbody>
                {project.audit.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    <td className="cs-audit-before">{r.before}</td>
                    <td className="cs-audit-after">{r.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {project.audit.note && <p className="cs-note">{project.audit.note}</p>}

          {project.audit.after?.map((para) => (
            <p key={para.slice(0, 40)} className="cs-body cs-body-wide">
              {para}
            </p>
          ))}
        </section>
      )}

      {project.reflections && project.reflections.length > 0 && (
        <section className="cs-block cs-block-wide" id={CASE_IDS.reflections}>
          <h4 className="cs-label">What I&rsquo;d Do Differently</h4>
          <ul className="cs-reflections">
            {project.reflections.map((r) => (
              <li key={r.title} className="cs-reflection">
                <h5 className="cs-reflection-title">{r.title}</h5>
                <p className="cs-body">{r.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/*
        ── UNDER THE HOOD ───────────────────────────────────────────────────
        Sits AFTER the audit and BEFORE the design system, because the audit
        ends on "so I rebuilt it in React" and this is what that turned out to
        involve. Moving it later breaks that hand-off.
      */}
      {project.engineering && project.engineering.length > 0 && (
        <section className="cs-block cs-block-wide" id={CASE_IDS.engineering}>
          <h4 className="cs-label">Under the Hood</h4>
          <ol className="cs-eng">
            {project.engineering.map((e, i) => (
              <li key={e.title} className="cs-eng-item">
                <span className="cs-eng-n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="cs-eng-text">
                  <h5 className="cs-eng-title">{e.title}</h5>
                  <p className="cs-body">{e.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/*
        ── THE DESIGN SYSTEM ────────────────────────────────────────────────
        The rules, as rules. The swatches are real elements rather than a
        picture of swatches — see the note on `designSystem` in portfolio.ts.
      */}
      {project.designSystem && (
        <section className="cs-block cs-block-wide" id={CASE_IDS.system}>
          <h4 className="cs-label">The Design System</h4>
          <p className="cs-lede">{project.designSystem.intro}</p>

          <ul className="cs-rules">
            {project.designSystem.rules.map((r) => (
              <li key={r.label} className="cs-rule">
                <h5 className="cs-rule-label">{r.label}</h5>
                <p className="cs-body">{r.body}</p>
              </li>
            ))}
          </ul>

          {project.designSystem.swatches &&
            project.designSystem.swatches.length > 0 && (
              <ul className="cs-swatches" aria-label="Type colour system">
                {project.designSystem.swatches.map((s) => (
                  <li
                    key={s.name}
                    className="cs-swatch"
                    style={
                      {
                        // The GRADIENT is the tile, because it is the surface
                        // the badge actually has to survive against in the
                        // product. A tile of the pale card tint would flatter
                        // the badge into looking more legible than it is.
                        backgroundImage: `linear-gradient(150deg, ${s.gradient[0]}, ${s.gradient[1]})`,
                      } as CSSProperties
                    }
                  >
                    {/* The badge carries the name, which is the whole rule
                        this section is describing — so the specimen works the
                        way the system does. */}
                    <span
                      className="cs-swatch-badge"
                      style={
                        {
                          background: s.badge,
                          color: pillInk(s.badge),
                        } as CSSProperties
                      }
                    >
                      {s.name}
                    </span>
                    <span className="cs-swatch-foot">
                      {/* The third role, as a bar rather than a third pill:
                          the card tint is a SURFACE in the product, and a
                          pill would imply it is another label. */}
                      <span
                        className="cs-swatch-card"
                        style={{ background: s.card } as CSSProperties}
                        aria-hidden="true"
                      />
                      <span className="cs-swatch-hex">
                        {s.badge.toUpperCase()}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

          {project.designSystem.note && (
            <p className="cs-note">{project.designSystem.note}</p>
          )}
        </section>
      )}

      {project.foundations && (
        <section className="cs-block cs-block-wide" id={CASE_IDS.foundations}>
          <h4 className="cs-label">Design Foundations</h4>
          <p className="cs-body cs-body-wide">{project.foundations}</p>
          {/*
            The palette as vertical columns — read from THIS project's data.
            The chips used to be four hard-coded labels reading live theme
            values, so every project announced Crustfolio's names.
          */}
          {project.palette && project.palette.length > 0 && (
            <ul className="cs-palette" aria-label="Colour palette">
              {project.palette.map((c) => (
                <li key={c.hex} className="cs-palette-col">
                  <span
                    className="cs-palette-chip"
                    style={{ background: c.hex } as CSSProperties}
                    aria-hidden="true"
                  />
                  <span className="cs-palette-name">{c.name}</span>
                  <span className="cs-palette-hex">{c.hex.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          )}

          {project.typography && (
            <div className="cs-type">
              <h5 className="cs-type-heading">Typography</h5>
              {/* Set in the project's OWN heading face, so the specimen shows
                  the type rather than naming it. */}
              <p className="cs-type-sample">{project.typography.sample}</p>
              <p className="cs-type-names">
                <span className="cs-type-family">{project.typography.headingName}</span>
                <span className="cs-type-sep" aria-hidden="true">/</span>
                <span className="cs-type-family">{project.typography.bodyName}</span>
              </p>
              <p className="cs-type-note">{project.typography.note}</p>
            </div>
          )}
        </section>
      )}

      {/*
        THE LOGO — the mark shown large beside what it means. Placed straight
        after Design Foundations so the brand system reads as one run: colour,
        type, then the mark those two were built around.
      */}
      {logo && (
        <section className="cs-block cs-logo-block" id={CASE_IDS.logo}>
          <h4 className="cs-label">The Logo</h4>
          <div className="cs-logo-row">
            <div className={`cs-logo-plate cs-logo-${logo.plate}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="cs-logo-large"
              />
            </div>
            <p className="cs-body cs-logo-note">{logo.rationale}</p>
          </div>
        </section>
      )}

      {!project.keyFeature && wide[1] && (
        <figure className="cs-shot">
          <Image
            src={wide[1].src}
            alt={wide[1].alt}
            width={1600}
            height={1200}
            sizes="(max-width: 700px) 92vw, 62rem"
            className="cs-shot-img"
          />
        </figure>
      )}

      {project.keyFeature && (
        <section className="cs-feature" id={CASE_IDS.feature}>
          <Cats cats={catsAt(flair, "feature")} />
          <div className="cs-feature-text">
            <h4 className="cs-label">Key Feature</h4>
            <h5 className="cs-feature-title">{project.keyFeature.title}</h5>
            <p className="cs-body">{project.keyFeature.body}</p>
          </div>
          {wide[1] && (
            <figure className="cs-feature-shot">
              <Image
                src={wide[1].src}
                alt={wide[1].alt}
                width={1600}
                height={1200}
                sizes="(max-width: 700px) 92vw, 30rem"
                className="cs-shot-img"
              />
            </figure>
          )}
        </section>
      )}

      {/*
        Whatever the sections above did not place. Consecutive PORTRAIT shots
        are paired into a two-column row — a phone screenshot at full width is
        most of a screen of height on its own, and two of them in a column turn
        the page into a scroll. Landscape shots keep the full width.
      */}
      {rest.length > 0 && (
        <div className="cs-flow">
          {rest.map((group, i) => (
            <ul
              key={group[0]?.src ?? i}
              className={group.length > 1 ? "cs-gallery cs-gallery-pair" : "cs-gallery"}
            >
              {group.map((shot) => (
                <li key={shot.src} className="cs-shot">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={1600}
                    height={shot.tall ? 2100 : 1200}
                    sizes={
                      group.length > 1
                        ? "(max-width: 700px) 92vw, 30rem"
                        : "(max-width: 700px) 92vw, 62rem"
                    }
                    className="cs-shot-img"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      )}

      {project.asides && project.asides.length > 0 && (
        <div className="cs-asides" id={CASE_IDS.asides}>
          {project.asides.map((a) => (
            <aside key={a.title} className="cs-aside">
              <h4 className="cs-aside-title">{a.title}</h4>
              <p className="cs-aside-body">{a.body}</p>
            </aside>
          ))}
        </div>
      )}

      {project.outcome && (
        <section className="cs-outcome" id={CASE_IDS.outcome}>
          <Cats cats={catsAt(flair, "outcome")} />
          <h4 className="cs-label">The Outcome</h4>
          <p className="cs-outcome-text">{project.outcome}</p>
        </section>
      )}

      {/* Only rendered where the content file actually carries these. */}
      {(hasTech || hasImpact) && (
        <dl className="cs-meta">
          {hasTech && (
            <div className="cs-meta-row">
              <dt>Built with</dt>
              <dd>{project.tech.join(" · ")}</dd>
            </div>
          )}
          {hasImpact && (
            <div className="cs-meta-row">
              <dt>Impact</dt>
              <dd>{project.impact}</dd>
            </div>
          )}
        </dl>
      )}

      {project.closing && (
        <section className="cs-closing" id={CASE_IDS.closing}>
          <h4 className="cs-closing-title">{project.closing.title}</h4>
          <p className="cs-closing-body">{project.closing.body}</p>
        </section>
      )}

      {/*
        Attribution and legal, LAST. A fan project's disclaimer belongs at the
        foot of the page where a footnote goes — putting it near the top reads
        as an apology for the work rather than as a statement about rights.
      */}
      {project.disclaimer && (
        <footer className="cs-disclaimer">
          <p>{project.disclaimer}</p>
        </footer>
      )}
    </article>
  );
}

export function ForgePage({
  open,
  onOpen,
}: {
  /** Which project's case study is showing, if any. Owned by SectionOverlay,
   *  which needs it too — the forge scene stops at a project's door. */
  open: string | null;
  onOpen: (title: string | null) => void;
}) {
  const list = ordered();
  const current = open ? (list.find((p) => p.title === open) ?? null) : null;

  const back = useCallback(() => onOpen(null), [onOpen]);

  if (current) return <CaseStudy project={current} onBack={back} />;

  return (
    <>
      <p className="section-intro">{FORGE.intro}</p>

      <ol className="quest-log">
        {list.map((p, i) => (
          <QuestRow key={p.title} project={p} index={i} onOpen={onOpen} />
        ))}
      </ol>
    </>
  );
}
