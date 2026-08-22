import { supabase } from "@/integrations/supabase/client";

export const ANALYTICS_EVENTS = {
  cta_click: "cta_click",
  whatsapp_open: "whatsapp_open",
  call_click: "call_click",
  enquiry_submit: "enquiry_submit",
  booking_submit: "booking_submit",
} as const;

export type AnalyticsEvent = keyof typeof ANALYTICS_EVENTS;

export const EVENT_LABELS: Record<string, string> = {
  cta_click: "CTA clicks",
  whatsapp_open: "WhatsApp opens",
  call_click: "Call button taps",
  enquiry_submit: "Enquiry form submissions",
  booking_submit: "Bookings submitted",
};

/** Fire-and-forget conversion tracking. Never blocks or breaks the UI. */
export function track(event: AnalyticsEvent, label?: string) {
  if (typeof window === "undefined") return;
  void supabase
    .from("analytics_events")
    .insert({
      event_name: event,
      label: label ?? null,
      path: window.location.pathname,
    })
    .then(({ error }) => {
      if (error) console.warn("[analytics]", error.message);
    });
}
