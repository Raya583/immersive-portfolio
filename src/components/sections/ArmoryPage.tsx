"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { armory, type ArmoryIcon } from "@/content/portfolio";
import { ARMORY_SCENE } from "@/config/armory";
import { mulberry32, span } from "@/lib/random";

/**
 * THE ARMORY — skills and tools, as collected gear.
 *
 * Every group and badge comes from `armory` in content/portfolio.ts.
 */

/**
 * The desert: dust on the wind, with the dunes behind it — sharing one pointer
 * and one animation frame.
 *
 * ── ONE EFFECT OWNS BOTH ───────────────────────────────────────────────────
 * The dunes are a DOM element and the dust is a canvas. Eased separately they
 * drift fractionally out of step, which is what breaks the sense of one space.
 *
 * ── WHY A SPRITE ───────────────────────────────────────────────────────────
 * Every mote is a soft radial glow. Building that gradient per mote per frame
 * would be ~82 `createRadialGradient` calls every 16ms; one is pre-rendered
 * and stamped with drawImage, which is a blit.
 */
function ArmoryScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const island = islandRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const P = ARMORY_SCENE.parallax;
    const isImage = ARMORY_SCENE.backdrop.mode === "image";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 700;
    // Reduced motion slows the drift rather than freezing it — a still frame
    // of scattered dots reads as a broken canvas, not as calm.
    const motion = reduced ? 0.24 : 1;
    const depth = mobile ? P.mobileScale : reduced ? P.reducedScale : 1;
    const rand = mulberry32(0xd0570a);
    const TAU = Math.PI * 2;

    /** One warm mote, pre-rendered. `solid` is how far the core runs. */
    const sprite = (solid: number) => {
      const R = 40;
      const c = document.createElement("canvas");
      c.width = c.height = R * 2;
      const g = c.getContext("2d");
      if (!g) return c;
      const grad = g.createRadialGradient(R, R, 0, R, R, R);
      grad.addColorStop(0, "rgba(255, 232, 186, 1)");
      grad.addColorStop(solid, "rgba(230, 179, 76, 0.5)");
      grad.addColorStop(1, "rgba(230, 179, 76, 0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(R, R, R, 0, TAU);
      g.fill();
      return c;
    };
    const grain = sprite(0.5);
    const soft = sprite(0.06);

    let width = 0;
    let height = 0;
    type Mote = {
      x: number; y: number; r: number; dx: number; dy: number;
      sway: number; swaySpeed: number; phase: number; alpha: number; soft: boolean;
    };
    let motes: Mote[] = [];

    const build = () => {
      const D = ARMORY_SCENE.dust;
      const B = ARMORY_SCENE.bokeh;
      const make = (spec: typeof D | typeof B, isSoft: boolean, n: number): Mote[] =>
        Array.from({ length: n }, () => ({
          x: rand() * width,
          y: rand() * height,
          r: span(rand, spec.size),
          dx: span(rand, spec.driftX),
          dy: span(rand, spec.driftY),
          sway: span(rand, spec.sway),
          swaySpeed: span(rand, spec.swaySpeed),
          phase: rand() * TAU,
          alpha: span(rand, spec.opacity),
          soft: isSoft,
        }));
      motes = [
        ...make(D, false, mobile ? D.mobileCount : D.count),
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
       * Exponential smoothing, framerate-independent. A plain lerp eases
       * faster on a 120Hz screen than a 60Hz one; folding dt through exp()
       * makes the settle time the same wall-clock duration everywhere.
       */
      const k = 1 - Math.exp(-P.easing * dt);
      curX += (targetX - curX) * k;
      curY += (targetY - curY) * k;

      /* The cut-out is centred with `left: 50%`, so its transform carries the
         -50%; the full-bleed image is placed by `inset` and must not. */
      if (island) {
        const ix = -curX * P.island * depth;
        const iy = -curY * P.island * depth * 0.5;
        island.style.transform = isImage
          ? `translate3d(${ix.toFixed(2)}px, ${iy.toFixed(2)}px, 0)`
          : `translate3d(calc(-50% + ${ix.toFixed(2)}px), ${iy.toFixed(2)}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.x += m.dx * dt * motion;
        m.y += m.dy * dt * motion;
        m.phase += m.swaySpeed * dt * TAU * motion;
        // The wind blows one way, so a mote leaving the right edge returns on
        // the left rather than bouncing.
        if (m.x - m.r > width) {
          m.x = -m.r;
          m.y = rand() * height;
        }
        if (m.y + m.r < 0) m.y = height + m.r;
        if (m.y - m.r > height) m.y = -m.r;

        const travel = m.soft ? P.bokeh : P.dust;
        const x = m.x + Math.sin(m.phase) * m.sway - curX * travel * depth;
        const y = m.y - curY * travel * depth * 0.6;
        // The sprite's falloff runs to its full radius, so a mote of radius r
        // is drawn wider than r to keep the halo outside the core.
        const d = m.r * (m.soft ? 5 : 3.4);
        ctx.globalAlpha = m.alpha;
        ctx.drawImage(m.soft ? soft : grain, x - d, y - d, d * 2, d * 2);
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

  const { src, glow } = ARMORY_SCENE.island;

  return (
    <>
      {/* Both backdrops share this element, so they share the parallax written
          to it every frame. The cut-out branch is one config word away. */}
      {ARMORY_SCENE.backdrop.mode === "image" ? (
        <div ref={islandRef} className="ar-backdrop" aria-hidden="true">
          <Image
            src={ARMORY_SCENE.backdrop.image.src}
            alt=""
            fill
            sizes="100vw"
            className="ar-backdrop-img"
            priority
          />
        </div>
      ) : (
        <div ref={islandRef} className="ar-island" aria-hidden="true">
          <Image src={glow} alt="" width={1536} height={1024} className="ar-island-glow" />
          <Image src={src} alt="" width={1536} height={1024} className="ar-island-art" priority />
        </div>
      )}
      <span className="ar-glare" aria-hidden="true" />
      <span className="ar-scrim" aria-hidden="true" />
      <canvas ref={canvasRef} className="ar-dust" aria-hidden="true" />
      {/* Heat rising off the sand — a masked band with a slow horizontal
          wobble. Real shimmer needs a shader; this reads the same for free. */}
      <span className="ar-shimmer" aria-hidden="true" />
    </>
  );
}

/**
 * The group marks. Original shapes rather than brand logos — a badge grid of
 * traced trademarks is both a legal problem and visually incoherent, since the
 * logos would each bring their own colour and weight.
 */
function GroupIcon({ kind }: { kind: ArmoryIcon }) {
  const c = {
    viewBox: "0 0 24 24",
    width: 17,
    height: 17,
    "aria-hidden": true as const,
    className: "ar-group-icon",
  };
  if (kind === "compass") {
    return (
      <svg {...c}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15.2 8.8 13 13l-4.2 2.2L11 11Z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "blueprint") {
    return (
      <svg {...c}>
        <rect x="3.5" y="4.5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3.5 9.5h17M9 9.5V19M14 9.5V19" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }
  if (kind === "pen") {
    return (
      <svg {...c}>
        <path d="M4 20l1.2-4L16 5.2a2 2 0 0 1 2.8 2.8L8 18.8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "spark") {
    return (
      <svg {...c}>
        <path d="M12 2.6 13.9 9 20 11l-6.1 2L12 21.4 10.1 13 4 11l6.1-2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "code") {
    return (
      <svg {...c}>
        <path d="M8.5 7.5 3.8 12l4.7 4.5M15.5 7.5 20.2 12l-4.7 4.5M13.4 4.4l-2.8 15.2"
          fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // gem — the equipment mark
  return (
    <svg {...c}>
      <path d="M7 3.6h10l4 5.2-9 11.6-9-11.6Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3.4 8.8h17.2M9.6 3.6 8 8.8l4 11.6 4-11.6-1.6-5.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function ArmoryPage() {
  return (
    <div className="ar">
      <ArmoryScene />

      <div className="ar-body">
        <header className="ar-head ar-enter" style={{ "--d": "0s" } as CSSProperties}>
          <h2 className="ar-heading font-hylia">{armory.heading}</h2>
          <p className="ar-intro">{armory.intro}</p>
        </header>

        {armory.groups.map((g, i) => (
          <section
            key={g.id}
            id={g.id}
            className="ar-group ar-enter"
            // The signature group gets a lit panel — see `featured` in the
            // content file, and `.ar-group[data-featured]` in globals.css.
            data-featured={g.featured || undefined}
            style={{ "--d": `calc(var(--ar-stagger) * ${i + 1})` } as CSSProperties}
          >
            <h3 className="ar-group-head">
              <span className="ar-group-mark" aria-hidden="true">
                <GroupIcon kind={g.icon} />
              </span>
              <span className="ar-group-title">{g.heading}</span>
              {g.note && <span className="ar-group-note">{g.note}</span>}
              {g.featured && <span className="ar-group-flag">Signature</span>}
              <span className="ar-group-count" aria-hidden="true">
                {g.items.length}
              </span>
            </h3>

            <ul className="ar-badges">
              {g.items.map((item) => (
                <li key={item} className="ar-badge">
                  <span className="ar-badge-rune" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
