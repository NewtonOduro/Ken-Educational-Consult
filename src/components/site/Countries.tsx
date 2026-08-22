import { ArrowUpRight } from "lucide-react";
import { COUNTRIES } from "@/lib/site-content";
import { Reveal, SectionHeading } from "./Section";

export function Countries() {
  return (
    <section id="destinations" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionHeading
          eyebrow="Destinations"
          title={
            <>
              Countries we help students <span className="text-gradient-gold">travel to</span>
            </>
          }
          description="Ten strong destinations, real partner institutions, and honest advice on where your profile has the best chance."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COUNTRIES.map((country, i) => (
            <Reveal key={country.name} delay={i * 50}>
              <a
                href="#contact"
                className="card-premium group flex h-full flex-col justify-between gap-4 p-5"
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                  {country.flag}
                </span>
                <span>
                  <span className="flex items-center gap-1 text-sm font-bold">
                    {country.name}
                    <ArrowUpRight className="text-gold size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="text-muted-foreground mt-1 block text-xs leading-snug">
                    {country.note}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
