import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site-content";
import { track } from "@/lib/analytics";
import { openWhatsApp } from "@/lib/whatsapp";

export function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      <a
        href={BUSINESS.phoneHref}
        onClick={() => track("call_click", "floating button")}
        aria-label="Call Ken Educational Consult"
        className="surface-navy grid size-12 place-items-center rounded-full shadow-[var(--shadow-lift)] transition-transform hover:scale-110 sm:hidden"
      >
        <Phone className="size-5 text-gold" />
      </a>
      <a
        href={BUSINESS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => openWhatsApp(e, "floating button")}
        aria-label="Chat with us on WhatsApp"
        className="bg-gold text-gold-foreground grid size-14 place-items-center rounded-full shadow-[var(--shadow-gold)] transition-transform hover:scale-110"
      >
        <MessageCircle className="size-6" />
      </a>
    </div>
  );
}
