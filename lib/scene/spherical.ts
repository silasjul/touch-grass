import { Vector3 } from "three";

const DEGREES = Math.PI / 180;

/** Azimuth 0 is +Z, turning towards +X — the angle three's `Spherical` and OrbitControls use. */
export function fromAngles(azimuth: number, elevation: number, distance: number) {
  const around = azimuth * DEGREES;
  const up = elevation * DEGREES;
  const flat = Math.cos(up) * distance;

  return new Vector3(flat * Math.sin(around), Math.sin(up) * distance, flat * Math.cos(around));
}
