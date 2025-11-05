declare module 'react-native' {
  import * as React from 'react';

  export type ColorSchemeName = 'light' | 'dark' | null;
  export type PlatformOSType = 'ios' | 'android' | 'macos' | 'windows' | 'web';
  export type TextStyle = Record<string, unknown>;
  export type ViewStyle = Record<string, unknown>;
  export type StyleProp<T> = T | null | undefined | false | ReadonlyArray<StyleProp<T>>;
  export type PressableStateCallbackType = (state: { pressed: boolean }) => StyleProp<ViewStyle>;
  export type LayoutChangeEvent = {
    nativeEvent: {
      layout: { width: number; height: number; x: number; y: number };
    };
  };
  export type NativeScrollEvent = {
    contentOffset: { x: number; y: number };
  };
  export type NativeSyntheticEvent<T> = { nativeEvent: T };

  export const View: React.ComponentType<{
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
    onLayout?: (event: LayoutChangeEvent) => void;
  }>;
  export const Text: React.ComponentType<{
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    numberOfLines?: number;
  }>;
  export type ScrollToOptions = {
    x?: number;
    y?: number;
    animated?: boolean;
  };

  export type ScrollViewHandle = {
    scrollTo: (options: ScrollToOptions) => void;
  };

  export type ScrollViewProps = {
    contentContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    scrollEventThrottle?: number;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    horizontal?: boolean;
    decelerationRate?: number | 'fast' | 'normal';
    snapToInterval?: number;
    snapToAlignment?: 'start' | 'center' | 'end';
    pagingEnabled?: boolean;
  };

  export const ScrollView: React.ForwardRefExoticComponent<
    ScrollViewProps & React.RefAttributes<ScrollViewHandle>
  >;

  export const Pressable: React.ComponentType<{
    style?: StyleProp<ViewStyle> | PressableStateCallbackType;
    children?: React.ReactNode;
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    onHoverIn?: () => void;
    onHoverOut?: () => void;
    accessibilityRole?: string;
    disabled?: boolean;
    accessibilityLabel?: string;
  }>;

  export const StyleSheet: {
    create<T extends Record<string, unknown>>(styles: T): T;
    flatten<T>(style: StyleProp<T>): T;
    absoluteFillObject: ViewStyle;
  };

  export const Easing: {
    linear: (value: number) => number;
    inOut: (easing: (value: number) => number) => (value: number) => number;
    out: (easing: (value: number) => number) => (value: number) => number;
    quad: (value: number) => number;
    cubic: (value: number) => number;
  };

  export const Appearance: {
    getColorScheme(): ColorSchemeName;
    addChangeListener(listener: (preferences: { colorScheme: ColorSchemeName }) => void): {
      remove(): void;
    };
  };

  export const Platform: {
    OS: PlatformOSType;
    select<T>(spec: { [key in PlatformOSType]?: T } & { default?: T }): T;
  };

  export const AccessibilityInfo: {
    isReduceMotionEnabled(): Promise<boolean>;
    addEventListener(
      type: 'reduceMotionChanged',
      listener: (reduceMotionEnabled: boolean) => void,
    ): { remove(): void };
  };

  export namespace Animated {
    class Value {
      constructor(value: number);
      setValue(value: number): void;
      interpolate(config: { inputRange: number[]; outputRange: number[] }): AnimatedInterpolation;
    }

    type AnimatedInterpolation = {
      __getValue?: () => number;
    };

    type AnimatedCompositeAnimation = {
      start(callback?: (result: { finished: boolean }) => void): void;
      stop(): void;
    };

    function timing(
      value: Value,
      config: {
        toValue: number;
        duration: number;
        useNativeDriver: boolean;
        easing?: (value: number) => number;
      },
    ): AnimatedCompositeAnimation;

    function spring(
      value: Value,
      config: {
        toValue: number;
        damping?: number;
        stiffness?: number;
        mass?: number;
        useNativeDriver: boolean;
      },
    ): AnimatedCompositeAnimation;

    function sequence(animations: AnimatedCompositeAnimation[]): AnimatedCompositeAnimation;

    function loop(animation: AnimatedCompositeAnimation): AnimatedCompositeAnimation;

    const View: React.ComponentType<{
      style?: StyleProp<ViewStyle>;
      children?: React.ReactNode;
      pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
    }>;
  }

  export const Animated: {
    Value: typeof Animated.Value;
    timing: typeof Animated.timing;
    spring: typeof Animated.spring;
    sequence: typeof Animated.sequence;
    loop: typeof Animated.loop;
    View: typeof Animated.View;
  };

  export function useWindowDimensions(): {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  };
}
