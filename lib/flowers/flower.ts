import { modelPosition, normalize } from "three/tsl";
import { buildCentre, buildPetal } from "./head";
import { isCentre, isPetal, isStem } from "./parts";
import { buildStalk } from "./stalk";
import { buildStem } from "./stem";

export function buildFlower() {
  const stalk = buildStalk();
  const stem = buildStem(stalk);
  const petal = buildPetal(stalk.head, stalk.alive);
  const centre = buildCentre(stalk.head, stalk.alive);

  const position = stem.position
    .mul(isStem)
    .add(petal.position.mul(isPetal))
    .add(centre.position.mul(isCentre));

  const normal = stem.normal
    .mul(isStem)
    .add(petal.normal.mul(isPetal))
    .add(centre.normal.mul(isCentre));

  // Local to the chunk mesh: the flower is built in world space, but three culls each chunk by
  // its own transform, so the position has to come back through it.
  return { position: position.sub(modelPosition), normal: normalize(normal) };
}
