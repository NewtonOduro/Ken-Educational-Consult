import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Eyebrow,
  Gold,
  Headline,
  Particles,
  Sub,
  useSpringIn,
} from "../components/kit";
import { C } from "../theme";
import { BODY } from "../fonts";

const Eiffel = () => (
  <path
    d="M60 12 L60 24 M52 24 H68 M60 24 C58 44 48 76 36 104 M60 24 C62 44 72 76 84 104 M46 62 H74 M40 84 H80 M30 104 H90"
    fill="none"
    stroke={C.goldLight}
    strokeWidth="2.4"
    strokeLinecap="round"
  />
);
const Burj = () => (
  <path
    d="M60 8 L60 40 M60 40 L48 104 M60 40 L72 104 M52 66 L44 104 M68 66 L76 104 M34 104 H86"
    fill="none"
    stroke={C.goldLight}
    strokeWidth="2.4"
    strokeLinecap="round"
  />
);
const BigBen = () => (
  <>
    <path
      d="M46 104 V38 H74 V104 M60 20 L74 38 H46 Z M60 12 V20 M34 104 H86"
      fill="none"
      stroke={C.goldLight}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <circle cx="60" cy="56" r="9" fill="none" stroke={C.goldLight} strokeWidth="2.2" />
  </>
);
const Skyline = () => (
  <path
    d="M28 104 V64 H44 V104 M48 104 V44 H62 V104 M66 104 V54 H78 V104 M82 104 V72 H94 V104 M55 44 V30 M24 104 H98"
    fill="none"
    stroke={C.goldLight}
    strokeWidth="2.4"
    strokeLinecap="round"
  />
);
const Alps = () => (
  <path
    d="M22 104 L48 48 L62 72 L76 40 L100 104 Z M40 66 L48 60 L56 68"
    fill="none"
    stroke={C.goldLight}
    strokeWidth="2.4"
    strokeLinecap="round"
  />
);
const Palm = () => (
  <path
    d="M60 104 C58 82 56 66 58 48 M58 48 C44 40 34 44 28 54 M58 48 C50 32 38 30 30 34 M58 48 C70 36 84 38 90 48 M58 48 C64 32 78 28 86 34 M28 104 H92"
    fill="none"
    stroke={C.goldLight}
    strokeWidth="2.4"
    strokeLinecap="round"
  />
);
const Domes = () => (
  <>
    <path
      d="M28 104 V70 H56 V104 M62 104 V58 H94 V104 M24 104 H98"
      fill="none"
      stroke={C.goldLight}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path d="M28 70 A14 14 0 0 1 56 70" fill="none" stroke={C.goldLight} strokeWidth="2.4" />
    <path d="M62 58 A16 16 0 0 1 94 58" fill="none" stroke={C.goldLight} strokeWidth="2.4" />
  </>
);
const Pagoda = () => (
  <path
    d="M60 16 L88 32 H32 Z M40 32 V44 M80 32 V44 M60 44 L86 58 H34 Z M42 58 V72 M78 58 V72 M60 72 L92 90 H28 Z M48 90 V104 M72 90 V104 M26 104 H94"
    fill="none"
    stroke={C.goldLight}
    strokeWidth="2.2"
    strokeLinecap="round"
  />
);

const CARDS = [
  { name: "Paris", label: "France", Art: Eiffel },
  { name: "Dubai", label: "UAE", Art: Burj },
  { name: "London", label: "United Kingdom", Art: BigBen },
  { name: "New York", label: "USA", Art: Skyline },
  { name: "Zurich", label: "Switzerland", Art: Alps },
  { name: "Malé", label: "Maldives", Art: Palm },
  { name: "Santorini", label: "Greece", Art: Domes },
  { name: "Tokyo", label: "Japan", Art: Pagoda },
];

const Card: React.FC<{ i: number; name: string; label: string; Art: React.FC }> = ({
  i,
  name,
  label,
  Art,
}) => {
  const p = useSpringIn(70 + i * 8, 20);
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 38 + i) * 6;
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid rgba(212,167,44,0.35)",
        background: "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
        padding: 22,
        opacity: p,
        transform: `translateY(${(1 - p) * 60 + float}px) scale(${0.92 + p * 0.08})`,
        boxShadow: "0 30px 60px -32px rgba(0,0,0,0.8)",
      }}
    >
      <svg width="120" height="116" viewBox="0 0 120 116">
        <Art />
      </svg>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 26, color: C.white, marginTop: 8 }}>
        {name}
      </div>
      <div
        style={{
          fontFamily: BODY,
          fontSize: 17,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Tourism: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 230], [-26, 26]);

  return (
    <AbsoluteFill>
      <Backdrop tone="deep" />
      <Particles count={44} seed={31} />
      <AbsoluteFill
        style={{
          padding: "70px 110px",
          justifyContent: "space-between",
          transform: `translateX(${pan}px)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Eyebrow delay={4}>Tourism & Global Exposure</Eyebrow>
          <Headline delay={10} size={86}>
            The world, <Gold>within reach.</Gold>
          </Headline>
          <Sub delay={28}>
            Visit, explore and experience the destinations you have only ever seen on a screen.
          </Sub>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 26,
            marginBottom: 20,
          }}
        >
          {CARDS.map((c, i) => (
            <Card key={c.name} i={i} name={c.name} label={c.label} Art={c.Art} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
