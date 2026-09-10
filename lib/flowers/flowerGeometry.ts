import * as THREE from "three";
import { FLOWER_PART } from "./parts";

export type FlowerLayout = {
  petals: number;
  petalSegments: number;
  stemSegments: number;
  discSides: number;
};

type Piece = { position: number[]; index: number[] };

function strip(segments: number): Piece {
  const position: number[] = [];
  const index: number[] = [];

  for (let row = 0; row <= segments; row++) {
    const along = row / segments;

    position.push(-0.5, along, 0, 0.5, along, 0);
  }

  for (let row = 0; row < segments; row++) {
    const corner = row * 2;

    index.push(corner, corner + 1, corner + 2, corner + 2, corner + 1, corner + 3);
  }

  return { position, index };
}

function disc(sides: number): Piece {
  const position = [0, 0, 0];
  const index: number[] = [];

  for (let step = 0; step < sides; step++) {
    const angle = (step / sides) * Math.PI * 2;

    position.push(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0);
  }

  for (let step = 0; step < sides; step++) {
    index.push(0, step + 1, ((step + 1) % sides) + 1);
  }

  return { position, index };
}

export function buildFlowerGeometry(layout: FlowerLayout, instances: number, radius: number) {
  const position: number[] = [];
  const part: number[] = [];
  const petal: number[] = [];
  const index: number[] = [];

  const append = (piece: Piece, partId: number, petalId: number) => {
    const offset = position.length / 3;

    position.push(...piece.position);

    for (let vertex = 0; vertex < piece.position.length / 3; vertex++) {
      part.push(partId);
      petal.push(petalId);
    }

    for (const corner of piece.index) index.push(corner + offset);
  };

  const petalStrip = strip(layout.petalSegments);

  append(strip(layout.stemSegments), FLOWER_PART.stem, 0);

  for (let slot = 0; slot < layout.petals; slot++) append(petalStrip, FLOWER_PART.petal, slot);

  append(disc(layout.discSides), FLOWER_PART.centre, 0);

  const geometry = new THREE.InstancedBufferGeometry();

  geometry.setIndex(index);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  geometry.setAttribute("part", new THREE.Float32BufferAttribute(part, 1));
  geometry.setAttribute("petal", new THREE.Float32BufferAttribute(petal, 1));
  geometry.instanceCount = instances;

  // Explicit, or frustum culling measures the one template the attributes hold and drops every chunk.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);

  return geometry;
}
