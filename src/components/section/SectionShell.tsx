import Link from "next/link";
import type { ReactNode } from "react";
import { getRegion } from "@/config/regions";

/**
 * The parchment sheet every section page is written on, with the route back to
 * the map. Server-rendered: all of the text inside is real HTML.
 */
export function SectionShell({
  regionId,
  children,
}: {
  regionId: string;
  children: ReactNode;
}) {
  const region = getRegion(regionId);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.28em] text-gold transition-colors hover:text-gold-light"
      >
        <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
          ←
        </span>
        Back to the map
      </Link>

      <article className="parchment rounded-sm px-6 py-10 sm:px-12 sm:py-14">
        <header className="mb-10 text-center">
          {region && (
            <p className="font-body text-[0.65rem] uppercase tracking-[0.4em] text-ink-faint sm:text-xs">
              {region.kicker}
            </p>
          )}
          <h1 className="mt-3 font-display text-3xl font-semibold uppercase tracking-wide text-ink sm:text-5xl">
            {region?.name ?? regionId}
          </h1>
          <div className="rule-gold mx-auto mt-5 h-px w-40 sm:w-64" />
          {region && (
            <p className="mt-5 font-body text-sm italic text-ink-soft sm:text-base">
              {region.blurb}
            </p>
          )}
        </header>

        {children}
      </article>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="font-body text-xs uppercase tracking-[0.28em] text-parchment/60 transition-colors hover:text-gold-light"
        >
          ← Return to the map
        </Link>
      </div>
    </main>
  );
}
