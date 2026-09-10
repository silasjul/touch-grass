import { MathUtils } from "three";

const DRIFT_SPEED = 8;
const ANGLE_LIMIT = 45;

export type HandSweep = ReturnType<typeof createHandSweep>;

export type SweepGains = {
  follow: number;
  settle: number;
  turn: number;
  bank: number;
  lean: number;
};

export function createHandSweep() {
  return { x: 0, z: 0, driftX: 0, driftZ: 0, turn: 0, bank: 0, lean: 0 };
}

export function restHandSweep(sweep: HandSweep, x: number, z: number) {
  sweep.x = x;
  sweep.z = z;
  sweep.driftX = 0;
  sweep.driftZ = 0;
  sweep.turn = 0;
  sweep.bank = 0;
  sweep.lean = 0;
}

/** Chases the pointer with a lag, then reads the angles of the hand back out of that lag. */
export function sweepHand(
  sweep: HandSweep,
  target: { x: number; z: number },
  heading: number,
  dt: number,
  gains: SweepGains,
) {
  const x = MathUtils.damp(sweep.x, target.x, gains.follow, dt);
  const z = MathUtils.damp(sweep.z, target.z, gains.follow, dt);
  const vx = (x - sweep.x) / dt;
  const vz = (z - sweep.z) / dt;

  sweep.x = x;
  sweep.z = z;

  const speed = Math.hypot(vx, vz);
  const drift = speed > 0 ? Math.min(speed / DRIFT_SPEED, 1) / speed : 0;
  const forward = vx * Math.cos(heading) - vz * Math.sin(heading);
  const sideways = vx * Math.sin(heading) + vz * Math.cos(heading);

  const settle = (from: number, to: number) =>
    MathUtils.damp(from, MathUtils.clamp(to, -ANGLE_LIMIT, ANGLE_LIMIT), gains.settle, dt);

  sweep.driftX = MathUtils.damp(sweep.driftX, vx * drift, gains.settle, dt);
  sweep.driftZ = MathUtils.damp(sweep.driftZ, vz * drift, gains.settle, dt);
  sweep.turn = settle(sweep.turn, -sideways * gains.turn);
  sweep.bank = settle(sweep.bank, -sideways * gains.bank);
  sweep.lean = settle(sweep.lean, forward * gains.lean);
}
