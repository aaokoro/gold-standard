import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme';

export default function GradientBackground({ children, style }) {
  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
      locations={[0, 0.4, 1]}
      style={[StyleSheet.absoluteFill, style]}
    >
      {/* Subtle vignette overlay for depth */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.15)']}
          locations={[0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </LinearGradient>
  );
}
