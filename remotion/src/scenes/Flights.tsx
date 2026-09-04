import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Eyebrow,
  Gold,
  Headline,
  MapDots,
  Plane,
  Sub,
  Tick,
  easeOut,
  useIn,
} from "../components/kit";
import { C } from "../theme";
import { BODY, DISPLAY } from "../fonts";

const ROUTES = [
  { x1: 520, y1: 700, x2: 1180, y2: 300, d: 20 },
  { x1: 520, y1: 700, x2: 1520, y2: 460, d: 44 },
  { x1: 520, y1: 700, x2: 820, y2: 230, d: 68 },
];

const arc = (r: (typeof ROUTES)[number]) => {
  const mx = (r.x1 + r.x2) / 2;
  const my = (r.y1 + r.y2) / 2 - Math.abs(r.x2 - r.x1) * 0.28;
  return `M ${r.x1} ${r.y1} Q ${mx} ${my} ${r.x2} ${r.y2}`;
};

export const Flights: React.FC = () => {
  const frame = useCurrentFrame();
  const pass = useIn(120, 30);

  return (
    <AbsoluteFill>
      <Backdrop tone="navy" />
      <AbsoluteFill style={{ opacity: 0.5 }}>
        <MapDots opacity={0.5} />
      </AbsoluteFill>

      <AbsoluteFill>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(245,222,139,0.25)" />
              <stop offset="100%" stopColor={C.goldLight} />
            </linearGradient>
          </defs>
          {ROUTES.map((r, i) => {
            const p = interpolate(frame, [r.d, r.d + 80], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            });
            return (
              <g key={i}>
                <path
                  d={arc(r)}
                  fill="none"
                  stroke="url(#route)"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeDasharray="1600"
                  strokeDashoffset={1600 - 1600 * p}
                />
                <circle cx={r.x1} cy={r.y1} r={7} fill={C.goldLight} opacity={p > 0 ? 1 : 0} />
                <circle
                  cx={r.x2}
                  cy={r.y2}
                  r={9}
                  fill="none"
                  stroke={C.goldLight}
                  strokeWidth="2.5"
                  opacity={p > 0.95 ? 1 : 0}
                />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* travelling plane along the top route */}
      {(() => {
        const p = interpolate(frame, [40, 150], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        });
        const r = ROUTES[1]!;
        const mx = (r.x1 + r.x2) / 2;
        const my = (r.y1 + r.y2) / 2 - Math.abs(r.x2 - r.x1) * 0.28;
        const t = p;
        const x = (1 - t) ** 2 * r.x1 + 2 * (1 - t) * t * mx + t ** 2 * r.x2;
        const y = (1 - t) ** 2 * r.y1 + 2 * (1 - t) * t * my + t ** 2 * r.y2;
        return (
          <div style={{ position: "absolute", left: x - 32, top: y - 32, opacity: p > 0 ? 1 : 0 }}>
            <Plane size={64} color={C.white} rotate={-18} />
          </div>
        );
      })()}

      <AbsoluteFill style={{ padding: "0 110px", justifyContent: "center" }}>
        <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 28 }}>
          <Eyebrow delay={4}>Travel & Flights</Eyebrow>
          <Headline delay={12} size={92}>
            Flights, hotels and <Gold>smooth departures.</Gold>
          </Headline>
          <Sub delay={32}>
            Ticketing, accommodation, travel insurance and airport pickup — arranged so your first
            day abroad feels effortless.
          </Sub>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
            <Tick label="Flight booking & itineraries" delay={150} />
            <Tick label="Hotel and insurance packages" delay={164} />
          </div>
        </div>
      </AbsoluteFill>

      {/* boarding pass */}
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 110,
          width: 520,
          borderRadius: 22,
          overflow: "hidden",
          background: "linear-gradient(150deg, #FFFFFF 0%, #E9F0FB 100%)",
          boxShadow: "0 46px 90px -34px rgba(2,8,24,0.85)",
          opacity: pass,
          transform: `translateY(${(1 - pass) * 60}px) rotate(-3deg)`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg, ${C.royal}, #0A2A63)`,
            padding: "18px 28px",
            color: C.white,
            fontFamily: BODY,
            letterSpacing: 5,
            fontSize: 18,
          }}
        >
          BOARDING PASS
        </div>
        <div style={{ padding: 28, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, color: "#0B2A5E" }}>
            ACC
          </div>
          <svg width="120" height="30" viewBox="0 0 120 30">
            <path d="M2 15 H108" stroke={C.gold} strokeWidth="2" strokeDasharray="7 6" />
          </svg>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, color: "#0B2A5E" }}>
            YYZ
          </div>
        </div>
        <div
          style={{
            padding: "0 28px 26px",
            fontFamily: BODY,
            fontSize: 20,
            color: "rgba(11,42,94,0.7)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Passenger · Ken Educational Consult</span>
          <span>Seat 12A</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
