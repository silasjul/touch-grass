import { folder, useControls } from "tsl-inspector";
import { HAND_MODEL } from "@/configs/hand/handModel";
import { HAND_MOTION } from "@/configs/hand/handMotion";

export function useHandTweaks() {
  const model = useControls(
    "Hand/Model",
    {
      size: { value: HAND_MODEL.size, min: 0.2, max: 20, step: 0.01 },
      reach: { value: HAND_MODEL.reach, min: -1, max: 1, step: 0.01 },
      side: { value: HAND_MODEL.side, min: -1, max: 1, step: 0.01 },
      lift: { value: HAND_MODEL.lift, min: -3, max: 3, step: 0.01 },
      approach: { value: HAND_MODEL.approach, min: 0, max: 12, step: 0.05 },
      aim: folder(
        {
          yaw: { value: HAND_MODEL.yaw, min: -180, max: 180, step: 1 },
          pitch: { value: HAND_MODEL.pitch, min: -180, max: 180, step: 1 },
          roll: { value: HAND_MODEL.roll, min: -180, max: 180, step: 1 },
          mirror: HAND_MODEL.mirror,
        },
        { collapsed: true },
      ),
    },
    { order: 1, collapsed: true },
  );

  const motion = useControls(
    "Hand/Motion",
    {
      follow: { value: HAND_MOTION.follow, min: 1, max: 30, step: 0.1 },
      settle: { value: HAND_MOTION.settle, min: 1, max: 30, step: 0.1 },
      turn: { value: HAND_MOTION.turn, min: -10, max: 10, step: 0.1 },
      bank: { value: HAND_MOTION.bank, min: -10, max: 10, step: 0.1 },
      lean: { value: HAND_MOTION.lean, min: -10, max: 10, step: 0.1 },
      entry: folder(
        {
          fadeIn: { value: HAND_MOTION.fadeIn, min: 0.05, max: 2, step: 0.01, label: "in" },
          fadeOut: { value: HAND_MOTION.fadeOut, min: 0.05, max: 2, step: 0.01, label: "out" },
          back: { value: HAND_MOTION.back, min: 0, max: 3, step: 0.01 },
          tilt: { value: HAND_MOTION.tilt, min: -90, max: 90, step: 1 },
        },
        { collapsed: true },
      ),
    },
    { order: 2, collapsed: true },
  );

  return { model, motion };
}
