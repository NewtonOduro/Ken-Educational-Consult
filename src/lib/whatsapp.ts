import { BUSINESS } from "@/lib/site-content";
import { track } from "@/lib/analytics";

const WA_BASE = "https://wa.me/233544728988";

export function whatsappUrl(text?: string) {
  if (!text) return BUSINESS.whatsapp;
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
}

/**
 * Opens WhatsApp in a real top-level tab. Inside embedded previews a plain
 * link can be blocked (ERR_BLOCKED_BY_RESPONSE), so we escape the frame.
 */
export function openWhatsApp(
  e: { preventDefault: () => void } | undefined,
  label: string,
  text?: string,
) {
  e?.preventDefault();
  track("whatsapp_open", label);
  const url = whatsappUrl(text);
  let opened: Window | null = null;
  try {
    opened = window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    opened = null;
  }
  if (opened) return;
  try {
    if (window.top) window.top.location.href = url;
    else window.location.href = url;
  } catch {
    window.location.href = url;
  }
}
