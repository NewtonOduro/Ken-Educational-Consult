import { Facebook, Globe2, Instagram, Linkedin, Twitter } from "lucide-react";
import { FOOTER_LINKS, SERVICES } from "@/lib/site-content";


export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="surface-navy grid size-10 place-items-center rounded-xl">
              <Globe2 className="size-5 text-gold" />
            </span>
            <span className="font-display text-base font-bold">
              PACIFIC <span className="text-gold">EDU</span> CONSULT
            </span>
          </div>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            A professional travel and educational consultancy in Kumasi, Ghana — helping students,
            families and professionals reach the world with confidence.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/" },
              { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/" },
              { Icon: Twitter, label: "X", href: "https://x.com/" },
              { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`PACIFIC EDU CONSULT on ${label}`}
                className="bg-muted hover:bg-primary hover:text-primary-foreground grid size-9 place-items-center rounded-lg transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>

        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SERVICES.map((service) => (
              <li key={service.title}>
                <a
                  href="#services"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-border">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p>© {new Date().getFullYear()} PACIFIC EDU CONSULT</p>
          <p>Study Abroad Ghana • Visa Assistance • Travel Agency Kumasi</p>
        </div>
      </div>
    </footer>
  );
}
