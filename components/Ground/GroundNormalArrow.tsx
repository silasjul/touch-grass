import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useControls } from "tsl-inspector";
import { GROUND_ARROW } from "@/configs/groundPlaneConfigs";
import type { GroundProbe } from "@/hooks/ground/useGroundPointer";
import {
  sampleGroundHeight,
  sampleGroundNormal,
} from "@/lib/terrain/sampleGround";
import { useGroundStore } from "@/stores/groundStore";

const UP = new THREE.Vector3(0, 1, 0);
const normal = new THREE.Vector3();

export default function GroundNormalArrow({
  probe,
}: {
  probe: RefObject<GroundProbe>;
}) {
  const group = useRef<THREE.Group>(null);
  const setProbeEnabled = useGroundStore((s) => s.setProbeEnabled);

  const { enabled, length, radius, headLength, headRadius, color } =
    useControls(
      "Ground/arrow",
      {
        enabled: GROUND_ARROW.enabled,
        length: { value: GROUND_ARROW.length, min: 0.5, max: 15, step: 0.05 },
        radius: {
          value: GROUND_ARROW.radius,
          min: 0.01,
          max: 0.5,
          step: 0.005,
        },
        headLength: {
          value: GROUND_ARROW.headLength,
          min: 0.1,
          max: 4,
          step: 0.02,
        },
        headRadius: {
          value: GROUND_ARROW.headRadius,
          min: 0.02,
          max: 1.5,
          step: 0.01,
        },
        color: GROUND_ARROW.color,
      },
      { order: 3, collapsed: true },
    );

  useEffect(() => setProbeEnabled(enabled), [enabled, setProbeEnabled]);

  useFrame(() => {
    const arrow = group.current;
    if (!arrow) return;

    arrow.visible = enabled && probe.current.held;
    if (!arrow.visible) return;

    const { x, z } = probe.current;

    arrow.position.set(x, sampleGroundHeight(x, z), z);
    arrow.quaternion.setFromUnitVectors(UP, sampleGroundNormal(x, z, normal));
  });

  const shaft = Math.max(length - headLength, 0.01);

  // Built upside down inside a group that stands along the normal, so the tip lands on the surface.
  return (
    <group ref={group} visible={false}>
      <mesh position-y={headLength / 2} rotation-x={Math.PI}>
        <coneGeometry args={[headRadius, headLength, 20]} />
        <meshStandardNodeMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh position-y={headLength + shaft / 2}>
        <cylinderGeometry args={[radius, radius, shaft, 16]} />
        <meshStandardNodeMaterial color={color} roughness={0.35} />
      </mesh>
    </group>
  );
}
