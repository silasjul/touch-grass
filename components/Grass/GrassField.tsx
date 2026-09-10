import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useControls } from "tsl-inspector";
import { GRASS_FIELD } from "@/configs/grass/grassField";
import { buildBladeGeometry } from "@/lib/grass/bladeGeometry";
import { buildGrassNodes } from "@/lib/grass/grassNodes";
import { columnsFor, gridColumns } from "@/lib/grass/placement";
import { useGroundStore } from "@/stores/groundStore";

export default function GrassField() {
  const nodes = useMemo(() => buildGrassNodes(), []);
  const size = useGroundStore((s) => s.size);

  const { density, maxBlades, segments, wireframe } = useControls(
    "Grass",
    {
      density: { value: GRASS_FIELD.density, min: 5, max: 800, step: 0.1 },
      maxBlades: { value: GRASS_FIELD.maxBlades, min: 10000, max: 2000000, step: 10000 },
      segments: { value: GRASS_FIELD.segments, min: 1, max: 12, step: 1 },
      wireframe: false,
    },
    { order: 1, collapsed: true },
  );

  const columns = columnsFor(Math.min(density * size * size, maxBlades));
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
