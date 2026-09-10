import { create } from "zustand";
import { GROUND, GROUND_ARROW } from "@/configs/groundPlaneConfigs";
import type { GroundShape } from "@/lib/terrain/groundShape";

type GroundStore = {
  size: number;
  setSize: (size: number) => void;
  shape: GroundShape;
  setShape: (shape: GroundShape) => void;
  relief: number;
  setRelief: (relief: number) => void;
  probeEnabled: boolean;
  setProbeEnabled: (probeEnabled: boolean) => void;
};

export const useGroundStore = create<GroundStore>((set) => ({
  size: GROUND.size,
  setSize: (size) => set({ size }),
  shape: GROUND.shape as GroundShape,
  setShape: (shape) => set({ shape }),
  relief: 0,
  setRelief: (relief) => set({ relief }),
  probeEnabled: GROUND_ARROW.enabled,
  setProbeEnabled: (probeEnabled) => set({ probeEnabled }),
}));
