"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { AmbientEffect } from "@/components/layout/AmbientEffect";
import { WinterAtmosphere } from "@/components/layout/WinterAtmosphere";
import { getIslandTheme } from "@/config/islandThemes";
import { getProject } from "@/config/projects";
import { useSelection } from "@/hooks/selectionContext";

/**
 * One island's landing page. There is a single component for all five worlds —
 * everything that makes them look different comes from ISLAND_THEMES
 * (config/islandThemes.ts), handed to CSS as custom properties on the root, so
 * theming a new island never means touching this file.
 *
 * Case-study copy still comes from config/projects.ts; it renders here instead
 * of in the old panel.
 *
 * Mounted for the wipe · page · unwipe phases, so it is always revealed and
 * covered again behind a fully-drawn curtain — it never pops in.
 */
export function IslandLanding() {
  const { selectedId, phase, requestBack } = useSelection();
  const theme = getIslandTheme(selectedId);
  const project = getProject(selectedId);

  const mounted = phase === "wipe" || phase === "page" || phase === "unwipe";
  const interactive = phase === "page";

  // Esc goes back, like any other full-screen view.
  useEffect(() => {
    if (!interactive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interactive, requestBack]);

  if (!mounted || !theme) return null;

  const palette = {
    "--landing-bg": theme.palette.bg,
    "--landing-hero-glow": theme.palette.heroGlow,
    "--landing-accent": theme.palette.accent,
    "--landing-text": theme.palette.text,
    "--landing-muted": theme.palette.muted,
    "--landing-panel": theme.palette.panel,
  } as CSSProperties;

  return (
    <div
      className="landing"
      style={palette}
      data-effect={theme.effect}
      aria-hidden={!interactive}
    >
      {/* Layered back to front: scenery silhouettes, then particles, then the
          content itself (see the layering block in globals.css). */}
      {theme.scenery === "winter" && <WinterAtmosphere />}
      <AmbientEffect effect={theme.effect} />

      <button
        type="button"
        className="landing-back"
        onClick={requestBack}
        tabIndex={interactive ? 0 : -1}
      >
        <span aria-hidden="true">←</span> Back to the map
      </button>

      <header className="landing-hero">
        <p className="landing-eyebrow">{theme.mood}</p>
        <h1 className="font-hylia landing-title">{theme.heroTitle}</h1>
        <p className="landing-subtitle">{theme.heroSubtitle}</p>

        {!theme.themed && (
          <p className="landing-todo">
            Theme in progress — this island still wears the default palette.
          </p>
        )}

        <div className="landing-cue" aria-hidden="true">
          <span className="landing-cue-line" />
          <span className="landing-cue-text">Read on</span>
        </div>
      </header>

      <main className="landing-body">
        <section className="landing-section">
          <h2 className="landing-heading">About this island</h2>
          <p className="landing-lede">
            PLACEHOLDER — a paragraph or two on what this world represents and
            why it earned a place on the map. Two or three sentences is plenty;
            the work below carries the detail.
          </p>
        </section>

        {project && (
          <section className="landing-section">
            <h2 className="landing-heading">The work</h2>
            <article className="landing-card">
              <h3 className="font-hylia landing-card-title">{project.title}</h3>

              <div className="landing-field">
                <h4 className="landing-field-label">Problem</h4>
                <p className="landing-field-body">{project.problem}</p>
              </div>
              <div className="landing-field">
                <h4 className="landing-field-label">Role</h4>
                <p className="landing-field-body">{project.role}</p>
              </div>
              <div className="landing-field">
                <h4 className="landing-field-label">Process</h4>
                <p className="landing-field-body">{project.process}</p>
              </div>
              <div className="landing-field">
                <h4 className="landing-field-label">Impact</h4>
                <p className="landing-field-body">{project.impact}</p>
              </div>

              {project.links && project.links.length > 0 && (
                <div className="landing-links">
                  {project.links.map((link) => (
                    <a
                      key={link.url + link.label}
                      className="landing-link"
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      tabIndex={interactive ? 0 : -1}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {project.confidential && (
                <p className="landing-nda">
                  Confidential (NDA) — described rather than shown.
                </p>
              )}
            </article>
          </section>
        )}

        <section className="landing-section">
          <h2 className="landing-heading">Field notes</h2>
          <div className="landing-grid">
            {["PLACEHOLDER note", "PLACEHOLDER note", "PLACEHOLDER note"].map(
              (note, i) => (
                <article key={i} className="landing-note">
                  <h3 className="landing-note-title">{note}</h3>
                  <p className="landing-note-body">
                    PLACEHOLDER — a short observation, experiment, or thing
                    learned on this island. Swap these for real notes, or drop
                    the whole section.
                  </p>
                </article>
              ),
            )}
          </div>
        </section>

        <footer className="landing-footer">
          <button
            type="button"
            className="landing-return"
            onClick={requestBack}
            tabIndex={interactive ? 0 : -1}
          >
            Return to the map
          </button>
        </footer>
      </main>
    </div>
  );
}
