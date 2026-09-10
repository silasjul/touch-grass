import { float, hash, pow, sin, step } from "three/tsl";
import type * as THREE from "three/webgpu";
import { bladeIndex } from "./placement";
import { shapeTweaks as s } from "./tweaks/shapeTweaks";

type Float = THREE.Node<"float">;

const random = (offset: number) => hash(bladeIndex.add(offset));

export const bladeRandom = {
  facing: random(17),
  height: random(211),
  width: random(307),
  bend: random(401),
  variant: random(509),
  tint: random(601),
  phase: random(719),
};

const shareTotal = s.bladeShare.add(s.broadShare).add(s.spikeShare).max(0.0001);
const pastBlade = step(s.bladeShare.div(shareTotal), bladeRandom.variant);
const pastBroad = step(s.bladeShare.add(s.broadShare).div(shareTotal), bladeRandom.variant);

const bladeWeight = float(1).sub(pastBlade);
const broadWeight = pastBlade.sub(pastBroad);
const spikeWeight = pastBroad;

const byVariant = (blade: Float, broad: Float, spike: Float) =>
  blade.mul(bladeWeight).add(broad.mul(broadWeight)).add(spike.mul(spikeWeight));

const vary = (amount: Float, random: Float) => float(1).add(random.sub(0.5).mul(2).mul(amount));

export const bladeHeight = byVariant(s.bladeHeight, s.broadHeight, s.spikeHeight)
  .mul(s.scale)
  .mul(vary(s.heightVariance, bladeRandom.height));

export const bladeWidth = byVariant(s.bladeWidth, s.broadWidth, s.spikeWidth).mul(
  vary(s.widthVariance, bladeRandom.width),
);

export const bladeBend = byVariant(s.bladeBend, s.broadBend, s.spikeBend).mul(
  vary(s.bendVariance, bladeRandom.bend),
);

export const bladeTwist = byVariant(s.bladeTwist, s.broadTwist, s.spikeTwist);

const taper = byVariant(s.bladeTaper, s.broadTaper, s.spikeTaper);
const bulge = byVariant(s.bladeBulge, s.broadBulge, s.spikeBulge);

export const widthProfile = (along: Float) =>
  pow(float(1).sub(along), taper).mul(float(1).add(bulge.mul(sin(along.mul(Math.PI)))));
