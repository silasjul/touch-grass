import {
  float,
  mix,
  mx_noise_float,
  saturation,
  texture,
  transformNormalToView,
  vec3,
} from "three/tsl";
import type * as THREE from "three/webgpu";
import { controls, folder } from "tsl-inspector";
import { GROUND_SURFACE } from "@/configs/groundPlaneConfigs";
import type { GroundTextures } from "@/hooks/terrain/useGroundTextures";

type Vec3 = THREE.Node<"vec3">;

export type SurfaceFrame = { tangent: Vec3; bitangent: Vec3; normal: Vec3 };

const surface = controls(
  "Ground/surface",
  {
    scale: { value: GROUND_SURFACE.scale, min: 1, max: 10, step: 0.05 },
    brightness: { value: GROUND_SURFACE.brightness, min: 0, max: 3, step: 0.01 },
    contrast: { value: GROUND_SURFACE.contrast, min: 0, max: 3, step: 0.01 },
    saturate: { value: GROUND_SURFACE.saturation, min: 0, max: 3, step: 0.01, label: "saturation" },
    tint: GROUND_SURFACE.tint,
    detail: folder(
      {
        normalStrength: {
          value: GROUND_SURFACE.normalStrength,
          min: 0,
          max: 4,
          step: 0.01,
          label: "normal",
        },
        roughness: { value: GROUND_SURFACE.roughness, min: 0, max: 2, step: 0.01 },
        ao: { value: GROUND_SURFACE.ao, min: 0, max: 1, step: 0.01 },
      },
      { collapsed: true },
    ),
    variation: folder(
      {
        variation: { value: GROUND_SURFACE.variation, min: 0, max: 1, step: 0.01, label: "amount" },
        variationScale: {
          value: GROUND_SURFACE.variationScale,
          min: 0.5,
          max: 40,
          step: 0.1,
          label: "scale",
        },
      },
      { collapsed: true },
    ),
  },
  { order: 2, collapsed: true },
);

export function buildGroundSurface(
  textures: GroundTextures,
  uv: THREE.Node<"vec2">,
  frame: SurfaceFrame,
) {
  const tiled = uv.mul(surface.scale);

  const albedo = texture(textures.color, tiled);
  const arm = texture(textures.arm, tiled);
  const packed = texture(textures.normal, tiled).xyz.mul(2).sub(1);

  const detail = vec3(packed.xy.mul(surface.normalStrength), packed.z).normalize();
  const normal = frame.tangent
    .mul(detail.x)
    .add(frame.bitangent.mul(detail.y))
    .add(frame.normal.mul(detail.z))
    .normalize();

  const blotch = mx_noise_float(uv.mul(surface.variationScale)).mul(0.5).add(0.5);
  const shade = mix(float(1), blotch, surface.variation);

  const lit = albedo.rgb.mul(surface.tint).mul(surface.brightness).mul(shade);
  const graded = saturation(lit.sub(0.5).mul(surface.contrast).add(0.5).max(0), surface.saturate);

  return {
    normalNode: transformNormalToView(normal),
    colorNode: graded,
    roughnessNode: arm.g.mul(surface.roughness).clamp(0.05, 1),
    aoNode: mix(float(1), arm.r, surface.ao),
  };
}
