import { useHelper } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useControls, folder } from "tsl-inspector";
import { LIGHT_DEFAULTS } from "@/configs/sceneConfigs";
import { sun, sunPosition } from "@/lib/scene/sun";

export default function Light() {
  const directional = useRef<THREE.DirectionalLight>(null!);

  const { sunColor, sunIntensity, sunAzimuth, sunElevation, ambientColor, fill, helper } =
    useControls(
      "Scene",
      {
        light: folder(
          {
            sunColor: LIGHT_DEFAULTS.sunColor,
            sunIntensity: {
              value: LIGHT_DEFAULTS.sunIntensity,
              min: 0,
              max: 10,
              step: 0.1,
            },
            sunAzimuth: {
              value: LIGHT_DEFAULTS.sunAzimuth,
              min: -180,
              max: 180,
              step: 0.1,
            },
            sunElevation: {
              value: LIGHT_DEFAULTS.sunElevation,
              min: -10,
              max: 90,
              step: 0.1,
            },
            ambientColor: LIGHT_DEFAULTS.ambientColor,
            fill: { value: LIGHT_DEFAULTS.fill, min: 0, max: 3, step: 0.05 },
            helper: LIGHT_DEFAULTS.helper,
          },
          { collapsed: true },
        ),
      },
      { collapsed: true },
    );

  const position = useMemo(
    () => sunPosition(sunAzimuth, sunElevation),
    [sunAzimuth, sunElevation],
  );

  useHelper(helper && directional, THREE.DirectionalLightHelper, 8, "#ff4d4d");

  useEffect(() => {
    sun.direction.value.copy(position).normalize();
    sun.color.value.set(sunColor);
    sun.intensity.value = sunIntensity;
  }, [position, sunColor, sunIntensity]);

  return (
    <>
      <ambientLight color={ambientColor} intensity={fill} />
      <directionalLight
        ref={directional}
        position={position}
        intensity={sunIntensity}
        color={sunColor}
      />
    </>
  );
}
