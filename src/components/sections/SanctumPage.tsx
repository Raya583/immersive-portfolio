"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { profile } from "@/content/portfolio";
import { SANCTUM, SANCTUM_SCENE } from "@/config/sanctum";
import { mulberry32, span } from "@/lib/random";

/**
 * THE SANCTUM — the home page, at the top of the mountain.
 *
 * Name, title, tagline, intro and portrait all come from `profile` in
 * content/portfolio.ts. Nothing here is written down twice.
 */

/**
 * The weather: clouds drifting past the peak, motes of light rising through
 * them, and the mountain itself — all sharing one pointer and one frame.
 *
 * ── ONE EFFECT OWNS THE LOT ────────────────────────────────────────────────
 * The mountain is a DOM element and the rest is a canvas. Eased separately
 * they drift fractionally out of step, which is exactly what breaks the sense
 * of a single space.
 *
 * ── DEPTH ──────────────────────────────────────────────────────────────────
 * Motes move most, clouds less, the mountain least. The GAPS are the depth
 * cue; equal movement would just be the picture sliding.
 *
 * ── WHY SPRITES ────────────────────────────────────────────────────────────
 * Every element here is a soft radial gradient. Building those per element per
 * frame would be dozens of `createRadialGradient` calls every 16ms; two are
 * pre-rendered once and stamped with drawImage, which is a blit.
 */
function SanctumScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const mountain = mountainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const P = SANCTUM_SCENE.parallax;
    const isImage = SANCTUM_SCENE.backdrop.mode === "image";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 700;
    // Reduced motion slows the drift rather than freezing it — a still frame
    // of scattered blobs reads as a broken canvas, not as calm.
    const motion = reduced ? 0.24 : 1;
    const depth = mobile ? P.mobileScale : reduced ? P.reducedScale : 1;
    const rand = mulberry32(0x5a17c7);
    const TAU = Math.PI * 2;

    /** A soft white disc. `solid` is how far the opaque core runs. */
    const sprite = (solid: number, tint: string) => {
      const R = 64;
      const c = document.createElement("canvas");
      c.width = c.height = R * 2;
      const g = c.getContext("2d");
      if (!g) return c;
      const grad = g.createRadialGradient(R, R, 0, R, R, R);
      grad.addColorStop(0, `rgba(${tint}, 1)`);
      grad.addColorStop(solid, `rgba(${tint}, 0.45)`);
      grad.addColorStop(1, `rgba(${tint}, 0)`);
      g.fillStyle = grad;
      g.beginPath();
      g.arc(R, R, R, 0, TAU);
      g.fill();
      return c;
    };
    // Cloud: falls off immediately, so the edge is all feather and no rim.
    const cloudSprite = sprite(0.04, "226, 238, 248");
    // Mote: mostly core, with a warm cast picked from the sunrise accent.
    const moteSprite = sprite(0.5, "246, 224, 190");

    let width = 0;
    let height = 0;

    /** Clouds and mist share a shape; only their numbers and band differ. */
    type Puff = { x: number; y: number; w: number; flatten: number; speed: number; alpha: number; z: number };
    type Mote = {
      x: number; y: number; r: number; speed: number;
      sway: number; swaySpeed: number; phase: number; alpha: number;
      /** Its own brightness cycle, so no two pulse together. */
      twPhase: number; twSpeed: number; twFloor: number;
    };
    let clouds: Puff[] = [];
    let mist: Puff[] = [];
    let motes: Mote[] = [];

    const build = () => {
      const C = SANCTUM_SCENE.clouds;
      const M = SANCTUM_SCENE.motes;

      clouds = Array.from({ length: mobile ? C.mobileCount : C.count }, () => ({
        x: rand() * width,
        // Kept to the upper two-thirds — clouds below the summit read as fog.
        y: rand() * height * 0.62,
        w: span(rand, C.size),
        flatten: C.flatten,
        // Half drift the other way, so the sky is not a conveyor belt.
        speed: span(rand, C.speed) * (rand() > 0.5 ? 1 : -1),
        alpha: span(rand, C.opacity),
        z: 0.3 + rand() * 0.7,
      }));

      // Fog on the flanks, in its own band lower down the page.
      const F = SANCTUM_SCENE.mist;
      mist = Array.from({ length: mobile ? F.mobileCount : F.count }, () => ({
        x: rand() * width,
        y: height * (F.band[0] + rand() * (F.band[1] - F.band[0])),
        w: span(rand, F.size),
        flatten: F.flatten,
        speed: span(rand, F.speed) * (rand() > 0.5 ? 1 : -1),
        alpha: span(rand, F.opacity),
        z: 0.5 + rand() * 0.5,
      }));

      motes = Array.from({ length: mobile ? M.mobileCount : M.count }, () => ({
        x: rand() * width,
        y: rand() * height,
        r: span(rand, M.size),
        speed: span(rand, M.speed),
        sway: span(rand, M.sway),
        swaySpeed: span(rand, M.swaySpeed),
        phase: rand() * TAU,
        alpha: span(rand, M.opacity),
        twPhase: rand() * TAU,
        twSpeed: span(rand, M.twinkleSpeed),
        twFloor: M.twinkle[0],
      }));
    };

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    measure();
    window.addEventListener("resize", measure);

    // Pointer as -1..1 from centre; `cur` chases `target`.
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / width) * 2 - 1;
      targetY = (e.clientY / height) * 2 - 1;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    if (depth > 0) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }

    let last = 0;
    let frame = 0;
    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      /*
       * Exponential smoothing, framerate-independent. A plain lerp eases faster
       * on a 120Hz screen than a 60Hz one; folding dt through exp() makes the
       * settle time the same wall-clock duration everywhere.
       */
      const k = 1 - Math.exp(-P.easing * dt);
      curX += (targetX - curX) * k;
      curY += (targetY - curY) * k;

      /*
       * The backdrop drifts opposite the cursor — the way a distant background
       * moves when you lean.
       *
       * The island cut-out is centred with `left: 50%`, so its transform has
       * to carry the -50% that does the centring; the full-bleed image is
       * already positioned by `inset` and must NOT, or it jumps half a screen
       * to the left.
       */
      if (mountain) {
        const mx = -curX * P.mountain * depth;
        const my = -curY * P.mountain * depth * 0.5;
        mountain.style.transform = isImage
          ? `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`
          : `translate3d(calc(-50% + ${mx.toFixed(2)}px), ${my.toFixed(2)}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);

      /*
       * Clouds and mist are the same draw with different numbers and a
       * different parallax weight — mist is nearer, so it travels further.
       * Order matters: high clouds, then fog in front of them, then motes
       * nearest of all.
       */
      const puffs = (list: Puff[], travel: number) => {
        for (const c of list) {
          c.x += c.speed * dt * motion;
          const w = c.w;
          const h = w * c.flatten;
          // Wrap on either side, allowing for the full width of the blob.
          if (c.speed > 0 && c.x - w > width) c.x = -w;
          if (c.speed < 0 && c.x + w < 0) c.x = width + w;

          const x = c.x - curX * travel * c.z * depth;
          const y = c.y - curY * travel * c.z * depth * 0.5;
          ctx.globalAlpha = c.alpha;
          ctx.drawImage(cloudSprite, x - w / 2, y - h / 2, w, h);
        }
      };
      puffs(clouds, P.clouds);
      puffs(mist, P.mist);

      for (const m of motes) {
        m.y += m.speed * dt * motion;
        m.phase += m.swaySpeed * dt * TAU * motion;
        if (m.y + m.r * 4 < 0) {
          m.y = height + m.r * 4;
          m.x = rand() * width;
        }
        const x = m.x + Math.sin(m.phase) * m.sway - curX * P.motes * depth;
        const y = m.y - curY * P.motes * depth * 0.6;
        // The sprite's falloff runs to its full radius, so a mote of radius r
        // is drawn wider than r to keep the soft edge outside the core.
        const d = m.r * 4;
        // Twinkle: a sine between the floor and full brightness, on its own
        // phase and rate, so the field shimmers instead of pulsing as one.
        m.twPhase += m.twSpeed * dt * TAU * motion;
        const tw = m.twFloor + (1 - m.twFloor) * (0.5 + 0.5 * Math.sin(m.twPhase));
        ctx.globalAlpha = m.alpha * tw;
        ctx.drawImage(moteSprite, x - d, y - d, d * 2, d * 2);
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const { src, glow } = SANCTUM_SCENE.mountain;

  return (
    <>
      {/*
        Both backdrops share this element, so they share the parallax written
        to it every frame. Which one renders is `backdrop.mode` in the config;
        the island branch is intact and one word away.
      */}
      {SANCTUM_SCENE.backdrop.mode === "image" ? (
        <div ref={mountainRef} className="sn-backdrop" aria-hidden="true">
          <Image
            src={SANCTUM_SCENE.backdrop.image.src}
            alt=""
            fill
            sizes="100vw"
            className="sn-backdrop-img"
            priority
          />
        </div>
      ) : (
        <div ref={mountainRef} className="sn-mountain" aria-hidden="true">
          <Image src={glow} alt="" width={1536} height={1024} className="sn-mountain-glow" />
          <Image src={src} alt="" width={1536} height={1024} className="sn-mountain-art" priority />
        </div>
      )}
      {/* The sunrise itself, sitting on the peak. See `sunGlow` in config. */}
      <span className="sn-sun" aria-hidden="true" />

      {/*
        God-rays off the summit. CSS gradients on one element rather than a
        canvas: a shaft of light is a soft wedge that barely moves, so paying a
        JS frame for it every 16ms buys nothing the compositor cannot do alone.
      */}
      <span className="sn-rays" aria-hidden="true">
        {Array.from({ length: SANCTUM_SCENE.rays.count }, (_, i) => (
          <span
            key={i}
            className="sn-ray"
            style={
              {
                // Fanned around vertical, widest at the edges of the spread.
                "--i": i - (SANCTUM_SCENE.rays.count - 1) / 2,
              } as CSSProperties
            }
          />
        ))}
      </span>
      <span className="sn-scrim" aria-hidden="true" />
      <canvas ref={canvasRef} className="sn-weather" aria-hidden="true" />
    </>
  );
}

/**
 * The character portrait.
 *
 * An ARCH rather than a circle. A circular crop is the universal profile
 * picture and drags the whole page back toward a CV; an arched frame with a
 * gold rim reads as a portrait hung in a hall, which is what this page is
 * pretending to be.
 *
 * `profile.photo` may point at a file that is not in the repo, so a failed
 * load falls back to a monogram in the SAME frame — identical layout either
 * way, so the page never looks half-built while a photograph is chosen.
 */
function Portrait() {
  const [failed, setFailed] = useState(false);
  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <figure className="sn-portrait-fig">
      <div className="sn-portrait">
        {/* The rim is a sibling, not a border: a gradient border cannot follow
            an arch, but an inset ring drawn on top of the same shape can. */}
        <span className="sn-portrait-rim" aria-hidden="true" />
        {profile.photo && !failed ? (
          <Image
            src={profile.photo}
            alt={`${profile.name}, ${profile.title}`}
            width={520}
            height={640}
            className="sn-portrait-img"
            onError={() => setFailed(true)}
            priority
          />
        ) : (
          <span className="sn-portrait-fallback font-hylia" aria-hidden="true">
            {initials}
          </span>
        )}
      </div>

      <figcaption
        className="sn-portrait-cap"
        data-plate={SANCTUM.portrait.nameplate}
      >
        {/* Ornament, not content — the plate reads identically without it. */}
        <span className="sn-plate-orn" aria-hidden="true">
          ◆
        </span>
        <span className="sn-plate-body">
          <span className="sn-portrait-name font-hylia">{SANCTUM.portrait.name}</span>
          <span className="sn-plate-rule" aria-hidden="true" />
          <span className="sn-portrait-class">{SANCTUM.portrait.className}</span>
        </span>
        <span className="sn-plate-orn" aria-hidden="true">
          ◆
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * The stat block.
 *
 * Diamonds rather than figures: a rating out of five reads as the
 * self-assessment it is, where a precise number invites a question about
 * measurement that has no honest answer.
 *
 * The pips are decorative — each row's accessible name carries the same
 * information as text, so a screen reader hears "Design, 5 of 5" instead of
 * five identical glyphs.
 */
function Stats() {
  return (
    <ul className="sn-stats">
      {SANCTUM.stats.map((s) => (
        <li
          key={s.label}
          className="sn-stat"
          aria-label={`${s.label}: ${s.level} of ${SANCTUM.statMax}`}
        >
          <span className="sn-stat-label">{s.label}</span>
          <span className="sn-stat-pips" aria-hidden="true">
            {Array.from({ length: SANCTUM.statMax }, (_, i) => (
              <span key={i} className={i < s.level ? "sn-pip is-on" : "sn-pip"}>
                ◆
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SanctumPage({
  onTravel,
}: {
  /** Take the reader to another island, wipe and all. */
  onTravel: (sectionId: string) => void;
}) {
  /*
   * Each element's entrance is staggered by its index. A custom property
   * rather than N keyframe rules, so adding a line to the hub does not mean
   * adding a matching rule to the stylesheet.
   */
  const step = (i: number) => ({ "--d": `calc(var(--sn-stagger) * ${i})` }) as CSSProperties;

  /*
   * The positioning is one string with an arrow in it. Split here so the two
   * halves can be styled as a FROM and a TO; edited as one line in
   * portfolio.ts. A title with no arrow renders whole.
   */
  const [was, ...becoming] = profile.title.split("→").map((p) => p.trim());
  const now = becoming.join(" → ");

  return (
    <div className="sn">
      <SanctumScene />

      <div className="sn-hero">
        <div className="sn-portrait-wrap sn-enter" style={step(0)}>
          <Portrait />
        </div>

        <div className="sn-intro">
          <p className="sn-kicker sn-enter" style={step(1)}>
            {SANCTUM.kicker}
          </p>

          <h2 className="sn-realm font-hylia sn-enter" style={step(2)}>
            {SANCTUM.realm}
          </h2>

          <p className="sn-title sn-enter" style={step(4)}>
            {now ? (
              <>
                <span className="sn-was">{was}</span>
                <span className="sn-arrow" aria-hidden="true">
                  →
                </span>
                <span className="sn-now">{now}</span>
              </>
            ) : (
              <span className="sn-now">{was}</span>
            )}
          </p>

          {profile.intro && (
            <p className="sn-lede sn-enter" style={step(5)}>
              {profile.intro}
            </p>
          )}

          <div className="sn-enter" style={step(6)}>
            <Stats />
          </div>

          {/* ONE quest, framed. The two links below it are deliberately not
              buttons — hierarchy is the whole point of this block. */}
          <div className="sn-quest sn-enter" style={step(7)}>
            <p className="sn-quest-label">{SANCTUM.quest.label}</p>
            <button
              type="button"
              className="sn-quest-action"
              onClick={() => onTravel(SANCTUM.quest.target)}
            >
              {SANCTUM.quest.action}
              <span aria-hidden="true"> →</span>
            </button>
          </div>

          <p className="sn-links sn-enter" style={step(8)}>
            {SANCTUM.secondary.map((a) => (
              <button
                key={a.target}
                type="button"
                className="sn-link"
                onClick={() => onTravel(a.target)}
              >
                {a.label}
                <span aria-hidden="true"> →</span>
              </button>
            ))}
          </p>
        </div>
      </div>

      {/* A note in the margin, not a card. */}
      <div className="sn-exploring sn-enter" style={step(9)}>
        <span className="sn-exploring-label">{SANCTUM.exploring.label}</span>
        <span className="sn-exploring-focus">{SANCTUM.exploring.focus}</span>
        <span className="sn-exploring-updated">{SANCTUM.exploring.updated}</span>
      </div>
    </div>
  );
}
