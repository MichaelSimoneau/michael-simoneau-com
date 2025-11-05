import { createContext, useContext } from 'react';

export type ThoughtOrbitFocusSnapshot = {
  focus: number;
  distance: number;
};

const ThoughtOrbitFocusContext = createContext<ThoughtOrbitFocusSnapshot>({
  focus: 0,
  distance: 1,
});

export const ThoughtOrbitFocusProvider = ThoughtOrbitFocusContext.Provider;

export const useThoughtOrbitFocus = () => useContext(ThoughtOrbitFocusContext);
