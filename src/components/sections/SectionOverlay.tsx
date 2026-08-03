"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { TRANSITION, type SectionMeta } from "@/config/sections";
import { ForgePage } from "./ForgePage";
import { GatePage } from "./GatePage";
import { SanctumPage } from "./SanctumPage";
import { OriginsPage } from "./OriginsPage";
import { ArmoryPage } from "./ArmoryPage";
import { gateVars } from "@/config/gate";
import { sanctumVars } from "@/config/sanctum";
import { originsVars } from "@/config/origins";
import { armoryVars } from "@/config/armory";
import { themeFor, themeVars } from "@/config/projectThemes";
import { AmbientBackdrop } from "../AmbientBackdrop";
import { SKY } from "@/config/ambient";
import { DriftField } from "../flair/DriftField";

/**
 * The page a scroll reveals.
 *
 * One shell — title, back control, scrolling body — with the section's own
 * content dropped inside it. Only The Forge is written; the other four get the
 * placeholder below, which is deliberately explicit about being unfinished
 * rather than pretending to be a real page with nothing on it.
 *
 * The overlay takes focus when it opens and returns it when it closes, and
 * Escape goes back — it covers the whole screen, so leaving the keyboard on the
 * map underneath would strand anyone not using a mouse.
 */

function ComingSoon({ section }: { section: SectionMeta }) {
  return (
    <div className="coming-soon">
      <p className="section-intro">
        {section.name} has not been charted yet.
      </p>
      {/* TODO: replace with the real section. Everything around this — the
          zoom, the scroll, the page shell, the back control — already works;
          only this block is a stub. */}
      <p className="coming-soon-note">
        This part of the realm is still being drawn. The Forge is open.
      </p>
    </div>
  );
}

export function SectionOverlay({
  section,
  visible,
  onBack,
  onTravel,
}: {
  section: SectionMeta;
  /** True once the scroll has passed over and the page should be readable. */
  visible: boolean;
  onBack: () => void;
  /** Leave for another island. Used by THE SANCTUM's call to action. */
  onTravel: (sectionId: string) => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  /** The scrolling element the ambient parallax reads from. */
  const scrollRef = useRef<HTMLElement>(null);
  /**
   * Which project's case study is open, if any.
   *
   * Owned here rather than inside ForgePage because the PAGE needs it too: a
   * case study wears its own project's colours and type, and the island's
   * ambient scene stops at that door.
   */
  const [openProject, setOpenProject] = useState<string | null>(null);
  const theme = openProject ? themeFor(openProject) : null;

  /**
   * ── THE SHARED SCROLLPORT ────────────────────────────────────────────────
   * The quest log and the case study are the same scrolling element with
   * different content in it, so `scrollTop` SURVIVES the swap. Open a project
   * from a row halfway down the log and the case study opens halfway down —
   * past its own masthead, award badge and certificate.
   *
   * So: a case study always opens at its top, and Back returns the log to the
   * row it was opened from rather than dumping the reader at the top of a list
   * they had already scrolled through.
   */
  const listScroll = useRef(0);

  const openCase = useCallback((title: string | null) => {
    // Read BEFORE the swap — after it, this element belongs to the other view.
    if (title && scrollRef.current) listScroll.current = scrollRef.current.scrollTop;
    setOpenProject(title);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: openProject ? 0 : listScroll.current });
  }, [openProject]);

  // Move focus onto the page when it is revealed, so the keyboard follows the
  // eye. Without this, tabbing would still be walking the map behind it.
  useEffect(() => {
    if (visible) headingRef.current?.focus();
  }, [visible]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  return (
    <section
      ref={scrollRef}
      className="section-page"
      data-project={openProject ?? undefined}
      data-page={section.built ? section.id : undefined}
      /* Carries config/ambient.ts's SKY through to the stylesheet, so the text
         treatment flips with the scene instead of being set twice. */
      data-sky={SKY}
      aria-label={section.name}
      style={
        {
          opacity: visible ? 1 : 0,
          transitionDuration: `${TRANSITION.pageFadeMs}ms`,
          pointerEvents: visible ? "auto" : "none",
          ...(theme ? themeVars(theme) : null),
          // The Gate's icy palette, by the same mechanism — so the section
          // header's title and back button read from config too, rather than
          // keeping a second hard-coded copy in the stylesheet.
          ...(section.id === "contact" && section.built ? gateVars() : null),
          ...(section.id === "home" && section.built ? sanctumVars() : null),
          ...(section.id === "about" && section.built ? originsVars() : null),
          ...(section.id === "skills" && section.built ? armoryVars() : null),
        } as CSSProperties
      }
    >
      {/*
        The backdrop goes in FIRST and is pinned below the content's stacking
        level, so it can never paint over a word or take a click.
      */}
      {!openProject && (
        <AmbientBackdrop sectionId={section.id} scrollRef={scrollRef} />
      )}

      {/* A project's own weather, if it has any. Behind the content. */}
      {openProject && <DriftField project={openProject} />}

      <div className="section-inner">
        {!openProject && (
        <header className="section-head">
          <button type="button" className="section-back font-hylia" onClick={onBack}>
            <span aria-hidden="true">←</span> Back to map
          </button>

          <h1 className="section-title font-hylia" ref={headingRef} tabIndex={-1}>
            {section.name}
          </h1>
          <p className="section-sub">{section.subtitle}</p>
          <span className="section-rule" aria-hidden="true" />
        </header>
        )}

        {section.built && section.id === "projects" ? (
          <ForgePage open={openProject} onOpen={openCase} />
        ) : section.built && section.id === "contact" ? (
          <GatePage />
        ) : section.built && section.id === "home" ? (
          <SanctumPage onTravel={onTravel} />
        ) : section.built && section.id === "about" ? (
          <OriginsPage />
        ) : section.built && section.id === "skills" ? (
          <ArmoryPage />
        ) : (
          <ComingSoon section={section} />
        )}
      </div>
    </section>
  );
}
