import { sin, time } from "three/tsl";
import type * as THREE from "three/webgpu";
import { windTweaks as w } from "./tweaks/windTweaks";

type Float = THREE.Node<"float">;

export const swayFrom = (gust: Float) => gust.mul(w.sway);

export const windAlignment = (gust: Float) => gust.mul(w.align).saturate();

export const bobbleAt = (phase: Float) =>
  sin(time.mul(w.bobbleSpeed).add(phase.mul(Math.PI * 2))).mul(w.bobble);
