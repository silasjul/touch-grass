import { Vector2 } from "three";
import { dot, normalize, uniform, vec2 } from "three/tsl";
import type * as THREE from "three/webgpu";
import { touchTweaks as t } from "./tweaks/touchTweaks";

export const touchPoint = uniform(new Vector2());
export const touchAxis = uniform(new Vector2(1, 0));
export const touchDrift = uniform(new Vector2());
export const touchHeight = uniform(0);
export const touchStrength = uniform(0);

export function touchAt(xz: THREE.Node<"vec2">, tip: THREE.Node<"float">) {
  const delta = xz.sub(touchPoint).toVar();
  const across = vec2(touchAxis.y.negate(), touchAxis.x);

  const shaped = vec2(dot(delta, touchAxis).div(t.stretch), dot(delta, across)).div(t.radius);
  const nearness = shaped.length().oneMinus().saturate().pow(t.falloff);
  const overlap = tip.sub(touchHeight).div(t.soften).saturate();

  const weight = nearness.mul(overlap).mul(touchStrength).saturate().toVar();

  // The nudge keeps normalize() off a zero vector, for a plant rooted exactly under the point.
  const radial = normalize(delta.add(vec2(0.0001, 0)));

  return {
    weight,
    away: normalize(radial.add(touchDrift.mul(t.drag))),
    bend: weight.mul(t.push),
    squash: weight.mul(t.squash).oneMinus(),
  };
}
