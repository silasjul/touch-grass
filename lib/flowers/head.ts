import { acos, cos, cross, float, mix, positionGeometry, sin, step } from "three/tsl";
import type * as THREE from "three/webgpu";
import {
  centreDome,
  centreSize,
  flowerRandom,
  petalCount,
  petalCurl,
  petalLength,
  petalProfile,
  petalSpread,
  petalWidth,
} from "./flowerShape";
import { petalSlot } from "./parts";
import type { Head } from "./stalk";

type Float = THREE.Node<"float">;

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const QUARTER_TURN = Math.PI / 2;

export function buildPetal(head: Head, alive: Float) {
  const along = positionGeometry.y;
  const side = positionGeometry.x;

  const count = petalCount.max(1);
  const live = step(petalSlot.add(0.5), count).mul(alive).toVar();

  const azimuth = petalSlot.mul(GOLDEN_ANGLE).add(flowerRandom.facing.mul(TAU));
  const ring = petalSlot.add(0.5).div(count);
  const polar = mix(float(QUARTER_TURN), acos(float(1).sub(ring.mul(2))), petalSpread);

  const outward = head.side.mul(cos(azimuth)).add(head.forward.mul(sin(azimuth)));
  const tangential = head.side.mul(sin(azimuth).negate()).add(head.forward.mul(cos(azimuth)));
  const dir = outward.mul(sin(polar)).add(head.up.mul(cos(polar))).toVar();

  const length = petalLength.mul(live).toVar();
  const reach = along.mul(length).add(centreSize.mul(0.45).mul(live));
  const curl = head.up.mul(along.mul(along).mul(petalCurl).mul(length));
  const width = petalProfile(along).mul(petalWidth).mul(live);

  const tangent = dir.add(head.up.mul(along.mul(2).mul(petalCurl)));

  return {
    position: head.centre.add(dir.mul(reach)).add(curl).add(tangential.mul(side.mul(width))),
    normal: cross(tangential, tangent),
  };
}

export function buildCentre(head: Head, alive: Float) {
  const disc = positionGeometry.xy;
  const spread = disc.length().mul(2);

  const size = centreSize.mul(alive).toVar();
  const outward = head.side.mul(disc.x).add(head.forward.mul(disc.y)).mul(2);
  const dome = head.up.mul(float(1).sub(spread.mul(spread))).mul(size.mul(centreDome));

  return {
    position: head.centre.add(outward.mul(size)).add(dome),
    normal: head.up.add(outward.mul(centreDome.mul(2))),
  };
}
