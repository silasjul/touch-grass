import { GROUND_NOISE } from "@/configs/groundPlaneConfigs";
import {
  Fn,
  mx_noise_float,
  positionLocal,
  transformNormalToView,
  vec2,
  vec3,
} from "three/tsl";
import type { Node } from "three/webgpu";
import { controls, folder } from "tsl-inspector";

const {
  frequency1,
  amplitude1,
  frequency2,
  amplitude2,
  frequency3,
  amplitude3,
} = controls(
  "Ground/noise",
  {
    "level 1": folder({
      frequency1: {
        value: GROUND_NOISE.level1.frequency,
        min: 0,
        max: 3.5,
        label: "frequency",
      },
      amplitude1: {
        value: GROUND_NOISE.level1.amplitude,
        min: 0,
        max: 0.2,
        step: 0.001,
        label: "amplitude",
      },
    }),
    "level 2": folder({
      frequency2: {
        value: GROUND_NOISE.level2.frequency,
        min: 3.5,
        max: 8,
        label: "frequency",
      },
      amplitude2: {
        value: GROUND_NOISE.level2.amplitude,
        min: 0,
        max: 0.1,
        step: 0.001,
        label: "amplitude",
      },
    }),
    "level 3": folder({
      frequency3: {
        value: GROUND_NOISE.level3.frequency,
        min: 8,
        max: 15,
        label: "frequency",
      },
      amplitude3: {
        value: GROUND_NOISE.level3.amplitude,
        min: 0,
        max: 0.01,
        step: 0.0001,
        label: "amplitude",
      },
    }),
  },
  { collapsed: true, order: 2 },
);

export const getHeight = Fn(
  ([p]: [Node<"vec2">]) =>
    mx_noise_float(p.mul(frequency1))
      .mul(amplitude1) // level 1
      .add(mx_noise_float(p.mul(frequency2)).mul(amplitude2)) // level 2
      .add(mx_noise_float(p.mul(frequency3)).mul(amplitude3)), // level 3
);

// Vertex
const h = getHeight(positionLocal.xy);

export const positionNode = vec3(positionLocal.x, positionLocal.y, h);

// Normals
const e = 0.001;

const hx = getHeight(positionLocal.xy.add(vec2(e, 0)));
const hy = getHeight(positionLocal.xy.add(vec2(0, e)));

const edgeX = vec3(e, 0, hx.sub(h));
const edgeY = vec3(0, e, hy.sub(h));

export const normalNode = transformNormalToView(edgeX.cross(edgeY).normalize());
