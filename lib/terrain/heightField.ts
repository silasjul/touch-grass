import {
  attributeArray,
  Fn,
  instanceIndex,
  textureStore,
  uvec2,
  vec2,
  vec4,
} from "three/tsl";
import * as THREE from "three/webgpu";
import { HEIGHT_FIELD } from "@/configs/groundPlaneConfigs";
import { groundHeight } from "./noise";

const { resolution } = HEIGHT_FIELD;

export const heightTexture = new THREE.StorageTexture(resolution, resolution);
heightTexture.type = THREE.FloatType;
heightTexture.minFilter = THREE.LinearFilter;
heightTexture.magFilter = THREE.LinearFilter;

const heightBuffer = attributeArray(resolution * resolution, "float");

export const heights = new Float32Array(resolution * resolution);

const bakeNode = Fn(() => {
  const x = instanceIndex.mod(resolution);
  const y = instanceIndex.div(resolution);

  // The half texel matters: a sampler reads at `uv * resolution - 0.5`, so storing at the texel
  // corner would put the whole field half a texel away from what `sampleGroundHeight` reads.
  const uv = vec2(x.toFloat(), y.toFloat()).add(0.5).div(resolution);
  const h = groundHeight(uv);

  heightBuffer.element(instanceIndex).assign(h);
  textureStore(heightTexture, uvec2(x, y), vec4(h));
})().compute(resolution * resolution);

/** Returns the relief in local units, the scale `heights` holds — times the ground size for world. */
export async function bake(renderer: THREE.WebGPURenderer) {
  await renderer.computeAsync(bakeNode);

  const attribute = heightBuffer.value as THREE.StorageBufferAttribute;
  await renderer.getArrayBufferAsync(attribute, heights.buffer);

  let peak = 0;

  for (const height of heights) peak = Math.max(peak, Math.abs(height));

  return peak;
}
