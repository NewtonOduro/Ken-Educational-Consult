import { auth, defineMcp } from "@lovable.dev/mcp-js";
import checkAvailabilityTool from "./tools/check-availability";
import getPerformanceSummaryTool from "./tools/get-performance-summary";
import listBookingsTool from "./tools/list-bookings";
import listEnquiriesTool from "./tools/list-enquiries";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "dream-abroad-agency",
  title: "Dream Abroad Agency",
  version: "0.1.0",
  instructions:
    "Tools for the Ken Educational Consult travel and study-abroad consultancy. Use check_availability before proposing consultation times, get_performance_summary for aggregate conversion numbers (staff and admin), and list_bookings / list_enquiries for client contact details (admin accounts only).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  // Cast: these tools declare no outputSchema, which the SDK's tool union
  // requires as a present-but-optional property under exactOptionalPropertyTypes.
  tools: [
    checkAvailabilityTool,
    getPerformanceSummaryTool,
    listBookingsTool,
    listEnquiriesTool,
  ] as unknown as Parameters<typeof defineMcp>[0]["tools"],
});
