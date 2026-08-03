"use client";

import Image from "next/image";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import { BOATS, BOAT_FADE_MS, type BoatLane } from "@/config/boats";

/**
 * The fleet: a few ships sailing the open water between the islands.
 *
 * ── WHY TWO NESTED ELEMENTS ────────────────────────────────────────────────
 * A ship is doing two independent things at once — sailing along its lane, and
 * bobbing on the swell — at completely different periods. One element cannot
 * run two transforms independently, so the outer span sails and the inner span
 * bobs. Same reason `.island` and `.island-art` are separate.
 *
 * ── WHY translateX IS IN THE HUNDREDS OF PERCENT ───────────────────────────
 * A percentage in `translateX` resolves against the ELEMENT's own width, not
 * its container's — so it cannot express "40% across the map" directly. The
 * conversion happens here instead: a ship `w` wide (in stage %) that wants its
 * centre at stage-x `X` must shift by `(X - w/2) / w × 100` percent of itself.
 * For a 5%-wide ship crossing the middle of the map that comes out around
 * 600-1100%, which looks alarming and is entirely correct.
 *
 * Everything else is a plain CSS animation on `transform` and `opacity`, so the
 * whole fleet is compositor work — no per-frame JavaScript at all.
 */

/** Where a ship must shift to put its centre at stage-x `x`. See above. */
const shiftFor = (x: number, width: number) => ((x - width / 2) / width) * 100;

function Boat({
  lane,
  mobile,
  className,
}: {
  lane: BoatLane;
  mobile: boolean;
  className: string;
}) {
  const g = mobile && lane.mobile ? lane.mobile : lane;
  const width = g.width;
  // The sprites are drawn bow-right, so a westward lane needs mirroring.
  const facingLeft = g.x1 < g.x0;

  return (
    <span
      className={`boat ${className}`}
      style={
        {
          "--boat-w": `${width}%`,
          "--boat-y": `${g.y}%`,
          "--boat-from": `${shiftFor(g.x0, width)}%`,
          "--boat-to": `${shiftFor(g.x1, width)}%`,
          "--boat-dur": `${lane.crossS}s`,
          // Negative delay starts the ship partway along its lane, so the sea
          // is already busy on arrival rather than every ship setting off at once.
          "--boat-delay": `${-lane.phase * lane.crossS}s`,
          "--boat-o": lane.opacity,
        } as CSSProperties
      }
    >
      <span
        className="boat-hull"
        style={
          {
            "--boat-bob": `${lane.bob}%`,
            "--boat-tilt": `${lane.tilt}deg`,
            "--boat-bob-dur": `${lane.bobS}s`,
          } as CSSProperties
        }
      >
        <Image
          src={lane.src}
          alt=""
          width={lane.natural.w}
          height={lane.natural.h}
          sizes="(max-width: 640px) 14vw, 8vw"
          className="boat-img"
          style={{ transform: facingLeft ? "scaleX(-1)" : undefined }}
        />
      </span>
    </span>
  );
}

export function BoatDrift({ visible }: { visible: boolean }) {
  return (
    <div
      className="boat-layer"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0, transitionDuration: `${BOAT_FADE_MS}ms` }}
    >
      {/* Keyed by index, not by `src`: several lanes now sail the same sprite,
          so the filename stopped being unique. */}
      {BOATS.filter((l) => l.enabled !== false).map((lane, i) => (
        <Fragment key={`${lane.src}-${i}`}>
          {/*
            Desktop and phone lanes are separate elements rather than one
            element switching custom properties at a breakpoint, because a ship
            can be absent from the phone layout altogether — the portrait map
            is tight — and CSS cannot unmount anything.
          */}
          <Boat lane={lane} mobile={false} className="boat-desktop" />
          {lane.mobile && <Boat lane={lane} mobile className="boat-mobile" />}
        </Fragment>
      ))}
    </div>
  );
}
