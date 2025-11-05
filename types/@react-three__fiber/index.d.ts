import type * as React from 'react';

export type ThreeElements = Record<string, unknown>;
export type RootState = {
  clock: { getElapsedTime(): number; elapsedTime: number };
  size: { width: number; height: number };
  camera: {
    position: { x: number; y: number; z: number };
    lookAt: (...args: number[]) => void;
    updateProjectionMatrix: () => void;
  };
  scene: unknown;
  gl: unknown;
};

export const Canvas: React.ComponentType<Record<string, unknown>>;

export function useFrame(handler: (state: RootState, delta: number) => void): void;
export function useThree(): RootState;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [element: string]: unknown;
    }
  }
}
