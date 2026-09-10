import type { GroundShape } from "@/lib/terrain/groundShape";

export type Chunk = { key: string; centre: [number, number, number] };

export const chunkColumnsFor = (blades: number, chunks: number) =>
  Math.ceil(Math.sqrt(Math.max(blades, 1)) / chunks);

/** A chunk the circle mask would empty is never built — every one of its blades collapses anyway. */
export function layOutChunks(span: number, chunks: number, shape: GroundShape): Chunk[] {
  const chunkSpan = span / chunks;
  const reach = (chunkSpan * Math.SQRT2) / 2;
  const laid: Chunk[] = [];

  for (let row = 0; row < chunks; row++) {
    for (let column = 0; column < chunks; column++) {
      const x = (column + 0.5) * chunkSpan - span / 2;
      const z = (row + 0.5) * chunkSpan - span / 2;

      if (shape === "circle" && Math.hypot(x, z) - reach > span / 2) continue;

      laid.push({ key: `${column}-${row}`, centre: [x, 0, z] });
    }
  }

  return laid;
}

export function chunkRadius(chunkSpan: number, relief: number, margin: number) {
  return Math.hypot((chunkSpan * Math.SQRT2) / 2, relief) + margin;
}
