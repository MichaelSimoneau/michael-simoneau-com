declare module 'react-native-math-view' {
  import type { ReactElement } from 'react';
  import type { StyleProp, ViewStyle } from 'react-native';

  export interface MathViewRenderErrorArgs {
    error: string;
  }

  export interface MathViewProps {
    math: string;
    style?: StyleProp<ViewStyle>;
    renderError?: (args: MathViewRenderErrorArgs) => ReactElement | null;
  }

  export default function MathView(props: MathViewProps): ReactElement;
}
