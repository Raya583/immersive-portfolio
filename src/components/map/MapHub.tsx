"use client";

import { useEffect, useState } from "react";
import { Opening } from "@/components/map/Opening";
import { WorldMap } from "@/components/map/WorldMap";
import { CINEMATIC } from "@/config/cinematic";
import Link from "next/link";
import { REGIONS } from "@/config/regions";
import { profile } from "@/content/portfolio";

/**
 * Runs the opening once, then hands over to the map.
 *
 * The "seen" flag lives in sessionStorage, so walking back from a section page
 * drops you straight onto the map — the cinematic is an arrival, not a toll
 * gate you pay every time. It resets when the tab closes.
 */
export function MapHub() {
  // Starts null so the first paint commits to nothing; sessionStorage isn't
  // readable during SSR and guessing would flash the wrong thing.
  const [showOpening, setShowOpening] = useState<boolean | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(CINEMATIC.sessionKey) === "1";
    } catch {
      // Private modes can throw on storage access; just play the opening.
    }
    setShowOpening(!seen);
  }, []);

  const finish = () => {
    try {
      window.sessionStorage.setItem(CINEMATIC.sessionKey, "1");
    } catch {
      /* non-fatal */
    }
    setShowOpening(false);
  };

  const mapReady = showOpening === false;

  return (
    <>
      {showOpening && <Opening onFinish={finish} />}

      <main className="relative flex min-h-dvh flex-col items-center justify-center py-14">
        <header
          className="mb-6 px-6 text-center transition-opacity duration-1000"
          style={{ opacity: mapReady ? 1 : 0 }}
        >
          <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.28em] text-parchment-light sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mt-3 font-body text-xs uppercase tracking-[0.34em] text-gold sm:text-sm">
            {profile.title}
          </p>
        </header>

        <WorldMap revealed={mapReady} />

        <p
          className="mt-6 px-6 text-center font-body text-xs uppercase tracking-[0.3em] text-parchment/45 transition-opacity duration-1000 sm:text-sm"
          style={{ opacity: mapReady ? 1 : 0 }}
        >
          Choose a region to explore
        </p>

        {/*
          Small screens get a real list as well. The map's own labels shrink to
          fit a 390px-wide continent, and touch has no hover, so the gold
          affordance never fires there — this keeps every region a comfortable,
          unmistakable tap target without taking the map away.
        */}
        <nav
          aria-label="Regions"
          className="mt-8 w-full px-6 transition-opacity duration-1000 sm:hidden"
          style={{ opacity: mapReady ? 1 : 0 }}
        >
          <ul className="mx-auto flex max-w-sm flex-col gap-2">
            {REGIONS.map((region) => (
              <li key={region.id}>
                <Link
                  href={`/${region.id}`}
                  className="flex items-baseline justify-between rounded-sm border border-parchment/15 bg-navy-sea/40 px-4 py-3 transition-colors hover:border-gold/60"
                >
                  <span className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-parchment-light">
                    {region.name}
                  </span>
                  <span className="font-body text-[0.6rem] uppercase tracking-[0.24em] text-gold">
                    {region.kicker}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
