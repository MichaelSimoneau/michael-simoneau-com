declare module 'react-native-safe-area-context' {
  import * as React from 'react';

  export const SafeAreaProvider: React.ComponentType<{
    children?: React.ReactNode;
  }>;
}
