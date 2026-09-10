import { useStore, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGroundStore } from "@/stores/groundStore";

const PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const hit = new THREE.Vector3();

export type GroundProbe = { held: boolean; x: number; z: number };

/**
 * DOM listeners rather than the mesh's own `onPointerDown`: r3f raycasts every object carrying a
 * handler on every pointer move, and the ground is 180k triangles. Nothing here raycasts a mesh —
 * the ray meets a math plane, and only while the pointer is held.
 */
export function useGroundPointer() {
  const canvas = useThree((s) => s.gl.domElement);
  const camera = useThree((s) => s.camera);
  const store = useStore();
  const probe = useRef<GroundProbe>({ held: false, x: 0, z: 0 });

  useEffect(() => {
    const setOrbit = (enabled: boolean) => {
      const orbit = store.getState().controls as { enabled: boolean } | null;

      if (orbit) orbit.enabled = enabled;
    };

    const aim = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();

      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);

      if (!raycaster.ray.intersectPlane(PLANE, hit)) return false;

      const half = useGroundStore.getState().size / 2;
      probe.current.x = THREE.MathUtils.clamp(hit.x, -half, half);
      probe.current.z = THREE.MathUtils.clamp(hit.z, -half, half);

      return true;
    };

    const drop = () => {
      if (!probe.current.held) return;

      probe.current.held = false;
      setOrbit(true);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("lostpointercapture", drop);
    };

    const onMove = (event: PointerEvent) => aim(event);

    const onUp = (event: PointerEvent) => {
      canvas.releasePointerCapture(event.pointerId);
      drop();
    };

    // Nothing at all when the probe is off, or when the ray misses the plane behind the horizon —
    // that press belongs to orbiting.
    const onDown = (event: PointerEvent) => {
      if (!useGroundStore.getState().probeEnabled) return;
      if (!aim(event)) return;

      canvas.setPointerCapture(event.pointerId);
      probe.current.held = true;
      setOrbit(false);

      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("lostpointercapture", drop);
    };

    canvas.addEventListener("pointerdown", onDown);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      drop();
    };
  }, [canvas, camera, store]);

  return probe;
}
