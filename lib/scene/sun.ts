import { Color, Vector3 } from "three";
import { uniform } from "three/tsl";
import { LIGHT_DEFAULTS } from "@/configs/sceneConfigs";

export const sun = {
  direction: uniform(
    new Vector3(LIGHT_DEFAULTS.sunX, LIGHT_DEFAULTS.sunHeight, LIGHT_DEFAULTS.sunZ).normalize(),
  ),
  color: uniform(new Color(LIGHT_DEFAULTS.sunColor)),
  intensity: uniform(LIGHT_DEFAULTS.sunIntensity),
};
