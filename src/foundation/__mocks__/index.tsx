import React from 'react';
import { View } from 'react-native';

export const FoundationProvider = ({ children }: { children: React.ReactNode }) => (
  <View>{children}</View>
);
