import { Reveal, SectionHeading } from "./Section";
import hero from "@/assets/hero.jpg";
import counseling from "@/assets/counseling.jpg";
import visa from "@/assets/visa.jpg";
import campus from "@/assets/campus.jpg";
import traveler from "@/assets/traveler.jpg";

const IMAGES = [
  { src: hero, alt: "Graduating international students celebrating at an airport", span: "sm:col-span-2 sm:row-span-2" },
  { src: visa, alt: "Approved visa inside a passport with an airline boarding pass" },
  { src: campus, alt: "University campus quad with students walking between lectures" },
  { src: counseling, alt: "Counselling session between a consultant and a student" },
  { src: traveler, alt: "Happy traveller with a suitcase in an airport departure hall" },
];

export function Gallery() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionHeading
          eyebrow="Gallery"
          title={
            <>
              Moments from the <span className="text-gradient-gold">journeys we plan</span>
            </>
          }
          description="Counselling sessions, visa approvals, passport handovers, campuses and departures."
        />

        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[200px] sm:grid-cols-4">
          {IMAGES.map((image, i) => (
            <Reveal
              key={image.alt}
              delay={i * 60}
              className={`overflow-hidden rounded-2xl ${image.span ?? ""}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
