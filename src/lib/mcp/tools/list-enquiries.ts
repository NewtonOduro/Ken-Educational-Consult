import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { deniedResult, resolveStaffRole, supabaseTrusted } from "../supabase";

export default defineTool({
  name: "list_enquiries",
  title: "List website enquiries",
  description:
    "List enquiries submitted through the website contact form, including the sender's contact details. Admin accounts only.",
  inputSchema: {
    limit: z.number().int().describe("How many enquiries to return (1-50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const role = await resolveStaffRole(ctx);
    if (!role) return deniedResult("Only Ken Educational Consult team accounts can use this tool.");
    if (role !== "admin") {
      return deniedResult("Enquiry contact details are restricted to admin accounts.");
    }

    const capped = Math.min(Math.max(Math.trunc(limit) || 10, 1), 50);
    const supabase = await supabaseTrusted();
    const { data, error } = await supabase
      .from("enquiries")
      .select("full_name, email, phone, service, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(capped);

    if (error) return deniedResult(error.message);

    const enquiries = data ?? [];
    return {
      content: [
        {
          type: "text" as const,
          text: enquiries.length
            ? enquiries
                .map(
                  (e) =>
                    `${e.created_at.slice(0, 10)} — ${e.full_name} (${e.status})\n  ${e.email}${e.phone ? ` · ${e.phone}` : ""}${e.service ? ` · interested in ${e.service}` : ""}\n  ${e.message}`,
                )
                .join("\n")
            : "No enquiries yet.",
        },
      ],
      structuredContent: { enquiries },
    };
  },
});
