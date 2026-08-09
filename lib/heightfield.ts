import {
  Fn,
  mx_noise_float,
  instanceIndex,
  textureStore,
  uvec2,
  vec4,
  vec2,
  uniform,
} from "three/tsl";
import * as THREE from "three/webgpu";

let texture: null | THREE.StorageTexture = null;
let computeNode: null | THREE.ComputeNode = null;

export function getTexture() {
  return texture;
}

const uFreq1 = uniform(0);
const uAmp1 = uniform(0);
const uFreq2 = uniform(0);
const uAmp2 = uniform(0);
const uFreq3 = uniform(0);
const uAmp3 = uniform(0);

export function init() {
  if (texture) return; // dont run more than once

  const heightTex = new THREE.StorageTexture(512, 512);
  heightTex.type = THREE.FloatType;

  const fbm = Fn(
    ([p]: [THREE.Node<"vec2">]) =>
      mx_noise_float(p.mul(uFreq1))
        .mul(uAmp1) // level 1
        .add(mx_noise_float(p.mul(uFreq2)).mul(uAmp2)) // level 2
        .add(mx_noise_float(p.mul(uFreq3)).mul(uAmp3)), // level 3
  );

  computeNode = Fn(() => {
    // 1. turn the flat index into x, y
    const x = instanceIndex.mod(512);
    const y = instanceIndex.div(512);

    // 2. turn x, y into a 0-1 uv, then compute height
    const uv = vec2(x.toFloat(), y.toFloat()).div(512);
    const h = fbm(uv);

    // 3. write it
    textureStore(heightTex, uvec2(x, y), vec4(h));
  })().compute(512 * 512);

  texture = heightTex;
}

export type NoiseParams = {
  freq1: number;
  amp1: number;
  freq2: number;
  amp2: number;
  freq3: number;
  amp3: number;
};

export async function bakeHeight(
  renderer: THREE.WebGPURenderer,
  params: NoiseParams,
) {
  const { freq1, amp1, freq2, amp2, freq3, amp3 } = params;
  uFreq1.value = freq1;
  uAmp1.value = amp1;
  uFreq2.value = freq2;
  uAmp2.value = amp2;
  uFreq3.value = freq3;
  uAmp3.value = amp3;

  if (!computeNode) return

  await renderer.computeAsync(computeNode);
}
