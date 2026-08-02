import type { Metadata } from "next";
import { SectionShell } from "@/components/section/SectionShell";
import { Card, Heading } from "@/components/section/Prose";
import { experience, profile } from "@/content/portfolio";
import { LINK_LABELS, definedLinks, filled } from "@/lib/content";

export const metadata: Metadata = {
  title: `The Gate — Contact — ${profile.name}`,
  description: `Reach ${profile.name} — ${profile.title}.`,
};

/**
 * Contact, plus the involvement list. Only channels present in the content
 * file are rendered: there is no GitHub on the résumé, so no GitHub link.
 * Involvement carries no dates in the source, so no date element is emitted.
 */
export default function Gate() {
  const links = definedLinks(profile.links);

  return (
    <SectionShell regionId="gate">
      <section className="text-center">
        <Heading>Send word</Heading>

        <div className="mt-7 flex flex-col items-center gap-4">
          {filled(profile.email) && (
            <a
              href={`mailto:${profile.email}`}
              className="border-b border-gold-deep/50 font-body text-lg text-ink transition-colors hover:border-gold hover:text-gold-deep sm:text-2xl"
            >
              {profile.email}
            </a>
          )}

          {filled(profile.phone) && (
            <a
              href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
              className="font-body text-base text-ink-soft transition-colors hover:text-ink sm:text-lg"
            >
              {profile.phone}
            </a>
          )}

          {links.length > 0 && (
            <ul className="mt-3 flex flex-wrap justify-center gap-3">
              {links.map(([key, href]) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-sm border border-ink/25 bg-parchment-light/60 px-4 py-2 font-body text-sm text-ink transition-colors hover:border-gold-deep hover:text-gold-deep"
                  >
                    {LINK_LABELS[key] ?? key}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {experience.length > 0 && (
        <section className="mt-14">
          <Heading>Where I show up</Heading>
          <ul className="mt-5 space-y-4">
            {experience.map((item) => (
              <li key={item.company}>
                <Card>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <p className="font-display text-base font-semibold uppercase tracking-[0.12em] text-ink sm:text-lg">
                      {item.company}
                    </p>
                    {filled(item.role) && (
                      <p className="font-body text-sm italic text-ink-faint">
                        {item.role}
                      </p>
                    )}
                  </div>

                  {(filled(item.dates) || filled(item.location)) && (
                    <p className="mt-2 font-body text-xs uppercase tracking-[0.2em] text-ink-faint">
                      {[item.dates, item.location].filter(filled).join(" · ")}
                    </p>
                  )}

                  {item.highlights.filter(filled).length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {item.highlights.filter(filled).map((highlight) => (
                        <li
                          key={highlight}
                          className="font-body text-sm leading-relaxed text-ink-soft sm:text-base"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </SectionShell>
  );
}
