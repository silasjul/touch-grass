import type * as THREE from "three";
import { HEIGHT_FIELD } from "@/configs/groundPlaneConfigs";
import { useGroundStore } from "@/stores/groundStore";
import { heights } from "./heightField";

const { resolution } = HEIGHT_FIELD;

function texel(x: number, y: number) {
  const cx = Math.min(Math.max(x, 0), resolution - 1);
  const cy = Math.min(Math.max(y, 0), resolution - 1);

  return heights[cy * resolution + cx];
}

export function sampleGroundHeight(worldX: number, worldZ: number) {
  const { size } = useGroundStore.getState();

  const u = worldX / size + 0.5;
  // Negated: the plane is turned -90 degrees about X, so its local +y points at world -z.
  const v = -worldZ / size + 0.5;

  const px = u * resolution - 0.5;
  const py = v * resolution - 0.5;

  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const fx = px - x0;
  const fy = py - y0;

  const top = texel(x0, y0) * (1 - fx) + texel(x0 + 1, y0) * fx;
  const bottom = texel(x0, y0 + 1) * (1 - fx) + texel(x0 + 1, y0 + 1) * fx;

  // The mesh is scaled uniformly, so the height the shader writes is in the same local units.
  return (top * (1 - fy) + bottom * fy) * size;
}

export function sampleGroundNormal(
  worldX: number,
  worldZ: number,
  target: THREE.Vector3,
) {
  const step = useGroundStore.getState().size / resolution;

  const h = sampleGroundHeight(worldX, worldZ);
  const hx = sampleGroundHeight(worldX + step, worldZ);
  const hz = sampleGroundHeight(worldX, worldZ + step);

  return target.set(h - hx, step, h - hz).normalize();
}
