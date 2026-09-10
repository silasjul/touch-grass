import { useEffect, useMemo } from "react";
import * as THREE from "three/webgpu";
import { folder, useControls } from "tsl-inspector";
import { FLOWER_FIELD } from "@/configs/flowers/flowerField";
import { useDrawCount } from "@/hooks/field/useDrawCount";
import { chunkColumnsFor, chunkRadius, layOutChunks } from "@/lib/field/chunks";
import { buildFlowerGeometry } from "@/lib/flowers/flowerGeometry";
import { buildFlowerNodes } from "@/lib/flowers/flowerNodes";
import { flowerScatter } from "@/lib/flowers/placement";
import { useGroundStore } from "@/stores/groundStore";

const DISC_SIDES = 10;

export default function FlowerField() {
  const size = useGroundStore((s) => s.size);
  const shape = useGroundStore((s) => s.shape);
  const relief = useGroundStore((s) => s.relief);

  const {
    density,
    maxFlowers,
    coverage,
    chunks,
    cullMargin,
    petals,
    petalSegments,
    stemSegments,
    wireframe,
  } = useControls(
    "Flowers",
    {
      density: { value: FLOWER_FIELD.density, min: 0, max: 30, step: 0.01 },
      maxFlowers: { value: FLOWER_FIELD.maxFlowers, min: 1000, max: 400000, step: 1000 },
      coverage: { value: FLOWER_FIELD.coverage, min: 0.1, max: 1, step: 0.01 },
      wireframe: false,
      mesh: folder(
        {
          petals: { value: FLOWER_FIELD.petals, min: 3, max: 48, step: 1 },
          petalSegments: { value: FLOWER_FIELD.petalSegments, min: 1, max: 8, step: 1 },
          stemSegments: { value: FLOWER_FIELD.stemSegments, min: 1, max: 10, step: 1 },
        },
        { collapsed: true },
      ),
      culling: folder(
        {
          chunks: { value: FLOWER_FIELD.chunks, min: 1, max: 16, step: 1 },
          cullMargin: { value: FLOWER_FIELD.cullMargin, min: 0, max: 30, step: 0.1, label: "margin" },
        },
        { collapsed: true },
      ),
    },
    { order: 2, collapsed: true },
  );

  const span = size * coverage;
  const chunkSpan = span / chunks;
  const columns = chunkColumnsFor(Math.min(density * size * size, maxFlowers), chunks);
  const radius = chunkRadius(chunkSpan, relief * size, cullMargin);
  const instances = density > 0 ? columns * columns : 0;

  const nodes = useMemo(() => buildFlowerNodes(), []);

  const material = useMemo(() => {
    const flower = new THREE.MeshStandardNodeMaterial();

    flower.positionNode = nodes.positionNode;
    flower.normalNode = nodes.normalNode;
    flower.colorNode = nodes.colorNode;
    flower.emissiveNode = nodes.emissiveNode;
    flower.roughnessNode = nodes.roughnessNode;
    flower.metalness = 0;
    flower.side = THREE.DoubleSide;

    return flower;
  }, [nodes]);

  const geometry = useMemo(
    () =>
      buildFlowerGeometry(
        { petals, petalSegments, stemSegments, discSides: DISC_SIDES },
        instances,
        radius,
      ),
    [petals, petalSegments, stemSegments, instances, radius],
  );

  const laid = useMemo(() => layOutChunks(span, chunks, shape), [span, chunks, shape]);

  const count = useDrawCount("Flowers/count", "flowers", instances, laid.length);

  useEffect(() => {
    flowerScatter.columns.value = columns;
    flowerScatter.chunks.value = chunks;
    flowerScatter.coverage.value = coverage;
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
