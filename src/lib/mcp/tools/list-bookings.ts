import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { deniedResult, resolveStaffRole, supabaseTrusted } from "../supabase";

export default defineTool({
  name: "list_bookings",
  title: "List consultation bookings",
  description:
    "List consultation bookings with client contact details. Admin accounts only; staff accounts get counts through get_performance_summary instead.",
  inputSchema: {
    limit: z.number().int().describe("How many bookings to return (1-50)."),
    upcoming_only: z.boolean().describe("True to return only bookings from today onwards."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, upcoming_only }, ctx) => {
    const role = await resolveStaffRole(ctx);
    if (!role) return deniedResult("Only Ken Educational Consult team accounts can use this tool.");
    if (role !== "admin") {
      return deniedResult(
        "Client contact details are restricted to admin accounts. Use get_performance_summary for aggregate numbers.",
      );
    }

    const capped = Math.min(Math.max(Math.trunc(limit) || 10, 1), 50);
    const supabase = await supabaseTrusted();
    let query = supabase
      .from("bookings")
      .select(
        "reference, full_name, email, phone, consultation_type, destination, meeting_mode, slot_date, slot_time, status, notes, created_at",
      )
      .order("slot_date", { ascending: true })
      .limit(capped);

    if (upcoming_only) {
      query = query.gte("slot_date", new Date().toISOString().slice(0, 10));
    }

    const { data, error } = await query;
    if (error) return deniedResult(error.message);

    const bookings = data ?? [];
    return {
      content: [
        {
          type: "text" as const,
          text: bookings.length
            ? bookings
                .map(
                  (b) =>
                    `${b.slot_date} ${b.slot_time} — ${b.full_name} (${b.consultation_type}, ${b.meeting_mode}, ${b.status})\n  ref ${b.reference} · ${b.email} · ${b.phone}${b.destination ? ` · destination: ${b.destination}` : ""}${b.notes ? `\n  notes: ${b.notes}` : ""}`,
                )
                .join("\n")
            : "No bookings match that request.",
        },
      ],
      structuredContent: { bookings },
    };
  },
});
