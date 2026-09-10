import { useStore, useThree, type ThreeEvent } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGroundStore } from "@/stores/groundStore";

const PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const hit = new THREE.Vector3();

/** What r3f actually puts on `event.target`, which its own types still describe as an EventTarget. */
type PointerCapture = {
  setPointerCapture: (id: number) => void;
  releasePointerCapture: (id: number) => void;
};

const capture = (e: ThreeEvent<PointerEvent>) =>
  e.target as unknown as PointerCapture;

export type GroundProbe = { held: boolean; x: number; z: number };

export function useGroundPointer() {
  const raycaster = useThree((s) => s.raycaster);
  const store = useStore();
  const probe = useRef<GroundProbe>({ held: false, x: 0, z: 0 });

  const setOrbit = (enabled: boolean) => {
    const orbit = store.getState().controls as { enabled: boolean } | null;

    if (orbit) orbit.enabled = enabled;
  };

  // The ray, not `event.point`: a captured pointer keeps replaying the intersection it was
  // captured on, so the point freezes as soon as the cursor leaves the mesh. The ray stays live.
  const aim = () => {
    if (!raycaster.ray.intersectPlane(PLANE, hit)) return;

    const half = useGroundStore.getState().size / 2;
    probe.current.x = THREE.MathUtils.clamp(hit.x, -half, half);
    probe.current.z = THREE.MathUtils.clamp(hit.z, -half, half);
  };

  const drop = () => {
    if (!probe.current.held) return;

    probe.current.held = false;
    setOrbit(true);
  };

  const handlers = {
    // Nothing at all when the probe is off, or the press would take the pointer away from orbiting.
    onPointerDown: (e: ThreeEvent<PointerEvent>) => {
      if (!useGroundStore.getState().probeEnabled) return;

      e.stopPropagation();
      capture(e).setPointerCapture(e.pointerId);
      probe.current.held = true;
      setOrbit(false);
      aim();
    },

    onPointerMove: (e: ThreeEvent<PointerEvent>) => {
      if (!probe.current.held) return;

      e.stopPropagation();
      aim();
    },

    onPointerUp: (e: ThreeEvent<PointerEvent>) => {
      if (!probe.current.held) return;

      capture(e).releasePointerCapture(e.pointerId);
      drop();
    },

    onLostPointerCapture: drop,
  };

  return { probe, handlers };
}
