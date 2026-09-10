import { Color } from "three";
import { uniform } from "three/tsl";
import { LIGHT_DEFAULTS } from "@/configs/sceneConfigs";
import { fromAngles } from "./spherical";

export function sunPosition(azimuth: number, elevation: number) {
  return fromAngles(azimuth, elevation, LIGHT_DEFAULTS.sunDistance);
}

export const sun = {
  direction: uniform(
    sunPosition(LIGHT_DEFAULTS.sunAzimuth, LIGHT_DEFAULTS.sunElevation).normalize(),
  ),
  color: uniform(new Color(LIGHT_DEFAULTS.sunColor)),
  intensity: uniform(LIGHT_DEFAULTS.sunIntensity),
};
