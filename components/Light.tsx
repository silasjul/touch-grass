import { useHelper } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useControls, folder } from "tsl-inspector";
import { LIGHT_DEFAULTS } from "@/configs/sceneConfigs";
import { sun } from "@/lib/scene/sun";

export default function Light() {
  const directional = useRef<THREE.DirectionalLight>(null!);

  const { sunColor, sunIntensity, sunHeight, ambientColor, fill, helper } =
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
            sunHeight: {
              value: LIGHT_DEFAULTS.sunHeight,
              min: -40,
              max: 80,
              step: 1,
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

  useHelper(helper && directional, THREE.DirectionalLightHelper, 8, "#ff4d4d");

  useEffect(() => {
    sun.direction.value.set(LIGHT_DEFAULTS.sunX, sunHeight, LIGHT_DEFAULTS.sunZ).normalize();
    sun.color.value.set(sunColor);
    sun.intensity.value = sunIntensity;
  }, [sunHeight, sunColor, sunIntensity]);

  return (
    <>
      <ambientLight color={ambientColor} intensity={fill} />
      <directionalLight
        ref={directional}
        position={[LIGHT_DEFAULTS.sunX, sunHeight, LIGHT_DEFAULTS.sunZ]}
        intensity={sunIntensity}
        color={sunColor}
      />
    </>
  );
}
