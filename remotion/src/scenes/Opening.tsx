import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Flare, Globe, Logo, Particles, easeOut } from "../components/kit";
import { C } from "../theme";
import { BODY } from "../fonts";

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const zoom = interpolate(frame, [40, 200], [1, 1.55], { extrapolateRight: "clamp" });
  const globeFade = interpolate(frame, [120, 165], [1, 0.12], { extrapolateRight: "clamp" });
  const pin = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const logo = interpolate(frame, [140, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <Backdrop tone="deep" />
      <Particles count={90} seed={7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${zoom}) translateY(${(1 - rise) * 220}px)`,
            opacity: globeFade,
            position: "relative",
          }}
        >
          <Globe progress={rise} rotate={frame * 0.55} />
          <div
            style={{
              position: "absolute",
              left: 300,
              top: 392,
              opacity: pin,
              transform: `translateY(${(1 - pin) * -24}px)`,
            }}
          >
            <svg width="52" height="66" viewBox="0 0 52 66">
              <path
                d="M26 2 C38 2 48 12 48 24 C48 40 26 64 26 64 C26 64 4 40 4 24 C4 12 14 2 26 2 Z"
                fill="rgba(245,222,139,0.92)"
                stroke={C.gold}
                strokeWidth="2"
              />
              <circle cx="26" cy="24" r="8" fill={C.navyDeep} />
            </svg>
            <div
              style={{
                fontFamily: BODY,
                fontSize: 20,
                letterSpacing: 4,
                color: C.goldLight,
                marginTop: 4,
                whiteSpace: "nowrap",
                transform: "translateX(-14px)",
              }}
            >
              KUMASI · GHANA
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <Flare x={430} y={250} scale={1.5} opacity={0.35 * rise} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${0.96 + logo * 0.04})` }}>
          <Logo progress={logo} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
