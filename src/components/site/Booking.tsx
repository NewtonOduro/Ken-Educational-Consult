import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { track } from "@/lib/analytics";
import { createBooking, getBookedSlots, type BookedSlot } from "@/lib/booking.functions";

import {
  CONSULTATION_TYPES,
  MEETING_MODES,
  TIME_SLOTS,
  formatSlotTime,
  isClosed,
  toDateKey,
} from "@/lib/booking-options";
import { COUNTRIES } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./Section";

const detailsSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a reachable phone number")
    .max(25)
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain digits and + - ( )"),
  notes: z.string().trim().max(1000).optional(),
});

type Errors = Partial<Record<"fullName" | "email" | "phone" | "notes", string>>;

const today = new Date();
const horizon = new Date();
horizon.setDate(horizon.getDate() + 60);

export function Booking() {
  const queryClient = useQueryClient();
  const [typeId, setTypeId] = useState<string>(CONSULTATION_TYPES[0].id);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [mode, setMode] = useState<string>(MEETING_MODES[0].id);
  const [destination, setDestination] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState<null | {
    reference: string;
    date: string;
    time: string;
    type: string;
  }>(null);

  const selectedType = CONSULTATION_TYPES.find((t) => t.id === typeId) ?? CONSULTATION_TYPES[0];

  const { data: taken = [] } = useQuery({
    queryKey: ["booked-slots"],
    queryFn: () =>
      getBookedSlots({ data: { fromDate: toDateKey(today), toDate: toDateKey(horizon) } }),
    staleTime: 60_000,
  });

  const takenForDay = useMemo(() => {
    if (!date) return new Set<string>();
    const key = toDateKey(date);
    return new Set(
      (taken as BookedSlot[]).filter((s) => s.slot_date === key).map((s) => s.slot_time),
    );
  }, [taken, date]);

  const mutation = useMutation({
    mutationFn: async (payload: {
      fullName: string;
      email: string;
      phone: string;
      notes?: string | undefined;
      slotDate: string;
      slotTime: string;
    }) => {
      const result = await createBooking({
        data: {
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          consultationType: selectedType.title,
          destination: destination || null,
          meetingMode: mode as "in_person" | "whatsapp" | "phone",
          slotDate: payload.slotDate,
          slotTime: payload.slotTime,
          notes: payload.notes ?? null,
        },
      });
      return result.reference;
    },
    onSuccess: (reference, variables) => {
      track("booking_submit", selectedType.title);
      setConfirmed({
        reference,
        date: variables.slotDate,
        time: variables.slotTime,
        type: selectedType.title,
      });
      toast.success("Booking received — check the confirmation details.");
      void queryClient.invalidateQueries({ queryKey: ["booked-slots"] });
    },
    onError: (error: { message?: string; code?: string }) => {
      if (error?.message?.includes("SLOT_TAKEN") || error?.message?.includes("duplicate")) {
        toast.error("That slot was just taken. Please pick another time.");
        setTime("");
        void queryClient.invalidateQueries({ queryKey: ["booked-slots"] });
        return;
      }
      toast.error("We couldn't save your booking. Please try again or reach us on WhatsApp.");
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!date || !time) {
      toast.error("Choose a date and a time slot first.");
      return;
    }

    const parsed = detailsSchema.safeParse({
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("bookingEmail") ?? ""),
      phone: String(data.get("bookingPhone") ?? ""),
      notes: String(data.get("bookingNotes") ?? ""),
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    mutation.mutate({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      notes: parsed.data.notes,
      slotDate: toDateKey(date),
      slotTime: time,
    });
  }

  if (confirmed) {
    return (
      <section id="booking" className="py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-5 md:px-6">
          <div className="bg-card rounded-3xl border border-border p-9 text-center shadow-[var(--shadow-soft)]">
            <span className="bg-gold/15 text-gold mx-auto grid size-16 place-items-center rounded-2xl">
              <CheckCircle2 className="size-8" />
            </span>
            <h2 className="mt-6 text-2xl font-bold sm:text-3xl">Your slot is reserved</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              An advisor will confirm by phone or WhatsApp shortly. Keep your reference handy.
            </p>
            <dl className="mt-7 grid gap-3 text-left text-sm">
              <Row label="Reference" value={confirmed.reference} />
              <Row label="Consultation" value={confirmed.type} />
              <Row
                label="Date"
                value={new Date(`${confirmed.date}T00:00:00`).toLocaleDateString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <Row label="Time" value={formatSlotTime(confirmed.time)} />
              <Row
                label="Mode"
                value={MEETING_MODES.find((m) => m.id === mode)?.label ?? "At the Kumasi office"}
              />
            </dl>
            <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
              <Button
                variant="gold"
                size="lg"
                onClick={() => {
                  setConfirmed(null);
                  setDate(undefined);
                  setTime("");
                }}
              >
                Book another session
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#contact">Ask a question</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionHeading
          eyebrow="Online booking"
          title={
            <>
              Reserve your <span className="text-gradient-gold">consultation slot</span>
            </>
          }
          description="Pick the session you need, choose a date and time that suits you, and we'll confirm within hours."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-6">
            <div>
              <StepLabel step={1} text="Choose a consultation type" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {CONSULTATION_TYPES.map((t) => {
                  const active = t.id === typeId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTypeId(t.id)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-2xl border p-5 text-left transition-all",
                        active
                          ? "border-gold bg-gold/5 shadow-[var(--shadow-gold)]"
                          : "border-border bg-card hover:border-gold/50",
                      )}
                    >
                      <t.icon className={cn("size-6", active ? "text-gold" : "text-primary")} />
                      <p className="mt-3 text-sm font-semibold">{t.title}</p>
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {t.blurb}
                      </p>
                      <p className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs font-medium">
                        <Clock className="size-3.5" /> {t.duration}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <StepLabel step={2} text="Pick a date and time" />
              <div className="bg-card mt-4 rounded-3xl border border-border p-5 shadow-[var(--shadow-soft)]">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(next) => {
                    setDate(next);
                    setTime("");
                  }}
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0)) || d > horizon || isClosed(d)
                  }
                  className={cn("pointer-events-auto")}
                />
                <div className="mt-5 border-t border-border pt-5">
                  {date ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {TIME_SLOTS.map((slot) => {
                        const disabled = takenForDay.has(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={disabled}
                            onClick={() => setTime(slot)}
                            className={cn(
                              "rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors",
                              time === slot
                                ? "border-gold bg-gold text-gold-foreground"
                                : "border-border bg-background hover:border-gold/60",
                              disabled &&
                                "text-muted-foreground cursor-not-allowed line-through opacity-50",
                            )}
                          >
                            {formatSlotTime(slot)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Select a date to see available times. The office is closed on Sundays.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="bg-card h-fit rounded-3xl border border-border p-7 shadow-[var(--shadow-soft)] sm:p-9"
          >
            <StepLabel step={3} text="Your details" />
            <p className="text-muted-foreground mt-3 text-sm">
              {date && time ? (
                <span className="text-foreground font-medium">
                  {selectedType.title} ·{" "}
                  {new Date(`${toDateKey(date)}T00:00:00`).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  at {formatSlotTime(time)}
                </span>
              ) : (
                "No slot selected yet — choose a date and time on the left."
              )}
            </p>

            <div className="mt-6 grid gap-5">
              <BField label="Full name" error={errors.fullName}>
                <Input id="fullName" name="fullName" maxLength={100} placeholder="Kwame Mensah" />
              </BField>
              <BField label="Email" error={errors.email}>
                <Input
                  id="bookingEmail"
                  name="bookingEmail"
                  type="email"
                  maxLength={255}
                  placeholder="you@email.com"
                />
              </BField>
              <BField label="Phone / WhatsApp" error={errors.phone}>
                <Input
                  id="bookingPhone"
                  name="bookingPhone"
                  maxLength={25}
                  placeholder="Your phone / WhatsApp number"
                />
              </BField>
              <BField label="Preferred destination">
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger id="bookingDestination">
                    <SelectValue placeholder="Optional" />
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
              </BField>
              <BField label="How should we meet?">
                <div className="grid gap-2 sm:grid-cols-3">
                  {MEETING_MODES.map((m) => {
                    const Icon =
                      m.id === "in_person" ? MapPin : m.id === "whatsapp" ? MessageCircle : Phone;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMode(m.id)}
                        aria-pressed={mode === m.id}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors",
                          mode === m.id
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/60",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="text-left">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </BField>
              <BField label="Anything we should prepare?" error={errors.notes}>
                <Textarea
                  id="bookingNotes"
                  name="bookingNotes"
                  rows={4}
                  maxLength={1000}
                  placeholder="I have SHS results from 2024 and want nursing programmes in Canada..."
                />
              </BField>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="xl"
              className="mt-7 w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" /> Reserving your slot
                </>
              ) : (
                <>
                  <CalendarCheck /> Confirm my booking
                </>
              )}
            </Button>
            <p className="text-muted-foreground mt-3 flex items-center justify-center gap-1.5 text-center text-xs">
              <Sparkles className="size-3.5" /> Free of charge · no payment needed to book
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function StepLabel({ step, text }: { step: number; text: string }) {
  return (
    <p className="flex items-center gap-3 text-sm font-semibold">
      <span className="surface-navy grid size-7 shrink-0 place-items-center rounded-full text-xs">
        {step}
      </span>
      {text}
    </p>
  );
}

function BField({
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 flex items-center justify-between gap-4 rounded-xl px-4 py-3">
      <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-right text-sm font-semibold">{value}</dd>
    </div>
  );
}
