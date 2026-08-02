import type { ReactNode } from "react";

/** Heading used inside a parchment sheet. */
export function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-lg font-semibold uppercase tracking-[0.16em] text-ink sm:text-2xl">
      {children}
    </h2>
  );
}

/** Small gold-ruled label above a block. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-body text-[0.65rem] uppercase tracking-[0.32em] text-ink-faint sm:text-xs">
      {children}
    </p>
  );
}

/** A bordered card on the parchment — used for projects, honours, roles. */
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-sm border border-ink/15 bg-parchment-light/45 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] sm:p-7">
      {children}
    </div>
  );
}

/** Outbound link, styled as an inked gold reference. */
export function InkLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 border-b border-gold-deep/50 font-body text-sm text-ink transition-colors hover:border-gold hover:text-gold-deep"
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
