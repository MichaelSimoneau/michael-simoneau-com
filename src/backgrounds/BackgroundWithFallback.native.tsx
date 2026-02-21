import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const BackgroundWithFallback: React.FC = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <LinearGradient
      colors={['#000510', '#001233', '#000510']}
      style={StyleSheet.absoluteFill}
    />
  </View>
);
