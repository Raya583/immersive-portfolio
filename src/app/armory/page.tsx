import type { Metadata } from "next";
import { SectionShell } from "@/components/section/SectionShell";
import { Card, Heading, InkLink } from "@/components/section/Prose";
import { achievements, profile, skills } from "@/content/portfolio";
import { LINK_LABELS, anyFilled, definedLinks, filled } from "@/lib/content";

export const metadata: Metadata = {
  title: `The Armory — Skills & Honours — ${profile.name}`,
  description:
    "Design and engineering toolkit, plus competition placements at IEEE IDEATHON, ECLearnix SOLVATHON, IEEE CREATHON and IGNITE.",
};

export default function Armory() {
  return (
    <SectionShell regionId="armory">
      <section>
        <Heading>The toolkit</Heading>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {skills
            .filter((group) => anyFilled(group.items))
            .map((group) => (
              <Card key={group.label}>
                <p className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-ink-faint">
                  {group.label}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.filter(filled).map((item) => (
                    <li
                      key={item}
                      className="rounded-sm border border-ink/20 bg-parchment/60 px-3 py-1.5 font-body text-sm text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
        </div>
      </section>

      {achievements.length > 0 && (
        <section className="mt-14">
          <Heading>Honours won</Heading>
          <ol className="mt-5 space-y-4">
            {achievements.map((item) => {
              const links = definedLinks(item.links);
              return (
                <li key={item.title}>
                  <Card>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <h3 className="font-display text-lg font-semibold uppercase tracking-[0.12em] text-ink sm:text-2xl">
                        {item.title}
                      </h3>
                      {filled(item.placement) && (
                        <span className="w-fit shrink-0 rounded-sm border border-gold-deep/60 bg-gold/15 px-3 py-1 font-body text-xs uppercase tracking-[0.2em] text-ink">
                          {item.placement}
                        </span>
                      )}
                    </div>

                    {filled(item.event) && (
                      <p className="mt-2 font-body text-sm italic text-ink-faint">
                        {item.event}
                      </p>
                    )}
                    {filled(item.description) && (
                      <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft sm:text-base">
                        {item.description}
                      </p>
                    )}
                    {links.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                        {links.map(([key, href]) => (
                          <InkLink key={key} href={href}>
                            {LINK_LABELS[key] ?? key}
                          </InkLink>
                        ))}
                      </div>
                    )}
                  </Card>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </SectionShell>
  );
}
