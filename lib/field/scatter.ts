import { float, hash, instanceIndex, mix, modelPosition, smoothstep, uint, uniform, vec2 } from "three/tsl";
import type * as THREE from "three/webgpu";
import { groundShape } from "@/lib/terrain/groundShape";
import { groundSize } from "@/lib/terrain/groundSize";

type Float = THREE.Node<"float">;

export const columnsFor = (instances: number) => Math.ceil(Math.sqrt(instances));

export type Scatter = ReturnType<typeof createScatter>;

export function createScatter(defaults: { columns: number; chunks: number; coverage: number }) {
  const columns = uniform(defaults.columns);
  const chunks = uniform(defaults.chunks);
  const coverage = uniform(defaults.coverage);

  const area = groundSize.mul(coverage);
  const chunkArea = area.div(chunks);
  const chunkCell = modelPosition.xz.add(area.mul(0.5)).div(chunkArea).floor();

  /** Every chunk draws the same `instanceIndex` range, so seeding on it alone tiles one patch. */
  const index = chunkCell.y
    .mul(chunks)
    .add(chunkCell.x)
    .mul(columns)
    .mul(columns)
    .add(instanceIndex.toFloat());

  function anchor(jitter: Float) {
    const cell = chunkArea.div(columns);
    const column = instanceIndex.mod(uint(columns)).toFloat();
    const row = instanceIndex.div(uint(columns)).toFloat();

    const offset = vec2(hash(index), hash(index.add(7))).sub(0.5).mul(jitter);
    const local = vec2(column, row).add(offset).add(0.5).mul(cell).sub(chunkArea.mul(0.5));

    return local.add(modelPosition.xz).toVar();
  }

  function insideField(xz: THREE.Node<"vec2">) {
    const radius = area.mul(0.5);
    const round = smoothstep(radius.mul(0.98), radius, xz.length()).oneMinus();

    return mix(float(1), round, groundShape);
  }

  return { columns, chunks, coverage, index, anchor, insideField };
}
