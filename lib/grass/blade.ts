import {
  abs,
  cameraPosition,
  cos,
  cross,
  dot,
  float,
  max,
  mix,
  normalize,
  positionGeometry,
  sin,
  vec2,
  vec3,
} from "three/tsl";
import {
  bladeBend,
  bladeHeight,
  bladeRandom,
  bladeTwist,
  bladeWidth,
  widthProfile,
} from "./bladeShape";
import { bladeAnchor, groundAt, insideField, patchAt } from "./placement";
import { fieldTweaks } from "./tweaks/fieldTweaks";
import { shapeTweaks } from "./tweaks/shapeTweaks";
import { flutterAt, gustAt, windAlignment, windDirection } from "./wind";

const TAU = Math.PI * 2;

export function buildBlade() {
  const along = positionGeometry.y;
  const side = positionGeometry.x;

  const anchor = bladeAnchor();
  const ground = groundAt(anchor);

  // World space, straight into a local-space node: the field mesh is never transformed, and moving
  // it would leave the blades behind on the ground they were scattered over anyway.
  const root = vec3(anchor.x, ground.height, anchor.y).toVar();

  const gust = gustAt(anchor);
  const spin = bladeRandom.facing.mul(TAU);
  const facing = normalize(
    mix(vec2(cos(spin), sin(spin)), windDirection, windAlignment(gust)),
  ).toVar();

  const up = normalize(mix(vec3(0, 1, 0), ground.normal, fieldTweaks.lean)).toVar();
  const sideAxis = normalize(cross(up, vec3(facing.x, 0, facing.y))).toVar();
  const bendAxis = cross(sideAxis, up).toVar();

  const inside = insideField(anchor).toVar();
  const height = bladeHeight.mul(patchAt(anchor)).mul(inside).toVar();
  const bend = bladeBend.add(gust).max(0.02).toVar();
  const angle = bend.mul(along).toVar();
  const radius = height.div(bend);

  const arc = up.mul(sin(angle)).add(bendAxis.mul(cos(angle).oneMinus())).mul(radius);
  const faceNormal = bendAxis.mul(cos(angle)).sub(up.mul(sin(angle))).toVar();

  const twist = bladeTwist.mul(along);
  const widthAxis = sideAxis.mul(cos(twist)).add(faceNormal.mul(sin(twist))).toVar();
  const twistedNormal = faceNormal.mul(cos(twist)).sub(sideAxis.mul(sin(twist)));

  const edgeOn = abs(dot(bendAxis, normalize(cameraPosition.sub(root))));
  const widen = mix(float(1), float(1).div(max(edgeOn, 0.2)), fieldTweaks.viewWiden).min(4);

  const width = widthProfile(along).mul(bladeWidth).mul(widen).mul(inside);
  const flutter = flutterAt(bladeRandom.phase).mul(along).mul(along).mul(height);

  const position = root.add(arc).add(widthAxis.mul(side.mul(width).add(flutter)));
  const normal = normalize(
    twistedNormal.add(widthAxis.mul(side.mul(2).mul(shapeTweaks.roundness))),
  );

  return { position, normal };
}
