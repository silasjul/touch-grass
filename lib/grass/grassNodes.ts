import { directionToFaceDirection, transformNormalToView, varying } from "three/tsl";
import { buildBlade } from "./blade";
import { buildGrassShading } from "./shading";

export function buildGrassNodes() {
  const blade = buildBlade();

  // Through a varying, or the whole blade is rebuilt per fragment: `normalNode` is set up in the
  // fragment stage, and everything behind it samples the height field and the wind noise.
  const normal = varying(blade.normal, "bladeNormal").normalize();

  return {
    positionNode: blade.position,
    normalNode: directionToFaceDirection(transformNormalToView(normal)),
    ...buildGrassShading(),
  };
}
