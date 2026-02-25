import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GLASS } from '../../theme';

export default function GlassCard({ children, style, intensity = 25, accent = false }) {
  const cardStyle = [
    styles.card,
    { borderRadius: GLASS.borderRadius, borderWidth: 1, borderColor: GLASS.cardBorder },
    accent && styles.accentBorder,
    style,
  ];

  if (Platform.OS === 'web') {
    return (
      <View style={cardStyle}>
        {accent && <View style={styles.accentLine} />}
        <View style={[styles.webFallback]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={cardStyle} overflow="hidden">
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      {accent && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <LinearGradient
            colors={['rgba(253,185,39,0.15)', 'transparent']}
            style={styles.accentGradient}
          />
        </View>
      )}
      <View style={styles.overlay} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: GLASS.card,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webFallback: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  accentBorder: {
    borderColor: 'rgba(253, 185, 39, 0.35)',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(253, 185, 39, 0.4)',
    borderTopLeftRadius: GLASS.borderRadius,
    borderTopRightRadius: GLASS.borderRadius,
    zIndex: 1,
  },
  accentGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
});
