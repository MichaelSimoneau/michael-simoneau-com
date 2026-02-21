import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const NebulaBackgroundWithFallback: React.FC = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <LinearGradient
      colors={['#000510', '#0a0020', '#050510', '#000510']}
      locations={[0, 0.3, 0.7, 1]}
      style={StyleSheet.absoluteFill}
    />
  </View>
);
