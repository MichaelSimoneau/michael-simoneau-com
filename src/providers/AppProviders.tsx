import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FoundationProvider } from '../foundation';
import { foundationConfig } from '../foundation/config';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <SafeAreaProvider>
      <FoundationProvider config={foundationConfig}>{children}</FoundationProvider>
    </SafeAreaProvider>
  );
};
