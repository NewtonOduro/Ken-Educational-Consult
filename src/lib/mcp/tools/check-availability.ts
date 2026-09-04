import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { deniedResult, resolveStaffRole, supabaseForUser } from "../supabase";

export default defineTool({
  name: "check_availability",
  title: "Check consultation availability",
  description:
    "List the consultation slots already taken between two dates (YYYY-MM-DD), so free times can be offered to a client.",
  inputSchema: {
    from_date: z.string().describe("Start date, YYYY-MM-DD."),
    to_date: z.string().describe("End date, YYYY-MM-DD."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ from_date, to_date }, ctx) => {
    const role = await resolveStaffRole(ctx);
    if (!role) return deniedResult("Only Ken Educational Consult team accounts can use this tool.");

    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("bookings")
      .select("slot_date, slot_time")
      .gte("slot_date", from_date)
      .lte("slot_date", to_date)
      .order("slot_date");

    if (error) return deniedResult(error.message);

    const taken = data ?? [];
    return {
      content: [
        {
          type: "text" as const,
          text: taken.length
            ? `Taken slots between ${from_date} and ${to_date}:\n${taken
                .map((slot) => `- ${slot.slot_date} at ${slot.slot_time}`)
                .join("\n")}`
            : `No slots are taken between ${from_date} and ${to_date}.`,
        },
      ],
      structuredContent: { taken },
    };
  },
});
