import { controls, folder } from "tsl-inspector";
import { HAND_REVEAL } from "@/configs/hand/handReveal";

export const revealTweaks = controls(
  "Hand/Reveal",
  {
    spread: { value: HAND_REVEAL.spread, min: 0.5, max: 6, step: 0.01 },
    soften: { value: HAND_REVEAL.soften, min: 0.01, max: 1, step: 0.01 },
    wobble: { value: HAND_REVEAL.wobble, min: 0, max: 1, step: 0.01 },
    grain: { value: HAND_REVEAL.grain, min: 0.2, max: 20, step: 0.1 },
    edge: folder(
      {
        band: { value: HAND_REVEAL.band, min: 0.01, max: 1, step: 0.01 },
        glow: { value: HAND_REVEAL.glow, min: 0, max: 12, step: 0.05 },
        glowColor: { value: HAND_REVEAL.glowColor, label: "color" },
      },
      { collapsed: true },
    ),
  },
  { order: 3, collapsed: true },
);
