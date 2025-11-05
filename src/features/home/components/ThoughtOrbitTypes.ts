export type OrbitAlignment = 'left' | 'right' | 'center';

export type ThoughtOrbitTone = 'hero' | 'surface';

export type ThoughtOrbitSubsectionDynamic = {
  id: string;
  focus: number;
  offset: number;
  spread: number;
  tone: ThoughtOrbitTone;
  index: number;
  count: number;
  active: boolean;
};

export type ThoughtOrbitSectionDynamic = {
  id: string;
  focus: number;
  distance: number;
  alignment: OrbitAlignment;
  tone: ThoughtOrbitTone;
  subsections: ThoughtOrbitSubsectionDynamic[];
};
