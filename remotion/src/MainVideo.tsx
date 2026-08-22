import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { Opening } from "./scenes/Opening";
import { StudyAbroad } from "./scenes/StudyAbroad";
import { Visa } from "./scenes/Visa";
import { Flights } from "./scenes/Flights";
import { Tourism } from "./scenes/Tourism";
import { Consultation } from "./scenes/Consultation";
import { Success } from "./scenes/Success";
import { Cta } from "./scenes/Cta";
import { Ending } from "./scenes/Ending";

const wipeT = springTiming({ config: { damping: 200 }, durationInFrames: 20 });
const fadeT = linearTiming({ durationInFrames: 20 });

const SCENES = [
  { C: Opening, d: 200 },
  { C: StudyAbroad, d: 230 },
  { C: Visa, d: 200 },
  { C: Flights, d: 220 },
  { C: Tourism, d: 230 },
  { C: Consultation, d: 200 },
  { C: Success, d: 200 },
  { C: Cta, d: 270 },
  { C: Ending, d: 230 },
];

export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - (SCENES.length - 1) * 20;

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#030C1E" }}>
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.d}>
            <s.C />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        const t = (
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={i % 2 === 0 ? wipe({ direction: "from-right" }) : fade()}
            timing={i % 2 === 0 ? wipeT : fadeT}
          />
        );
        return [t, seq];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
