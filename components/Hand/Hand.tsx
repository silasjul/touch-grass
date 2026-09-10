import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { useHandModel } from "@/hooks/hand/useHandModel";
import { useHandPress } from "@/hooks/hand/useHandPress";
import { useHandTweaks } from "@/hooks/hand/useHandTweaks";
import { groundProbe } from "@/lib/ground/probe";
import { createHandSweep, restHandSweep, sweepHand } from "@/lib/hand/sweep";
import { revealProgress, revealSize } from "@/lib/hand/reveal";
import { touchAxis, touchDrift, touchHeight, touchPoint, touchStrength } from "@/lib/hand/touch";
import { sampleGroundHeight } from "@/lib/terrain/sampleGround";

const DEGREES = Math.PI / 180;

export default function Hand() {
  const aim = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const bank = useRef<THREE.Group>(null);
  const sweep = useRef(createHandSweep());

  const { model } = useHandModel();
  const { model: pose, motion } = useHandTweaks();
  const move = useHandPress(motion.fadeIn, motion.fadeOut);

  useFrame(({ camera }, delta) => {
    if (!aim.current || !tilt.current || !bank.current) return;

    const press = move.current;
    const hand = sweep.current;

    touchStrength.value = Math.max(press.press, 0);
    revealProgress.value = press.reveal;
    revealSize.value = pose.size;
    aim.current.visible = press.reveal > 0.002;

    if (!aim.current.visible) {
      restHandSweep(hand, groundProbe.x, groundProbe.z);
      return;
    }

    const dt = Math.min(delta, 0.05);
    const toCamera = Math.atan2(camera.position.z - hand.z, hand.x - camera.position.x);
    const heading = toCamera + pose.yaw * DEGREES;

    sweepHand(hand, groundProbe, heading, dt, motion);

    const { x, z, turn, lean, bank: roll } = hand;
    const height = sampleGroundHeight(x, z) + pose.lift + pose.approach * press.drop;
    const back = (pose.reach + motion.back * press.drop) * pose.size;
    const facing = heading + turn * DEGREES;

    aim.current.position.set(x, height, z);
    aim.current.rotation.y = facing;
    tilt.current.rotation.z = (pose.pitch + lean + motion.tilt * press.drop) * DEGREES;
    bank.current.rotation.x = (pose.roll + roll) * DEGREES;
    bank.current.position.set(-back, 0, pose.side * pose.size);

    touchPoint.value.set(x, z);
    touchAxis.value.set(Math.cos(facing), -Math.sin(facing));
    touchDrift.value.set(hand.driftX, hand.driftZ);
    touchHeight.value = height;
  });

  return (
    <group ref={aim} visible={false}>
      <group ref={tilt}>
        <group ref={bank} scale={[pose.size, pose.mirror ? -pose.size : pose.size, pose.size]}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}
