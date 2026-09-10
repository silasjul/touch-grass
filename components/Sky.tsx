import { Environment } from "@react-three/drei";
import { useControls } from "tsl-inspector";
import { SKY_DEFAULTS } from "@/configs/sceneConfigs";

const DEGREES = Math.PI / 180;

export default function Sky() {
  const { background, blur, backgroundIntensity, environmentIntensity, rotation } =
    useControls(
      "Scene/sky",
      {
        background: SKY_DEFAULTS.background,
        blur: { value: SKY_DEFAULTS.blur, min: 0, max: 1, step: 0.01 },
        backgroundIntensity: {
          value: SKY_DEFAULTS.backgroundIntensity,
          min: 0,
          max: 3,
          step: 0.01,
        },
        environmentIntensity: {
          value: SKY_DEFAULTS.environmentIntensity,
          min: 0,
          max: 3,
          step: 0.01,
        },
        rotation: { value: SKY_DEFAULTS.rotation, min: 0, max: 360, step: 1 },
      },
      { order: 1, collapsed: true },
    );

  const spin: [number, number, number] = [0, rotation * DEGREES, 0];

  return (
    <Environment
      files="/kloofendal_48d_partly_cloudy_puresky_2k.exr"
      background={background}
      blur={blur}
      backgroundIntensity={backgroundIntensity}
      environmentIntensity={environmentIntensity}
      backgroundRotation={spin}
      environmentRotation={spin}
    />
  );
}
