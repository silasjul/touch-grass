import { controls, folder } from "tsl-inspector";
import { HAND_TOUCH } from "@/configs/hand/handTouch";

export const touchTweaks = controls(
  "Hand/Touch",
  {
    radius: { value: HAND_TOUCH.radius, min: 0.1, max: 30, step: 0.01 },
    falloff: { value: HAND_TOUCH.falloff, min: 0.2, max: 8, step: 0.01 },
    push: { value: HAND_TOUCH.push, min: 0, max: 5, step: 0.01 },
    squash: { value: HAND_TOUCH.squash, min: 0, max: 1, step: 0.01 },
    shape: folder(
      {
        stretch: { value: HAND_TOUCH.stretch, min: 0.2, max: 4, step: 0.01 },
        drag: { value: HAND_TOUCH.drag, min: 0, max: 0.9, step: 0.01 },
        soften: { value: HAND_TOUCH.soften, min: 0.02, max: 2, step: 0.01 },
      },
      { collapsed: true },
    ),
  },
  { order: 3, collapsed: true },
);
