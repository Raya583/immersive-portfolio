import type { Metadata } from "next";
import { SectionShell } from "@/components/section/SectionShell";
import { Card, InkLink } from "@/components/section/Prose";
import { profile, projects } from "@/content/portfolio";
import { LINK_LABELS, anyFilled, definedLinks, filled } from "@/lib/content";

export const metadata: Metadata = {
  title: `The Forge — Projects — ${profile.name}`,
  description: "Selected projects: COGMU, DEXOVO, FUTURX and Crustfolio.",
};

/**
 * Projects. Role, tech and impact render only when the content file actually
 * carries them — today they are all empty, so those rows are absent rather
 * than showing a hollow label.
 */
export default function Forge() {
  return (
    <SectionShell regionId="forge">
      <div className="space-y-6">
        {projects.map((project) => {
          const links = definedLinks(project.links);
          const hasDetail =
            filled(project.role) ||
            filled(project.impact) ||
            anyFilled(project.tech);

          return (
            <Card key={project.title}>
              <h2 className="font-display text-xl font-semibold uppercase tracking-[0.14em] text-ink sm:text-3xl">
                {project.title}
              </h2>

              {filled(project.description) && (
                <p className="mt-4 font-body text-sm leading-relaxed text-ink-soft sm:text-base">
                  {project.description}
                </p>
              )}

              {filled(project.role) && (
                <p className="mt-4 font-body text-sm text-ink-soft">
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
                    Role{" "}
                  </span>
                  {project.role}
                </p>
              )}

              {filled(project.impact) && (
                <p className="mt-2 font-body text-sm text-ink-soft">
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
                    Impact{" "}
                  </span>
                  {project.impact}
                </p>
              )}

              {anyFilled(project.tech) && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech.filter(filled).map((tech) => (
                    <li
                      key={tech}
                      className="rounded-sm border border-ink/20 px-2.5 py-1 font-body text-xs text-ink-soft"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              )}

              {links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                  {links.map(([key, href]) => (
                    <InkLink key={key} href={href}>
                      {LINK_LABELS[key] ?? key}
                    </InkLink>
                  ))}
                </div>
              )}

              {!hasDetail && (
                <p className="mt-5 font-body text-[0.7rem] uppercase tracking-[0.24em] text-ink-faint/70">
                  Full account still being written
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </SectionShell>
  );
}
