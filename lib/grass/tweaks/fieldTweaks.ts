import { controls, folder } from "tsl-inspector";
import { GRASS_FIELD, GRASS_PATCHES } from "@/configs/grass/grassField";

export const fieldTweaks = controls(
  "Grass/Field",
  {
    coverage: { value: GRASS_FIELD.coverage, min: 0.1, max: 1, step: 0.01 },
    jitter: { value: GRASS_FIELD.jitter, min: 0, max: 1, step: 0.01 },
    lean: { value: GRASS_FIELD.lean, min: 0, max: 1, step: 0.01 },
    viewWiden: { value: GRASS_FIELD.viewWiden, min: 0, max: 1, step: 0.01 },
    patches: folder(
      {
        patchScale: {
          value: GRASS_PATCHES.scale,
          min: 0.05,
          max: 4,
          step: 0.01,
          label: "scale",
        },
        patchStrength: {
          value: GRASS_PATCHES.strength,
          min: 0,
          max: 1,
          step: 0.01,
          label: "strength",
        },
        patchBare: { value: GRASS_PATCHES.bare, min: 0, max: 1, step: 0.01, label: "bare" },
        patchFade: { value: GRASS_PATCHES.fade, min: 0.01, max: 1, step: 0.01, label: "fade" },
      },
      { collapsed: true },
    ),
  },
  { order: 1, collapsed: true },
);
