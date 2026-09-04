import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const rangeSchema = () =>
  z.object({
    fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  });

export type BookedSlot = { slot_date: string; slot_time: string };

/**
 * Public availability lookup. Returns ONLY taken date/time pairs (never PII),
 * using a privileged server-side client so no database role needs read access
 * to the bookings table.
 */
export const getBookedSlots = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => rangeSchema().parse(input))
  .handler(async ({ data }): Promise<BookedSlot[]> => {
    const from = new Date(`${data.fromDate}T00:00:00Z`);
    const requestedTo = new Date(`${data.toDate}T00:00:00Z`);
    const maxTo = new Date(from.getTime() + 120 * 24 * 60 * 60 * 1000);
    const to = requestedTo < maxTo ? requestedTo : maxTo;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select("slot_date, slot_time")
      .neq("status", "cancelled")
      .gte("slot_date", data.fromDate)
      .lte("slot_date", to.toISOString().slice(0, 10));

    if (error) throw new Error("Could not load availability");

    return (rows ?? []).map((r) => ({ slot_date: r.slot_date, slot_time: r.slot_time }));
  });

const createSchema = () =>
  z.object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(25)
      .regex(/^[0-9+\-\s()]+$/),
    consultationType: z.string().trim().min(2).max(120),
    destination: z.string().trim().max(120).optional().nullable(),
    meetingMode: z.enum(["in_person", "whatsapp", "phone"]),
    slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    slotTime: z.string().regex(/^\d{2}:\d{2}$/),
    notes: z.string().trim().max(1000).optional().nullable(),
  });

/**
 * Booking creation runs server-side with strict validation, so the bookings
 * table needs no public INSERT policy and stays fully locked to staff reads.
 */
export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema().parse(input))
  .handler(async ({ data }): Promise<{ reference: string }> => {
    const slotDay = new Date(`${data.slotDate}T00:00:00Z`);
    const todayKey = new Date().toISOString().slice(0, 10);
    const maxDay = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000);
    if (data.slotDate < todayKey || slotDay > maxDay) {
      throw new Error("Please choose a date within the next few weeks");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const reference = `PEC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const { error } = await supabaseAdmin.from("bookings").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      consultation_type: data.consultationType,
      destination: data.destination ?? null,
      meeting_mode: data.meetingMode,
      slot_date: data.slotDate,
      slot_time: data.slotTime,
      notes: data.notes ?? null,
      reference,
    });

    if (error) {
      if (error.code === "23505" || /duplicate/i.test(error.message)) {
        throw new Error("SLOT_TAKEN");
      }
      throw new Error("Could not save the booking");
    }

    return { reference };
  });
