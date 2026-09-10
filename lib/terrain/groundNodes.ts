import {
  positionLocal,
  texture,
  transformNormalToView,
  vec2,
  vec3,
} from "three/tsl";
import { HEIGHT_FIELD } from "@/configs/groundPlaneConfigs";
import { heightTexture } from "./heightField";

export function buildGroundNodes() {
  const uv = positionLocal.xy.add(0.5);

  const h = texture(heightTexture, uv).r;

  const positionNode = vec3(positionLocal.x, positionLocal.y, h);

  const e = 1 / HEIGHT_FIELD.resolution;
  const hx = texture(heightTexture, uv.add(vec2(e, 0))).r;
  const hy = texture(heightTexture, uv.add(vec2(0, e))).r;

  const edgeX = vec3(e, 0, hx.sub(h));
  const edgeY = vec3(0, e, hy.sub(h));

  const normalNode = transformNormalToView(edgeX.cross(edgeY).normalize());

  return { positionNode, normalNode };
}
