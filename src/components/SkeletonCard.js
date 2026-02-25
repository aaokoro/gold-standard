import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { GLASS } from '../../theme';

export function SkeletonLine({ width = '100%', height = 12, style }) {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, useNativeDriver: true, duration: 800 }),
        Animated.timing(shimmer, { toValue: 0, useNativeDriver: true, duration: 800 }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.5] });
  return (
    <Animated.View
      style={[
        styles.line,
        { width, height, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonLine width="70%" height={14} style={styles.title} />
      <SkeletonLine width="100%" height={10} style={styles.body} />
      <SkeletonLine width="40%" height={10} style={styles.meta} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
  },
  card: {
    backgroundColor: GLASS.card,
    borderRadius: GLASS.borderRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: GLASS.cardBorder,
  },
  title: { marginBottom: 10 },
  body: { marginBottom: 8 },
  meta: {},
});
