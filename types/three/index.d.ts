export class Color {
  constructor(color?: string | number);
}

export const DoubleSide: unique symbol;

export class Group {
  rotation: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  scale: { x: number; setScalar(value: number): void };
}

export class MeshStandardMaterial {
  opacity: number;
  emissiveIntensity: number;
  transparent: boolean;
}

export class MeshBasicMaterial {
  opacity: number;
  transparent: boolean;
}
