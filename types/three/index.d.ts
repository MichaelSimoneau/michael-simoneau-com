export class Color {
  constructor(color?: string | number);
}

export const DoubleSide: unique symbol;

export class Group {
  rotation: { x: number; y: number; z: number };
  scale: { setScalar(value: number): void };
}

export class MeshStandardMaterial {
  opacity: number;
  emissiveIntensity: number;
  transparent: boolean;
}
