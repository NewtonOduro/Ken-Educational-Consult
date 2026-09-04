import { GraduationCap, Stamp, Plane, BookOpenCheck, Landmark, Briefcase } from "lucide-react";

export const BUSINESS = {
  name: "Ken Educational Consult",
  tagline: "Study • Travel • Global Opportunities",
  address: "Atonsu S' Line Junction, AK-376-2269, Kumasi, Ghana",
  phoneHref: "tel:+233544728988",
  whatsapp:
    "https://wa.me/233544728988?text=Hello%20Ken%20Educational%20Consult%2C%20I%27d%20like%20a%20free%20consultation.",
  website: "keneducationalconsult.com",
  email: "info@keneducationalconsult.com",
  mapsEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=-1.6206%2C6.6328%2C-1.5806%2C6.6728&layer=mapnik&marker=6.6528%2C-1.6006",
  mapsLink:
    "https://www.google.com/maps/dir/?api=1&destination=Atonsu+S+Line+Junction%2C+Kumasi%2C+Ghana",
} as const;

export const SERVICES = [
  {
    icon: GraduationCap,
    title: "Study Abroad",
    blurb: "Placement into trusted universities and colleges, start to finish.",
    items: [
      "University admissions",
      "College applications",
      "Scholarship assistance",
      "Admission guidance",
    ],
  },
  {
    icon: Stamp,
    title: "Visa Assistance",
    blurb: "Documentation and interview coaching with a high approval record.",
    items: [
      "Student & visitor visa",
      "Tourist & business visa",
      "Visa documentation",
      "Interview preparation",
    ],
  },
  {
    icon: Plane,
    title: "Travel Services",
    blurb: "Every detail of your trip handled by one dedicated team.",
    items: [
      "Flight booking",
      "Hotel reservations",
      "Travel insurance",
      "Airport pickup & holiday packages",
    ],
  },
  {
    icon: BookOpenCheck,
    title: "Test Preparation",
    blurb: "Score-focused coaching for the exams your school requires.",
    items: ["IELTS & TOEFL", "SAT", "GRE & GMAT", "Language preparation"],
  },
  {
    icon: Landmark,
    title: "Immigration Guidance",
    blurb: "Clear, honest advice on staying and settling legally.",
    items: ["Residency advice", "Documentation", "Consultation", "Family support"],
  },
  {
    icon: Briefcase,
    title: "Career Abroad",
    blurb: "Build an international career with guidance that opens doors.",
    items: ["International job guidance", "CV review", "Career counseling", "Interview coaching"],
  },
] as const;

export const COUNTRIES = [
  { name: "Canada", flag: "🇨🇦", note: "Post-study work permits" },
  { name: "United Kingdom", flag: "🇬🇧", note: "1-year master's degrees" },
  { name: "United States", flag: "🇺🇸", note: "Scholarship-rich campuses" },
  { name: "Australia", flag: "🇦🇺", note: "Work while you study" },
  { name: "Germany", flag: "🇩🇪", note: "Low & no tuition options" },
  { name: "Ireland", flag: "🇮🇪", note: "Tech & pharma hubs" },
  { name: "Netherlands", flag: "🇳🇱", note: "English-taught programs" },
  { name: "France", flag: "🇫🇷", note: "Affordable public schools" },
  { name: "Dubai (UAE)", flag: "🇦🇪", note: "Fast visa processing" },
  { name: "China", flag: "🇨🇳", note: "Generous scholarships" },
] as const;

export const REASONS = [
  { title: "Experienced Consultants", text: "A team that has guided hundreds of applications." },
  { title: "High Visa Success Rate", text: "Airtight files reviewed before every submission." },
  { title: "Personalized Guidance", text: "One advisor with you from first call to boarding." },
  { title: "Affordable Packages", text: "Clear service tiers that fit real family budgets." },
  { title: "Trusted by Students", text: "Referrals from students already studying abroad." },
  { title: "Transparent Process", text: "No hidden charges, no vague promises, ever." },
  { title: "Fast Application Support", text: "Deadlines tracked so you never miss an intake." },
  { title: "Friendly Customer Service", text: "Reachable on WhatsApp, phone and in office." },
] as const;

export const STEPS = [
  { title: "Book Consultation", text: "Free session to understand your goals and budget." },
  { title: "Choose Country", text: "We match you to the best destination for your profile." },
  { title: "Select School", text: "Shortlist programs with real admission chances." },
  { title: "Prepare Documents", text: "Transcripts, funds, statements — checked line by line." },
  { title: "Submit Application", text: "We file, track and follow up with the institution." },
  { title: "Receive Admission", text: "Offer letter secured and acceptance confirmed." },
  { title: "Apply for Visa", text: "Full visa file plus interview rehearsal." },
  { title: "Travel Abroad", text: "Flights, insurance and airport pickup arranged." },
] as const;

export const STATS = [
  { value: 1000, suffix: "+", label: "Happy Clients" },
  { value: 500, suffix: "+", label: "Student Visas" },
  { value: 50, suffix: "+", label: "Partner Institutions" },
  { value: 10, suffix: "+", label: "Destination Countries" },
  { value: 95, suffix: "%", label: "Client Satisfaction" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Ken Educational Consult made my dream of studying in Canada a reality. The process was smooth, and their support was outstanding.",
    name: "Akosua Mensah",
    role: "MSc Student, Toronto 🇨🇦",
    initials: "AM",
  },
  {
    quote:
      "They reviewed every document twice before submission. My UK student visa was approved on the first attempt.",
    name: "Kwame Boateng",
    role: "MBA Student, Manchester 🇬🇧",
    initials: "KB",
  },
  {
    quote:
      "I walked in with only my results slip. They found the school, the scholarship and even booked my flight.",
    name: "Yaa Asantewaa",
    role: "Undergraduate, Berlin 🇩🇪",
    initials: "YA",
  },
  {
    quote:
      "Professional from start to finish. My family visitor visa and hotel bookings were handled in under three weeks.",
    name: "Mr. Owusu Ansah",
    role: "Business Traveller, Dubai 🇦🇪",
    initials: "OA",
  },
] as const;

export const BADGES = [
  "Trusted Educational Consultant",
  "Visa Assistance",
  "Professional Travel Agency",
  "Student Support",
  "Secure Process",
] as const;

export const FAQS = [
  {
    q: "Which countries do you support?",
    a: "We actively place students in Canada, the UK, USA, Australia, Germany, Ireland, the Netherlands, France, Dubai (UAE) and China, and we arrange travel to most other destinations on request.",
  },
  {
    q: "How long does visa processing take?",
    a: "It depends on the embassy and season. Student visas typically take 3–8 weeks after a complete submission, while visitor and business visas often complete in 2–4 weeks. We tell you the realistic timeline before you pay anything.",
  },
  {
    q: "Can you help with scholarships?",
    a: "Yes. We identify tuition waivers, merit awards and partial scholarships you actually qualify for, then help you write and submit the supporting essays and references.",
  },
  {
    q: "What documents are required?",
    a: "Generally a valid passport, academic transcripts and certificates, English test results where required, proof of funds or sponsorship, a statement of purpose and passport photographs. You get a personalised checklist at your first consultation.",
  },
  {
    q: "How much are consultation fees?",
    a: "Your first consultation is completely free. After that we offer transparent, affordable service packages quoted upfront based on the country and services you need — no hidden charges.",
  },
] as const;

export const POSTS = [
  {
    title: "Studying in Canada from Ghana: the 2026 checklist",
    category: "Study Abroad",
    read: "6 min read",
    excerpt:
      "Intake dates, proof-of-funds amounts and the documents Canadian visa officers look for first.",
  },
  {
    title: "IELTS in 6 weeks: a realistic study plan",
    category: "Test Prep",
    read: "5 min read",
    excerpt: "How our students move from a band 6 to a band 7.5 without quitting school or work.",
  },
  {
    title: "10 mistakes that get student visas refused",
    category: "Visa Tips",
    read: "7 min read",
    excerpt: "Most refusals are avoidable. Here is what we fix before any application is filed.",
  },
] as const;

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

/** Longer list used in the footer only — the navbar stays intentionally short. */
export const FOOTER_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Book Online", href: "#booking" },
  { label: "Destinations", href: "#destinations" },
  { label: "Why Us", href: "#why-us" },
  { label: "Process", href: "#process" },
  { label: "Stories", href: "#stories" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;
