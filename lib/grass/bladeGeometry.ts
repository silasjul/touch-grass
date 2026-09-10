import * as THREE from "three";

export function buildBladeGeometry(segments: number, instances: number, radius: number) {
  const strip = new THREE.PlaneGeometry(1, 1, 1, segments);
  strip.translate(0, 0.5, 0);

  const geometry = new THREE.InstancedBufferGeometry();

  geometry.setIndex(strip.getIndex());
  for (const [name, attribute] of Object.entries(strip.attributes)) {
    geometry.setAttribute(name, attribute);
  }
  geometry.instanceCount = instances;

  // Explicit, or frustum culling measures the one strip the attributes hold and drops every chunk.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);

  return geometry;
}
