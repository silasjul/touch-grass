import { useControls } from "tsl-inspector";
import { PLANE_DEFAULTS } from "@/configs/groundPlaneConfigs";

export default function GroundPlane() {
  const { size, segments, wireframe } = useControls(
    "Plane",
    {
      size: { value: PLANE_DEFAULTS.size, min: 1, max: 40, step: 0.01 },
      segments: { value: PLANE_DEFAULTS.segments, min: 0, max: 300, step: 1 },
      wireframe: PLANE_DEFAULTS.wireframe,
    },
    { order: 1 },
  );

  return (
    <mesh scale={size} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1, 1, segments, segments]} />
      <meshStandardMaterial wireframe={wireframe} roughness={0.6} />
    </mesh>
  );
}
