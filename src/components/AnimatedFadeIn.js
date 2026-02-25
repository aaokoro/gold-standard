import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { ANIMATION } from '../../theme';

export default function AnimatedFadeIn({ children, delay = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION.durationNormal,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION.durationNormal,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [opacity, translateY, delay]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
