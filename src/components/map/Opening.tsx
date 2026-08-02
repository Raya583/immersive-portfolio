"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CINEMATIC } from "@/config/cinematic";

/**
 * The opening cinematic: black void → narration → light burst → starfield →
 * narration → burst → hands off to the map.
 *
 * Deliberately CSS-only. Every moving part is an opacity or transform on a
 * composited layer, so there is no animation library and no render loop — the
 * stars are plain absolutely-positioned dots that scale out from centre on
 * staggered transition delays.
 *
 * Both beats wait on the viewer (click anywhere, Enter, or Space) rather than
 * running on a timer, so nobody is ever rushed past a line.
 */

type Phase = "line-one" | "line-two" | "closing";

/** Deterministic PRNG: star placement must match between server and client. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useTypewriter(text: string, active: boolean) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!active) return;
    setShown("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, CINEMATIC.typeSpeedMs);
    return () => window.clearInterval(timer);
  }, [text, active]);

  return { shown, done: shown.length >= text.length };
}

export function Opening({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<Phase>("line-one");
  const [bursting, setBursting] = useState(false);
  const [starsOut, setStarsOut] = useState(false);
  const busy = useRef(false);

  const lineIndex = phase === "line-one" ? 0 : 1;
  const line = CINEMATIC.lines[lineIndex] ?? "";
  const { shown, done } = useTypewriter(line, phase !== "closing");

  const [cueReady, setCueReady] = useState(false);
  useEffect(() => {
    setCueReady(false);
    if (!done || phase === "closing") return;
    const id = window.setTimeout(() => setCueReady(true), CINEMATIC.cueDelayMs);
    return () => window.clearTimeout(id);
  }, [done, phase]);

  const stars = useMemo(() => {
    const rand = mulberry32(20260802);
    return Array.from({ length: CINEMATIC.starCount }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: 1 + rand() * 2.2,
      opacity: 0.25 + rand() * 0.7,
      delay: rand() * 620,
    }));
  }, []);

  /** Advance one beat. Ignores input while a burst is mid-flight. */
  const advance = useCallback(() => {
    if (busy.current || !cueReady) return;
    busy.current = true;
    setBursting(true);

    window.setTimeout(() => {
      setBursting(false);
      busy.current = false;
      if (phase === "line-one") {
        setStarsOut(true);
        setPhase("line-two");
      } else {
        setPhase("closing");
        onFinish();
      }
    }, CINEMATIC.burstMs);
  }, [cueReady, phase, onFinish]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  return (
    <div
      className={`fixed inset-0 z-50 cursor-pointer bg-navy-deep transition-opacity duration-700 ${
        phase === "closing" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      onClick={advance}
      role="button"
      tabIndex={0}
      aria-label="Continue the introduction"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") advance();
      }}
    >
      {/* Starfield — scattered outward from centre once the first burst lands. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity ${starsOut ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDuration: `${CINEMATIC.starfieldMs}ms` }}
      >
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-parchment-light"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: starsOut ? star.opacity : 0,
              transform: starsOut
                ? "translate3d(0,0,0) scale(1)"
                : "translate3d(0,0,0) scale(0.2)",
              transition: `opacity ${CINEMATIC.starfieldMs}ms ease-out ${star.delay}ms, transform ${CINEMATIC.starfieldMs}ms cubic-bezier(0.16,1,0.3,1) ${star.delay}ms`,
            }}
          />
        ))}
      </div>

      {/* The burst itself. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "40vmax",
          height: "40vmax",
          background:
            "radial-gradient(circle, rgba(255,250,235,0.95) 0%, rgba(242,221,148,0.55) 32%, rgba(212,175,55,0.16) 55%, transparent 72%)",
          opacity: bursting ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${bursting ? 3.4 : 0.15})`,
          transition: `opacity ${CINEMATIC.burstMs}ms ease-out, transform ${CINEMATIC.burstMs}ms cubic-bezier(0.16,1,0.3,1)`,
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-2xl leading-relaxed tracking-wide text-parchment-light sm:text-4xl md:text-5xl">
          {shown}
          <span
            aria-hidden="true"
            className={`ml-1 inline-block w-[2px] ${done ? "opacity-0" : "animate-cue-pulse"}`}
          >
            |
          </span>
        </p>

        <p
          className={`mt-14 font-body text-xs uppercase tracking-[0.42em] text-gold transition-opacity duration-700 sm:text-sm ${
            cueReady && !bursting ? "animate-cue-pulse opacity-100" : "opacity-0"
          }`}
        >
          Press enter or click to continue
        </p>
      </div>
    </div>
  );
}
