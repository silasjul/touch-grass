import {
  cameraPosition,
  dot,
  float,
  mix,
  mx_noise_float,
  normalize,
  normalWorld,
  positionGeometry,
  positionWorld,
  pow,
  smoothstep,
  varying,
} from "three/tsl";
import { sun } from "@/lib/scene/sun";
import { bladeRandom } from "./bladeShape";
import { bladeAnchor } from "./placement";
import { colorTweaks as c } from "./tweaks/colorTweaks";

export function buildGrassShading() {
  const along = positionGeometry.y;
  const dryness = varying(mx_noise_float(bladeAnchor().mul(c.drynessScale)).mul(0.5).add(0.5));
  const tint = varying(bladeRandom.tint);

  const gradient = mix(c.root, c.tip, pow(along, c.gradient));
  const dried = mix(gradient, c.dryColor, dryness.mul(c.dryness));
  const tinted = dried.mul(float(1).add(tint.sub(0.5).mul(2).mul(c.variance)));
  const occlusion = mix(c.occlusion.oneMinus(), float(1), smoothstep(0, 0.4, along));

  const toCamera = normalize(cameraPosition.sub(positionWorld));
  const towardSun = dot(toCamera, sun.direction.mul(-1)).saturate();
  const litFromBehind = dot(normalWorld.mul(-1), sun.direction).saturate();
  const glow = pow(towardSun, c.translucencyFocus)
    .mul(litFromBehind)
    .mul(c.translucency)
    .mul(along);

  return {
    colorNode: tinted.mul(occlusion),
    // Through the blade, so it leaves the blade's colour. Sun colour alone is white light, and the
    // whole field goes white the moment you turn towards the sun.
    emissiveNode: sun.color.mul(sun.intensity).mul(tinted).mul(glow),
    roughnessNode: c.roughness.mul(mix(float(1.3), float(0.8), along)).clamp(0.05, 1),
  };
}
