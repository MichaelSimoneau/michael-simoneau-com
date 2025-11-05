export type OrbitAlignment = 'left' | 'right' | 'center';

export type ThoughtOrbitTone = 'hero' | 'surface';

export type ThoughtOrbitDynamicState = {
  id: string;
  focus: number;
  distance: number;
  alignment: OrbitAlignment;
  tone: ThoughtOrbitTone;
};
