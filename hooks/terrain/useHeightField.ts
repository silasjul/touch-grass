import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three/webgpu";
import { bake } from "@/lib/terrain/heightField";
import { takeDirty } from "@/lib/terrain/noise";
import { useGroundStore } from "@/stores/groundStore";

export function useHeightField() {
  const gl = useThree((s) => s.gl) as unknown as THREE.WebGPURenderer;
  const setRelief = useGroundStore((s) => s.setRelief);
  const baking = useRef(false);

  useFrame(() => {
    if (baking.current) return;
    if (!takeDirty()) return;

    baking.current = true;
    bake(gl)
      .then(setRelief)
      .finally(() => {
        baking.current = false;
      });
  });
}
