import { ArrowRight, MessageCircle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site-content";
import { track } from "@/lib/analytics";
import { openWhatsApp } from "@/lib/whatsapp";
import worldMap from "@/assets/worldmap.jpg";

export function FinalCta() {
  return (
    <section className="surface-navy relative isolate overflow-hidden py-24 lg:py-32">
      <img
        src={worldMap}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1920}
        height={1080}
        className="absolute inset-0 -z-10 size-full object-cover opacity-60"
      />
      <div className="mx-auto max-w-3xl px-5 text-center md:px-6">
        <p className="eyebrow text-gold justify-center">Your next chapter</p>
        <h2 className="text-navy-foreground mt-5 text-4xl font-bold sm:text-5xl lg:text-6xl">
          Your Future Has <span className="text-gradient-gold">No Borders.</span>
        </h2>
        <p className="text-navy-foreground/80 mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
          Whether you dream of studying abroad, traveling internationally, or building a global
          career, PACIFIC EDU CONSULT is here to guide you every step of the way.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="gold" size="xl">
            <a href="#booking" onClick={() => track("cta_click", "final CTA — book consultation")}>
              Book Free Consultation <ArrowRight />
            </a>
          </Button>
          <Button asChild variant="glass" size="xl">
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openWhatsApp(e, "final CTA")}
            >
              <MessageCircle /> Chat on WhatsApp
            </a>
          </Button>
        </div>

        <a
          href={BUSINESS.phoneHref}
          onClick={() => track("call_click", "final CTA")}
          className="text-navy-foreground/80 hover:text-gold mt-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <PhoneCall className="size-4" /> Call the office
        </a>
      </div>
    </section>
  );
}
