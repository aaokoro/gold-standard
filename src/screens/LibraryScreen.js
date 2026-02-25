import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import { COLORS, FONTS } from '../../theme';

const LIBRARY_URL = 'https://library.ncat.edu/';

export default function LibraryScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.intro}>Bluford Library and resources.</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => Linking.openURL(LIBRARY_URL).catch(() => Alert.alert('Error', 'Could not open link.'))}>
          <GlassCard style={styles.linkCard}>
            <Text style={styles.linkLabel}>Bluford Library</Text>
            <Text style={styles.linkSub}>Open in browser</Text>
          </GlassCard>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  intro: { fontSize: FONTS.body, color: COLORS.gray, marginBottom: 20, textAlign: 'center' },
  linkCard: { padding: 20 },
  linkLabel: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.white },
  linkSub: { fontSize: FONTS.caption, color: COLORS.gray, marginTop: 6 },
});
