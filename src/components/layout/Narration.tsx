"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useStory } from "@/hooks/storyContext";
import { useTypewriter } from "@/hooks/useTypewriter";
import { STORY } from "@/config/story";

/** Hangul jamo + syllables. Hylia Serif has no glyphs for any of these. */
const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힣]/;

interface Run {
  text: string;
  hangul: boolean;
}

/**
 * Splits a narration line into alternating Latin / Hangul runs so each keeps
 * its own face: Latin stays in Hylia Serif, Korean gets a Korean serif with
 * its own tracking (see .narration-hangul). Browsers would fall back on their
 * own, but doing it explicitly means the Korean can be styled to sit level
 * with the Latin instead of looking bolted on.
 */
function toRuns(text: string): Run[] {
  const runs: Run[] = [];
  for (const char of text) {
    const hangul = HANGUL.test(char);
    const last = runs[runs.length - 1];
    if (last && last.hangul === hangul) last.text += char;
    else runs.push({ text: char, hangul });
  }
  return runs;
}

/**
 * The 2D narration overlay — Hylia-serif typewriter text with a soft magical
 * glow. Every line is click-to-continue: the first line appears on its own,
 * then once a line finishes typing a gentle "continue" hint invites a click.
 * Fades away after the final line.
 */
export function Narration() {
  const { step, advance, canAdvance, isLast } = useStory();
  const line = STORY[step]?.text ?? "";
  const { shown, done } = useTypewriter(line);
  const runs = useMemo(() => toRuns(shown), [shown]);

  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (isLast && done) {
      const t = setTimeout(() => setDismissed(true), 3000);
      return () => clearTimeout(t);
    }
  }, [isLast, done]);

  const handleClick = () => {
    if (done && canAdvance) advance();
  };

  if (dismissed) return null;

  const showClickHint = done && canAdvance;

  return (
    <div
      onClick={handleClick}
      className={[
        "pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center",
        "select-none transition-opacity duration-[1500ms]",
        isLast && done ? "opacity-0" : "opacity-100",
        showClickHint ? "cursor-pointer" : "cursor-default",
      ].join(" ")}
    >
      <p className="font-hylia narration-glow max-w-3xl px-8 text-center text-3xl font-normal leading-relaxed tracking-wide text-white/95 md:text-5xl">
        {runs.map((run, i) =>
          run.hangul ? (
            <span key={i} className="narration-hangul">
              {run.text}
            </span>
          ) : (
            <Fragment key={i}>{run.text}</Fragment>
          ),
        )}
        <span className="ml-1 inline-block w-[2px] animate-pulse text-white/70">
          {done ? "" : "|"}
        </span>
      </p>

      {showClickHint && (
        <span className="font-hylia mt-12 animate-pulse text-base uppercase tracking-[0.35em] text-white/40">
          click to continue
        </span>
      )}
    </div>
  );
}
