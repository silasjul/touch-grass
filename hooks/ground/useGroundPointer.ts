import { useStore, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { aimProbe } from "@/lib/ground/probe";
import { useGroundStore } from "@/stores/groundStore";

const PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const hit = new THREE.Vector3();

/**
 * DOM listeners rather than the mesh's own `onPointerDown`: r3f raycasts every object carrying a
 * handler on every pointer move, and the ground is 180k triangles. Nothing here raycasts a mesh —
 * the ray meets a math plane, and only while the pointer is held.
 */
export function useGroundPointer() {
  const canvas = useThree((s) => s.gl.domElement);
  const camera = useThree((s) => s.camera);
  const store = useStore();

  useEffect(() => {
    const { setTouching } = useGroundStore.getState();

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

      const { size, shape } = useGroundStore.getState();

      return aimProbe(hit.x, hit.z, size, shape);
    };

    const drop = () => {
      if (!useGroundStore.getState().touching) return;

      setTouching(false);
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

    // Nothing at all unless the press lands on the ground. Off it, the press belongs to the camera,
    // and this listener runs first only because it is attached before the orbit controls are.
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary) return;
      if (!aim(event)) return;

      canvas.setPointerCapture(event.pointerId);
      setTouching(true);
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
}
