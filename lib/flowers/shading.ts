import {
  cameraPosition,
  dot,
  float,
  mix,
  normalize,
  normalWorld,
  positionGeometry,
  positionWorld,
  pow,
  smoothstep,
  varying,
} from "three/tsl";
import type * as THREE from "three/webgpu";
import { sun } from "@/lib/scene/sun";
import { flowerRandom, variantMix } from "./flowerShape";
import { isCentre, isPetal, isStem } from "./parts";
import { colorTweaks as c } from "./tweaks/colorTweaks";

type Color = THREE.Node<"color">;

export function buildFlowerShading() {
  const along = positionGeometry.y;

  // Through a varying, or nothing works: both are seeded on `instanceIndex`, which the fragment
  // stage has no access to.
  const weights = varying(variantMix, "flowerVariant");
  const tint = varying(flowerRandom.tint, "flowerTint");

  const byVariant = (dandelion: Color, daisy: Color, blowball: Color) =>
    dandelion.mul(weights.x).add(daisy.mul(weights.y)).add(blowball.mul(weights.z));

  const petal = mix(
    byVariant(c.dandelionPetal, c.daisyPetal, c.blowballPetal),
    byVariant(c.dandelionEdge, c.daisyEdge, c.blowballEdge),
    along,
  );
  const centre = byVariant(c.dandelionCentre, c.daisyCentre, c.blowballCentre);
  const stem = mix(c.stemRoot, c.stemTip, along);

  const base = stem.mul(isStem).add(petal.mul(isPetal)).add(centre.mul(isCentre));
  const tinted = base.mul(float(1).add(tint.sub(0.5).mul(2).mul(c.variance)));
  const shaded = mix(c.occlusion.oneMinus(), float(1), smoothstep(0, 0.5, along));
  const occlusion = mix(float(1), shaded, isStem);

  const toCamera = normalize(cameraPosition.sub(positionWorld));
  const towardSun = dot(toCamera, sun.direction.mul(-1)).saturate();
  const litFromBehind = dot(normalWorld.mul(-1), sun.direction).saturate();
  const glow = pow(towardSun, c.translucencyFocus)
    .mul(litFromBehind)
    .mul(c.translucency)
    .mul(isPetal);

  return {
    colorNode: tinted.mul(occlusion),
    // Through the petal, so it leaves the petal's colour. Sun colour alone is white light, and
    // every flower goes white the moment you turn towards the sun.
    emissiveNode: sun.color.mul(sun.intensity).mul(tinted).mul(glow),
    roughnessNode: c.roughness.mul(mix(float(1), float(1.4), isCentre)).clamp(0.05, 1),
  };
}
