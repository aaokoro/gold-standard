import React, { useEffect, useRef, useState } from 'react';
import { Text, Animated, StyleSheet, View, Image, ImageBackground, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_FAMILY } from '../../../theme';

const ASSETS = {
  campus: require('../../../assets/campus.png'),
  spirit: require('../../../assets/spirit.png'),
  logoAg: require('../../../assets/logo-ag.png'),
  logoBulldog: require('../../../assets/logo-bulldog.png'),
};

export default function SplashScreen() {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => navigation.replace('MainTabs'));
    }, 2200);
    return () => clearTimeout(timer);
  }, [opacity, scale, navigation]);

  const Background = imageError ? (
    <LinearGradient colors={[COLORS.aggieBlue, '#003366']} style={StyleSheet.absoluteFill} />
  ) : (
    <ImageBackground
      source={ASSETS.spirit}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
      onError={() => setImageError(true)}
    >
      <LinearGradient
        colors={['rgba(0,70,132,0.85)', 'rgba(0,70,132,0.6)']}
        style={StyleSheet.absoluteFill}
      />
    </ImageBackground>
  );

  return (
    <View style={styles.wrapper}>
      {Background}
      <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}>
        <View style={styles.logoWrap}>
          <Image
            source={ASSETS.logoAg}
            style={styles.logoImg}
            resizeMode="contain"
            onError={() => {}}
          />
        </View>
        <Text style={styles.title}>Gold Standard</Text>
        <Text style={styles.tagline}>North Carolina A&T • Campus utility</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    width: 100,
    height: 100,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImg: {
    width: 72,
    height: 72,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: Platform.OS === 'web' ? 'Montserrat_700Bold' : FONT_FAMILY.bold,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.aggieGold,
    marginTop: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
