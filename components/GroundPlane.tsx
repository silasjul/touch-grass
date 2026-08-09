import { useControls, folder } from "tsl-inspector";
import { GROUND } from "@/configs/groundPlaneConfigs";
import { normalNode, positionNode } from "@/lib/ground";

export default function GroundPlane() {
  const { size, segments, wireframe } = useControls("Ground", {
    geometry: folder(
      {
        size: { value: GROUND.size, min: 30, max: 60, step: 0.01 },
        segments: { value: GROUND.segments, min: 1, max: 400, step: 1 },
        wireframe: GROUND.wireframe,
      },
      { order: 1, collapsed: true },
    ),
  }, {order: 0, collapsed: true});

  return (
    <mesh scale={size} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1, 1, segments, segments]} />
      <meshStandardNodeMaterial
        positionNode={positionNode}
        normalNode={normalNode}
        wireframe={wireframe}
        roughness={0.6}
      />
    </mesh>
  );
}
