import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three/webgpu";
import { buildHandMaterial } from "@/lib/hand/material";

const SOURCE = "/hand.glb";

export function useHandModel() {
  const { scene } = useGLTF(SOURCE);

  const hand = useMemo(() => {
    const model = scene.clone();
    const bounds = new THREE.Box3().setFromObject(model);
    const span = bounds.getSize(new THREE.Vector3());
    const centre = bounds.getCenter(new THREE.Vector3());
    const unit = 1 / Math.max(span.x, span.y, span.z);
    const materials: THREE.Material[] = [];

    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const material = buildHandMaterial(mesh.material as THREE.MeshStandardMaterial);

      mesh.material = material;
      materials.push(material);
    });

    model.scale.setScalar(unit);
    model.position.copy(centre).multiplyScalar(-unit);

    return { model, materials };
  }, [scene]);

  useEffect(() => () => hand.materials.forEach((material) => material.dispose()), [hand]);

  return hand;
}
