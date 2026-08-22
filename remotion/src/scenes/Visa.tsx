import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import {
  Backdrop,
  Eyebrow,
  Flare,
  Gold,
  Headline,
  Particles,
  Sub,
  Tick,
  easeOut,
} from "../components/kit";
import { C } from "../theme";
import { BODY, DISPLAY } from "../fonts";

export const Visa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = spring({ frame: frame - 118, fps, config: { damping: 11, stiffness: 140 } });
  const stampScale = interpolate(stamp, [0, 1], [3.2, 1]);
  const shake = frame > 118 && frame < 136 ? Math.sin(frame * 3) * (136 - frame) * 0.3 : 0;
  const passport = interpolate(frame, [24, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <Backdrop tone="deep" />
      <Particles count={40} seed={21} />
      <Flare x={300} y={880} scale={1.2} opacity={0.22} />

      <AbsoluteFill
        style={{
          display: "grid",
          gridTemplateColumns: "0.95fr 1.05fr",
          alignItems: "center",
          padding: "0 110px",
          gap: 70,
        }}
      >
        {/* passport with stamp */}
        <div style={{ position: "relative", height: 640, transform: `translateX(${shake}px)` }}>
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 110,
              width: 500,
              height: 420,
              borderRadius: 22,
              background: "linear-gradient(155deg, #0C2E6E 0%, #061634 100%)",
              border: "1px solid rgba(212,167,44,0.5)",
              boxShadow: "0 50px 100px -36px rgba(0,0,0,0.85)",
              transform: `perspective(1500px) rotateY(${-18 + passport * 10}deg) translateY(${
                (1 - passport) * 70
              }px)`,
              opacity: passport,
              padding: 42,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: BODY,
                letterSpacing: 8,
                fontSize: 20,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              PASSPORT
            </div>
            <div style={{ marginTop: 40, display: "flex", gap: 26 }}>
              <div
                style={{
                  width: 130,
                  height: 160,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                {[80, 62, 90, 50].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: 10,
                      width: `${w}%`,
                      borderRadius: 5,
                      background: "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                marginTop: 42,
                height: 34,
                borderRadius: 6,
                background:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 8px, transparent 8px 15px)",
              }}
            />
            {/* APPROVED stamp */}
            <div
              style={{
                position: "absolute",
                right: 46,
                bottom: 92,
                transform: `rotate(-14deg) scale(${stampScale})`,
                opacity: Math.min(stamp * 1.4, 1),
              }}
            >
              <div
                style={{
                  border: `4px solid ${C.goldLight}`,
                  borderRadius: 12,
                  padding: "10px 20px",
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 42,
                  letterSpacing: 4,
                  color: C.goldLight,
                  textShadow: "0 0 22px rgba(245,222,139,0.55)",
                }}
              >
                APPROVED
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Eyebrow delay={4}>Visa Assistance</Eyebrow>
          <Headline delay={12} size={92}>
            Visa files built to be <Gold>approved.</Gold>
          </Headline>
          <Sub delay={34}>
            Document review, financial proof, biometrics and interview coaching — nothing left to
            chance before your appointment.
          </Sub>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 6 }}>
            <Tick label="Fast — organised submissions" delay={140} />
            <Tick label="Reliable — verified checklists" delay={154} />
            <Tick label="Trusted — 500+ student visas" delay={168} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
