import { controls, folder } from "tsl-inspector";
import {
  GRASS_BLADE,
  GRASS_BROAD,
  GRASS_SHAPE,
  GRASS_SPIKE,
  GRASS_VARIANCE,
} from "@/configs/grass/grassShapes";

const SHARE = { min: 0, max: 1, step: 0.01, label: "share" };
const HEIGHT = { min: 0.05, max: 3, step: 0.01, label: "height" };
const WIDTH = { min: 0.002, max: 0.3, step: 0.001, label: "width" };
const TAPER = { min: 0.2, max: 4, step: 0.01, label: "taper" };
const BULGE = { min: 0, max: 1.5, step: 0.01, label: "bulge" };
const BEND = { min: 0.02, max: 2.5, step: 0.01, label: "bend" };
const TWIST = { min: -2, max: 2, step: 0.01, label: "twist" };

export const shapeTweaks = controls(
  "Grass/Shape",
  {
    scale: { value: GRASS_SHAPE.scale, min: 0.1, max: 3, step: 0.01 },
    roundness: { value: GRASS_SHAPE.roundness, min: 0, max: 3, step: 0.01 },
    blade: folder(
      {
        bladeShare: { value: GRASS_BLADE.share, ...SHARE },
        bladeHeight: { value: GRASS_BLADE.height, ...HEIGHT },
        bladeWidth: { value: GRASS_BLADE.width, ...WIDTH },
        bladeTaper: { value: GRASS_BLADE.taper, ...TAPER },
        bladeBulge: { value: GRASS_BLADE.bulge, ...BULGE },
        bladeBend: { value: GRASS_BLADE.bend, ...BEND },
        bladeTwist: { value: GRASS_BLADE.twist, ...TWIST },
      },
      { collapsed: true },
    ),
    broad: folder(
      {
        broadShare: { value: GRASS_BROAD.share, ...SHARE },
        broadHeight: { value: GRASS_BROAD.height, ...HEIGHT },
        broadWidth: { value: GRASS_BROAD.width, ...WIDTH },
        broadTaper: { value: GRASS_BROAD.taper, ...TAPER },
        broadBulge: { value: GRASS_BROAD.bulge, ...BULGE },
        broadBend: { value: GRASS_BROAD.bend, ...BEND },
        broadTwist: { value: GRASS_BROAD.twist, ...TWIST },
      },
      { collapsed: true },
    ),
    spike: folder(
      {
        spikeShare: { value: GRASS_SPIKE.share, ...SHARE },
        spikeHeight: { value: GRASS_SPIKE.height, ...HEIGHT },
        spikeWidth: { value: GRASS_SPIKE.width, ...WIDTH },
        spikeTaper: { value: GRASS_SPIKE.taper, ...TAPER },
        spikeBulge: { value: GRASS_SPIKE.bulge, ...BULGE },
        spikeBend: { value: GRASS_SPIKE.bend, ...BEND },
        spikeTwist: { value: GRASS_SPIKE.twist, ...TWIST },
      },
      { collapsed: true },
    ),
    variance: folder(
      {
        heightVariance: { value: GRASS_VARIANCE.height, min: 0, max: 1, step: 0.01, label: "height" },
        widthVariance: { value: GRASS_VARIANCE.width, min: 0, max: 1, step: 0.01, label: "width" },
        bendVariance: { value: GRASS_VARIANCE.bend, min: 0, max: 1, step: 0.01, label: "bend" },
      },
      { collapsed: true },
    ),
  },
  { order: 2, collapsed: true },
);
