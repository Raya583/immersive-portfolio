"use client";

import { useEffect, useRef } from "react";
import { EFFECT_PRESETS, type IslandEffect } from "@/config/islandThemes";

function between(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Builds ONE soft round sprite on an offscreen canvas, which every flake then
 * draws scaled. This is what makes the snow read as snow rather than stars: a
 * radial falloff gives each flake blurry edges, and doing it once means no
 * per-frame gradient work no matter how many flakes are on screen.
 */
function makeFlakeSprite(color: string, softness: number): HTMLCanvasElement {
  const size = 64;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const sctx = sprite.getContext("2d");
  if (!sctx) return sprite;

  const half = size / 2;
  const gradient = sctx.createRadialGradient(half, half, 0, half, half, half);
  // `softness` moves the solid core inward: 0 = crisp disc, 1 = pure haze.
  gradient.addColorStop(0, color);
  gradient.addColorStop(Math.max(0.02, 1 - softness) * 0.55, color);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  sctx.fillStyle = gradient;
  sctx.beginPath();
  sctx.arc(half, half, half, 0, Math.PI * 2);
  sctx.fill();
  return sprite;
}

/**
 * The ambient particle layer behind a landing page — falling snow on the winter
 * island, slow rising motes elsewhere.
 *
 * Every flake has its own DEPTH (0 = far, 1 = near), which drives its size,
 * speed and opacity together, so the fall has parallax: many small quick flakes
 * behind a few big slow ones. Each also carries its own sine sway, so it drifts
 * sideways as it descends instead of dropping on rails. Nothing pulses in place
 * — the motion is all travel.
 *
 * Particle state lives in typed arrays allocated ONCE, so the loop allocates
 * nothing frame to frame, and motion is delta-timed so it looks identical at 60
 * and 144 Hz. prefers-reduced-motion gets a single static frame.
 *
 * Tune density, speed and size in EFFECT_PRESETS (config/islandThemes.ts).
 */
export function AmbientEffect({ effect }: { effect: IslandEffect }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const preset = EFFECT_PRESETS[effect];
    const canvas = canvasRef.current;
    if (!preset || preset.count === 0 || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprite = makeFlakeSprite(preset.color, preset.softness);

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ── Preallocated flake state ─────────────────────────────────────────────
    const n = preset.count;
    const px = new Float32Array(n);
    const py = new Float32Array(n);
    const size = new Float32Array(n);
    const fall = new Float32Array(n);
    const alpha = new Float32Array(n);
    const swayAmp = new Float32Array(n);
    const swayRate = new Float32Array(n);
    const phase = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      // Biased so most flakes sit far away — a few big ones near the glass.
      const depth = Math.pow(Math.random(), 2.2);

      px[i] = Math.random() * width;
      py[i] = Math.random() * height;
      size[i] = lerp(preset.size[0], preset.size[1], depth);
      // Near flakes fall SLOWER, which is what sells the depth.
      fall[i] = lerp(preset.speed[1], preset.speed[0], depth);
      alpha[i] = lerp(preset.opacity[0], preset.opacity[1], depth);
      swayAmp[i] = between(preset.sway[0], preset.sway[1]);
      swayRate[i] = between(preset.swaySpeed[0], preset.swaySpeed[1]);
      phase[i] = Math.random() * Math.PI * 2;
    }

    const draw = (delta: number) => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < n; i++) {
        py[i]! += fall[i]! * preset.direction * delta;
        px[i]! += preset.drift * delta;
        phase[i]! += swayRate[i]! * delta;

        // Respawn at the far edge, at a fresh x, once it leaves the screen.
        const margin = size[i]! * 2;
        if (preset.direction > 0 && py[i]! > height + margin) {
          py[i] = -margin;
          px[i] = Math.random() * width;
        } else if (preset.direction < 0 && py[i]! < -margin) {
          py[i] = height + margin;
          px[i] = Math.random() * width;
        }
        // Wrap sideways so wind never empties one edge.
        if (px[i]! > width + margin) px[i] = -margin;
        else if (px[i]! < -margin) px[i] = width + margin;

        const drawn = size[i]! * 2;
        const x = px[i]! + Math.sin(phase[i]!) * swayAmp[i]!;
        ctx.globalAlpha = alpha[i]!;
        ctx.drawImage(sprite, x - size[i]!, py[i]! - size[i]!, drawn, drawn);
      }
      ctx.globalAlpha = 1;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw(0);
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Clamped so a backgrounded tab doesn't teleport every flake on return.
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(delta);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [effect]);

  return <canvas ref={canvasRef} className="landing-effect" aria-hidden="true" />;
}
