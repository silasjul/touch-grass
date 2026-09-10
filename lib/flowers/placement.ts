import { mx_noise_float, smoothstep } from "three/tsl";
import type * as THREE from "three/webgpu";
import { FLOWER_FIELD } from "@/configs/flowers/flowerField";
import { GROUND } from "@/configs/groundPlaneConfigs";
import { columnsFor, createScatter } from "@/lib/field/scatter";
import { fieldTweaks } from "./tweaks/fieldTweaks";

export const flowerScatter = createScatter({
  columns: columnsFor((FLOWER_FIELD.density * GROUND.size ** 2) / FLOWER_FIELD.chunks ** 2),
  chunks: FLOWER_FIELD.chunks,
  coverage: FLOWER_FIELD.coverage,
});

export const flowerIndex = flowerScatter.index;

export const flowerAnchor = () => flowerScatter.anchor(fieldTweaks.jitter);

export const insideField = flowerScatter.insideField;

export function clumpAt(xz: THREE.Node<"vec2">) {
  const noise = mx_noise_float(xz.mul(fieldTweaks.clumpScale)).mul(0.5).add(0.5);

  return smoothstep(fieldTweaks.clumpBare, fieldTweaks.clumpBare.add(fieldTweaks.clumpFade), noise);
}
