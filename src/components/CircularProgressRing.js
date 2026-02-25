import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../theme';

const SIZE = 48;
const STROKE = 5;

function getRingColor(percent) {
  if (percent <= 30) return COLORS.busyGreen;
  if (percent <= 70) return COLORS.busyGold;
  return COLORS.busyRed;
}

export default function CircularProgressRing({ percent, size = SIZE }) {
  const stroke = (STROKE / SIZE) * size;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  const dashOffset = circumference - (p / 100) * circumference;
  const color = getRingColor(p);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {Platform.OS !== 'web' && (
        <View
          style={[
            styles.glow,
            {
              width: size + 12,
              height: size + 12,
              borderRadius: (size + 12) / 2,
              shadowColor: color,
            },
          ]}
        />
      )}
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.svg}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  svg: {},
});
