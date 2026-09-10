import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useControls } from "tsl-inspector";
import { GRASS_FIELD } from "@/configs/grass/grassField";
import { buildBladeGeometry } from "@/lib/grass/bladeGeometry";
import { buildGrassNodes } from "@/lib/grass/grassNodes";
import { columnsFor, gridColumns } from "@/lib/grass/placement";

export default function GrassField() {
  const nodes = useMemo(() => buildGrassNodes(), []);

  const { blades, segments, wireframe } = useControls(
    "Grass",
    {
      blades: { value: GRASS_FIELD.blades, min: 1000, max: 1000000, step: 1000 },
      segments: { value: GRASS_FIELD.segments, min: 1, max: 12, step: 1 },
      wireframe: false,
    },
    { order: 1, collapsed: true },
  );

  const columns = columnsFor(blades);
  const geometry = useMemo(
    () => buildBladeGeometry(segments, columns * columns),
    [segments, columns],
  );

  useEffect(() => {
    gridColumns.value = columns;
  }, [columns]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <meshStandardNodeMaterial
        positionNode={nodes.positionNode}
        normalNode={nodes.normalNode}
        colorNode={nodes.colorNode}
        emissiveNode={nodes.emissiveNode}
        roughnessNode={nodes.roughnessNode}
        metalness={0}
        side={THREE.DoubleSide}
        wireframe={wireframe}
      />
    </mesh>
  );
}
