import { controls, folder } from "tsl-inspector";
import { GRASS_COLOR } from "@/configs/grass/grassColor";

export const colorTweaks = controls(
  "Grass/Color",
  {
    root: GRASS_COLOR.root,
    tip: GRASS_COLOR.tip,
    gradient: { value: GRASS_COLOR.gradient, min: 0.2, max: 4, step: 0.01 },
    occlusion: { value: GRASS_COLOR.occlusion, min: 0, max: 1, step: 0.01 },
    variance: { value: GRASS_COLOR.variance, min: 0, max: 1, step: 0.01 },
    roughness: { value: GRASS_COLOR.roughness, min: 0.05, max: 1, step: 0.01 },
    dry: folder(
      {
        dryColor: { value: GRASS_COLOR.dry, label: "color" },
        dryness: { value: GRASS_COLOR.dryness, min: 0, max: 1, step: 0.01, label: "amount" },
        drynessScale: {
          value: GRASS_COLOR.drynessScale,
          min: 0.01,
          max: 2,
          step: 0.01,
          label: "scale",
        },
      },
      { collapsed: true },
    ),
    backlight: folder(
      {
        translucency: { value: GRASS_COLOR.translucency, min: 0, max: 3, step: 0.01, label: "amount" },
        translucencyFocus: {
          value: GRASS_COLOR.translucencyFocus,
          min: 1,
          max: 12,
          step: 0.1,
          label: "focus",
        },
      },
      { collapsed: true },
    ),
  },
  { order: 4, collapsed: true },
);
