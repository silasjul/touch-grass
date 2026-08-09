import { useControls, folder } from "tsl-inspector";
import { GROUND, GROUND_NOISE } from "@/configs/groundPlaneConfigs";
import { useEffect, useMemo } from "react";
import { bakeHeight, getTexture, init } from "@/lib/heightfield";
import { useThree } from "@react-three/fiber";
import * as THREE from "three/webgpu";
import { buildGroundNodes } from "@/lib/ground";

export default function GroundPlane() {
  const gl = useThree((s) => s.gl) as unknown as THREE.WebGPURenderer;

  const nodes = useMemo(() => {
    init();
    return buildGroundNodes(getTexture()!);
  }, []);

  const { size, segments, wireframe } = useControls(
    "Ground",
    {
      geometry: folder(
        {
          size: { value: GROUND.size, min: 30, max: 60, step: 0.01 },
          segments: { value: GROUND.segments, min: 1, max: 400, step: 1 },
          wireframe: GROUND.wireframe,
        },
        { order: 1, collapsed: true },
      ),
    },
    { order: 0, collapsed: true },
  );

  const { freq1, amp1, freq2, amp2, freq3, amp3 } = useControls(
    "Ground/noise",
    {
      "level 1": folder({
        freq1: {
          value: GROUND_NOISE.level1.frequency,
          min: 0,
          max: 3.5,
          label: "frequency",
        },
        amp1: {
          value: GROUND_NOISE.level1.amplitude,
          min: 0,
          max: 0.2,
          step: 0.001,
          label: "amplitude",
        },
      }),
      "level 2": folder({
        freq2: {
          value: GROUND_NOISE.level2.frequency,
          min: 3.5,
          max: 8,
          label: "frequency",
        },
        amp2: {
          value: GROUND_NOISE.level2.amplitude,
          min: 0,
          max: 0.1,
          step: 0.001,
          label: "amplitude",
        },
      }),
      "level 3": folder({
        freq3: {
          value: GROUND_NOISE.level3.frequency,
          min: 8,
          max: 15,
          label: "frequency",
        },
        amp3: {
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

  useEffect(() => {
    bakeHeight(gl, { freq1, amp1, freq2, amp2, freq3, amp3 }).then(() => {});
  }, [gl, freq1, amp1, freq2, amp2, freq3, amp3]);

  return (
    <mesh scale={size} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1, 1, segments, segments]} />
      <meshStandardNodeMaterial
        positionNode={nodes.positionNode}
        normalNode={nodes.normalNode}
        wireframe={wireframe}
        roughness={0.6}
      />
    </mesh>
  );
}
