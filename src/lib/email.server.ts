/**
 * Transactional email sending (server-only).
 * Uses the Resend HTTP API — no Node-only SDK, safe in the Worker runtime.
 * If no API key is configured the send is skipped silently so bookings never fail.
 */

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendArgs): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) return false;

  const from = process.env["EMAIL_FROM"] ?? "Ken Educational Consult <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function bookingConfirmationHtml(args: {
  fullName: string;
  reference: string;
  consultationType: string;
  slotDate: string;
  slotTime: string;
  meetingMode: string;
  destination?: string | null;
}): string {
  const modeLabel =
    args.meetingMode === "whatsapp"
      ? "WhatsApp video call"
      : args.meetingMode === "phone"
        ? "Phone call"
        : "At our Kumasi office";

  const prettyDate = new Date(`${args.slotDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const row = (label: string, value: string) =>
    `<tr><td style="padding:10px 0;color:#8b93a7;font-size:12px;letter-spacing:.08em;text-transform:uppercase">${label}</td><td style="padding:10px 0;text-align:right;font-size:14px;font-weight:600;color:#0b1220">${value}</td></tr>`;

  return `<!doctype html><html><body style="margin:0;background:#f5f6f8;font-family:Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#0b1220;padding:24px 28px;color:#ffffff">
          <div style="font-size:18px;font-weight:700">Ken <span style="color:#d4af37">Educational</span> Consult</div>
          <div style="font-size:12px;opacity:.75;margin-top:4px">Study • Travel • Global Opportunities</div>
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 8px;font-size:20px;color:#0b1220">Your consultation is reserved</h1>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#4b5468">
            Hi ${args.fullName}, thank you for booking with us. An advisor will confirm your session shortly.
            Please keep your reference number handy.
          </p>
          <div style="background:#fdf7e6;border:1px solid #e6d28f;border-radius:12px;padding:16px;text-align:center;margin-bottom:20px">
            <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8a7420">Booking reference</div>
            <div style="font-size:24px;font-weight:700;letter-spacing:.08em;color:#0b1220;margin-top:6px">${args.reference}</div>
          </div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Consultation", args.consultationType)}
            ${row("Date", prettyDate)}
            ${row("Time", args.slotTime)}
            ${row("Meeting mode", modeLabel)}
            ${args.destination ? row("Destination", args.destination) : ""}
          </table>
          <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#4b5468">
            Need to reschedule or ask something first? Just reply to this email and quote your reference.
          </p>
        </td></tr>
        <tr><td style="padding:18px 28px;background:#f5f6f8;font-size:11px;color:#8b93a7">
          Atonsu S' Line Junction, AK-376-2269, Kumasi, Ghana
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
