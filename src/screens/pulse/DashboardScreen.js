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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AggieCard from '../../components/AggieCard';
import { COLORS, FONTS, FONT_FAMILY, SPACING } from '../../../theme';
import { useAuth } from '../../context/AuthContext';
import { useFirstFocusTask } from '../../context/PlannerContext';

function getName(user) {
  if (!user?.email) return 'Aggie';
  const part = user.email.split('@')[0] || '';
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() || 'Aggie';
}

// Campus Hub – one label per button
const CAMPUS_HUB = [
  { key: 'Library', label: 'Library', screen: 'Library' },
  { key: 'Exchange', label: 'Community', screen: 'Exchange' },
  { key: 'Dining', label: 'Dining', screen: 'Dining' },
  // Shuttle card now points to campus links; label it clearly
  { key: 'Shuttle', label: 'Campus Links', screen: 'Links' },
  { key: 'Map', label: 'Map', screen: 'Links' },
  { key: 'Traditions', label: 'Traditions', screen: 'Traditions' },
];

const DEFAULT_FOCUS = 'Complete CSCI 430 HW';

const LOGO_AG = require('../../../assets/logo-ag.png');

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
    <View style={styles.container}>
      <View style={styles.headerBar}>
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
        <Text style={styles.howdy}>Howdy, Aggie!</Text>
        <Text style={styles.nameLabel}>Name</Text>
        <Text style={styles.nameValue}>{name}</Text>

        <Pressable onPress={() => goTo('Planner')}>
          <AggieCard
            title={`${greeting}, Aggie!`}
            subtitle="Your next class is in Chery Hall."
            onPress={() => goTo('Planner')}
            style={styles.heroCard}
          />
        </Pressable>

        <TouchableOpacity style={styles.dailyCard} onPress={() => goTo('Planner')} activeOpacity={0.8}>
          <Text style={styles.dailyTitle}>Daily Overview</Text>
          <View style={styles.dailyRow}>
            <Text style={styles.dailyFocus}>Today&apos;s Focus: {todayFocusText}</Text>
            <View style={styles.calendarIconWrap}>
              <Text style={styles.calendarIcon}>Cal</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.quickRow}>
          <Pressable style={styles.quickBtnAsk} onPress={() => goTo('AggieAI')}>
            <Text style={styles.quickBtnLabel}>Ask Aggie</Text>
          </Pressable>
          <Pressable style={styles.quickBtnPlanner} onPress={() => goTo('Planner')}>
            <Text style={styles.quickBtnLabelPlanner}>Study Planner</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Campus Hub</Text>
        <View style={styles.grid}>
          {CAMPUS_HUB.map(({ key, label, screen }) => (
            <Pressable
              key={key}
              style={({ pressed }) => [styles.gridCard, pressed && styles.gridCardPressed]}
              onPress={() => goTo(screen)}
            >
              <Text style={styles.gridLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.xl,
    backgroundColor: COLORS.aggieBlue,
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
  howdy: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: Platform.OS === 'web' ? 'Montserrat_700Bold' : FONT_FAMILY.bold,
  },
  nameLabel: { fontSize: FONTS.caption, color: COLORS.gray, marginTop: 4 },
  nameValue: { fontSize: FONTS.body, color: COLORS.grayLight, marginBottom: SPACING.lg },
  heroCard: { marginVertical: 8 },
  dailyCard: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 15,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  dailyTitle: {
    fontSize: FONTS.subtitle,
    fontWeight: '700',
    color: COLORS.aggieBlue,
    marginBottom: SPACING.sm,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyFocus: { fontSize: FONTS.body, color: COLORS.grayLight, flex: 1 },
  calendarIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.aggieGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: { fontSize: 11, fontWeight: '700', color: COLORS.backgroundDark },
  quickRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xxl },
  quickBtnAsk: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.aggieBlue,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: 15,
  },
  quickBtnPlanner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.aggieGold,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: 15,
  },
  quickBtnLabel: { fontSize: FONTS.body, fontWeight: '700', color: COLORS.white },
  quickBtnLabelPlanner: { fontSize: FONTS.body, fontWeight: '700', color: COLORS.backgroundDark },
  sectionTitle: {
    fontSize: FONTS.subtitle,
    fontWeight: '700',
    color: COLORS.aggieBlue,
    marginBottom: SPACING.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  gridCard: {
    width: '31%',
    backgroundColor: COLORS.surfaceDarkElevated,
    borderRadius: 15,
    padding: SPACING.lg,
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  gridCardPressed: { opacity: 0.8 },
  gridLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.grayLight,
    textAlign: 'center',
  },
});
