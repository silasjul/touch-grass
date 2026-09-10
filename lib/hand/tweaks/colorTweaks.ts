import { controls, folder } from "tsl-inspector";
import { HAND_COLOR } from "@/configs/hand/handColor";

export const colorTweaks = controls(
  "Hand/Color",
  {
    tint: HAND_COLOR.tint,
    brightness: { value: HAND_COLOR.brightness, min: 0, max: 5, step: 0.01 },
    contrast: { value: HAND_COLOR.contrast, min: 0, max: 3, step: 0.01 },
    saturate: { value: HAND_COLOR.saturation, min: 0, max: 3, step: 0.01, label: "saturation" },
    surface: folder(
      {
        roughness: { value: HAND_COLOR.roughness, min: 0, max: 2, step: 0.01 },
        metalness: { value: HAND_COLOR.metalness, min: 0, max: 1, step: 0.01 },
      },
      { collapsed: true },
    ),
  },
  { order: 4, collapsed: true },
);
