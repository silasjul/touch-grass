import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "tsl-inspector";
import { CAMERA_ORBIT } from "@/configs/cameraConfigs";

/** Bound to the canvas rather than R3F's event container, which also holds the Inspector. */
export default function CameraOrbit() {
  const canvas = useThree((s) => s.gl.domElement);

  const { speed, damping } = useControls(
    "Scene/camera",
    {
      speed: { value: CAMERA_ORBIT.speed, min: 0.05, max: 3, step: 0.05 },
      damping: { value: CAMERA_ORBIT.damping, min: 0.01, max: 0.3, step: 0.005 },
    },
    { order: 2, collapsed: true },
  );

  return (
    <OrbitControls
      makeDefault
      domElement={canvas}
      target={[0, 0, 0]}
      rotateSpeed={speed}
      dampingFactor={damping}
    />
  );
}
