import { positionGeometry, texture, varying, vec2, vec3 } from "three/tsl";
import { HEIGHT_FIELD } from "@/configs/groundPlaneConfigs";
import type { GroundTextures } from "@/hooks/terrain/useGroundTextures";
import { buildGroundSurface } from "./groundSurface";
import { heightTexture } from "./heightField";

export function buildGroundNodes(textures: GroundTextures) {
  const uv = positionGeometry.xy.add(0.5);

  const h = texture(heightTexture, uv).r;

  const positionNode = vec3(positionGeometry.x, positionGeometry.y, h);

  const e = 1 / HEIGHT_FIELD.resolution;
  const hx = texture(heightTexture, uv.add(vec2(e, 0))).r;
  const hy = texture(heightTexture, uv.add(vec2(0, e))).r;

  const edgeX = vec3(e, 0, hx.sub(h));
  const edgeY = vec3(0, e, hy.sub(h));

  // Varyings, or the height field is sampled per fragment: the surface hangs off `normalNode`,
  // which a node material sets up in the fragment stage.
  const frame = {
    tangent: varying(edgeX.normalize(), "groundTangent"),
    bitangent: varying(edgeY.normalize(), "groundBitangent"),
    normal: varying(edgeX.cross(edgeY).normalize(), "groundNormal"),
  };

  return { positionNode, ...buildGroundSurface(textures, uv, frame) };
}
