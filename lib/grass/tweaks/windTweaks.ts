import { controls } from "tsl-inspector";
import { GRASS_WIND } from "@/configs/grass/grassWind";

export const windTweaks = controls(
  "Grass/Wind",
  {
    direction: { value: GRASS_WIND.direction, min: 0, max: 360, step: 1 },
    strength: { value: GRASS_WIND.strength, min: 0, max: 2, step: 0.01 },
    speed: { value: GRASS_WIND.speed, min: 0, max: 4, step: 0.01 },
    scale: { value: GRASS_WIND.scale, min: 0.01, max: 2, step: 0.01 },
    align: { value: GRASS_WIND.align, min: 0, max: 1, step: 0.01 },
    flutter: { value: GRASS_WIND.flutter, min: 0, max: 0.5, step: 0.005 },
    flutterSpeed: { value: GRASS_WIND.flutterSpeed, min: 0, max: 20, step: 0.1 },
  },
  { order: 3, collapsed: true },
);
