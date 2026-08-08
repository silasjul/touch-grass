import { GROUND_VERTEX } from "@/configs/groundPlaneConfigs";
import {
  Fn,
  mx_noise_float,
  positionLocal,
  transformNormalToView,
  vec2,
  vec3,
} from "three/tsl";
import type { Node } from "three/webgpu";
import { controls } from "tsl-inspector";

const { frequency, amplitude } = controls("Ground/noise", {
  frequency: { value: GROUND_VERTEX.frequency, min: 0, max: 30 },
  amplitude: { value: GROUND_VERTEX.amplitude, min: 0, max: 1 },
});

export const getHeight = Fn(([p]: [Node<"vec2">]) =>
  mx_noise_float(p.mul(frequency)).mul(amplitude),
);

const h = getHeight(positionLocal.xy);

export const positionNode = vec3(positionLocal.x, positionLocal.y, h);

// Normals
const e = 0.001;

const hx = getHeight(positionLocal.xy.add(vec2(e, 0)));
const hy = getHeight(positionLocal.xy.add(vec2(0, e)));

const edgeX = vec3(e, 0, hx.sub(h));
const edgeY = vec3(0, e, hy.sub(h));

export const normalNode = transformNormalToView(edgeX.cross(edgeY).normalize());
