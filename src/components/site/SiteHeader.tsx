import { useEffect, useState } from "react";
import { Menu, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BUSINESS, NAV_LINKS } from "@/lib/site-content";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";


export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="surface-navy hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2 text-xs">
          <p className="flex items-center gap-2 opacity-90">
            <Globe2 className="size-3.5" /> {BUSINESS.tagline}
          </p>
          <div className="flex items-center gap-5 opacity-90">
            <span className="hidden lg:inline">{BUSINESS.address}</span>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/90 backdrop-blur-xl shadow-[var(--shadow-soft)]"
            : "bg-background",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 md:px-6">
          <a href="#top" className="flex items-center gap-3">
            <span className="surface-navy grid size-11 place-items-center rounded-xl">
              <Globe2 className="size-6 text-gold" />
            </span>
            <span className="leading-tight">
              <span className="font-display block text-base font-bold tracking-tight sm:text-lg">
                PACIFIC <span className="text-gold">EDU</span> CONSULT
              </span>
              <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.2em] uppercase">
                Kumasi • Ghana
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground/75 hover:text-primary relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="gold" size="lg" className="hidden sm:inline-flex">
              <a href="#booking" onClick={() => track("cta_click", "header — book consultation")}>
                Book Free Consultation
              </a>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[78%] sm:w-80">
                <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="hover:bg-muted rounded-lg px-3 py-3 text-base font-medium"
                    >
                      {link.label}
                    </a>
                  ))}
                  <Button asChild variant="gold" size="lg" className="mt-4">
                    <a
                      href="#booking"
                      onClick={() => {
                        track("cta_click", "mobile menu — book consultation");
                        setOpen(false);
                      }}
                    >
                      Book Free Consultation
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="mt-2">
                    <a href={BUSINESS.phoneHref} onClick={() => track("call_click", "mobile menu")}>
                      Call Us
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>


          </div>
        </div>
      </header>
    </>
  );
}
