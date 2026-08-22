import { GraduationCap, Stamp, Plane, BookOpenCheck } from "lucide-react";

export const CONSULTATION_TYPES = [
  {
    id: "study-abroad",
    title: "Study Abroad Consultation",
    duration: "45 min",
    blurb: "Course, university and scholarship shortlist built around your grades and budget.",
    icon: GraduationCap,
  },
  {
    id: "visa-review",
    title: "Visa & Documents Review",
    duration: "30 min",
    blurb: "We check your file, spot the gaps and prepare you for the interview.",
    icon: Stamp,
  },
  {
    id: "travel-planning",
    title: "Travel & Flight Planning",
    duration: "30 min",
    blurb: "Flights, hotels, insurance and airport pickup planned in one sitting.",
    icon: Plane,
  },
  {
    id: "test-prep",
    title: "IELTS / Test Prep Advice",
    duration: "30 min",
    blurb: "Target score, study plan and the right exam date for your application.",
    icon: BookOpenCheck,
  },
] as const;

export const MEETING_MODES = [
  { id: "in_person", label: "At the Kumasi office" },
  { id: "whatsapp", label: "WhatsApp video call" },
  { id: "phone", label: "Phone call" },
] as const;

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export function formatSlotTime(value: string) {
  const parts = value.split(":");
  const hour = Number(parts[0] ?? 0);
  const minute = parts[1] ?? "00";
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${minute} ${suffix}`;
}

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Office is closed on Sundays. */
export function isClosed(date: Date) {
  return date.getDay() === 0;
}
