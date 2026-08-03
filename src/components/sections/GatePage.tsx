"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { GATE, GATE_SCENE, methods, type GateIcon } from "@/config/gate";
import { mulberry32, span } from "@/lib/random";

/**
 * THE GATE — the contact page.
 *
 * Every address on it comes from `profile` in content/portfolio.ts by way of
 * config/gate.ts, and a method with no value renders no card. Nothing here is
 * written down twice.
 *
 * Real anchors throughout — `mailto:`, `tel:`, and two off-site links. A card
 * is an <a>, not a div with a click handler, so it can be tabbed to, opened in
 * a new tab, copied, and read aloud as a link.
 */

/** Icons drawn inline — original paths, no icon font, nothing external. */
function Icon({ kind }: { kind: GateIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 20,
    height: 20,
    "aria-hidden": true as const,
    className: "gate-icon",
  };

  if (kind === "mail") {
    return (
      <svg {...common}>
        <rect x="2.5" y="5" width="19" height="14" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        {/* The flap, drawn as the fold it actually is. */}
        <path d="M3.4 7 L12 13.2 L20.6 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "phone") {
    return (
      <svg {...common}>
        <path
          d="M7.6 3.6h2.1l1.3 3.4-1.7 1.3a11.4 11.4 0 0 0 5.4 5.4l1.3-1.7 3.4 1.3v2.1a2.3 2.3 0 0 1-2.5 2.3A15.6 15.6 0 0 1 5.3 6.1 2.3 2.3 0 0 1 7.6 3.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "linkedin") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="7.8" cy="8" r="1.25" fill="currentColor" />
        <path d="M7.8 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M11.4 17v-6m0 1.6a2.6 2.6 0 0 1 4.9 1.3V17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
    </svg>
  );
}

/**
 * The frozen scene: the mountain, the snowfall, and the pointer parallax that
 * ties them together.
 *
 * -- ONE EFFECT OWNS BOTH ---------------------------------------------------
 * The mountain is a DOM element and the snow is a canvas, but they share one
 * pointer and one animation frame. Split across two components they would each
 * ease their own copy of the cursor and drift fractionally out of step, which
 * is exactly the thing that breaks the illusion of a single space.
 *
 * -- DEPTH ------------------------------------------------------------------
 * Every layer drifts by a different amount: near flakes most, far flakes less,
 * the mountain least. The GAPS are the depth cue -- equal movement would just
 * be the whole picture sliding.
 *
 * -- ONE CANVAS, TWO POPULATIONS --------------------------------------------
 * Small crisp flakes in the middle distance, and a handful of large
 * out-of-focus ones nearer the viewer. Real snow has depth, and depth on a
 * flat screen means some of it must be blurred, slower, and parallax more.
 *
 * -- WHY SPRITES ------------------------------------------------------------
 * Each flake is a soft radial glow. Building that gradient per flake per frame
 * is ~124 `createRadialGradient` calls every 16ms; instead the two looks are
 * pre-rendered ONCE into small offscreen canvases and stamped with drawImage,
 * which is a blit. It is what keeps this affordable on a phone.
 */
function GateScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const island = islandRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const P = GATE_SCENE.parallax;
    const isImage = GATE_SCENE.backdrop.mode === "image";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 700;
    // Reduced motion slows the fall rather than stopping it -- a frozen frame
    // of scattered dots reads as a broken canvas, not as calm.
    const motion = reduced ? 0.24 : 1;
    // No hovering cursor on a touch screen, and a damped one if asked.
    const depth = mobile ? P.mobileScale : reduced ? P.reducedScale : 1;
    const rand = mulberry32(0x5e1ce7);
    const TAU = Math.PI * 2;

    /** A soft white disc, pre-rendered. `solid` is how far the core runs. */
    const sprite = (solid: number) => {
      const R = 32;
      const c = document.createElement("canvas");
      c.width = c.height = R * 2;
      const g = c.getContext("2d");
      if (!g) return c;
      const grad = g.createRadialGradient(R, R, 0, R, R, R);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(solid, "rgba(233,246,255,0.55)");
      grad.addColorStop(1, "rgba(214,238,255,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(R, R, R, 0, TAU);
      g.fill();
      return c;
    };
    // Crisp: most of the radius is solid. Soft: falls off almost immediately.
    const crisp = sprite(0.62);
    const soft = sprite(0.08);

    let width = 0;
    let height = 0;
    type Flake = {
      x: number; y: number; r: number; speed: number;
      sway: number; swaySpeed: number; phase: number; alpha: number;
      soft: boolean;
      /** 0 = far, 1 = right in front of the viewer. Drives the parallax. */
      z: number;
    };
    let flakes: Flake[] = [];

    const build = () => {
      const S = GATE_SCENE.snow;
      const B = GATE_SCENE.bokeh;
      const make = (spec: typeof S | typeof B, isSoft: boolean, n: number): Flake[] =>
        Array.from({ length: n }, () => ({
          x: rand() * width,
          y: rand() * height,
          r: span(rand, spec.size),
          speed: span(rand, spec.speed),
          sway: span(rand, spec.sway),
          swaySpeed: span(rand, spec.swaySpeed),
          phase: rand() * TAU,
          alpha: span(rand, spec.opacity),
          soft: isSoft,
          // The blurred ones are the ones close to the lens, so they travel
          // furthest; the crisp mid-distance flakes barely shift.
          z: isSoft ? span(rand, [0.72, 1]) : span(rand, [0.12, 0.5]),
        }));

      flakes = [
        ...make(S, false, mobile ? S.mobileCount : S.count),
        ...make(B, true, mobile ? B.mobileCount : B.count),
      ];
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

    // Pointer, as -1..1 from the centre. `cur` chases `target`.
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    // Cursor in real pixels, for the repulsion. Off-screen until it moves, so
    // nothing is shoved around before the pointer has ever appeared.
    let px = -9999;
    let py = -9999;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / width) * 2 - 1;
      targetY = (e.clientY / height) * 2 - 1;
      px = e.clientX;
      py = e.clientY;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      px = -9999;
      py = -9999;
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
       * Exponential smoothing, framerate-independent. A plain `cur += (t-cur)*k`
       * eases faster on a 120Hz screen than on a 60Hz one; folding dt through
       * exp() makes the settle time the same wall-clock duration everywhere.
       */
      const k = 1 - Math.exp(-P.easing * dt);
      curX += (targetX - curX) * k;
      curY += (targetY - curY) * k;

      // The mountain, drifting opposite the cursor -- the direction a real
      // background moves when you lean.
      /*
       * The cut-out is centred with `left: 50%`, so its transform must carry
       * the -50% that does the centring; the full-bleed image is positioned by
       * `inset` and must NOT, or it jumps half a screen to the left.
       */
      if (island) {
        const ix = -curX * P.island * depth;
        const iy = -curY * P.island * depth * 0.55;
        island.style.transform = isImage
          ? `translate3d(${ix.toFixed(2)}px, ${iy.toFixed(2)}px, 0)`
          : `translate3d(calc(-50% + ${ix.toFixed(2)}px), ${iy.toFixed(2)}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);

      const R = P.repelRadius;
      const strength = P.repelStrength * depth;

      for (const f of flakes) {
        f.y += f.speed * dt * motion;
        f.phase += f.swaySpeed * dt * TAU * motion;
        // Back to the top once it has fallen clear, at a new x.
        if (f.y - f.r * 5 > height) {
          f.y = -f.r * 5;
          f.x = rand() * width;
        }

        let x = f.x + Math.sin(f.phase) * f.sway - curX * P.snow * f.z * depth;
        let y = f.y - curY * P.snow * f.z * depth * 0.6;

        // Shove clear of the cursor, falling off to nothing at the radius.
        if (strength > 0) {
          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            // Squared falloff: a firm nudge up close, nothing at the edge.
            const push = (1 - d / R) ** 2 * strength;
            x += (dx / d) * push;
            y += (dy / d) * push;
          }
        }

        // The sprite's falloff runs to its full radius, so a flake of radius r
        // is drawn wider than r to keep the soft edge outside the solid core.
        const dsize = f.r * (f.soft ? 5 : 3);
        ctx.globalAlpha = f.alpha;
        ctx.drawImage(f.soft ? soft : crisp, x - dsize, y - dsize, dsize * 2, dsize * 2);
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

  const { src, glow } = GATE_SCENE.island;

  return (
    <>
      {/*
        The frozen mountain, the same artwork its marker uses on the map — so
        arriving reads as landing on the island you clicked.
      */}
      {/*
        Both backdrops share this element, so they share the parallax written
        to it every frame. Which one renders is `backdrop.mode` in the config;
        the cut-out branch is intact and one word away.
      */}
      {GATE_SCENE.backdrop.mode === "image" ? (
        <div ref={islandRef} className="gate-backdrop" aria-hidden="true">
          <Image
            src={GATE_SCENE.backdrop.image.src}
            alt=""
            fill
            sizes="100vw"
            className="gate-backdrop-img"
            priority
          />
        </div>
      ) : (
        <div ref={islandRef} className="gate-island" aria-hidden="true">
          <Image src={glow} alt="" width={1536} height={1024} className="gate-island-glow" />
          <Image src={src} alt="" width={1536} height={1024} className="gate-island-art" priority />
        </div>
      )}
      {/* Between the mountain and the words. See `scrim` in config/gate.ts. */}
      <span className="gate-scrim" aria-hidden="true" />
      <canvas ref={canvasRef} className="gate-snow" aria-hidden="true" />
      <span className="gate-mist" aria-hidden="true" />
    </>
  );
}

export function GatePage() {
  const list = methods();

  return (
    <div className="gate">
      <GateScene />

      <h2 className="gate-heading">{GATE.heading}</h2>
      <p className="gate-invite">{GATE.invitation}</p>

      <ul className="gate-methods">
        {list.map((m) => (
          <li key={m.id} className="gate-method">
            <a
              className="gate-card"
              data-primary={m.primary || undefined}
              href={m.href}
              // Only off-site links get a new tab. A mailto: or tel: that
              // opens a blank tab leaves an empty window behind on desktop.
              target={m.external ? "_blank" : undefined}
              rel={m.external ? "noopener noreferrer" : undefined}
            >
              <span className="gate-card-mark" aria-hidden="true">
                <Icon kind={m.icon} />
              </span>
              <span className="gate-card-text">
                <span className="gate-card-label">{m.label}</span>
                {/* The real value, so it can be read and copied without
                    following the link. */}
                <span className="gate-card-value">{m.value}</span>
              </span>
              <span className="gate-card-go" aria-hidden="true">
                {m.external ? "↗" : "→"}
              </span>
              {m.external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>

      <p className="gate-footnote">{GATE.footnote}</p>
    </div>
  );
}
