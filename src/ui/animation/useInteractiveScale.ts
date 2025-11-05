import { useCallback, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { useReducedMotion } from './useReducedMotion';

type InteractiveScaleOptions = {
  restingScale?: number;
  pressedScale?: number;
};

export const useInteractiveScale = ({
  restingScale = 1,
  pressedScale = 0.97,
}: InteractiveScaleOptions = {}) => {
  const reduceMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(restingScale)).current;

  const animateTo = useCallback(
    (value: number) => {
      if (reduceMotion) {
        scale.setValue(restingScale);
        return;
      }

      Animated.spring(scale, {
        toValue: value,
        damping: 18,
        stiffness: 260,
        mass: 1,
        useNativeDriver: true,
      }).start();
    },
    [reduceMotion, restingScale, scale],
  );

  const handlePressIn = useCallback(() => {
    animateTo(pressedScale);
  }, [animateTo, pressedScale]);

  const handlePressOut = useCallback(() => {
    animateTo(restingScale);
  }, [animateTo, restingScale]);

  const animatedStyle = useMemo(
    () => ({
      transform: [{ scale }],
    }),
    [scale],
  );

  return { animatedStyle, handlePressIn, handlePressOut, reduceMotion };
};
