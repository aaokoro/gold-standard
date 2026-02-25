import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { COLORS, FONTS, GOLD_GLOW } from '../../theme';

const UPD_PHONE = '3363347675';
const SAFE_RIDE_PHONE = '3362852530';

function callNumber(phone, label) {
  const url = `tel:${phone}`;
  Linking.openURL(url).catch(() => {
    Alert.alert('Cannot place call', `Opening ${label} failed. You can dial manually: ${phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`);
  });
}

export default function SafetyScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.intro}>One-tap access to campus safety resources.</Text>

        <TouchableOpacity
          style={[styles.emergencyButton, styles.upd, GOLD_GLOW]}
          onPress={() => callNumber(UPD_PHONE, 'UPD')}
          activeOpacity={0.9}
        >
          <Text style={styles.emergencyIcon}>📞</Text>
          <Text style={[styles.emergencyLabel, styles.updText]}>Call University Police (UPD)</Text>
          <Text style={[styles.emergencySub, styles.updText]}>24-hour emergency: 336-334-7675</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => callNumber(SAFE_RIDE_PHONE, 'Aggie Escort')}
          activeOpacity={0.9}
        >
          <Text style={styles.emergencyIcon}>🚗</Text>
          <Text style={styles.emergencyLabel}>Aggie Escort (Safe Ride)</Text>
          <Text style={styles.emergencySub}>336-285-2530 · Sun–Fri 6pm–2am</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          UPD: 24/7. Aggie Escort: on-campus only after 11pm.
        </Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  intro: {
    fontSize: FONTS.body,
    color: COLORS.gray,
    marginBottom: 24,
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  upd: { backgroundColor: COLORS.aggieGold },
  updText: { color: COLORS.gradientStart },
  emergencyIcon: { fontSize: 40, marginBottom: 8 },
  emergencyLabel: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.white },
  emergencySub: { fontSize: FONTS.body, color: COLORS.white, opacity: 0.9 },
  disclaimer: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 16,
  },
});
