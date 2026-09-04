import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Services } from "@/components/site/Services";
import { Countries } from "@/components/site/Countries";
import { WhyUs } from "@/components/site/WhyUs";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";
import { Gallery } from "@/components/site/Gallery";
import { Blog } from "@/components/site/Blog";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Booking } from "@/components/site/Booking";
import { FinalCta } from "@/components/site/FinalCta";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FloatingActions } from "@/components/site/FloatingActions";
import { BUSINESS, FAQS } from "@/lib/site-content";

const TITLE = "Ken Educational Consult | Study Abroad & Visa Assistance, Kumasi";
const DESCRIPTION =
  "Study abroad, visa assistance and travel services in Kumasi, Ghana. University admissions, student visas, IELTS prep and flight booking with Ken Educational Consult.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "Study Abroad Ghana, Travel Agency Kumasi, Visa Assistance Ghana, Educational Consultancy Ghana, Student Visa Ghana, University Admission Ghana, Travel Consultant Kumasi, International Education Ghana",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["EducationalOrganization", "TravelAgency", "LocalBusiness"],
              name: BUSINESS.name,
              description: DESCRIPTION,
              url: `https://${BUSINESS.website}`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Atonsu S' Line Junction, AK-376-2269",
                addressLocality: "Kumasi",
                addressCountry: "GH",
              },
              areaServed: "Ghana",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "1000",
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Countries />
        <WhyUs />
        <Process />
        <Testimonials />
        <Gallery />
        <Blog />
        <Booking />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
