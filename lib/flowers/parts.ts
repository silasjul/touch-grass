import { attribute, float, step } from "three/tsl";

export const FLOWER_PART = { stem: 0, petal: 1, centre: 2 };

const part = attribute<"float">("part", "float");

export const petalSlot = attribute<"float">("petal", "float");

export const isPetal = step(float(0.5), part).mul(step(float(1.5), part).oneMinus());
export const isCentre = step(float(1.5), part);
export const isStem = float(1).sub(isPetal).sub(isCentre);
