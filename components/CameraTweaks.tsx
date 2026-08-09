import { useThree } from "@react-three/fiber";
import { button, useControls } from "tsl-inspector";

export default function CameraTweaks() {
  const camera = useThree((s) => s.camera);

  useControls(
    "Scene/camera",
    {
      "Log position": button(() => {
        const { x, y, z } = camera.position;
        console.log(`position: [${x}, ${y}, ${z}]`);
      }),
    },
    { collapsed: true, order: 2 },
  );

  return null;
}
