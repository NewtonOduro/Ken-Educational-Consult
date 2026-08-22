import { Check } from "lucide-react";
import { SERVICES } from "@/lib/site-content";
import { Reveal, SectionHeading } from "./Section";

export function Services() {
  return (
    <section id="services" className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Premium services for <span className="text-gradient-gold">every step</span> abroad
            </>
          }
          description="One consultancy for admissions, visas, exams, travel and career support — handled by people who do this every single day."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={i * 70}>
              <article className="card-premium group h-full p-7">
                <span className="surface-navy grid size-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                  <service.icon className="size-6 text-gold" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {service.blurb}
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="text-sky mt-0.5 size-4 shrink-0" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
