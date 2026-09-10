import { uniform } from "three/tsl";
import { GROUND } from "@/configs/groundPlaneConfigs";

export const groundShape = uniform(GROUND.shape === "circle" ? 1 : 0);
