import {
  float,
  hash,
  instanceIndex,
  mix,
  mx_noise_float,
  smoothstep,
  texture,
  uint,
  uniform,
  vec2,
  vec3,
} from "three/tsl";
import type * as THREE from "three/webgpu";
import { GRASS_FIELD } from "@/configs/grass/grassField";
import { GROUND, HEIGHT_FIELD } from "@/configs/groundPlaneConfigs";
import { groundShape } from "@/lib/terrain/groundShape";
import { groundSize } from "@/lib/terrain/groundSize";
import { heightTexture } from "@/lib/terrain/heightField";
import { fieldTweaks } from "./tweaks/fieldTweaks";

export const columnsFor = (blades: number) => Math.ceil(Math.sqrt(blades));

export const gridColumns = uniform(columnsFor(GRASS_FIELD.density * GROUND.size ** 2));

const fieldArea = groundSize.mul(fieldTweaks.coverage);

export function bladeAnchor() {
  const columns = uint(gridColumns);
  const cell = fieldArea.div(gridColumns);
  const column = instanceIndex.mod(columns).toFloat();
  const row = instanceIndex.div(columns).toFloat();

  const offset = vec2(hash(instanceIndex), hash(instanceIndex.add(7)))
    .sub(0.5)
    .mul(fieldTweaks.jitter);

  return vec2(column, row).add(offset).add(0.5).mul(cell).sub(fieldArea.mul(0.5)).toVar();
}

function heightAt(xz: THREE.Node<"vec2">) {
  const u = xz.x.div(groundSize).add(0.5);
  const v = xz.y.div(groundSize).mul(-1).add(0.5);

  return texture(heightTexture, vec2(u, v)).r.mul(groundSize);
}

export function groundAt(xz: THREE.Node<"vec2">) {
  const step = groundSize.div(HEIGHT_FIELD.resolution);

  const height = heightAt(xz).toVar();
  const alongX = heightAt(xz.add(vec2(step, 0)));
  const alongZ = heightAt(xz.add(vec2(0, step)));

  const normal = vec3(height.sub(alongX), step, height.sub(alongZ)).normalize().toVar();

  return { height, normal };
}

export function patchAt(xz: THREE.Node<"vec2">) {
  const noise = mx_noise_float(xz.mul(fieldTweaks.patchScale)).mul(0.5).add(0.5);
  const density = smoothstep(
    fieldTweaks.patchBare,
    fieldTweaks.patchBare.add(fieldTweaks.patchFade),
    noise,
  );

  return mix(float(1), density, fieldTweaks.patchStrength);
}

export function insideField(xz: THREE.Node<"vec2">) {
  const radius = fieldArea.mul(0.5);
  const round = smoothstep(radius.mul(0.98), radius, xz.length()).oneMinus();

  return mix(float(1), round, groundShape);
}
