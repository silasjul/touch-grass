import { cos, cross, float, mix, normalize, sin, vec2, vec3 } from "three/tsl";
import type * as THREE from "three/webgpu";
import { groundAt } from "@/lib/field/ground";
import { gustAt, windDirection } from "@/lib/wind/gust";
import { bloom, flowerRandom, headNod, stemBend, stemHeight } from "./flowerShape";
import { clumpAt, flowerAnchor, insideField } from "./placement";
import { fieldTweaks } from "./tweaks/fieldTweaks";
import { bobbleAt, swayFrom, windAlignment } from "./wind";

type Float = THREE.Node<"float">;

const TAU = Math.PI * 2;

export type Stalk = ReturnType<typeof buildStalk>;
export type Head = Stalk["head"];

export function buildStalk() {
  const anchor = flowerAnchor();
  const ground = groundAt(anchor);

  // World space, straight into a local-space node: the field mesh is never transformed, and moving
  // it would leave the flowers behind on the ground they were scattered over anyway.
  const root = vec3(anchor.x, ground.height, anchor.y).toVar();

  const gust = gustAt(anchor);
  const spin = flowerRandom.facing.mul(TAU);
  const facing = normalize(
    mix(vec2(cos(spin), sin(spin)), windDirection, windAlignment(gust)),
  ).toVar();

  const up = normalize(mix(vec3(0, 1, 0), ground.normal, fieldTweaks.lean)).toVar();
  const sideAxis = normalize(cross(up, vec3(facing.x, 0, facing.y))).toVar();
  const bendAxis = cross(sideAxis, up).toVar();

  const alive = insideField(anchor).mul(clumpAt(anchor)).mul(bloom).toVar();
  const height = stemHeight.mul(alive).toVar();
  const bend = stemBend.add(swayFrom(gust)).max(0.02).toVar();
  const radius = height.div(bend);
  const bobble = bobbleAt(flowerRandom.phase).mul(height).toVar();

  const at = (along: Float) => {
    const angle = bend.mul(along);
    const arc = up.mul(sin(angle)).add(bendAxis.mul(cos(angle).oneMinus())).mul(radius);

    return root.add(arc).add(sideAxis.mul(bobble.mul(along).mul(along)));
  };

  const nodded = bend.add(headNod);
  const headUp = normalize(up.mul(cos(nodded)).add(bendAxis.mul(sin(nodded)))).toVar();

  return {
    up,
    sideAxis,
    bendAxis,
    bend,
    alive,
    at,
    head: {
      centre: at(float(1)).toVar(),
      up: headUp,
      side: sideAxis,
      forward: cross(headUp, sideAxis).toVar(),
    },
  };
}
