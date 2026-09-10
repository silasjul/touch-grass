export const GROUND = {
  segments: 300,
  shape: "circle",
  wireframe: false,
  size: 45,
};

export const HEIGHT_FIELD = {
  resolution: 512,
};

export const GROUND_ARROW = {
  enabled: false,
  length: 5.5,
  radius: 0.13,
  headLength: 1.6,
  headRadius: 0.42,
  color: "#3d7dff",
};

export const GROUND_NOISE = {
  level1: { frequency: 2.46, amplitude: 0.043 },
  level2: { frequency: 5.81, amplitude: 0.005 },
  level3: { frequency: 10.16, amplitude: 0.0029 },
};

export const GROUND_SURFACE = {
  scale: 3.5,
  brightness: 0.38,
  contrast: 0.92,
  saturation: 0.98,
  tint: "#ffffff",
  normalStrength: 1,
  roughness: 1,
  ao: 1,
  variation: 0.35,
  variationScale: 6,
};
