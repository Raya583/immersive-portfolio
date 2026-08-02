import type { Metadata } from "next";
import { SectionShell } from "@/components/section/SectionShell";
import { Card, Heading } from "@/components/section/Prose";
import { about, education, profile } from "@/content/portfolio";
import { filled } from "@/lib/content";

export const metadata: Metadata = {
  title: `Origins — About — ${profile.name}`,
  description: about.slice(0, 155),
};

export default function Origins() {
  return (
    <SectionShell regionId="origins">
      <p className="font-body text-base leading-relaxed text-ink sm:text-lg">
        {about}
      </p>

      {filled(profile.location) && (
        <p className="mt-6 font-body text-sm uppercase tracking-[0.24em] text-ink-faint">
          Based in {profile.location}
        </p>
      )}

      {education.length > 0 && (
        <section className="mt-12">
          <Heading>Learning</Heading>
          <div className="mt-5 space-y-4">
            {education.map((item) => (
              <Card key={item.school}>
                <p className="font-display text-base font-semibold uppercase tracking-[0.12em] text-ink sm:text-lg">
                  {item.school}
                </p>
                {filled(item.degree) && (
                  <p className="mt-2 font-body text-sm text-ink-soft sm:text-base">
                    {item.degree}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-body text-xs uppercase tracking-[0.18em] text-ink-faint">
                  {filled(item.dates) && <span>{item.dates}</span>}
                  {filled(item.note) && <span>{item.note}</span>}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </SectionShell>
  );
}
