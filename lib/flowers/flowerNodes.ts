import { directionToFaceDirection, transformNormalToView, varying } from "three/tsl";
import { buildFlower } from "./flower";
import { buildFlowerShading } from "./shading";

export function buildFlowerNodes() {
  const flower = buildFlower();

  // Through a varying, or the whole flower is rebuilt per fragment: `normalNode` is set up in the
  // fragment stage, and everything behind it samples the height field and the wind noise.
  const normal = varying(flower.normal, "flowerNormal").normalize();

  return {
    positionNode: flower.position,
    normalNode: directionToFaceDirection(transformNormalToView(normal)),
    ...buildFlowerShading(),
  };
}
