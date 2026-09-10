import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

const FILES = [
  "/ground_textures/leafy_grass_diff_1k.jpg",
  "/ground_textures/leafy_grass_nor_gl_1k.jpg",
  "/ground_textures/leafy_grass_arm_1k.jpg",
];

export type GroundTextures = {
  color: THREE.Texture;
  normal: THREE.Texture;
  arm: THREE.Texture;
};

// Takes the array, not the keyed object: drei types `onLoad` as handing over whatever shape it was
// asked for, then passes the raw loader result either way, so a record arrives undefined.
function configure(loaded: THREE.Texture[]) {
  const [color] = loaded;

  for (const map of loaded) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 8;
  }

  color.colorSpace = THREE.SRGBColorSpace;
}

export function useGroundTextures(): GroundTextures {
  const [color, normal, arm] = useTexture(FILES, configure);

  return useMemo(() => ({ color, normal, arm }), [color, normal, arm]);
}
