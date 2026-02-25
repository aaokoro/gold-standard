import React, { useEffect, useRef } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');
const CARD_PADDING = 24;
const WAVE_WIDTH = Math.min(width - CARD_PADDING * 4, 320);
const WAVE_HEIGHT = 48;

function makeWavePath(phase = 0, amplitude = 12, yOffset = WAVE_HEIGHT / 2) {
  const points = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * WAVE_WIDTH;
    const y = yOffset + amplitude * Math.sin((x / WAVE_WIDTH) * Math.PI * 2 + phase);
    points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  return points.join(' ');
}

export default function PulseWave() {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -WAVE_WIDTH * 0.5,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateX]);

  const path1 = makeWavePath(0, 12, WAVE_HEIGHT * 0.4);
  const path2 = makeWavePath(Math.PI * 0.5, 12, WAVE_HEIGHT * 0.65);

  return (
    <View style={{ width: WAVE_WIDTH, height: WAVE_HEIGHT, overflow: 'hidden' }}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        <Svg width={WAVE_WIDTH} height={WAVE_HEIGHT} viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}>
        <Path
          d={path2}
          stroke={COLORS.waveTeal}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
        <Path
          d={path1}
          stroke={COLORS.aggieGold}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.95}
        />
      </Svg>
        <Svg width={WAVE_WIDTH} height={WAVE_HEIGHT} viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}>
        <Path d={path2} stroke={COLORS.waveTeal} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.9} />
        <Path d={path1} stroke={COLORS.aggieGold} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.95} />
      </Svg>
      </Animated.View>
    </View>
  );
}
