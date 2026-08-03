"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Cosmos } from "@/components/Cosmos";
import { MapStage } from "@/components/MapStage";
import { ScrollWipe } from "@/components/ScrollWipe";
import { SectionOverlay } from "@/components/sections/SectionOverlay";
import { MAP_TIMING } from "@/config/islands";
import { TRANSITION, sectionById } from "@/config/sections";

/**
 * ── NARRATION SCRIPT ───────────────────────────────────────────────────────
 * The full opening, all five beats. Only the first three are wired into the
 * flow today — see LAST_PLAYABLE_INDEX below.
 *
 * Every character of all five lines is covered by Hylia Serif (a Latin-only
 * face mapping ~107 codepoints, so new lines are worth a glance — the
 * apostrophe in line 5 is present, as is basic punctuation).
 *
 * Not exported: a Next App Router page may only export `default`, `metadata`
 * and a fixed set of route options — exporting anything else fails the build.
 * If a later step needs these elsewhere, lift them into src/config/.
 */
const NARRATION_LINES = [
  "EVERY REALM BEGINS IN SILENCE.",
  "THEN, A LIGHT.",
  "FROM IT, A WORLD IS BORN.",
  "FIVE LANDS AWAIT THE TRAVELER.",
  "WELCOME TO YASH'S REALM.",
] as const;

/**
 * ── NARRATION TUNING ───────────────────────────────────────────────────────
 *   uppercase     — force caps. Hylia Serif draws lowercase as small caps, so
 *                   with this off a line comes out unevenly sized; on, every
 *                   letter is full height and the line reads as monumental.
 *   letterSpacing — tracking between the caps. Generous on purpose: caps need
 *                   far more air than lowercase. In em, so it scales with the
 *                   font size instead of breaking at small widths.
 *   typeSpeedMs   — milliseconds PER CHARACTER. Higher is slower and calmer.
 *   startDelayMs  — beat of pure black before the FIRST letter lands. Only the
 *                   opening line waits; later lines follow their fade.
 *   fadeInMs      — how long the opening line takes to rise out of the dark.
 *   returnInMs    — quicker fade back in for later lines, so it doesn't lag
 *                   behind the typing that follows it.
 *   fadeOutMs     — the current line dissolving once you advance.
 *   cueDelayMs    — pause after a line completes before the cue appears, so
 *                   the sentence gets a moment to land on its own.
 *   cueText       — what the cue says. Caps to match the narration.
 */
const NARRATION = {
  uppercase: true,
  letterSpacing: "0.2em",
  typeSpeedMs: 105,
  startDelayMs: 1200,
  fadeInMs: 2000,
  returnInMs: 320,
  fadeOutMs: 900,
  cueDelayMs: 650,
  cueText: "PRESS ENTER",
} as const;

/**
 * ── BANG PACING ────────────────────────────────────────────────────────────
 * How long the cinematic HOLDS for the detonation before line 3 starts typing.
 * What the bang actually looks like — flash, shockwave, streaks, nebula and
 * stars — is all in config/cosmos.ts.
 *
 *   bloomMs   — the shock's span, matched to the canvas animation.
 *   settleMs  — quiet afterwards, so the new sky gets a moment on its own.
 */
const BURST = {
  bloomMs: 1200,
  settleMs: 550,
} as const;

/**
 * How far the flow currently runs, and where the burst fires.
 *
 * Each advance can carry a transition with it:
 *   from line 2 → the burst, and the starfield
 *   from line 3 → the slow dissolve into the ocean
 *   from line 4 → the five lands rising
 *
 * Line 5 is the end: once it has typed, the cinematic is over and the map is
 * interactive. Timings for the last two live in config/islands.ts.
 */
const LAST_PLAYABLE_INDEX = 4;
const BURST_AFTER_INDEX = 1;
const OCEAN_AFTER_INDEX = 2;
const ISLANDS_AFTER_INDEX = 3;

/**
 * "typing" · "ready" (cue shown) · "fading" · "bursting" (the bang) ·
 * "changing" (the world shifting under the text — ocean, or islands rising)
 */
type Phase = "typing" | "ready" | "fading" | "bursting" | "changing";

/**
 * ── OPENING A SECTION ──────────────────────────────────────────────────────
 * The whole journey from clicking an island to reading its page, and back.
 * Timings are in config/sections.ts.
 *
 *   map            the map, interactive
 *   zoom-in        pushing in toward the island you clicked
 *   wipe-in-open   the scroll unrolls sideways over the screen
 *   wipe-in-hold   held wide — the loading beat; the page mounts behind it
 *   wipe-in-close  collapses top and bottom, revealing the page
 *   page           reading
 *   wipe-out-*     the same in reverse, on the opposite axis, back to the map
 *
 * Every step is a timer, and every timer is cleared on unmount by the same
 * `timers` ref the narration uses.
 */
type MapPhase =
  | "map"
  | "zoom-in"
  | "wipe-in-open"
  | "wipe-in-hold"
  | "wipe-in-close"
  | "page"
  | "wipe-out-open"
  | "wipe-out-hold"
  | "wipe-out-close";

function format(line: string): string {
  return NARRATION.uppercase ? line.toUpperCase() : line;
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  /** Bumped to finish the current line immediately. */
  const [skip, setSkip] = useState(0);
  /** The cosmos, from the bang until the ocean has finished taking its place. */
  const [starsOut, setStarsOut] = useState(false);
  /** Set once the cross-fade is over, to unmount the starfield for good. */
  const [starsGone, setStarsGone] = useState(false);
  /** Bumped once to detonate. The canvas watches this. */
  const [bang, setBang] = useState(0);
  /** The ocean, and then the lands. Both latch on — neither ever goes back. */
  const [oceanOut, setOceanOut] = useState(false);
  const [islandsOut, setIslandsOut] = useState(false);
  /**
   * The narration leaving the finished map: "showing" while the last line is
   * still being read, "fading" for the dissolve, then "gone" and unmounted.
   */
  const [outro, setOutro] = useState<"showing" | "fading" | "gone">("showing");
  /**
   * Whether the opening is still running. Skipping sets this to "done", and it
   * is a HARD stop: the typewriter and the outro both bail out on it, so no
   * timer that was already in flight can put the narration back on screen
   * after the map has arrived.
   */
  const [cinematic, setCinematic] = useState<"playing" | "done">("playing");
  /** Which island is being opened, and how far along that journey we are. */
  const [selected, setSelected] = useState<string | null>(null);
  const [mapPhase, setMapPhase] = useState<MapPhase>("map");

  /** Tracks which skip we have already applied, so a new line types normally. */
  const skipRef = useRef(0);
  /**
   * The last index we have already advanced away from.
   *
   * This is a ref, not state, because it has to latch SYNCHRONOUSLY: a single
   * gesture can reach `advance` more than once within one render, and every one
   * of those calls sees the same `phase` and `index` from the same closure. A
   * state guard cannot help — it has not re-rendered yet. See `advance`.
   */
  const advancedFrom = useRef(-1);
  const timers = useRef<number[]>([]);
  const schedule = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /**
   * Cancels every beat still waiting to fire. `splice` empties the array IN
   * PLACE rather than replacing it, because the unmount cleanup below captured
   * this exact array object at mount — hand it a new one and that cleanup would
   * be left clearing a list nothing writes to any more.
   */
  const clearTimers = useCallback(() => {
    timers.current.splice(0).forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  // Types the current line. Re-runs whenever the index changes, so each new
  // beat gets a clean pass — and tears its timers down if you leave mid-line.
  useEffect(() => {
    // Skipped: nothing left to type, and re-running this would set `phase`
    // back to "typing" and start the closing line over the finished map.
    if (cinematic === "done") return;

    const line = format(NARRATION_LINES[index] ?? "");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // A skip lands the line instantly and goes straight to the cue.
    if (skipRef.current !== skip) {
      skipRef.current = skip;
      setShown(line);
      const cue = window.setTimeout(() => setPhase("ready"), 180);
      return () => window.clearTimeout(cue);
    }

    setShown("");
    setPhase("typing");

    // Anyone who asked for less motion gets the finished line, not a machine
    // typing at them — but still gets the cue, so they can still advance.
    if (reduced) {
      setShown(line);
      const cue = window.setTimeout(() => setPhase("ready"), NARRATION.cueDelayMs);
      return () => window.clearTimeout(cue);
    }

    let typer: number | undefined;
    let cue: number | undefined;

    // Only the opening line waits on the void; later ones follow their fade.
    const start = window.setTimeout(
      () => {
        let position = 0;
        typer = window.setInterval(() => {
          position += 1;
          setShown(line.slice(0, position));
          if (position >= line.length) {
            if (typer) window.clearInterval(typer);
            cue = window.setTimeout(
              () => setPhase("ready"),
              NARRATION.cueDelayMs,
            );
          }
        }, NARRATION.typeSpeedMs);
      },
      index === 0 ? NARRATION.startDelayMs : 0,
    );

    return () => {
      window.clearTimeout(start);
      if (typer) window.clearInterval(typer);
      if (cue) window.clearTimeout(cue);
    };
  }, [index, skip, cinematic]);

  /**
   * Advance a beat: dissolve the current line, then either detonate or hand
   * straight over to the next line.
   *
   * Guarded on "ready", so a second click mid-transition can't skip a beat,
   * and on the last playable index, so the end of the wired flow holds.
   *
   * ── ONE BEAT PER CLICK ────────────────────────────────────────────────────
   * The phase guard alone is NOT enough, and this is worth understanding before
   * touching it. A click on the cue button runs this twice: once from the
   * button's own handler, and once more as the very same event bubbles up to
   * <main>. Both calls belong to one render, so both read `phase === "ready"`
   * and the same `index` — React has not re-rendered in between — and both pass
   * the guard and schedule the beat.
   *
   * Because each beat ends in `setIndex(current => current + 1)`, two of them
   * move the index by TWO: a line is skipped, and so is the transition attached
   * to it. That is what broke the cinematic — clicking the cue at line 1 landed
   * on line 3 without ever firing the burst, so the starfield never appeared;
   * clicking it at line 3 landed on line 5 with the islands never raised.
   *
   * So the latch is a ref, set synchronously here. The second call in the same
   * gesture sees it immediately and returns.
   */
  const advance = useCallback(() => {
    // Clicking while a line is still typing SKIPS to the end of it rather than
    // doing nothing. Swallowing eager clicks silently is the single easiest way
    // to make this feel broken — you press, nothing happens, and you conclude
    // the cinematic is stuck.
    if (phase === "typing") {
      setSkip((n) => n + 1);
      return;
    }
    if (phase !== "ready" || index >= LAST_PLAYABLE_INDEX) return;
    if (advancedFrom.current === index) return;
    advancedFrom.current = index;

    setPhase("fading");
    schedule(() => {
      if (index === BURST_AFTER_INDEX) {
        setPhase("bursting");
        setStarsOut(true);
        setBang((n) => n + 1);
        schedule(
          () => setIndex((current) => current + 1),
          BURST.bloomMs + BURST.settleMs,
        );
        return;
      }

      if (index === OCEAN_AFTER_INDEX) {
        // The void becomes a world. Line 4 starts partway through the dissolve
        // so the screen is never just sitting there mid-fade.
        setPhase("changing");
        setOceanOut(true);
        // Once the dissolve is done the cosmos has nothing left to show, so it
        // comes out of the tree entirely — canvas, listeners, and the several
        // full-screen offscreen buffers the sky was painted into. It must not
        // linger over the map beats.
        schedule(() => setStarsGone(true), MAP_TIMING.crossFadeMs + 60);
        schedule(
          () => setIndex((current) => current + 1),
          MAP_TIMING.textDelayMs,
        );
        return;
      }

      if (index === ISLANDS_AFTER_INDEX) {
        // The lands climb into place; line 5 lands while they are still
        // settling, so the two beats overlap instead of queueing.
        setPhase("changing");
        setIslandsOut(true);
        schedule(
          () => setIndex((current) => current + 1),
          MAP_TIMING.line5DelayMs,
        );
        return;
      }

      setIndex((current) => current + 1);
    }, NARRATION.fadeOutMs);
  }, [phase, index, schedule]);

  /**
   * ── SKIP ──────────────────────────────────────────────────────────────────
   * Straight to the finished map, from wherever the opening happens to be.
   *
   * Cancelling the pending timers FIRST is the whole job. Half a cinematic is
   * always in flight — a line waiting to advance, the starfield waiting to
   * unmount, the narration waiting to fade — and every one of those callbacks
   * would land seconds later on top of the map, putting text back on screen or
   * tearing down a layer that is now permanent. Skipping is not just setting
   * the end state; it is making sure nothing is still on its way to the old one.
   */
  const skipIntro = useCallback(() => {
    clearTimers();
    setCinematic("done");

    // The end state, all at once.
    setStarsOut(true);   // gates the map's existence
    setStarsGone(true);  // ...but the cosmos itself never mounts
    setOceanOut(true);
    setIslandsOut(true);
    setOutro("gone");    // narration and cue unmounted
    setIndex(LAST_PLAYABLE_INDEX);
    setPhase("ready");
    // Nothing further can advance a beat.
    advancedFrom.current = LAST_PLAYABLE_INDEX;
  }, [clearTimers]);

  /**
   * Clicking an island. Runs the full sequence in one place rather than
   * scattering it across effects, so the order is readable top to bottom.
   */
  const openSection = useCallback(
    (id: string) => {
      if (mapPhase !== "map") return;
      setSelected(id);
      setMapPhase("zoom-in");
      schedule(() => setMapPhase("wipe-in-open"), TRANSITION.zoomMs);
      schedule(
        () => setMapPhase("wipe-in-hold"),
        TRANSITION.zoomMs + TRANSITION.openMs,
      );
      schedule(
        () => setMapPhase("wipe-in-close"),
        TRANSITION.zoomMs + TRANSITION.openMs + TRANSITION.holdMs,
      );
      schedule(
        () => setMapPhase("page"),
        TRANSITION.zoomMs +
          TRANSITION.openMs +
          TRANSITION.holdMs +
          TRANSITION.closeMs,
      );
    },
    [mapPhase, schedule],
  );

  /*
   * ── TRAVELLING BETWEEN ISLANDS ───────────────────────────────────────────
   * THE SANCTUM's call to action goes straight to THE FORGE, which means
   * closing one island and opening another as one gesture.
   *
   * `openSection` guards on `mapPhase === "map"`, and the copy captured when
   * `closeSection` was created still says "page" — so it cannot simply be
   * called from inside the closing timeout. This ref always holds the freshest
   * one, and the open is scheduled a beat after the map is uncovered so that
   * guard is satisfied by the state that has actually committed.
   */
  const openRef = useRef(openSection);
  useEffect(() => {
    openRef.current = openSection;
  }, [openSection]);
  const pendingTravel = useRef<string | null>(null);

  /** Back to the map — the same sequence on the other axis. */
  const closeSection = useCallback(() => {
    if (mapPhase !== "page") return;
    setMapPhase("wipe-out-open");
    schedule(() => setMapPhase("wipe-out-hold"), TRANSITION.openMs);
    schedule(
      () => setMapPhase("wipe-out-close"),
      TRANSITION.openMs + TRANSITION.holdMs,
    );
    schedule(() => {
      // The map is uncovered again only now, so the zoom-out lands behind the
      // closing scroll rather than being visible through it.
      setMapPhase("map");
      setSelected(null);

      const next = pendingTravel.current;
      if (next) {
        pendingTravel.current = null;
        // A short beat so the map is genuinely on screen between the two
        // wipes; back-to-back they read as one long stutter.
        schedule(() => openRef.current(next), TRANSITION.travelPauseMs);
      }
    }, TRANSITION.openMs + TRANSITION.holdMs + TRANSITION.closeMs);
  }, [mapPhase, schedule]);

  /** Leave this island and open another one, wipes and all. */
  const travelTo = useCallback(
    (id: string) => {
      if (mapPhase !== "page") return;
      pendingTravel.current = id;
      closeSection();
    },
    [mapPhase, closeSection],
  );

  // Enter works wherever focus happens to be.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  /**
   * The cinematic bows out. Once the closing line has finished typing it holds
   * for a beat, dissolves, and unmounts — leaving a clean map with nothing on
   * it but the islands, their names, and the sea.
   *
   * The trigger is the last line reaching "ready", not the islands finishing
   * their rise: the lands settle around 1.9s after they start, while line 5 is
   * still being written and does not finish until roughly 3.5s. Hanging the
   * fade off the islands would rub the sentence out mid-word.
   */
  useEffect(() => {
    // Already gone — without this the skip would satisfy the condition below
    // and set `outro` back to "fading", remounting the line it just removed.
    if (cinematic === "done") return;
    if (index !== LAST_PLAYABLE_INDEX || phase !== "ready") return;
    const hold = window.setTimeout(
      () => setOutro("fading"),
      MAP_TIMING.outroHoldMs,
    );
    return () => window.clearTimeout(hold);
  }, [index, phase, cinematic]);

  useEffect(() => {
    if (outro !== "fading") return;
    const done = window.setTimeout(
      () => setOutro("gone"),
      MAP_TIMING.outroFadeMs,
    );
    return () => window.clearTimeout(done);
  }, [outro]);

  // The line stays down through every transition as well as the fade —
  // otherwise the OLD text would snap back to full opacity behind the flash.
  const hidden =
    phase === "fading" || phase === "bursting" || phase === "changing";
  const canAdvance = phase === "ready" && index < LAST_PLAYABLE_INDEX;

  /**
   * The skip is offered for the whole opening and retires the moment the lands
   * arrive — by then there is nothing left to skip, and it would only sit on
   * the finished map competing with the islands.
   */
  const showSkip = cinematic === "playing" && !islandsOut;

  const section = sectionById(selected);
  /** The page exists from the hold onward — including all the way back out. */
  const pageMounted = mapPhase !== "zoom-in" && mapPhase !== "wipe-in-open";

  /**
   * How the scroll should look right now. `null` while zooming and while the
   * page is simply being read — the curtain is only in the tree when it has
   * something to do.
   */
  const wipe: {
    axis: "horizontal" | "vertical";
    state: "open" | "closed";
    ms: number;
    showTitle: boolean;
  } | null =
    mapPhase === "wipe-in-open"
      ? { axis: "horizontal", state: "open", ms: TRANSITION.openMs, showTitle: false }
      : mapPhase === "wipe-in-hold"
        ? { axis: "horizontal", state: "open", ms: 0, showTitle: true }
        : mapPhase === "wipe-in-close"
          ? { axis: "vertical", state: "closed", ms: TRANSITION.closeMs, showTitle: false }
          : mapPhase === "wipe-out-open"
            ? { axis: "vertical", state: "open", ms: TRANSITION.openMs, showTitle: false }
            : mapPhase === "wipe-out-hold"
              ? { axis: "vertical", state: "open", ms: 0, showTitle: true }
              : mapPhase === "wipe-out-close"
                ? { axis: "horizontal", state: "closed", ms: TRANSITION.closeMs, showTitle: false }
                : null;

  return (
    <main
      onClick={advance}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-black px-6"
    >
      {/*
        Deep space, then the sea over it, then the lands on that. Layer order is
        set explicitly in globals.css rather than left to DOM order, so neither
        of these can ever end up painting over the other by accident.

        The starfield belongs to the star beats only: it stops animating the
        moment the ocean starts arriving, and leaves the tree once the
        cross-fade has finished.
      */}
      {starsOut && !starsGone && (
        <div
          className="starfield-holder"
          style={{
            opacity: oceanOut ? 0 : 1,
            transitionDuration: `${MAP_TIMING.crossFadeMs}ms`,
          }}
        >
          <Cosmos visible={!oceanOut} bang={bang} />
        </div>
      )}

      {/*
        Mounted at the bang, a good ten seconds before the dissolve needs it, so
        the ocean is fetched and decoded by the time it has to fade in — a
        cross-fade to an image that is still downloading is just a black screen.
      */}
      {starsOut && (
        <MapStage
          /*
           * Keyed on the cinematic so a SKIP remounts the whole map. Every
           * entrance in here — the ocean cross-fade, the islands' staggered
           * rise, the labels, the clouds and the fleet fading up — is a CSS
           * transition from a previous value, and a fresh mount simply has no
           * previous value to move from. So the map appears already finished,
           * with no animation to sit through, and without threading an
           * "instant" flag down through four components to suppress each one.
           * Playing through never changes this key, so it never remounts.
           */
          key={cinematic}
          oceanVisible={oceanOut}
          islandsVisible={islandsOut && mapPhase === "map"}
          onSelect={openSection}
          focusId={selected}
          zoomed={mapPhase !== "map"}
        />
      )}

      {/*
        The scroll and the page it reveals. Both are DOM overlays over the map
        rather than a route change: the map keeps its state — the cinematic has
        already played, the islands are up — so coming back is instant and does
        not replay anything.
      */}
      {section && mapPhase !== "map" && (
        <>
          {/* Page mounts at the HOLD, behind the parchment, so it is fully
              laid out and painted by the time the scroll uncovers it. */}
          {pageMounted && (
            <SectionOverlay
              section={section}
              visible={mapPhase === "page"}
              onBack={closeSection}
              onTravel={travelTo}
            />
          )}

          {wipe && (
            <ScrollWipe
              axis={wipe.axis}
              state={wipe.state}
              durationMs={wipe.ms}
              title={section.name}
              showTitle={wipe.showTitle}
            />
          )}
        </>
      )}

      {/*
        The line is read out whole to assistive tech; the animated copy is
        hidden from it, so a screen reader isn't fed one letter at a time.
      */}
      <p className="sr-only" aria-live="polite">
        {format(NARRATION_LINES[index] ?? "")}
      </p>

      {/*
        Once the lands are up the narration moves to the top of the frame, so
        the final line never lands on top of the map it is introducing — and
        once it has been read, it dissolves and leaves the tree for good.
      */}
      {outro !== "gone" && (
      <p
        aria-hidden="true"
        // `pointer-events-none` matters: this sits over the map, and a
        // paragraph that swallows the pointer stops the islands under it from
        // ever seeing a hover. It is decorative — <main> owns the click.
        //
        // Position is set by ONE class, never two: leaving `relative` on while
        // adding `absolute` lets stylesheet order decide which wins, and it
        // kept the line pinned in the centre on top of the centre island.
        className={`font-hylia narration-glow pointer-events-none z-[2] max-w-5xl text-center text-[clamp(1.05rem,4.4vw,3rem)] leading-[1.6] text-[#f3ede1] transition-all ease-out ${
          islandsOut
            ? "absolute inset-x-0 top-[6vh] px-6"
            : "relative"
        }`}
        style={{
          opacity: hidden || outro === "fading" ? 0 : 1,
          transitionDuration: `${
            outro === "fading"
              ? MAP_TIMING.outroFadeMs
              : hidden
                ? NARRATION.fadeOutMs
                : index === 0
                  ? NARRATION.fadeInMs
                  : NARRATION.returnInMs
          }ms`,
          letterSpacing: NARRATION.letterSpacing,
          // Tracking adds a trailing gap after the last glyph, which throws
          // centred text off by half a space. Pulling it back re-centres.
          textIndent: NARRATION.letterSpacing,
        }}
      >
        {shown}
      </p>
      )}

      {/*
        SKIP — bottom-right for the whole opening.

        `stopPropagation` for the same reason as the cue below: this sits inside
        <main>, whose click handler advances the narration, and without it one
        press would both skip the cinematic and advance a beat of the thing it
        just skipped.
      */}
      {showSkip && (
        <button
          type="button"
          className="skip-intro font-hylia"
          onClick={(event) => {
            event.stopPropagation();
            skipIntro();
          }}
        >
          Skip intro <span aria-hidden="true">→</span>
        </button>
      )}

      {/*
        The cue. A real button, so it can be tabbed to and fired from the
        keyboard.

        `stopPropagation` is load-bearing: without it this click ALSO bubbles to
        <main>, and the beat runs twice. The ref latch in `advance` already
        absorbs that, but the two guards answer different questions — this one
        keeps one gesture to one handler, and the latch keeps one beat to one
        run no matter how it is reached. Neither is redundant.

        It leaves with the narration: there is nothing left to advance to.
      */}
      {outro !== "gone" && (
      <button
        type="button"
        aria-label="Continue"
        onClick={(event) => {
          event.stopPropagation();
          advance();
        }}
        tabIndex={canAdvance ? 0 : -1}
        className={`font-hylia z-[2] text-center text-[clamp(0.6rem,1.8vw,0.8rem)] text-[#f3ede1] transition-opacity duration-700 ${
          islandsOut
            ? "absolute inset-x-0 bottom-[5vh]"
            : "relative mt-16 sm:mt-24"
        }`}
        style={{
          letterSpacing: "0.42em",
          textIndent: "0.42em",
          opacity: canAdvance ? 1 : 0,
          pointerEvents: canAdvance ? "auto" : "none",
        }}
      >
        {/*
          The pulse lives on an inner span, not on the button. A CSS animation
          on `opacity` beats an inline `opacity` — putting both on one element
          left the cue breathing away in the dark before the line had typed.
          Nesting them multiplies instead: the button gates visibility, the
          span breathes inside it.
        */}
        <span className="narration-cue">{NARRATION.cueText}</span>
      </button>
      )}
    </main>
  );
}
