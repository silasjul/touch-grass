import { create } from "zustand";
import { GROUND } from "@/configs/groundPlaneConfigs";
import type { GroundShape } from "@/lib/terrain/groundShape";

type GroundStore = {
  size: number;
  setSize: (size: number) => void;
  shape: GroundShape;
  setShape: (shape: GroundShape) => void;
  relief: number;
  setRelief: (relief: number) => void;
  touching: boolean;
  setTouching: (touching: boolean) => void;
};

export const useGroundStore = create<GroundStore>((set) => ({
  size: GROUND.size,
  setSize: (size) => set({ size }),
  shape: GROUND.shape as GroundShape,
  setShape: (shape) => set({ shape }),
  relief: 0,
  setRelief: (relief) => set({ relief }),
  touching: false,
  setTouching: (touching) => set({ touching }),
}));
