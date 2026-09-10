import { float, mix, mx_noise_float, smoothstep } from "three/tsl";
import type * as THREE from "three/webgpu";
import { GRASS_FIELD } from "@/configs/grass/grassField";
import { GROUND } from "@/configs/groundPlaneConfigs";
import { columnsFor, createScatter } from "@/lib/field/scatter";
import { fieldTweaks } from "./tweaks/fieldTweaks";

export const grassScatter = createScatter({
  columns: columnsFor((GRASS_FIELD.density * GROUND.size ** 2) / GRASS_FIELD.chunks ** 2),
  chunks: GRASS_FIELD.chunks,
  coverage: GRASS_FIELD.coverage,
});

export const bladeIndex = grassScatter.index;

export const bladeAnchor = () => grassScatter.anchor(fieldTweaks.jitter);

export const insideField = grassScatter.insideField;

export function patchAt(xz: THREE.Node<"vec2">) {
  const noise = mx_noise_float(xz.mul(fieldTweaks.patchScale)).mul(0.5).add(0.5);
  const density = smoothstep(
    fieldTweaks.patchBare,
    fieldTweaks.patchBare.add(fieldTweaks.patchFade),
    noise,
  );

  return mix(float(1), density, fieldTweaks.patchStrength);
}
