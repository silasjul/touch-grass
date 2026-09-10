import { texture, vec2, vec3 } from "three/tsl";
import type * as THREE from "three/webgpu";
import { HEIGHT_FIELD } from "@/configs/groundPlaneConfigs";
import { heightTexture } from "@/lib/terrain/heightField";
import { groundSize } from "@/lib/terrain/groundSize";

function heightAt(xz: THREE.Node<"vec2">) {
  const u = xz.x.div(groundSize).add(0.5);
  const v = xz.y.div(groundSize).mul(-1).add(0.5);

  return texture(heightTexture, vec2(u, v)).r.mul(groundSize);
}

export function groundAt(xz: THREE.Node<"vec2">) {
  const step = groundSize.div(HEIGHT_FIELD.resolution);

  const height = heightAt(xz).toVar();
  const alongX = heightAt(xz.add(vec2(step, 0)));
  const alongZ = heightAt(xz.add(vec2(0, step)));

  const normal = vec3(height.sub(alongX), step, height.sub(alongZ)).normalize().toVar();

  return { height, normal };
}
