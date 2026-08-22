import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Chip,
  Eyebrow,
  Flare,
  Gold,
  Headline,
  Particles,
  Sub,
  Tick,
  easeOut,
  useIn,
} from "../components/kit";
import { C } from "../theme";
import { BODY, DISPLAY } from "../fonts";

const COUNTRIES = ["Canada", "UK", "USA", "Germany", "Australia", "Dubai", "Turkey", "China"];

export const StudyAbroad: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [30, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const cap = useIn(96, 30);
  const float = Math.sin(frame / 42) * 12;

  return (
    <AbsoluteFill>
      <Backdrop tone="navy" />
      <Particles count={50} seed={11} color="rgba(156,203,255,0.6)" />
      <Flare x={1620} y={180} scale={1.1} opacity={0.28} />

      <AbsoluteFill
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          alignItems: "center",
          padding: "0 110px",
          gap: 60,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Eyebrow delay={4}>Study Abroad</Eyebrow>
          <Headline delay={12} size={92}>
            Admissions into <Gold>world-class</Gold> universities.
          </Headline>
          <Sub delay={34}>
            Course selection, applications and scholarships handled by advisors who know exactly
            what each institution is looking for.
          </Sub>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 8 }}>
            <Tick label="University & course shortlist" delay={64} />
            <Tick label="Scholarship and funding guidance" delay={78} />
            <Tick label="Application filed end-to-end" delay={92} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
            {COUNTRIES.map((c, i) => (
              <Chip key={c} label={c} delay={112 + i * 7} />
            ))}
          </div>
        </div>

        {/* acceptance letter + grad cap composition */}
        <div style={{ position: "relative", height: 700 }}>
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 130 + float,
              width: 520,
              height: 420,
              borderRadius: 20,
              background: "linear-gradient(160deg, #FFFFFF 0%, #EDF3FC 100%)",
              boxShadow: "0 50px 90px -34px rgba(2,8,24,0.8)",
              transform: `perspective(1400px) rotateY(${-16 + open * 8}deg) rotateX(${8 - open * 5}deg) translateY(${
                (1 - open) * 80
              }px)`,
              opacity: open,
              padding: 44,
            }}
          >
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 34,
                color: "#0B2A5E",
                letterSpacing: 1,
              }}
            >
              LETTER OF ADMISSION
            </div>
            <div style={{ height: 3, width: 120, background: C.gold, marginTop: 14 }} />
            {[92, 100, 74, 88, 60].map((w, i) => {
              const p = interpolate(frame, [70 + i * 8, 92 + i * 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    marginTop: 22,
                    height: 12,
                    width: `${w * p}%`,
                    borderRadius: 6,
                    background: "rgba(11,42,94,0.14)",
                  }}
                />
              );
            })}
            <div
              style={{
                position: "absolute",
                right: 40,
                bottom: 34,
                fontFamily: BODY,
                fontSize: 22,
                color: C.royal,
                opacity: interpolate(frame, [130, 156], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              Congratulations, you&apos;re in.
            </div>
          </div>

          {/* graduation caps tossed */}
          {[0, 1, 2, 3, 4].map((i) => {
            const start = 100 + i * 10;
            const p = interpolate(frame, [start, start + 90], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const arc = Math.sin(p * Math.PI) * (150 + i * 34);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 90 + i * 100,
                  top: 460 - arc,
                  opacity: cap * (1 - p * 0.15),
                  transform: `rotate(${-30 + p * 80 + i * 12}deg)`,
                }}
              >
                <svg width="86" height="66" viewBox="0 0 86 66">
                  <path d="M43 6 L82 24 L43 42 L4 24 Z" fill={C.navyDeep} stroke={C.gold} strokeWidth="2" />
                  <path d="M22 32 L22 52 C30 60 56 60 64 52 L64 32" fill="none" stroke={C.gold} strokeWidth="2.6" />
                  <path d="M78 26 L78 48" stroke={C.goldLight} strokeWidth="2.4" />
                  <circle cx="78" cy="52" r="5" fill={C.goldLight} />
                </svg>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
