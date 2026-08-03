"use client";

import { useEffect, useRef } from "react";
import { flairFor, type DriftKind } from "@/config/projectFlair";
import { mulberry32, span } from "@/lib/random";
import { drawShape } from "./shapes";

/**
 * Whatever drifts past a case-study page — slices for the pizzeria, notes and
 * headphones for the music app.
 *
 * Canvas rather than DOM: each piece is a handful of paths, and a few dozen of
 * them redrawn per frame costs far less than a few dozen elements being
 * transformed and composited. Every shape is drawn from scratch, so no image is
 * loaded and nothing is traced.
 *
 * Behind the content and `pointer-events: none`. Kept low-opacity on purpose:
 * the page is a case study, and the words underneath have to win.
 *
 * Each kind reads its own `colors` array out of the mix entry, so adding a
 * shape means a draw function here and a mix entry in config — no new fields.
 */

interface Piece {
  kind: DriftKind;
  colors: string[];
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  spin: number;
  angle: number;
  alpha: number;
}

export function DriftField({ project }: { project: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spec = flairFor(project).drift;

  useEffect(() => {
    if (!spec) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 700;
    const motion = reduced ? 0.25 : 1;

    let width = 0;
    let height = 0;
    let pieces: Piece[] = [];
    const rand = mulberry32(0x9127a);
    const TAU = Math.PI * 2;

    /** Picks an entry by weight, so the mix is proportions rather than counts. */
    const total = spec.mix.reduce((n: number, m) => n + m.weight, 0);
    const FALLBACK = { kind: "note" as DriftKind, weight: 1, colors: ["#ffffff"] };
    const pickEntry = () => {
      let r = rand() * total;
      for (const m of spec.mix) {
        r -= m.weight;
        if (r <= 0) return m;
      }
      return spec.mix[0] ?? FALLBACK;
    };

    const build = () => {
      const count = mobile ? spec.mobileCount : spec.count;
      pieces = Array.from({ length: count }, () => {
        const entry = pickEntry();
        return {
          kind: entry.kind,
          colors: entry.colors,
          x: rand() * width,
          // Scattered over the whole page at the start, so it is already moving
          // when you arrive rather than releasing a batch from one edge.
          y: rand() * height,
          size: span(rand, spec.size),
          speed: span(rand, spec.speed),
          sway: span(rand, spec.sway),
          swaySpeed: span(rand, spec.swaySpeed),
          phase: rand() * TAU,
          spin: span(rand, spec.spin),
          angle: rand() * TAU,
          alpha: span(rand, spec.opacity),
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    let frame = 0;

    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const p of pieces) {
        p.y += p.speed * dt * motion;
        p.phase += p.swaySpeed * dt * TAU * motion;
        p.angle += p.spin * dt * TAU * motion;
        // Wrap whichever way this field travels.
        if (p.speed > 0 && p.y - p.size * 1.4 > height) {
          p.y = -p.size * 1.6;
          p.x = rand() * width;
        }
        if (p.speed < 0 && p.y + p.size * 1.6 < 0) {
          p.y = height + p.size * 1.4;
          p.x = rand() * width;
        }

        const x = p.x + Math.sin(p.phase) * p.sway;
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;
        drawShape(ctx, p.kind, p.size, p.alpha, p.colors);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [spec]);

  if (!spec) return null;
  return <canvas ref={canvasRef} className="drift-field" aria-hidden="true" />;
}
