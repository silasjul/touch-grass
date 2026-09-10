import { controls } from "tsl-inspector";
import { FLOWER_WIND } from "@/configs/flowers/flowerWind";

export const windTweaks = controls(
  "Flowers/Wind",
  {
    sway: { value: FLOWER_WIND.sway, min: 0, max: 12, step: 0.05 },
    align: { value: FLOWER_WIND.align, min: 0, max: 1, step: 0.01 },
    bobble: { value: FLOWER_WIND.bobble, min: 0, max: 0.4, step: 0.005 },
    bobbleSpeed: { value: FLOWER_WIND.bobbleSpeed, min: 0, max: 12, step: 0.1 },
  },
  { order: 3, collapsed: true },
);
