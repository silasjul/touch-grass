import { controls, folder } from "tsl-inspector";
import { FLOWER_COLOR } from "@/configs/flowers/flowerColor";

export const colorTweaks = controls(
  "Flowers/Color",
  {
    stemRoot: FLOWER_COLOR.stemRoot,
    stemTip: FLOWER_COLOR.stemTip,
    variance: { value: FLOWER_COLOR.variance, min: 0, max: 1, step: 0.01 },
    roughness: { value: FLOWER_COLOR.roughness, min: 0.05, max: 1, step: 0.01 },
    occlusion: { value: FLOWER_COLOR.occlusion, min: 0, max: 1, step: 0.01 },
    dandelion: folder(
      {
        dandelionPetal: { value: FLOWER_COLOR.dandelionPetal, label: "petal" },
        dandelionEdge: { value: FLOWER_COLOR.dandelionEdge, label: "edge" },
        dandelionCentre: { value: FLOWER_COLOR.dandelionCentre, label: "centre" },
      },
      { collapsed: true },
    ),
    daisy: folder(
      {
        daisyPetal: { value: FLOWER_COLOR.daisyPetal, label: "petal" },
        daisyEdge: { value: FLOWER_COLOR.daisyEdge, label: "edge" },
        daisyCentre: { value: FLOWER_COLOR.daisyCentre, label: "centre" },
      },
      { collapsed: true },
    ),
    blowball: folder(
      {
        blowballPetal: { value: FLOWER_COLOR.blowballPetal, label: "petal" },
        blowballEdge: { value: FLOWER_COLOR.blowballEdge, label: "edge" },
        blowballCentre: { value: FLOWER_COLOR.blowballCentre, label: "centre" },
      },
      { collapsed: true },
    ),
    backlight: folder(
      {
        translucency: {
          value: FLOWER_COLOR.translucency,
          min: 0,
          max: 4,
          step: 0.01,
          label: "amount",
        },
        translucencyFocus: {
          value: FLOWER_COLOR.translucencyFocus,
          min: 1,
          max: 12,
          step: 0.1,
          label: "focus",
        },
      },
      { collapsed: true },
    ),
  },
  { order: 4, collapsed: true },
);
