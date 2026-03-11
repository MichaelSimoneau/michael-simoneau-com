import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FoundationProvider } from '../foundation';
import { foundationConfig } from '../foundation/config';
import { MediaPlaybackCoordinatorProvider } from './MediaPlaybackCoordinatorProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <SafeAreaProvider testID="safe-area-provider">
      <FoundationProvider config={foundationConfig} testID='foundation-provider'>
        <MediaPlaybackCoordinatorProvider>{children}</MediaPlaybackCoordinatorProvider>
      </FoundationProvider>
    </SafeAreaProvider>
  );
};
