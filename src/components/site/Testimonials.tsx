import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site-content";
import { Reveal, SectionHeading } from "./Section";

export function Testimonials() {
  return (
    <section id="stories" className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionHeading
          eyebrow="Success stories"
          title={
            <>
              Students who are already <span className="text-gradient-gold">living it</span>
            </>
          }
          description="Real clients from Kumasi and beyond, now studying, working and travelling across the world."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <figure className="card-premium flex h-full flex-col p-7">
                <Quote className="text-gold size-7" />
                <blockquote className="text-foreground/85 mt-4 flex-1 text-base leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <div className="mt-6 flex items-center gap-4 border-t border-border pt-5">
                  <span className="surface-navy grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold">
                    <span className="text-gold">{t.initials}</span>
                  </span>
                  <div className="flex-1">
                    <figcaption className="text-sm font-bold">{t.name}</figcaption>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                  <span className="flex text-gold" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="size-3.5 fill-current" />
                    ))}
                  </span>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
