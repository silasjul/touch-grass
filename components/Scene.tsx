"use client";

import { Canvas } from "@react-three/fiber";
import { CAMERA_ORBIT } from "@/configs/cameraConfigs";
import { fromAngles } from "@/lib/scene/spherical";
import Light from "@/components/Light";
import GroundPlane from "@/components/Ground/GroundPlane";
import GrassField from "@/components/Grass/GrassField";
import Sky from "@/components/Sky";
import CameraOrbit from "@/components/Camera/CameraOrbit";
import CameraTweaks from "@/components/Camera/CameraTweaks";
import { createWebGPURenderer, useParametersToggle } from "tsl-inspector";

export default function Scene() {
  useParametersToggle();

  return (
    <Canvas
      camera={{
        position: fromAngles(CAMERA_ORBIT.azimuth, CAMERA_ORBIT.elevation, CAMERA_ORBIT.distance),
        fov: 45,
        near: 0.1,
        far: 2000,
      }}
      gl={createWebGPURenderer}
    >
      <Sky />
      <Light />
      <GroundPlane />
      <GrassField />
      <CameraOrbit />
      <CameraTweaks />
    </Canvas>
  );
}
