import { useFrame } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import { useParameters } from "tsl-inspector";

/**
 * Returns the `onBeforeRender` to hang on every chunk. Three only calls it for a mesh that survived
 * frustum culling, so counting the calls is the one honest count of what the GPU was asked to draw.
 */
export function useBladeCount(perChunk: number, chunks: number) {
  const drawn = useRef(0);
  const readout = useRef({ blades: "0", chunks: "0" }).current;

  useParameters("Grass/count", (group) => {
    group.add(readout, "blades").name("blades").listen();
    group.add(readout, "chunks").name("chunks").listen();
  });

  // A frame behind: this runs before the render that fills the counter it reads.
  useFrame(() => {
    readout.blades = (drawn.current * perChunk).toLocaleString();
    readout.chunks = `${drawn.current} / ${chunks}`;
    drawn.current = 0;
  });

  return useCallback(() => {
    drawn.current++;
  }, []);
}
