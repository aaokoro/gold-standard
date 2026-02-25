import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AggieCard from '../../components/AggieCard';
import { COLORS, FONTS, FONT_FAMILY, SPACING } from '../../../theme';
import { useAuth } from '../../context/AuthContext';
import { useFirstFocusTask } from '../../context/PlannerContext';
import PressableScale from '../../components/PressableScale';

function getName(user) {
  if (!user?.email) return 'Aggie';
  const part = user.email.split('@')[0] || '';
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() || 'Aggie';
}

// Campus Hub – one label per button
const CAMPUS_HUB = [
  { key: 'Library', label: 'Library', screen: 'Library', icon: 'book-open' },
  { key: 'Exchange', label: 'Community', screen: 'Exchange', icon: 'users' },
  { key: 'Dining', label: 'Dining', screen: 'Dining', icon: 'coffee' },
  // Shuttle card now points to campus links; label it clearly
  { key: 'Shuttle', label: 'Campus Links', screen: 'Links', icon: 'link-2' },
  { key: 'Map', label: 'Map', screen: 'Links', icon: 'map' },
  { key: 'Traditions', label: 'Traditions', screen: 'Traditions', icon: 'star' },
];

const DEFAULT_FOCUS = 'Complete CSCI 430 HW';

const LOGO_AG = require('../../../assets/logo-ag.png');
const DASHBOARD_BG = require('../../../assets/dashboard-bg.png');

function HeaderLogo() {
  const [err, setErr] = React.useState(false);
  if (err) {
    return (
      <View style={styles.logoWrap}>
        <Text style={styles.logoFallback}>AG</Text>
      </View>
    );
  }
  return (
    <View style={styles.logoWrap}>
      <Image source={LOGO_AG} style={styles.logoImg} resizeMode="contain" onError={() => setErr(true)} />
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const firstFocus = useFirstFocusTask();
  const name = getName(user);
  const todayFocusText = firstFocus ? firstFocus.title : DEFAULT_FOCUS;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const goTo = (screen) => {
    try {
      navigation.navigate(screen);
    } catch (e) {
      const root = navigation.getParent?.();
      if (root) root.navigate(screen);
    }
  };

  return (
    <ImageBackground
      source={DASHBOARD_BG}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.backdrop} />

      <View style={[styles.headerBar, Platform.OS === 'web' && styles.headerBarWeb]}>
        <HeaderLogo />
        <Text style={styles.headerTitle}>Gold Standard</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => goTo('Login')} accessibilityLabel="Menu">
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <Text style={styles.howdy}>Howdy, Aggie!</Text>
          <Text style={styles.nameLabel}>Name</Text>
          <Text style={styles.nameValue}>{name}</Text>

          <PressableScale onPress={() => goTo('Planner')} style={styles.heroWrapper}>
            <AggieCard
              title={`${greeting}, Aggie!`}
              subtitle="Your next class is in Marteena Hall."
              onPress={() => goTo('Planner')}
              style={styles.heroCard}
            />
          </PressableScale>

          <View style={styles.dailyCard}>
            <View style={styles.dailyHeaderRow}>
              <Text style={styles.dailyLabel}>DAILY OVERVIEW</Text>
              <View style={styles.dailyPill}>
                <Text style={styles.dailyPillText}>CSCI 430 HW</Text>
              </View>
            </View>
            <Text style={styles.dailyFocus}>Today&apos;s Focus: {todayFocusText}</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <View style={styles.quickRow}>
            <Pressable
              onPress={() => goTo('AggieAI')}
              style={({ pressed }) => [
                styles.quickBtnOutline,
                styles.quickBtnOutlinePrimary,
                pressed && styles.quickBtnFilledPrimary,
              ]}
            >
              <Text style={styles.quickBtnOutlineText}>Ask Aggie</Text>
            </Pressable>
            <Pressable
              onPress={() => goTo('Planner')}
              style={({ pressed }) => [
                styles.quickBtnOutline,
                styles.quickBtnOutlineGold,
                pressed && styles.quickBtnFilledGold,
              ]}
            >
              <Text style={styles.quickBtnOutlineText}>Study Planner</Text>
            </Pressable>
          </View>

          <View style={styles.campusHubBox}>
            <Text style={styles.campusHubTitle}>CAMPUS HUB</Text>
            <View style={styles.grid}>
              {CAMPUS_HUB.map(({ key, label, screen, icon }) => (
                <PressableScale
                  key={key}
                  onPress={() => goTo(screen)}
                  style={styles.gridCard}
                >
                  <View style={styles.gridInner}>
                    <Feather name={icon} size={18} color={COLORS.grayLight} />
                    <Text style={styles.gridLabel}>{label}</Text>
                  </View>
                </PressableScale>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: COLORS.backgroundDark },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.xl,
    backgroundColor: 'rgba(0, 25, 60, 0.9)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.18)',
    zIndex: 20,
  },
  headerBarWeb: {
    position: 'sticky',
    top: 0,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImg: { width: 28, height: 28 },
  logoFallback: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Montserrat_700Bold' : FONT_FAMILY.bold,
  },
  menuBtn: { padding: SPACING.sm },
  menuIcon: { color: COLORS.white, fontSize: 24, fontWeight: '300' },
  scroll: { flex: 1 },
  content: { padding: SPACING.xl, paddingBottom: 100 },
  inner: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
  },
  howdy: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: Platform.OS === 'web' ? 'Montserrat_700Bold' : FONT_FAMILY.bold,
  },
  nameLabel: { fontSize: FONTS.caption, color: COLORS.gray, marginTop: 4 },
  nameValue: { fontSize: FONTS.body, color: COLORS.grayLight, marginBottom: SPACING.lg },
  heroWrapper: { marginVertical: 8 },
  heroCard: { marginVertical: 0 },
  dailyCard: {
    backgroundColor: 'rgba(10, 10, 15, 0.85)',
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: COLORS.aggieGold,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  },
  dailyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  dailyLabel: {
    fontSize: FONTS.caption,
    color: COLORS.grayLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dailyPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(253,185,39,0.7)',
    backgroundColor: 'rgba(253,185,39,0.12)',
  },
  dailyPillText: {
    fontSize: FONTS.caption,
    color: COLORS.aggieGold,
    fontWeight: '600',
  },
  dailyFocus: {
    fontSize: FONTS.body,
    color: COLORS.grayLight,
    marginBottom: SPACING.md,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  progressFill: {
    width: '68%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.aggieBlue,
    shadowColor: COLORS.aggieBlue,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  quickRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xxl },
  quickBtnOutline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickBtnOutlinePrimary: {
    borderColor: COLORS.aggieBlue,
    backgroundColor: 'transparent',
  },
  quickBtnOutlineGold: {
    borderColor: COLORS.aggieGold,
    backgroundColor: 'transparent',
  },
  quickBtnFilledPrimary: {
    backgroundColor: COLORS.aggieBlue,
  },
  quickBtnFilledGold: {
    backgroundColor: COLORS.aggieGold,
  },
  quickBtnOutlineText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: COLORS.grayLight,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  campusHubBox: {
    backgroundColor: 'rgba(10, 10, 15, 0.85)',
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: COLORS.aggieBlue,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    overflow: 'hidden',
  },
  campusHubTitle: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: COLORS.grayLight,
    marginBottom: SPACING.md,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
    alignItems: 'center',
  },
  gridCard: {
    // pill-style buttons sized to content
    borderRadius: 999,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: 'transparent',
  },
  gridInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: SPACING.sm,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.grayLight,
    textAlign: 'left',
  },
});
