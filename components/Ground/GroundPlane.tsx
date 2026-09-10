import { useEffect, useMemo } from "react";
import { folder, useControls } from "tsl-inspector";
import GroundNormalArrow from "@/components/Ground/GroundNormalArrow";
import { GROUND } from "@/configs/groundPlaneConfigs";
import { useGroundPointer } from "@/hooks/ground/useGroundPointer";
import { useHeightField } from "@/hooks/terrain/useHeightField";
import { buildGroundNodes } from "@/lib/terrain/groundNodes";
import { useGroundStore } from "@/stores/groundStore";

export default function GroundPlane() {
  useHeightField();

  const nodes = useMemo(() => buildGroundNodes(), []);
  const setSize = useGroundStore((s) => s.setSize);
  const { probe, handlers } = useGroundPointer();

  const { size, segments, wireframe } = useControls(
    "Ground",
    {
      geometry: folder(
        {
          size: { value: GROUND.size, min: 30, max: 60, step: 0.01 },
          segments: { value: GROUND.segments, min: 1, max: 400, step: 1 },
          wireframe: GROUND.wireframe,
        },
        { order: 1, collapsed: true },
      ),
    },
    { order: 0, collapsed: true },
  );

  useEffect(() => setSize(size), [size, setSize]);

  return (
    <>
      <mesh scale={size} rotation-x={-Math.PI / 2} {...handlers}>
        <planeGeometry args={[1, 1, segments, segments]} />
        <meshStandardNodeMaterial
          positionNode={nodes.positionNode}
          normalNode={nodes.normalNode}
          wireframe={wireframe}
          roughness={0.6}
        />
      </mesh>

      <GroundNormalArrow probe={probe} />
    </>
  );
}
