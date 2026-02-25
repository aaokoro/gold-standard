import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert, Platform } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import { COLORS, FONTS } from '../../theme';

const LINKS = [
  { label: 'Aggie Hub', url: 'https://aggiehub.ncat.edu/', icon: '🏠' },
  { label: 'Blackboard', url: 'https://blackboard.ncat.edu/', icon: '📖' },
  { label: '1891Connect', url: 'https://1891connect.ncat.edu/', icon: '👥' },
  { label: 'Dining Menus', url: 'https://dineoncampus.com/ncat/', icon: '🍽️' },
  { label: 'NCAT Home', url: 'https://www.ncat.edu/', icon: '🌐' },
];

function openUrl(url) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open this link.'));
}

export default function LinksScreen() {
  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Quick links to the most used NCAT pages.</Text>
        {LINKS.map((link) => (
          <TouchableOpacity
            key={link.label}
            activeOpacity={0.8}
            onPress={() => openUrl(link.url)}
          >
            <GlassCard style={styles.linkCard}>
              <Text style={styles.linkIcon}>{link.icon}</Text>
              <Text style={styles.linkLabel}>{link.label}</Text>
              <Text style={styles.linkUrl} numberOfLines={1}>{link.url}</Text>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  intro: {
    fontSize: FONTS.body,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  linkCard: {
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  linkIcon: { fontSize: 28, marginRight: 16 },
  linkLabel: { flex: 1, fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.white },
  linkUrl: { width: '100%', marginTop: 6, fontSize: FONTS.caption, color: COLORS.gray },
});
