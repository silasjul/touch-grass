import { float, hash, pow, sin, step, vec3 } from "three/tsl";
import type * as THREE from "three/webgpu";
import { flowerIndex } from "./placement";
import { fieldTweaks as f } from "./tweaks/fieldTweaks";
import { shapeTweaks as s } from "./tweaks/shapeTweaks";

type Float = THREE.Node<"float">;

const random = (offset: number) => hash(flowerIndex.add(offset));

export const flowerRandom = {
  facing: random(23),
  height: random(139),
  head: random(197),
  bend: random(281),
  variant: random(347),
  tint: random(433),
  phase: random(577),
  bloom: random(653),
};

const shareTotal = s.dandelionShare.add(s.daisyShare).add(s.blowballShare).max(0.0001);
const pastDandelion = step(s.dandelionShare.div(shareTotal), flowerRandom.variant);
const pastDaisy = step(s.dandelionShare.add(s.daisyShare).div(shareTotal), flowerRandom.variant);

const dandelionWeight = float(1).sub(pastDandelion);
const daisyWeight = pastDandelion.sub(pastDaisy);
const blowballWeight = pastDaisy;

export const variantMix = vec3(dandelionWeight, daisyWeight, blowballWeight);

export const byVariant = (dandelion: Float, daisy: Float, blowball: Float) =>
  dandelion.mul(dandelionWeight).add(daisy.mul(daisyWeight)).add(blowball.mul(blowballWeight));

const vary = (amount: Float, random: Float) => float(1).add(random.sub(0.5).mul(2).mul(amount));

const headScale = vary(s.headVariance, flowerRandom.head).mul(s.scale);

export const bloom = step(f.thinning, flowerRandom.bloom);

export const stemHeight = byVariant(s.dandelionHeight, s.daisyHeight, s.blowballHeight)
  .mul(s.scale)
  .mul(vary(s.heightVariance, flowerRandom.height));

export const stemBend = byVariant(s.dandelionBend, s.daisyBend, s.blowballBend).mul(
  vary(s.bendVariance, flowerRandom.bend),
);

export const headNod = byVariant(s.dandelionNod, s.daisyNod, s.blowballNod);

export const petalCount = byVariant(s.dandelionPetals, s.daisyPetals, s.blowballPetals).round();

export const petalLength = byVariant(s.dandelionLength, s.daisyLength, s.blowballLength).mul(
  headScale,
);

export const petalWidth = byVariant(s.dandelionWidth, s.daisyWidth, s.blowballWidth).mul(headScale);

export const petalCurl = byVariant(s.dandelionCurl, s.daisyCurl, s.blowballCurl);

export const petalSpread = byVariant(s.dandelionSpread, s.daisySpread, s.blowballSpread);

export const centreSize = byVariant(s.dandelionCentre, s.daisyCentre, s.blowballCentre).mul(
  headScale,
);

export const centreDome = byVariant(s.dandelionDome, s.daisyDome, s.blowballDome);

const taper = byVariant(s.dandelionTaper, s.daisyTaper, s.blowballTaper);
const bulge = byVariant(s.dandelionBulge, s.daisyBulge, s.blowballBulge);

export const petalProfile = (along: Float) =>
  pow(float(1).sub(along), taper).mul(float(1).add(bulge.mul(sin(along.mul(Math.PI)))));
