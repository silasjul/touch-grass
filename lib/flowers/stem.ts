import { cos, float, positionGeometry, sin } from "three/tsl";
import type { Stalk } from "./stalk";
import { shapeTweaks as s } from "./tweaks/shapeTweaks";

export function buildStem(stalk: Stalk) {
  const along = positionGeometry.y;
  const side = positionGeometry.x;

  const angle = stalk.bend.mul(along);
  const faceNormal = stalk.bendAxis.mul(cos(angle)).sub(stalk.up.mul(sin(angle)));

  const width = s.stemWidth
    .mul(float(1).sub(along.mul(s.stemTaper)))
    .mul(s.scale)
    .mul(stalk.alive);

  return {
    position: stalk.at(along).add(stalk.sideAxis.mul(side.mul(width))),
    normal: faceNormal.add(stalk.sideAxis.mul(side.mul(2).mul(s.stemRoundness))),
  };
}
