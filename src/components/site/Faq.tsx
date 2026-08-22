import { FAQS } from "@/lib/site-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./Section";

export function Faq() {
  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions we answer <span className="text-gradient-gold">every day</span>
            </>
          }
        />
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`item-${i}`}
              className="bg-card rounded-2xl border border-border px-5 shadow-[var(--shadow-soft)]"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
