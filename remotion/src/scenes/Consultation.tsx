import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Eyebrow,
  Glass,
  Gold,
  Headline,
  Sub,
  useIn,
  useSpringIn,
} from "../components/kit";
import { C } from "../theme";
import { BODY } from "../fonts";

const PILLARS = [
  { title: "Career counselling", note: "Match your strengths to the right programme." },
  { title: "IELTS & test prep", note: "Target scores, study plan, exam booking." },
  { title: "One-on-one advisors", note: "A real person with you at every stage." },
];

export const Consultation: React.FC = () => {
  const frame = useCurrentFrame();
  const line = useIn(20, 60);
  const wave = (i: number) => 20 + Math.abs(Math.sin(frame / 11 + i)) * 62;

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <AbsoluteFill
        style={{
          padding: "0 110px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: 70,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Eyebrow delay={4} dark>
            Consultation & Guidance
          </Eyebrow>
          <Headline delay={12} size={88} dark>
            Advisors who sit <span style={{ color: C.royal }}>beside you.</span>
          </Headline>
          <Sub delay={30} dark>
            Personalised counselling from first question to boarding gate — clear answers, honest
            advice, no guesswork.
          </Sub>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
            {PILLARS.map((p, i) => {
              const s = useSpringIn(70 + i * 14, 20);
              return (
                <div
                  key={p.title}
                  style={{
                    display: "flex",
                    gap: 20,
                    alignItems: "flex-start",
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(11,58,143,0.12)",
                    borderRadius: 20,
                    padding: "20px 24px",
                    opacity: s,
                    transform: `translateX(${(1 - s) * -40}px)`,
                    boxShadow: "0 24px 50px -32px rgba(11,42,94,0.5)",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: C.gold,
                      marginTop: 10,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: BODY,
                        fontWeight: 600,
                        fontSize: 28,
                        color: "#08183A",
                      }}
                    >
                      {p.title}
                    </div>
                    <div style={{ fontFamily: BODY, fontSize: 21, color: "rgba(8,24,58,0.6)" }}>
                      {p.note}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* video-call composition */}
        <div style={{ position: "relative" }}>
          <Glass
            delay={30}
            style={{
              background:
                "linear-gradient(160deg, rgba(11,58,143,0.95) 0%, rgba(6,22,52,0.95) 100%)",
              padding: 26,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: BODY,
                color: "rgba(255,255,255,0.7)",
                fontSize: 18,
                letterSpacing: 3,
              }}
            >
              <span>LIVE SESSION</span>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: "#4ADE80",
                    opacity: 0.5 + 0.5 * Math.sin(frame / 9),
                  }}
                />
                CONNECTED
              </span>
            </div>
            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[0, 1, 2, 3].map((i) => {
                const s = useSpringIn(48 + i * 10, 20);
                return (
                  <div
                    key={i}
                    style={{
                      height: 170,
                      borderRadius: 18,
                      background: `linear-gradient(150deg, rgba(77,163,255,${0.24 + i * 0.05}), rgba(6,22,52,0.9))`,
                      border: "1px solid rgba(255,255,255,0.14)",
                      opacity: s,
                      transform: `scale(${0.9 + s * 0.1})`,
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.22)",
                        border: `1px solid ${C.gold}`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 22,
                display: "flex",
                alignItems: "flex-end",
                gap: 6,
                height: 90,
              }}
            >
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: wave(i) * line,
                    borderRadius: 4,
                    background: i % 5 === 0 ? C.goldLight : "rgba(156,203,255,0.55)",
                  }}
                />
              ))}
            </div>
          </Glass>
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: -46,
              padding: "18px 26px",
              borderRadius: 18,
              background: C.white,
              boxShadow: "0 30px 60px -30px rgba(11,42,94,0.55)",
              fontFamily: BODY,
              fontSize: 22,
              color: "#08183A",
              opacity: interpolate(frame, [110, 140], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <Gold>★★★★★</Gold> “They answered every question.”
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
