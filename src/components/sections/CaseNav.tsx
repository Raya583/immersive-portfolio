"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/content/portfolio";
import { sectionsFor } from "@/config/caseSections";

/**
 * The sticky glass header on a case-study page.
 *
 * ── IT SCROLLS INSIDE SOMETHING ────────────────────────────────────────────
 * The page is NOT the window. `.section-page` is `position: fixed` with its
 * own `overflow-y: auto`, so it is the scrollport — which changes three
 * things, and getting any of them wrong is the usual way a header like this
 * half-works:
 *
 *   1. `position: sticky` sticks to the nearest scrollport, so the header has
 *      to live INSIDE `.section-page`. It does; it is rendered within the
 *      case-study article.
 *   2. Scroll events come from that element, not from `window`. A listener on
 *      `window` would simply never fire here.
 *   3. Scrolling to a section means moving that element's `scrollTop`, not
 *      calling `window.scrollTo`.
 *
 * The scroller is found with `closest()` rather than passed down through
 * ForgePage — the header is the only thing that needs it, and threading a ref
 * through two components to reach one `addEventListener` is a worse trade.
 *
 * ── SCROLL-SPY ─────────────────────────────────────────────────────────────
 * Measured directly rather than with an IntersectionObserver. The sections
 * here are wildly uneven — a one-line Brief and a five-phase Design Approach —
 * so the "which one is intersecting" question has several defensible answers
 * and IO gives whichever its rootMargin happens to favour. Reading positions
 * and taking the last section whose top has passed under the header is exactly
 * the rule a reader would describe, and it is deterministic enough to assert
 * on in a test.
 */

/** Distance below the header where a section counts as "current". */
const SPY_OFFSET = 28;

export function CaseNav({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const tabs = sectionsFor(project);
  const navRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  /** Past the masthead — the glass gets a touch more opaque once it overlaps. */
  const [lifted, setLifted] = useState(false);
  /** Does the tab row need to scroll? Drives the edge fade. */
  const [overflowing, setOverflowing] = useState(false);

  /** The scrollport this page lives in. */
  const scroller = useCallback(
    () => navRef.current?.closest(".section-page") as HTMLElement | null,
    [],
  );

  useEffect(() => {
    const root = scroller();
    const nav = navRef.current;
    if (!root || !nav) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rootTop = root.getBoundingClientRect().top;
      const cut = nav.getBoundingClientRect().bottom - rootTop + SPY_OFFSET;

      let current = tabs[0]?.id ?? "";
      for (const t of tabs) {
        const el = document.getElementById(t.id);
        if (!el) continue;
        // Position within the scrollport, independent of where it is scrolled.
        const top = el.getBoundingClientRect().top - rootTop;
        if (top <= cut) current = t.id;
        else break;
      }

      /*
       * The bottom of the page can never satisfy the rule above for the last
       * couple of sections — once the scroll bottoms out, nothing new passes
       * under the header. Without this, "Outcome" is unreachable as an active
       * tab on every project.
       */
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4) {
        const last = tabs[tabs.length - 1];
        if (last) current = last.id;
      }

      setActive(current);
      setLifted(root.scrollTop > 8);
      const row = tabsRef.current;
      if (row) setOverflowing(row.scrollWidth > row.clientWidth + 1);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // Re-measure when the project changes: different page, different sections.
  }, [scroller, project.title, tabs]);

  /** Keep the active tab in view when the tab row is scrolled horizontally. */
  useEffect(() => {
    const row = tabsRef.current;
    const el = row?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!row || !el) return;
    const r = el.getBoundingClientRect();
    const rr = row.getBoundingClientRect();
    if (r.left < rr.left + 8 || r.right > rr.right - 8) {
      row.scrollTo({
        left: el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [active]);

  const go = useCallback(
    (id: string) => {
      const root = scroller();
      const el = document.getElementById(id);
      const nav = navRef.current;
      if (!root || !el) return;

      const headerH = nav ? nav.getBoundingClientRect().height : 0;
      // Where the element sits in the scrollport's coordinate space.
      const top =
        root.scrollTop +
        el.getBoundingClientRect().top -
        root.getBoundingClientRect().top -
        headerH -
        16;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.scrollTo({
        top: Math.max(top, 0),
        behavior: reduced ? "auto" : "smooth",
      });
      setActive(id);
    },
    [scroller],
  );

  return (
    <header ref={navRef} className="cs-nav" data-lifted={lifted || undefined}>
      <div className="cs-nav-bar">
        <button type="button" className="cs-nav-back" onClick={onBack}>
          <span aria-hidden="true">←</span>
          <span className="cs-nav-back-text">The Forge</span>
        </button>

        {/*
          No logo and no project name here. Both were redundant — the masthead
          and the browser title already name the project, and the mark is a
          wordmark that said it a second time. The width goes to the tabs.
        */}
        <nav className="cs-nav-tabs" aria-label="Sections of this case study">
          <ul
            ref={tabsRef}
            className="cs-nav-list"
            /* The edge fade is only correct when the row actually scrolls;
               applied unconditionally it dims the first and last tab of a row
               that fits perfectly well. */
            data-overflow={overflowing || undefined}
          >
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  data-tab={t.id}
                  className="cs-nav-tab"
                  aria-current={active === t.id ? "true" : undefined}
                  onClick={() => go(t.id)}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
