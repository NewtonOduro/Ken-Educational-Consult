import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Eyebrow,
  Flare,
  Gold,
  Headline,
  Particles,
  Sub,
  useSpringIn,
} from "../components/kit";
import { C } from "../theme";
import { BODY } from "../fonts";

const SERVICES = [
  "Study Abroad Admissions",
  "Visa Assistance",
  "Travel & Flight Booking",
  "Tourism Packages",
  "IELTS / Test Preparation",
  "Career Counselling",
];

const CONTACT = [
  { k: "Call or WhatsApp", v: "+233 55 000 0000" },
  { k: "Office", v: "Atonsu S' Line Junction, Kumasi" },
  { k: "Online", v: "pacificeduconsult.com" },
];

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [40, 90], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop tone="deep" />
      <Particles count={56} seed={53} />
      <Flare x={1500} y={860} scale={1.5} opacity={0.25} />

      <AbsoluteFill style={{ padding: "90px 110px", justifyContent: "center" }}>
        <Eyebrow delay={4}>Your next chapter</Eyebrow>
        <div style={{ marginTop: 26 }}>
          <Headline delay={12} size={112}>
            Your Future Begins <Gold>Today.</Gold>
          </Headline>
        </div>
        <div style={{ marginTop: 26, maxWidth: 900 }}>
          <Sub delay={34}>
            Study. Travel. Succeed. One trusted partner from your first question to your first day
            abroad.
          </Sub>
        </div>

        <div
          style={{
            height: 2,
            marginTop: 52,
            background: `linear-gradient(90deg, ${C.gold}, rgba(245,222,139,0))`,
            width: `${rule * 100}%`,
          }}
        />

        <div
          style={{
            marginTop: 52,
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 80,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {SERVICES.map((s, i) => {
              const p = useSpringIn(70 + i * 9, 20);
              return (
                <div
                  key={s}
                  style={{
                    fontFamily: BODY,
                    fontSize: 27,
                    color: "rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 26}px)`,
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 999,
                      background: C.gold,
                      flexShrink: 0,
                    }}
                  />
                  {s}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {CONTACT.map((c, i) => {
              const p = useSpringIn(130 + i * 12, 20);
              return (
                <div
                  key={c.k}
                  style={{
                    opacity: p,
                    transform: `translateX(${(1 - p) * 36}px)`,
                    borderLeft: `2px solid ${C.gold}`,
                    paddingLeft: 22,
                  }}
                >
                  <div
                    style={{
                      fontFamily: BODY,
                      fontSize: 17,
                      letterSpacing: 4,
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {c.k}
                  </div>
                  <div
                    style={{
                      fontFamily: BODY,
                      fontWeight: 600,
                      fontSize: 28,
                      color: C.white,
                      marginTop: 6,
                    }}
                  >
                    {c.v}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
