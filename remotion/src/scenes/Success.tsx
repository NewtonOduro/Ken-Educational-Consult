import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Eyebrow,
  Flare,
  Gold,
  Headline,
  Particles,
  rand,
  useIn,
} from "../components/kit";
import { C } from "../theme";
import { BODY, DISPLAY } from "../fonts";

const STATS = [
  { value: 1000, suffix: "+", label: "Happy clients" },
  { value: 500, suffix: "+", label: "Student visas" },
  { value: 10, suffix: "+", label: "Countries served" },
];

const Counter: React.FC<{ value: number; suffix: string; label: string; delay: number }> = ({
  value,
  suffix,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return (
    <div style={{ textAlign: "center", opacity: Math.min(p * 2.5, 1) }}>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1,
          background: `linear-gradient(120deg, ${C.gold}, ${C.goldLight})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {Math.round(value * p).toLocaleString("en-US")}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: BODY,
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.62)",
          marginTop: 14,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Success: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = useIn(0, 60);

  return (
    <AbsoluteFill>
      <Backdrop tone="navy" />
      <Particles count={70} seed={41} />
      <Flare x={960} y={520} scale={2.4} opacity={0.22 * glow} />

      {/* confetti */}
      <AbsoluteFill>
        {Array.from({ length: 70 }).map((_, i) => {
          const start = 10 + rand(i, 5) * 40;
          const p = interpolate(frame, [start, start + 150], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = rand(i + 9, 5) * 1920;
          const sway = Math.sin(frame / 20 + i) * 40;
          const colors = [C.gold, C.goldLight, C.sky, "#FFFFFF"];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x + sway,
                top: -40 + p * 1180,
                width: 8,
                height: 18,
                borderRadius: 2,
                background: colors[i % 4],
                opacity: 0.85 * (1 - p * 0.35),
                transform: `rotate(${frame * (2 + rand(i + 3, 5) * 4)}deg)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          padding: "0 140px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Eyebrow delay={4}>Proven results</Eyebrow>
        </div>
        <Headline delay={12} size={96}>
          Dreams delivered, <Gold>again and again.</Gold>
        </Headline>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 90,
            marginTop: 20,
          }}
        >
          {STATS.map((s, i) => (
            <Counter key={s.label} {...s} delay={54 + i * 16} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
