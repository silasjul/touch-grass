import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { folder, useControls } from "tsl-inspector";
import GroundNormalArrow from "@/components/Ground/GroundNormalArrow";
import { GROUND } from "@/configs/groundPlaneConfigs";
import { useGroundPointer } from "@/hooks/ground/useGroundPointer";
import { useGroundTextures } from "@/hooks/terrain/useGroundTextures";
import { useHeightField } from "@/hooks/terrain/useHeightField";
import { buildGroundNodes } from "@/lib/terrain/groundNodes";
import { groundShape } from "@/lib/terrain/groundShape";
import { groundSize } from "@/lib/terrain/groundSize";
import { useGroundStore } from "@/stores/groundStore";

export default function GroundPlane() {
  useHeightField();

  const textures = useGroundTextures();
  const nodes = useMemo(() => buildGroundNodes(textures), [textures]);
  const setSize = useGroundStore((s) => s.setSize);
  const setShape = useGroundStore((s) => s.setShape);
  const probe = useGroundPointer();

  const { size, shape, segments, wireframe } = useControls(
    "Ground",
    {
      geometry: folder(
        {
          size: { value: GROUND.size, min: 10, max: 400, step: 0.1 },
          shape: { value: GROUND.shape, options: ["circle", "square"] },
          segments: { value: GROUND.segments, min: 1, max: 400, step: 1 },
          wireframe: GROUND.wireframe,
        },
        { order: 1, collapsed: true },
      ),
    },
    { order: 0, collapsed: true },
  );

  const geometry = useMemo(
    () =>
      shape === "circle"
        ? new THREE.RingGeometry(0, 0.5, segments, segments)
        : new THREE.PlaneGeometry(1, 1, segments, segments),
    [shape, segments],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    setSize(size);
    setShape(shape);
    groundSize.value = size;
    groundShape.value = shape === "circle" ? 1 : 0;
  }, [size, shape, setSize, setShape]);

  return (
    <>
      <mesh geometry={geometry} scale={size} rotation-x={-Math.PI / 2}>
        <meshStandardNodeMaterial
          positionNode={nodes.positionNode}
          normalNode={nodes.normalNode}
          colorNode={nodes.colorNode}
          roughnessNode={nodes.roughnessNode}
          aoNode={nodes.aoNode}
          wireframe={wireframe}
        />
      </mesh>

      <GroundNormalArrow probe={probe} />
    </>
  );
}
