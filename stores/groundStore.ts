import { create } from "zustand";
import { GROUND, GROUND_ARROW } from "@/configs/groundPlaneConfigs";

type GroundStore = {
  size: number;
  setSize: (size: number) => void;
  probeEnabled: boolean;
  setProbeEnabled: (probeEnabled: boolean) => void;
};

export const useGroundStore = create<GroundStore>((set) => ({
  size: GROUND.size,
  setSize: (size) => set({ size }),
  probeEnabled: GROUND_ARROW.enabled,
  setProbeEnabled: (probeEnabled) => set({ probeEnabled }),
}));
