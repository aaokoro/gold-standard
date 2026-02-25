import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, FONT_FAMILY, SPACING } from '../../../theme';

const ASSETS = {
  spirit: require('../../../assets/spirit.png'),
};

// NC A&T traditions – The Greatest Homecoming on Earth, etc. (no emojis)
const TRADITIONS = [
  { id: '1', title: 'First game', code: '1st', desc: 'Attend your first Aggie football game' },
  { id: '2', title: 'Library night', code: 'Lib', desc: 'Study at Bluford Library after dark' },
  { id: '3', title: 'Student Union', code: 'SU', desc: 'Visit the Student Union' },
  { id: '4', title: 'Homecoming', code: 'HC', desc: 'The Greatest Homecoming on Earth' },
  { id: '5', title: 'Ring the bell', code: 'Bell', desc: 'Ring the bell (grad tradition)' },
  { id: '6', title: 'Dining hall', code: 'Dine', desc: 'Eat at Williams Dining Hall' },
  { id: '7', title: 'Campus tour', code: 'Tour', desc: 'Complete a full campus walk' },
  { id: '8', title: 'Aggie Pride', code: 'Pride', desc: 'Wear Aggie colors on game day' },
];

export default function TraditionsScreen() {
  const [achieved, setAchieved] = useState({});

  const toggle = (id) => {
    setAchieved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const count = Object.values(achieved).filter(Boolean).length;

  return (
    <ImageBackground
      source={ASSETS.spirit}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.bannerOverlay} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.bannerTitle}>Aggie Pride</Text>
          <Text style={styles.bannerSubtitle}>
            {count} of {TRADITIONS.length} traditions achieved
          </Text>
        </View>

        <View style={styles.grid}>
          {TRADITIONS.map((t) => {
            const done = achieved[t.id];
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.card, done && styles.cardAchieved]}
                onPress={() => toggle(t.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrap, done && styles.iconWrapAchieved]}>
                  <Text style={[styles.iconCode, done && styles.iconCodeAchieved]}>{t.code}</Text>
                </View>
                <Text style={[styles.cardTitle, done && styles.cardTitleAchieved]} numberOfLines={1}>
                  {t.title}
                </Text>
                {done && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: COLORS.backgroundDark },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,70,132,0.6)',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: Platform.OS === 'web' ? 'Montserrat_700Bold' : FONT_FAMILY.bold,
  },
  bannerSubtitle: {
    fontSize: FONTS.caption,
    color: COLORS.aggieGold,
    marginTop: 4,
  },
  scroll: { flex: 1 },
  content: { padding: SPACING.xl, paddingBottom: 100 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  card: {
    width: '47%',
    padding: SPACING.lg,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  cardAchieved: {
    backgroundColor: 'rgba(253, 185, 39, 0.12)',
    borderWidth: 2,
    borderColor: COLORS.aggieGold,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,70,132,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  iconWrapAchieved: {
    backgroundColor: 'rgba(253, 185, 39, 0.3)',
  },
  iconCode: { fontSize: 12, fontWeight: '700', color: COLORS.aggieBlue },
  iconCodeAchieved: { color: COLORS.aggieGold },
  cardTitle: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.grayLight,
    textAlign: 'center',
  },
  cardTitleAchieved: { color: COLORS.aggieGold },
  check: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    fontSize: 14,
    color: COLORS.aggieGold,
    fontWeight: '700',
  },
});
