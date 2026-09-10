"use client";

import { Canvas } from "@react-three/fiber";
import Light from "@/components/Light";
import GroundPlane from "@/components/Ground/GroundPlane";
import GrassField from "@/components/Grass/GrassField";
import Controls from "@/components/Controls";
import CameraTweaks from "@/components/CameraTweaks";
import { createWebGPURenderer, useParametersToggle } from "tsl-inspector";

export default function Scene() {
  useParametersToggle();

  return (
    <Canvas
      camera={{
        position: [3.4, 19.2, 24.7],
        fov: 45,
        near: 0.1,
        far: 2000,
      }}
      gl={createWebGPURenderer}
    >
      <Light />
      <GroundPlane />
      <GrassField />
      <Controls />
      <CameraTweaks />
    </Canvas>
  );
}
