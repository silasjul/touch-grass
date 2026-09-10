import { controls, folder } from "tsl-inspector";
import {
  BLOWBALL,
  DAISY,
  DANDELION,
  FLOWER_SHAPE,
  FLOWER_VARIANCE,
} from "@/configs/flowers/flowerShapes";

const SHARE = { min: 0, max: 1, step: 0.01, label: "share" };
const HEIGHT = { min: 0.05, max: 3, step: 0.01, label: "height" };
const BEND = { min: 0, max: 1.5, step: 0.01, label: "bend" };
const NOD = { min: 0, max: 1.5, step: 0.01, label: "nod" };
const PETALS = { min: 3, max: 48, step: 1, label: "petals" };
const LENGTH = { min: 0.01, max: 0.5, step: 0.001, label: "petalLength" };
const WIDTH = { min: 0.002, max: 0.12, step: 0.001, label: "petalWidth" };
const TAPER = { min: 0.2, max: 4, step: 0.01, label: "petalTaper" };
const BULGE = { min: 0, max: 1.5, step: 0.01, label: "petalBulge" };
const CURL = { min: -1.5, max: 1.5, step: 0.01, label: "petalCurl" };
const SPREAD = { min: 0, max: 1, step: 0.01, label: "spread" };
const CENTRE = { min: 0, max: 0.2, step: 0.001, label: "centreSize" };
const DOME = { min: 0, max: 2, step: 0.01, label: "centreDome" };

export const shapeTweaks = controls(
  "Flowers/Shape",
  {
    scale: { value: FLOWER_SHAPE.scale, min: 0.1, max: 3, step: 0.01 },
    stem: folder(
      {
        stemWidth: { value: FLOWER_SHAPE.stemWidth, min: 0.002, max: 0.08, step: 0.001, label: "width" },
        stemTaper: { value: FLOWER_SHAPE.stemTaper, min: 0, max: 1, step: 0.01, label: "taper" },
        stemRoundness: {
          value: FLOWER_SHAPE.stemRoundness,
          min: 0,
          max: 3,
          step: 0.01,
          label: "roundness",
        },
      },
      { collapsed: true },
    ),
    dandelion: folder(
      {
        dandelionShare: { value: DANDELION.share, ...SHARE },
        dandelionHeight: { value: DANDELION.height, ...HEIGHT },
        dandelionBend: { value: DANDELION.bend, ...BEND },
        dandelionNod: { value: DANDELION.nod, ...NOD },
        dandelionPetals: { value: DANDELION.petals, ...PETALS },
        dandelionLength: { value: DANDELION.petalLength, ...LENGTH },
        dandelionWidth: { value: DANDELION.petalWidth, ...WIDTH },
        dandelionTaper: { value: DANDELION.petalTaper, ...TAPER },
        dandelionBulge: { value: DANDELION.petalBulge, ...BULGE },
        dandelionCurl: { value: DANDELION.petalCurl, ...CURL },
        dandelionSpread: { value: DANDELION.spread, ...SPREAD },
        dandelionCentre: { value: DANDELION.centreSize, ...CENTRE },
        dandelionDome: { value: DANDELION.centreDome, ...DOME },
      },
      { collapsed: true },
    ),
    daisy: folder(
      {
        daisyShare: { value: DAISY.share, ...SHARE },
        daisyHeight: { value: DAISY.height, ...HEIGHT },
        daisyBend: { value: DAISY.bend, ...BEND },
        daisyNod: { value: DAISY.nod, ...NOD },
        daisyPetals: { value: DAISY.petals, ...PETALS },
        daisyLength: { value: DAISY.petalLength, ...LENGTH },
        daisyWidth: { value: DAISY.petalWidth, ...WIDTH },
        daisyTaper: { value: DAISY.petalTaper, ...TAPER },
        daisyBulge: { value: DAISY.petalBulge, ...BULGE },
        daisyCurl: { value: DAISY.petalCurl, ...CURL },
        daisySpread: { value: DAISY.spread, ...SPREAD },
        daisyCentre: { value: DAISY.centreSize, ...CENTRE },
        daisyDome: { value: DAISY.centreDome, ...DOME },
      },
      { collapsed: true },
    ),
    blowball: folder(
      {
        blowballShare: { value: BLOWBALL.share, ...SHARE },
        blowballHeight: { value: BLOWBALL.height, ...HEIGHT },
        blowballBend: { value: BLOWBALL.bend, ...BEND },
        blowballNod: { value: BLOWBALL.nod, ...NOD },
        blowballPetals: { value: BLOWBALL.petals, ...PETALS },
        blowballLength: { value: BLOWBALL.petalLength, ...LENGTH },
        blowballWidth: { value: BLOWBALL.petalWidth, ...WIDTH },
        blowballTaper: { value: BLOWBALL.petalTaper, ...TAPER },
        blowballBulge: { value: BLOWBALL.petalBulge, ...BULGE },
        blowballCurl: { value: BLOWBALL.petalCurl, ...CURL },
        blowballSpread: { value: BLOWBALL.spread, ...SPREAD },
        blowballCentre: { value: BLOWBALL.centreSize, ...CENTRE },
        blowballDome: { value: BLOWBALL.centreDome, ...DOME },
      },
      { collapsed: true },
    ),
    variance: folder(
      {
        heightVariance: {
          value: FLOWER_VARIANCE.height,
          min: 0,
          max: 1,
          step: 0.01,
          label: "height",
        },
        headVariance: { value: FLOWER_VARIANCE.head, min: 0, max: 1, step: 0.01, label: "head" },
        bendVariance: { value: FLOWER_VARIANCE.bend, min: 0, max: 1, step: 0.01, label: "bend" },
      },
      { collapsed: true },
    ),
  },
  { order: 2, collapsed: true },
);
