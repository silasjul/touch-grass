import { useEffect, useMemo } from "react";
import * as THREE from "three/webgpu";
import { folder, useControls } from "tsl-inspector";
import { GRASS_FIELD } from "@/configs/grass/grassField";
import { useDrawCount } from "@/hooks/field/useDrawCount";
import { buildBladeGeometry } from "@/lib/grass/bladeGeometry";
import { chunkColumnsFor, chunkRadius, layOutChunks } from "@/lib/field/chunks";
import { buildGrassNodes } from "@/lib/grass/grassNodes";
import { grassScatter } from "@/lib/grass/placement";
import { useGroundStore } from "@/stores/groundStore";

export default function GrassField() {
  const size = useGroundStore((s) => s.size);
  const shape = useGroundStore((s) => s.shape);
  const relief = useGroundStore((s) => s.relief);

  const { density, maxBlades, coverage, chunks, cullMargin, segments, wireframe } = useControls(
    "Grass",
    {
      density: { value: GRASS_FIELD.density, min: 5, max: 800, step: 0.1 },
      maxBlades: { value: GRASS_FIELD.maxBlades, min: 10000, max: 2000000, step: 10000 },
      coverage: { value: GRASS_FIELD.coverage, min: 0.1, max: 1, step: 0.01 },
      segments: { value: GRASS_FIELD.segments, min: 1, max: 12, step: 1 },
      wireframe: false,
      culling: folder(
        {
          chunks: { value: GRASS_FIELD.chunks, min: 1, max: 16, step: 1 },
          cullMargin: { value: GRASS_FIELD.cullMargin, min: 0, max: 30, step: 0.1, label: "margin" },
        },
        { collapsed: true },
      ),
    },
    { order: 1, collapsed: true },
  );

  const span = size * coverage;
  const chunkSpan = span / chunks;
  const columns = chunkColumnsFor(Math.min(density * size * size, maxBlades), chunks);
  const radius = chunkRadius(chunkSpan, relief * size, cullMargin);

  const nodes = useMemo(() => buildGrassNodes(), []);

  const material = useMemo(() => {
    const grass = new THREE.MeshStandardNodeMaterial();

    grass.positionNode = nodes.positionNode;
    grass.normalNode = nodes.normalNode;
    grass.colorNode = nodes.colorNode;
    grass.emissiveNode = nodes.emissiveNode;
    grass.roughnessNode = nodes.roughnessNode;
    grass.metalness = 0;
    grass.side = THREE.DoubleSide;

    return grass;
  }, [nodes]);

  const geometry = useMemo(
    () => buildBladeGeometry(segments, columns * columns, radius),
    [segments, columns, radius],
  );

  const laid = useMemo(() => layOutChunks(span, chunks, shape), [span, chunks, shape]);

  const count = useDrawCount("Grass/count", "blades", columns * columns, laid.length);

  useEffect(() => {
    grassScatter.columns.value = columns;
    grassScatter.chunks.value = chunks;
    grassScatter.coverage.value = coverage;
  }, [columns, chunks, coverage]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return (
    <>
      {laid.map((chunk) => (
        <mesh
          key={chunk.key}
          geometry={geometry}
          material={material}
          material-wireframe={wireframe}
          position={chunk.centre}
          onBeforeRender={count}
        />
      ))}
    </>
  );
}
