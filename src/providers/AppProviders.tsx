import React from "react";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FoundationProvider } from "../foundation";
import { foundationConfig } from "../foundation/config";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <SafeAreaProvider testID="safe-area-provider">
      <FoundationProvider
        config={foundationConfig}
        testID="foundation-provider"
      >
        {children}
      </FoundationProvider>
    </SafeAreaProvider>
  );
};
