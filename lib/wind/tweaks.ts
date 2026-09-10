import { controls } from "tsl-inspector";
import { WIND } from "@/configs/wind";

export const windTweaks = controls(
  "Wind",
  {
    direction: { value: WIND.direction, min: 0, max: 360, step: 1 },
    strength: { value: WIND.strength, min: 0, max: 2, step: 0.01 },
    speed: { value: WIND.speed, min: 0, max: 4, step: 0.01 },
    scale: { value: WIND.scale, min: 0.01, max: 2, step: 0.01 },
  },
  { order: 3, collapsed: true },
);
