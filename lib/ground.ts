import {
  positionLocal,
  texture,
  transformNormalToView,
  vec2,
  vec3,
} from "three/tsl";
import * as THREE from "three/webgpu";

export function buildGroundNodes(tex: THREE.Texture) {
  const uv = positionLocal.xy.add(0.5);

  const h = texture(tex, uv).r;

  const positionNode = vec3(positionLocal.x, positionLocal.y, h);

  const e = 0.002;
  const hx = texture(tex, uv.add(vec2(e, 0))).r;
  const hy = texture(tex, uv.add(vec2(0, e))).r;

  const edgeX = vec3(e, 0, hx.sub(h));
  const edgeY = vec3(0, e, hy.sub(h));

  const normalNode = transformNormalToView(edgeX.cross(edgeY).normalize());

  return { positionNode, normalNode };
}
