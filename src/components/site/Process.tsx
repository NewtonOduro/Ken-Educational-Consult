import { STEPS } from "@/lib/site-content";
import { Reveal, SectionHeading } from "./Section";

export function Process() {
  return (
    <section id="process" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Eight clear steps from <span className="text-gradient-gold">enquiry to takeoff</span>
            </>
          }
          description="No guesswork. You always know exactly which stage you are at and what happens next."
        />

        <ol className="relative mt-16 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-px before:bg-border md:space-y-0 md:before:top-[27px] md:before:right-0 md:before:left-0 md:before:h-px md:before:w-full md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-12">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 70}>
              <li className="relative flex gap-5 md:block">
                <span className="surface-navy relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ring-4 ring-background">
                  <span className="text-gold">{i + 1}</span>
                </span>
                <div className="md:mt-5">
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
