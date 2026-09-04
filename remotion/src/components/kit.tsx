import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C } from "./theme";
import { BODY, DISPLAY } from "./fonts";

/* ---------------- utilities ---------------- */

export const rand = (i: number, seed = 1) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const useIn = (delay = 0, duration = 24) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

export const useSpringIn = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

/* ---------------- backdrops ---------------- */

export const Backdrop: React.FC<{ tone?: "deep" | "navy" | "light" }> = ({ tone = "navy" }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 40;
  const base =
    tone === "light"
      ? `linear-gradient(140deg, #F4F7FC 0%, #E4ECF8 55%, #D8E5F6 100%)`
      : tone === "deep"
        ? `linear-gradient(150deg, ${C.navyDeep} 0%, #05122B 60%, #071B3F 100%)`
        : `linear-gradient(140deg, ${C.navy} 0%, #0A2A63 55%, ${C.navyDeep} 100%)`;
  return (
    <AbsoluteFill style={{ background: base }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 55% at ${52 + drift / 20}% 22%, ${
            tone === "light" ? "rgba(77,163,255,0.28)" : "rgba(77,163,255,0.30)"
          } 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 45% at ${78 - drift / 25}% 88%, rgba(212,167,44,0.22) 0%, transparent 70%)`,
        }}
      />
      <Vignette />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(120% 90% at 50% 50%, transparent 45%, rgba(2,7,18,0.55) 100%)",
    }}
  />
);

export const Particles: React.FC<{ count?: number; seed?: number; color?: string }> = ({
  count = 60,
  seed = 3,
  color = "rgba(245,222,139,0.7)",
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => {
        const x = rand(i, seed) * 1920;
        const y0 = rand(i + 40, seed) * 1080;
        const speed = 0.25 + rand(i + 80, seed) * 0.9;
        const size = 1.5 + rand(i + 120, seed) * 3.5;
        const y = (y0 - frame * speed + 1080) % 1080;
        const twinkle = 0.25 + 0.75 * Math.abs(Math.sin(frame / 30 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: 999,
              background: color,
              opacity: twinkle * 0.7,
              filter: "blur(0.4px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Flare: React.FC<{ x: number; y: number; scale?: number; opacity?: number }> = ({
  x,
  y,
  scale = 1,
  opacity = 0.6,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 520 * scale,
      height: 520 * scale,
      marginLeft: -260 * scale,
      marginTop: -260 * scale,
      borderRadius: 999,
      background: `radial-gradient(circle, rgba(255,247,214,${opacity}) 0%, rgba(245,222,139,${
        opacity * 0.45
      }) 25%, transparent 62%)`,
      mixBlendMode: "screen",
    }}
  />
);

/* ---------------- typography ---------------- */

export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number; dark?: boolean }> = ({
  children,
  delay = 0,
  dark,
}) => {
  const p = useIn(delay, 20);
  return (
    <div
      style={{
        fontFamily: BODY,
        fontWeight: 600,
        letterSpacing: 6,
        textTransform: "uppercase",
        fontSize: 20,
        color: dark ? C.royal : C.goldLight,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span style={{ width: 42, height: 2, background: dark ? C.gold : C.gold }} />
      {children}
    </div>
  );
};

export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  dark?: boolean;
}> = ({ children, delay = 0, size = 96, dark }) => {
  const p = useIn(delay, 28);
  return (
    <h1
      style={{
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.03,
        margin: 0,
        color: dark ? "#08183A" : C.white,
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px)`,
        filter: `blur(${(1 - p) * 6}px)`,
        letterSpacing: -1.5,
      }}
    >
      {children}
    </h1>
  );
};

export const Gold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: `linear-gradient(100deg, ${C.gold} 0%, ${C.goldLight} 45%, ${C.gold} 100%)`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

export const Sub: React.FC<{ children: React.ReactNode; delay?: number; dark?: boolean }> = ({
  children,
  delay = 0,
  dark,
}) => {
  const p = useIn(delay, 24);
  return (
    <p
      style={{
        fontFamily: BODY,
        fontSize: 30,
        lineHeight: 1.5,
        color: dark ? "rgba(8,24,58,0.72)" : "rgba(255,255,255,0.78)",
        margin: 0,
        maxWidth: 760,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      {children}
    </p>
  );
};

/* ---------------- glass ---------------- */

export const Glass: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
}> = ({ children, style, delay = 0 }) => {
  const p = useSpringIn(delay, 22);
  return (
    <div
      style={{
        borderRadius: 28,
        border: "1px solid rgba(255,255,255,0.16)",
        background:
          "linear-gradient(150deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)",
        boxShadow: "0 30px 70px -30px rgba(2,8,24,0.75)",
        padding: 28,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + p * 0.06})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Tick: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const p = useSpringIn(delay, 18);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: p,
        transform: `translateX(${(1 - p) * -30}px)`,
        fontFamily: BODY,
        fontSize: 30,
        color: "rgba(255,255,255,0.92)",
      }}
    >
      <svg width="34" height="34" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r="16" fill="none" stroke={C.gold} strokeWidth="1.6" />
        <path
          d="M10 17.5 L15 22.5 L24 12"
          fill="none"
          stroke={C.goldLight}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="30"
          strokeDashoffset={30 - 30 * p}
        />
      </svg>
      {label}
    </div>
  );
};

export const Chip: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const p = useSpringIn(delay, 16);
  return (
    <div
      style={{
        fontFamily: BODY,
        fontSize: 24,
        padding: "12px 24px",
        borderRadius: 999,
        border: `1px solid rgba(212,167,44,0.55)`,
        background: "rgba(255,255,255,0.07)",
        color: C.white,
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

/* ---------------- globe ---------------- */

export const Globe: React.FC<{ progress: number; rotate: number }> = ({ progress, rotate }) => {
  const R = 340;
  return (
    <div style={{ position: "relative", width: R * 2, height: R * 2 }}>
      <div
        style={{
          position: "absolute",
          inset: -80,
          borderRadius: 999,
          background: `radial-gradient(circle, rgba(77,163,255,0.42) 40%, transparent 72%)`,
          filter: "blur(18px)",
        }}
      />
      <svg width={R * 2} height={R * 2} viewBox="0 0 680 680" style={{ position: "relative" }}>
        <defs>
          <radialGradient id="ocean" cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#1D63C9" />
            <stop offset="55%" stopColor="#0B3A8F" />
            <stop offset="100%" stopColor="#041232" />
          </radialGradient>
          <linearGradient id="terminator" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,236,180,0.85)" />
            <stop offset="45%" stopColor="rgba(255,214,120,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <clipPath id="ball">
            <circle cx="340" cy="340" r="300" />
          </clipPath>
        </defs>
        <circle cx="340" cy="340" r="300" fill="url(#ocean)" />
        <g clipPath="url(#ball)" opacity="0.9">
          {/* latitude lines */}
          {[-240, -160, -80, 0, 80, 160, 240].map((o) => (
            <ellipse
              key={o}
              cx="340"
              cy={340 + o}
              rx={Math.sqrt(Math.max(300 * 300 - o * o, 0))}
              ry={22}
              fill="none"
              stroke="rgba(156,203,255,0.25)"
              strokeWidth="1.2"
            />
          ))}
          {/* longitude lines */}
          {Array.from({ length: 9 }).map((_, i) => {
            const phase = ((i * 40 + rotate) % 360) - 180;
            const rx = Math.abs(Math.cos((phase * Math.PI) / 180)) * 300;
            return (
              <ellipse
                key={i}
                cx="340"
                cy="340"
                rx={rx}
                ry={300}
                fill="none"
                stroke="rgba(156,203,255,0.22)"
                strokeWidth="1.2"
              />
            );
          })}
          {/* stylised landmass cluster (Africa-centric) */}
          <g
            transform={`translate(${340 + Math.sin((rotate * Math.PI) / 180) * 60}, 340)`}
            fill="rgba(120,205,170,0.5)"
            stroke="rgba(190,240,215,0.4)"
          >
            <path d="M-30 -150 C40 -170 90 -120 70 -60 C120 -40 110 40 60 90 C30 150 -20 190 -50 130 C-80 70 -100 20 -80 -40 C-95 -100 -80 -140 -30 -150 Z" />
            <path d="M-190 -120 C-140 -150 -90 -140 -80 -100 C-120 -70 -150 -40 -180 -60 C-210 -80 -215 -100 -190 -120 Z" />
            <path d="M120 -170 C190 -190 250 -150 240 -110 C200 -80 150 -90 120 -120 Z" />
          </g>
          <circle
            cx="340"
            cy="340"
            r="300"
            fill="url(#terminator)"
            style={{ mixBlendMode: "screen", opacity: 0.35 + progress * 0.5 }}
          />
        </g>
        <circle
          cx="340"
          cy="340"
          r="300"
          fill="none"
          stroke="rgba(245,222,139,0.55)"
          strokeWidth="1.6"
        />
        <circle
          cx="340"
          cy="340"
          r="312"
          fill="none"
          stroke="rgba(77,163,255,0.28)"
          strokeWidth="10"
          strokeDasharray="1885"
          strokeDashoffset={1885 - 1885 * progress}
          transform="rotate(-90 340 340)"
        />
      </svg>
    </div>
  );
};

/* ---------------- logo ---------------- */

export const Logo: React.FC<{ progress: number; scale?: number }> = ({ progress, scale = 1 }) => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 22);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        transform: `scale(${scale * (0.9 + progress * 0.1)})`,
        opacity: progress,
      }}
    >
      <div style={{ position: "relative", width: 116, height: 116 }}>
        <div
          style={{
            position: "absolute",
            inset: -26,
            borderRadius: 999,
            background: `radial-gradient(circle, rgba(245,222,139,${0.28 + glow * 0.3}) 0%, transparent 68%)`,
            filter: "blur(6px)",
          }}
        />
        <svg width="116" height="116" viewBox="0 0 116 116">
          <circle
            cx="58"
            cy="58"
            r="52"
            fill="rgba(255,255,255,0.06)"
            stroke={C.gold}
            strokeWidth="2"
          />
          <ellipse
            cx="58"
            cy="58"
            rx="52"
            ry="20"
            fill="none"
            stroke={C.goldLight}
            strokeWidth="1.4"
            opacity="0.75"
          />
          <ellipse
            cx="58"
            cy="58"
            rx="22"
            ry="52"
            fill="none"
            stroke={C.goldLight}
            strokeWidth="1.4"
            opacity="0.75"
          />
          <path
            d="M22 66 C40 40 76 40 94 66"
            fill="none"
            stroke={C.sky}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset={120 - 120 * progress}
          />
          <path d="M92 60 l10 6 -10 6 2 -6 z" fill={C.goldLight} opacity={progress} />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 62,
            letterSpacing: 3,
            color: C.white,
            textShadow: `0 0 ${18 + glow * 26}px rgba(245,222,139,0.45)`,
          }}
        >
          Ken <Gold>Educational</Gold> Consult
        </div>
        <div
          style={{
            fontFamily: BODY,
            fontSize: 22,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.66)",
            marginTop: 10,
          }}
        >
          Study · Travel · Global Opportunities
        </div>
      </div>
    </div>
  );
};

/* ---------------- plane + trail ---------------- */

export const Plane: React.FC<{ size?: number; color?: string; rotate?: number }> = ({
  size = 64,
  color = C.white,
  rotate = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rotate}deg)` }}>
    <path
      d="M2.5 13.2 L21.5 11.9 L14.6 8.6 L12.6 3.2 L10.9 3.2 L11.6 8.1 L5.4 6.1 L4.2 7 L8.1 10.6 L2.5 11.6 Z M8.6 15.2 L11.2 20.8 L12.6 20.8 L12 15 Z"
      fill={color}
    />
  </svg>
);

export const MapDots: React.FC<{ opacity?: number }> = ({ opacity = 0.35 }) => {
  const cols = 78;
  const rows = 34;
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ opacity }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const x = 60 + c * 23;
          const y = 90 + r * 27;
          const nx = (c / cols) * 2 - 1;
          const ny = (r / rows) * 2 - 1;
          const land =
            Math.sin(nx * 5.2 + ny * 2.1) +
            Math.cos(ny * 4.4 - nx * 1.7) +
            rand(r * cols + c) * 0.8;
          if (land < 0.85) return null;
          return <circle key={`${r}-${c}`} cx={x} cy={y} r="2.6" fill="rgba(156,203,255,0.75)" />;
        }),
      )}
    </svg>
  );
};
