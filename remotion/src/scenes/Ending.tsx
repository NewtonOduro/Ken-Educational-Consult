import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Flare, Logo, MapDots, Particles, Plane, easeOut } from "../components/kit";
import { C } from "../theme";
import { BODY } from "../fonts";

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const trail = interpolate(frame, [50, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const tag = interpolate(frame, [120, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const fade = interpolate(frame, [200, 230], [1, 0.25], { extrapolateLeft: "clamp" });

  const x = 120 + trail * 1680;
  const y = 880 - Math.sin(trail * Math.PI * 0.85) * 190;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Backdrop tone="deep" />
      <AbsoluteFill style={{ opacity: 0.32 }}>
        <MapDots opacity={0.4} />
      </AbsoluteFill>
      <Particles count={60} seed={61} />
      <Flare x={960} y={430} scale={2.2} opacity={0.2 * logo} />

      <AbsoluteFill>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="tail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(245,222,139,0)" />
              <stop offset="70%" stopColor="rgba(245,222,139,0.55)" />
              <stop offset="100%" stopColor={C.goldLight} />
            </linearGradient>
          </defs>
          <path
            d="M 120 880 Q 960 560 1800 880"
            fill="none"
            stroke="url(#tail)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2200"
            strokeDashoffset={2200 - 2200 * trail}
          />
        </svg>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: x - 30, top: y - 30, opacity: trail > 0 ? 1 : 0 }}>
        <Plane size={62} color={C.goldLight} rotate={interpolate(trail, [0, 1], [-32, 32])} />
      </div>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginTop: -80 }}>
          <Logo progress={logo} scale={1.08} />
          <div
            style={{
              marginTop: 46,
              textAlign: "center",
              fontFamily: BODY,
              fontSize: 34,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: C.goldLight,
              opacity: tag,
              transform: `translateY(${(1 - tag) * 22}px)`,
            }}
          >
            Study · Travel · Succeed
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
