import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppProviders } from '../AppProviders';
import { Text } from 'react-native';
import { jest, describe, it, expect } from '@jest/globals';

// Mock expo-constants to prevent native module access
jest.mock('expo-constants', () => ({
  // Mock any specific exports from expo-constants if needed
  // For now, an empty object might suffice to prevent errors.
  // This ensures that accessing `NativeModules` from `expo-modules-core` doesn't happen.
}));

// Mock expo-router to prevent native module access
jest.mock('expo-router', () => ({
  Stack: () => null, // Mock Stack component
  useSearchParams: () => ({}), // Mock useSearchParams hook
  // Add any other necessary mocks for expo-router if they cause issues
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../foundation', () => ({
  FoundationProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('AppProviders', () => {
  it('renders children within SafeAreaProvider and FoundationProvider', () => {
    const TestChild = () => <Text>Test Child Content</Text>;

    render(
      <AppProviders>
        <TestChild />
      </AppProviders>,
    );

    // Check if the child component is rendered within FoundationProvider
    expect(screen.getByText('Test Child Content')).toBeTruthy();
  });
});
