import { float, saturation, texture, vec3 } from "three/tsl";
import * as THREE from "three/webgpu";
import { buildHandReveal } from "./reveal";
import { colorTweaks as c } from "./tweaks/colorTweaks";

export function buildHandMaterial(source: THREE.MeshStandardMaterial) {
  const material = new THREE.MeshStandardNodeMaterial();
  const reveal = buildHandReveal();

  const albedo = source.map ? texture(source.map).rgb : vec3(1);
  const lit = albedo.mul(c.tint).mul(c.brightness);
  const rough = source.roughnessMap ? texture(source.roughnessMap).g : float(1);

  material.normalMap = source.normalMap;
  material.normalScale.copy(source.normalScale);
  material.aoMap = source.aoMap;
  material.aoMapIntensity = source.aoMapIntensity;
  material.side = source.side;
  material.transparent = true;

  material.colorNode = saturation(lit.sub(0.5).mul(c.contrast).add(0.5).max(0), c.saturate);
  material.roughnessNode = rough.mul(c.roughness).clamp(0.05, 1);
  material.metalnessNode = c.metalness;
  material.opacityNode = reveal.opacityNode;
  material.emissiveNode = reveal.emissiveNode;

  return material;
}
