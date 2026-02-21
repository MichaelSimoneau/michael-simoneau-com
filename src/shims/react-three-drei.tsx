/**
 * Stub for @react-three/drei. All exported components render nothing.
 * Needed because drei depends on @react-three/fiber which crashes with React 19.
 */
import React from 'react';

const Noop: React.FC<any> = () => null;

export const Points = Noop;
export const PointMaterial = Noop;
export const Cloud = Noop;
export const Float = Noop;
export const Stars = Noop;
export const OrbitControls = Noop;
export const Environment = Noop;
export const useGLTF = (() => ({})) as any;
export const useTexture = (() => null) as any;
export const Html = Noop;
export const Text = Noop;
