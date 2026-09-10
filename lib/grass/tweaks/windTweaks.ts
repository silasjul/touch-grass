import { controls } from "tsl-inspector";
import { GRASS_WIND } from "@/configs/grass/grassWind";

export const windTweaks = controls(
  "Grass/Wind",
  {
    align: { value: GRASS_WIND.align, min: 0, max: 1, step: 0.01 },
    flutter: { value: GRASS_WIND.flutter, min: 0, max: 0.5, step: 0.005 },
    flutterSpeed: { value: GRASS_WIND.flutterSpeed, min: 0, max: 20, step: 0.1 },
  },
  { order: 3, collapsed: true },
);
