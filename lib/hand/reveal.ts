import {
  abs,
  distance,
  mx_noise_float,
  positionGeometry,
  positionWorld,
  smoothstep,
  uniform,
  vec3,
} from "three/tsl";
import { touchHeight, touchPoint } from "./touch";
import { revealTweaks as r } from "./tweaks/revealTweaks";

export const revealProgress = uniform(0);
export const revealSize = uniform(1);

export function buildHandReveal() {
  const origin = vec3(touchPoint.x, touchHeight, touchPoint.y);
  const front = revealProgress.mul(r.spread).mul(revealSize);

  // Vertex space, so the speckle sits on the skin instead of sliding through it as the hand moves.
  const speckle = mx_noise_float(positionGeometry.mul(r.grain)).mul(r.wobble).mul(revealSize);
  const edge = front.sub(distance(positionWorld, origin)).add(speckle).toVar();

  const rim = smoothstep(0, r.band.mul(revealSize), abs(edge)).oneMinus();

  return {
    opacityNode: smoothstep(0, r.soften.mul(revealSize), edge),
    emissiveNode: r.glowColor.mul(r.glow).mul(rim),
  };
}
