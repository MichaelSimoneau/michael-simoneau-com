/**
 * Stub for @react-three/fiber that renders Canvas as a <div> (preserving
 * the style/className so the gradient backgrounds still show) while
 * skipping WebGL. Needed because react-reconciler@0.27 crashes with React 19.
 * Swap this out once @react-three/fiber ships React 19 support.
 */
import React from 'react';

export const Canvas: React.FC<any> = ({ style, className, children, ...rest }) => (
  <div style={style} className={className} />
);

export const useFrame = (() => {}) as any;
export const useThree = (() => ({})) as any;
export const useLoader = (() => null) as any;
export const extend = (() => {}) as any;

export const addEffect = (() => {}) as any;
export const addAfterEffect = (() => {}) as any;
export const addTail = (() => {}) as any;
