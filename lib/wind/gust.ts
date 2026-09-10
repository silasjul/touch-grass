import { cos, mx_noise_float, sin, time, vec2 } from "three/tsl";
import type * as THREE from "three/webgpu";
import { windTweaks as w } from "./tweaks";

const DEGREES = Math.PI / 180;
const angle = w.direction.mul(DEGREES);

export const windDirection = vec2(cos(angle), sin(angle));

export function gustAt(xz: THREE.Node<"vec2">) {
  const flow = xz.mul(w.scale).sub(windDirection.mul(time.mul(w.speed)));

  return mx_noise_float(flow).mul(0.5).add(0.5).mul(w.strength).toVar();
}
