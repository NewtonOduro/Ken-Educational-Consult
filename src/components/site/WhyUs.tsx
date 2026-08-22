import { BadgeCheck } from "lucide-react";
import { REASONS, BADGES } from "@/lib/site-content";
import { Reveal, SectionHeading } from "./Section";
import counseling from "@/assets/counseling.jpg";

export function WhyUs() {
  return (
    <section id="why-us" className="surface-navy py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeading
              align="left"
              inverted
              eyebrow="Why choose us"
              title={
                <>
                  Guidance you can <span className="text-gradient-gold">actually trust</span>
                </>
              }
              description="We do not sell dreams. We build strong applications, prepare you properly, and tell you the truth at every stage."
            />
            <img
              src={counseling}
              alt="Consultant reviewing university admission documents with a student in the Kumasi office"
              width={1200}
              height={900}
              loading="lazy"
              className="mt-10 hidden w-full rounded-3xl object-cover shadow-[var(--shadow-lift)] lg:block"
            />
            <div className="mt-8 flex flex-wrap gap-2.5">
              {BADGES.map((badge) => (
                <span
                  key={badge}
                  className="border-navy-foreground/20 bg-navy-foreground/10 text-navy-foreground/90 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium"
                >
                  <BadgeCheck className="text-gold size-3.5" /> {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {REASONS.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 60}>
                <div className="border-navy-foreground/15 bg-navy-foreground/[0.07] hover:border-gold/50 hover:bg-navy-foreground/[0.12] h-full rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1">
                  <BadgeCheck className="text-gold size-5" />
                  <h3 className="text-navy-foreground mt-3 text-base font-bold">{reason.title}</h3>
                  <p className="text-navy-foreground/70 mt-1.5 text-sm leading-relaxed">
                    {reason.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
