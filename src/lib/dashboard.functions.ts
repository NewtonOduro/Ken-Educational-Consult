import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DashboardSummary = {
  bookings_total: number;
  bookings_last_7_days: number;
  bookings_upcoming: number;
  events_total: number;
  events_last_7_days: number;
  events_by_name: { event_name: string; total: number; last_7_days: number }[];
  bookings_by_type: { consultation_type: string; total: number }[];
  daily: { day: string; bookings: number; events: number }[];
};

const dayKey = (value: string) => new Date(value).toISOString().slice(0, 10);

export const getDashboardSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardSummary> => {
    // Staff-only: verify the caller holds an admin/staff role before reading business data.
    const { data: roles, error: rolesError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);

    if (rolesError) throw new Error("Could not verify access");
    const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "staff");
    if (!allowed) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [bookingsRes, eventsRes] = await Promise.all([
      supabaseAdmin.from("bookings").select("consultation_type, slot_date, status, created_at"),
      supabaseAdmin.from("analytics_events").select("event_name, created_at"),
    ]);

    if (bookingsRes.error || eventsRes.error) throw new Error("Could not load the summary");

    const bookings = bookingsRes.data ?? [];
    const events = eventsRes.data ?? [];

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const todayKey = new Date().toISOString().slice(0, 10);
    const isRecent = (created: string) => new Date(created).getTime() > sevenDaysAgo;

    const eventsByName = new Map<string, { total: number; last_7_days: number }>();
    for (const e of events) {
      const entry = eventsByName.get(e.event_name) ?? { total: 0, last_7_days: 0 };
      entry.total += 1;
      if (isRecent(e.created_at)) entry.last_7_days += 1;
      eventsByName.set(e.event_name, entry);
    }

    const byType = new Map<string, number>();
    for (const b of bookings) {
      byType.set(b.consultation_type, (byType.get(b.consultation_type) ?? 0) + 1);
    }

    const daily: DashboardSummary["daily"] = [];
    for (let i = 13; i >= 0; i -= 1) {
      const day = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      daily.push({
        day,
        bookings: bookings.filter((b) => dayKey(b.created_at) === day).length,
        events: events.filter((e) => dayKey(e.created_at) === day).length,
      });
    }

    return {
      bookings_total: bookings.length,
      bookings_last_7_days: bookings.filter((b) => isRecent(b.created_at)).length,
      bookings_upcoming: bookings.filter((b) => b.slot_date >= todayKey && b.status !== "cancelled")
        .length,
      events_total: events.length,
      events_last_7_days: events.filter((e) => isRecent(e.created_at)).length,
      events_by_name: [...eventsByName.entries()]
        .map(([event_name, v]) => ({ event_name, ...v }))
        .sort((a, b) => b.total - a.total),
      bookings_by_type: [...byType.entries()]
        .map(([consultation_type, total]) => ({ consultation_type, total }))
        .sort((a, b) => b.total - a.total),
      daily,
    };
  });
