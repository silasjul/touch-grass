import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three/webgpu";
import { bake } from "@/lib/terrain/heightField";
import { takeDirty } from "@/lib/terrain/noise";

export function useHeightField() {
  const gl = useThree((s) => s.gl) as unknown as THREE.WebGPURenderer;
  const baking = useRef(false);

  useFrame(() => {
    if (baking.current) return;
    if (!takeDirty()) return;

    baking.current = true;
    bake(gl).finally(() => {
      baking.current = false;
    });
  });
}
