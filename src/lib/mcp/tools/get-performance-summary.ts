import { defineTool } from "@lovable.dev/mcp-js";
import { deniedResult, resolveStaffRole, supabaseTrusted } from "../supabase";

export default defineTool({
  name: "get_performance_summary",
  title: "Get performance summary",
  description:
    "Aggregate conversion numbers for the consultancy: bookings, upcoming sessions, tracked interactions and enquiry volume. No client contact details. Available to staff and admin accounts.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const role = await resolveStaffRole(ctx);
    if (!role) return deniedResult("Only Ken Educational Consult team accounts can use this tool.");

    const supabase = await supabaseTrusted();
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [bookings, events, enquiries] = await Promise.all([
      supabase.from("bookings").select("consultation_type, slot_date, status, created_at"),
      supabase.from("analytics_events").select("event_name, created_at"),
      supabase.from("enquiries").select("created_at"),
    ]);

    if (bookings.error || events.error || enquiries.error) {
      return deniedResult(
        bookings.error?.message ??
          events.error?.message ??
          enquiries.error?.message ??
          "Read failed",
      );
    }

    const bookingRows = bookings.data ?? [];
    const eventRows = events.data ?? [];
    const enquiryRows = enquiries.data ?? [];

    const byType: Record<string, number> = {};
    for (const row of bookingRows) {
      byType[row.consultation_type] = (byType[row.consultation_type] ?? 0) + 1;
    }
    const byEvent: Record<string, number> = {};
    for (const row of eventRows) {
      byEvent[row.event_name] = (byEvent[row.event_name] ?? 0) + 1;
    }

    const summary = {
      role,
      bookings_total: bookingRows.length,
      bookings_last_7_days: bookingRows.filter((b) => b.created_at > weekAgo).length,
      bookings_upcoming: bookingRows.filter((b) => b.slot_date >= today && b.status !== "cancelled")
        .length,
      bookings_by_type: byType,
      tracked_events_total: eventRows.length,
      tracked_events_last_7_days: eventRows.filter((e) => e.created_at > weekAgo).length,
      tracked_events_by_name: byEvent,
      enquiries_total: enquiryRows.length,
      enquiries_last_7_days: enquiryRows.filter((e) => e.created_at > weekAgo).length,
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
