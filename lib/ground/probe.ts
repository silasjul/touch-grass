import type { GroundShape } from "@/lib/terrain/groundShape";

export const groundProbe = { x: 0, z: 0 };

/** Puts the nearest point of the ground in the probe, and tells you if the ray already met it. */
export function aimProbe(x: number, z: number, size: number, shape: GroundShape) {
  const half = size / 2;

  if (shape === "circle") {
    const radius = Math.hypot(x, z);
    const pull = Math.min(half / radius, 1);

    groundProbe.x = x * pull;
    groundProbe.z = z * pull;

    return radius <= half;
  }

  groundProbe.x = Math.min(Math.max(x, -half), half);
  groundProbe.z = Math.min(Math.max(z, -half), half);

  return Math.abs(x) <= half && Math.abs(z) <= half;
}
