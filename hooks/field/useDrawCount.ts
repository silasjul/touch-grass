import { useFrame } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import { useParameters } from "tsl-inspector";

/**
 * Returns the `onBeforeRender` to hang on every chunk. Three only calls it for a mesh that survived
 * frustum culling, so counting the calls is the one honest count of what the GPU was asked to draw.
 */
export function useDrawCount(folder: string, label: string, perChunk: number, chunks: number) {
  const drawn = useRef(0);
  const readout = useRef({ instances: "0", chunks: "0" }).current;

  useParameters(folder, (group) => {
    group.add(readout, "instances").name(label).listen();
    group.add(readout, "chunks").name("chunks").listen();
  });

  // A frame behind: this runs before the render that fills the counter it reads.
  useFrame(() => {
    readout.instances = (drawn.current * perChunk).toLocaleString();
    readout.chunks = `${drawn.current} / ${chunks}`;
    drawn.current = 0;
  });

  return useCallback(() => {
    drawn.current++;
  }, []);
}
