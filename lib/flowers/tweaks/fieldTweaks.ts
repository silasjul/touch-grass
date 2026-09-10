import { controls, folder } from "tsl-inspector";
import { FLOWER_CLUMPS, FLOWER_FIELD } from "@/configs/flowers/flowerField";

export const fieldTweaks = controls(
  "Flowers/Field",
  {
    jitter: { value: FLOWER_FIELD.jitter, min: 0, max: 1, step: 0.01 },
    lean: { value: FLOWER_FIELD.lean, min: 0, max: 1, step: 0.01 },
    clumps: folder(
      {
        clumpScale: { value: FLOWER_CLUMPS.scale, min: 0.02, max: 2, step: 0.01, label: "scale" },
        clumpBare: { value: FLOWER_CLUMPS.bare, min: 0, max: 1, step: 0.01, label: "bare" },
        clumpFade: { value: FLOWER_CLUMPS.fade, min: 0.01, max: 1, step: 0.01, label: "fade" },
        thinning: { value: FLOWER_CLUMPS.thinning, min: 0, max: 1, step: 0.01 },
      },
      { collapsed: true },
    ),
  },
  { order: 1, collapsed: true },
);
