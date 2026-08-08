import { useControls } from "tsl-inspector";
import { LIGHT_DEFAULTS } from "@/configs/sceneConfigs";

export default function Light() {
  const { sunColor, sunIntensity, sunHeight, ambientColor, fill } =
    useControls("Light", {
      sunColor: LIGHT_DEFAULTS.sunColor,
      sunIntensity: {
        value: LIGHT_DEFAULTS.sunIntensity,
        min: 0,
        max: 10,
        step: 0.1,
      },
      sunHeight: { value: LIGHT_DEFAULTS.sunHeight, min: -40, max: 80, step: 1 },
      ambientColor: LIGHT_DEFAULTS.ambientColor,
      fill: { value: LIGHT_DEFAULTS.fill, min: 0, max: 3, step: 0.05 },
    });

  return (
    <>
      <ambientLight color={ambientColor} intensity={fill} />
      <directionalLight
        position={[-60, sunHeight, -40]}
        intensity={sunIntensity}
        color={sunColor}
      />
    </>
  );
}
