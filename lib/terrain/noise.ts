import { Fn, mx_noise_float } from "three/tsl";
import { controls, folder } from "tsl-inspector";
import { GROUND_NOISE } from "@/configs/groundPlaneConfigs";
import type * as THREE from "three/webgpu";

let dirty = true;

const bump = () => {
  dirty = true;
};

export function takeDirty() {
  const was = dirty;
  dirty = false;

  return was;
}

// `transient: false` on every row: a row with an `onChange` counts as transient, and a transient
// row is skipped when the uniforms are built, so without it these come back undefined.
const { freq1, amp1, freq2, amp2, freq3, amp3 } = controls(
  "Ground/noise",
  {
    "level 1": folder({
      freq1: {
        value: GROUND_NOISE.level1.frequency,
        min: 0,
        max: 3.5,
        label: "frequency",
        onChange: bump,
        transient: false,
      },
      amp1: {
        value: GROUND_NOISE.level1.amplitude,
        min: 0,
        max: 0.2,
        step: 0.001,
        label: "amplitude",
        onChange: bump,
        transient: false,
      },
    }),
    "level 2": folder({
      freq2: {
        value: GROUND_NOISE.level2.frequency,
        min: 3.5,
        max: 8,
        label: "frequency",
        onChange: bump,
        transient: false,
      },
      amp2: {
        value: GROUND_NOISE.level2.amplitude,
        min: 0,
        max: 0.1,
        step: 0.001,
        label: "amplitude",
        onChange: bump,
        transient: false,
      },
    }),
    "level 3": folder({
      freq3: {
        value: GROUND_NOISE.level3.frequency,
        min: 8,
        max: 15,
        label: "frequency",
        onChange: bump,
        transient: false,
      },
      amp3: {
        value: GROUND_NOISE.level3.amplitude,
        min: 0,
        max: 0.01,
        step: 0.0001,
        label: "amplitude",
        onChange: bump,
        transient: false,
      },
    }),
  },
  { collapsed: true, order: 2 },
);

export const groundHeight = Fn(([p]: [THREE.Node<"vec2">]) =>
  mx_noise_float(p.mul(freq1))
    .mul(amp1)
    .add(mx_noise_float(p.mul(freq2)).mul(amp2))
    .add(mx_noise_float(p.mul(freq3)).mul(amp3)),
);
