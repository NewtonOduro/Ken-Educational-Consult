import { useEffect, useRef } from "react";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site-content";
import { track } from "@/lib/analytics";
import { openWhatsApp } from "@/lib/whatsapp";
import heroImage from "@/assets/hero.jpg";

const PROOF = ["Free eligibility check", "Scholarship guidance", "Full visa document support"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playVideo = () => {
      if (!videoRef.current) return;
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        console.log("Autoplay was prevented by browser:", error);
      });
    };

    playVideo();
  }, []);

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      <video
        ref={videoRef}
        src="/airport.mp4"
        poster={heroImage}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        webkit-playsinline="true"
        aria-hidden="true"
        onCanPlay={() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch((err) => console.log("Replay error:", err));
          }
        }}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch((err) => console.log("Replay error:", err));
          }
        }}
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full min-h-[100svh] object-cover object-center"
      />
      <div className="from-black/95 via-black/80 to-black/60 absolute inset-0 -z-10 bg-gradient-to-r" />

      <div className="text-navy-foreground mx-auto max-w-4xl px-5 pt-24 pb-24 text-center md:px-6 lg:pt-32 lg:pb-32">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="border-gold/40 bg-navy-foreground/10 text-gold inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.16em] uppercase backdrop-blur"
        >
          <Sparkles className="size-3.5" /> Kumasi&apos;s trusted education &amp; travel partner
        </motion.p>

        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-6 text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl"
        >
          Your Journey to Study, Travel &amp;{" "}
          <span className="text-gradient-gold">Global Opportunities</span> Starts Here.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="text-navy-foreground/85 mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          From university admissions and visa assistance to international travel planning, Ken
          Educational Consult helps you confidently achieve your dreams abroad.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Button asChild variant="gold" size="xl">
            <a href="#booking" onClick={() => track("cta_click", "hero — book consultation")}>
              Book Free Consultation <ArrowRight />
            </a>
          </Button>
          <Button asChild variant="glass" size="xl">
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openWhatsApp(e, "hero")}
            >
              <MessageCircle /> Chat on WhatsApp
            </a>
          </Button>
        </motion.div>

        <motion.ul
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="text-navy-foreground/80 mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
        >
          {PROOF.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <ShieldCheck className="text-gold size-4 shrink-0" /> {item}
            </li>
          ))}
        </motion.ul>

        <motion.dl
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
          className="border-navy-foreground/20 mx-auto mt-12 grid max-w-xl grid-cols-3 gap-6 border-t pt-7"
        >
          {[
            { k: "1,000+", v: "Happy clients" },
            { k: "500+", v: "Student visas" },
            { k: "10+", v: "Countries" },
          ].map((item) => (
            <div key={item.v}>
              <dt className="font-display text-gold text-2xl font-bold sm:text-3xl">{item.k}</dt>
              <dd className="text-navy-foreground/70 text-xs tracking-wide uppercase">{item.v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
