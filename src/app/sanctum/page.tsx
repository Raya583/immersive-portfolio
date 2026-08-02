import type { Metadata } from "next";
import { SectionShell } from "@/components/section/SectionShell";
import { Eyebrow, Heading } from "@/components/section/Prose";
import { profile } from "@/content/portfolio";
import { filled } from "@/lib/content";

export const metadata: Metadata = {
  title: `The Sanctum — ${profile.name}`,
  description: `${profile.name}, ${profile.title}.`,
};

export default function Sanctum() {
  return (
    <SectionShell regionId="sanctum">
      <div className="text-center">
        <Eyebrow>{profile.title}</Eyebrow>
        <p className="mt-6 font-display text-3xl font-semibold uppercase tracking-wide text-ink sm:text-5xl">
          {profile.name}
        </p>
        {filled(profile.tagline) && (
          <p className="mt-6 font-body text-lg italic text-ink-soft sm:text-2xl">
            {profile.tagline}
          </p>
        )}
      </div>

      <div className="rule-gold mx-auto my-10 h-px w-32" />

      <div className="text-center">
        <Heading>Where to go</Heading>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-ink-soft sm:text-base">
          The Forge holds the work. Origins tells how it started. The Armory
          keeps the tools and the honours. The Gate is how you reach me.
        </p>
      </div>
    </SectionShell>
  );
}
