import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, MessageCircle, Phone, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS, COUNTRIES, SERVICES } from "@/lib/site-content";
import { track } from "@/lib/analytics";
import { openWhatsApp } from "@/lib/whatsapp";
import { SectionHeading } from "./Section";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a reachable phone number")
    .max(25)
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain digits and + - ( )"),
  country: z.string().min(1, "Choose a destination"),
  service: z.string().min(1, "Choose a service"),
  message: z.string().trim().min(10, "Tell us a little about your plans").max(1000),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function Contact() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [country, setCountry] = useState("");
  const [service, setService] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = schema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      country,
      service,
      message: String(data.get("message") ?? ""),
    });

    if (!parsed.success) {
      const next: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    const v = parsed.data;
    const text = `New enquiry — PACIFIC EDU CONSULT\n\nName: ${v.name}\nEmail: ${v.email}\nPhone: ${v.phone}\nDestination: ${v.country}\nService: ${v.service}\n\n${v.message}`;
    track("enquiry_submit", v.service);
    openWhatsApp(undefined, "enquiry form", text);
    toast.success("Thank you! Your enquiry is ready to send on WhatsApp.");
    form.reset();
    setCountry("");
    setService("");
  }

  return (
    <section id="contact" className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Book your <span className="text-gradient-gold">free consultation</span>
            </>
          }
          description="Visit the office in Kumasi, call us, or send the form below — we usually reply the same day."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <div className="surface-navy rounded-3xl p-7">
              <p className="font-display text-xl font-bold">{BUSINESS.name}</p>
              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex gap-3.5">
                  <MapPin className="text-gold mt-0.5 size-5 shrink-0" />
                  <span className="text-navy-foreground/85">{BUSINESS.address}</span>
                </li>
                <li className="flex gap-3.5">
                  <Phone className="text-gold mt-0.5 size-5 shrink-0" />
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a
                      href={BUSINESS.phoneHref}
                      onClick={() => track("call_click", "contact details")}
                      className="hover:text-gold transition-colors"
                    >
                      Call the office
                    </a>
                    <a
                      href={BUSINESS.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => openWhatsApp(e, "contact details number")}
                      className="text-gold/90 hover:text-gold inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <MessageCircle className="size-3.5" /> WhatsApp this number
                    </a>
                  </span>
                </li>
                <li className="flex gap-3.5">
                  <Globe className="text-gold mt-0.5 size-5 shrink-0" />
                  <a
                    href={`https://${BUSINESS.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold text-navy-foreground/85 transition-colors"
                  >
                    {BUSINESS.website}
                  </a>
                </li>
                <li className="flex gap-3.5">
                  <Mail className="text-gold mt-0.5 size-5 shrink-0" />
                  <a
                    href={`mailto:${BUSINESS.email}?subject=Consultation%20enquiry`}
                    className="hover:text-gold transition-colors break-all"
                  >
                    Send us an email
                  </a>
                </li>
              </ul>
              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                <Button asChild variant="gold" size="lg">
                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => openWhatsApp(e, "contact card")}
                  >
                    <MessageCircle /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <a href={BUSINESS.phoneHref} onClick={() => track("call_click", "contact card")}>
                    <Phone /> Call now
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-card overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
              <iframe
                src={BUSINESS.mapsEmbed}
                title="PACIFIC EDU CONSULT office location in Kumasi, Ghana"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
              />
              <a
                href={BUSINESS.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors"
              >
                <MapPin className="text-gold size-4" /> Get directions to our office
              </a>
            </div>

          </div>

          <form
            id="apply"
            onSubmit={onSubmit}
            noValidate
            className="bg-card rounded-3xl border border-border p-7 shadow-[var(--shadow-soft)] sm:p-9"
          >
            <h3 className="text-xl font-bold">Apply now / request a call back</h3>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Fill this in once — your advisor will come back with a personalised plan.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <Input id="name" name="name" maxLength={100} placeholder="Kwame Mensah" />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={255}
                  placeholder="you@email.com"
                />
              </Field>
              <Field label="Phone / WhatsApp" error={errors.phone}>
                <Input id="phone" name="phone" maxLength={25} placeholder="Your phone / WhatsApp number" />
              </Field>
              <Field label="Destination" error={errors.country}>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.flag} {c.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="Not decided yet">Not decided yet</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Service needed" error={errors.service}>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.title} value={s.title}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Tell us about your plans" error={errors.message}>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={1000}
                    placeholder="I completed SHS in 2024 and would like to study nursing in Canada..."
                  />
                </Field>
              </div>
            </div>

            <Button type="submit" variant="gold" size="xl" className="mt-7 w-full">
              <Send /> Send my enquiry
            </Button>
            <p className="text-muted-foreground mt-3 text-center text-xs">
              Your details are only used to respond to your enquiry.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold tracking-wide uppercase">{label}</Label>
      {children}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
