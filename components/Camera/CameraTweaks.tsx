import { useStore, useThree } from "@react-three/fiber";
import type * as THREE from "three";
import { button, useControls } from "tsl-inspector";

const DEGREES = 180 / Math.PI;

/** What OrbitControls exposes, which r3f's own types only describe as an EventDispatcher. */
type OrbitAngles = {
  getAzimuthalAngle: () => number;
  getPolarAngle: () => number;
  getDistance: () => number;
  target: THREE.Vector3;
};

export default function CameraTweaks() {
  const camera = useThree((s) => s.camera);
  const store = useStore();

  useControls(
    "Scene/camera",
    {
      "Log position": button(() => {
        const { x, y, z } = camera.position;
        console.log(`position: [${x}, ${y}, ${z}]`);
      }),

      "Log angle": button(() => {
        const orbit = store.getState().controls as OrbitAngles | null;

        if (!orbit) return;

        const { x, y, z } = orbit.target;

        console.log(
          `azimuth: ${(orbit.getAzimuthalAngle() * DEGREES).toFixed(1)}°, ` +
            `polar: ${(orbit.getPolarAngle() * DEGREES).toFixed(1)}°, ` +
            `distance: ${orbit.getDistance().toFixed(2)}, ` +
            `target: [${x}, ${y}, ${z}]`,
        );
      }),
    },
    { collapsed: true, order: 2 },
  );

  return null;
}
