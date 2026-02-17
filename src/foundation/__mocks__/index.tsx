import { View } from 'react-native';

export const FoundationProvider = ({ children }: { children: React.ReactNode }) => (
  <View testID="foundation-provider">{children}</View>
);
