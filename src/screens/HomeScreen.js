import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import PulseWave from '../components/PulseWave';
import CircularProgressRing from '../components/CircularProgressRing';
import AnimatedFadeIn from '../components/AnimatedFadeIn';
import PressableScale from '../components/PressableScale';
import { SkeletonCard } from '../components/SkeletonCard';
import {
  COLORS,
  FONTS,
  FONT_FAMILY,
  GLASS,
  GOLD_GLOW,
  GOLD_GLOW_STRONG,
  SPACING,
  TEXT_SHADOW,
  ANIMATION,
} from '../../theme';
import { useAuth } from '../context/AuthContext';
import { LOCATIONS, getLineStats } from '../services/lineCheck';

function getName(user) {
  if (!user?.email) return 'Aggie';
  const part = user.email.split('@')[0] || '';
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() || 'Aggie';
}

function PulseDot() {
  const anim = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.4, useNativeDriver: true, duration: 800 }),
        Animated.timing(anim, { toValue: 1, useNativeDriver: true, duration: 800 }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);
  return (
    <Animated.View style={[styles.pulseDot, { opacity: anim }]} />
  );
}

function PulseCard({ campusBusyPercent }) {
  const level = Math.min(100, campusBusyPercent || 0);
  return (
    <GlassCard style={styles.pulseCard} accent>
      <Text style={styles.pulseLabel}>Campus pulse</Text>
      <View style={styles.waveWrap}>
        <PulseWave />
      </View>
      <Text style={styles.pulsePercent}>{Math.round(level)}% busy</Text>
    </GlassCard>
  );
}

const QUICK_ACTIONS = [
  { key: 'Links', icon: '🚌' },
  { key: 'Parking', icon: '🅿️' },
  { key: 'Dining', icon: '🍔' },
  { key: 'Library', icon: '📚' },
];

function RecentReportCard({ locationName, percent, onPress, index }) {
  return (
    <AnimatedFadeIn delay={ANIMATION.stagger * (index + 3)}>
      <PressableScale onPress={onPress}>
        <GlassCard style={styles.feedCard}>
          <View style={styles.feedCardInner}>
            <View style={styles.feedCardLeft}>
              <Text style={styles.feedTitle}>{locationName}</Text>
              <Text style={styles.feedBusy}>{percent}% Busy</Text>
            </View>
            <CircularProgressRing percent={percent} size={56} />
          </View>
        </GlassCard>
      </PressableScale>
    </AnimatedFadeIn>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const name = getName(user);
  const [recentStats, setRecentStats] = useState({ williams: null, chickfila: null });
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);

  const loadFeed = useCallback(async () => {
    setFeedLoading(true);
    setFeedError(false);
    try {
      const [w, c] = await Promise.all([
        getLineStats(LOCATIONS.WILLIAMS_DINING),
        getLineStats(LOCATIONS.CHICKFILA),
      ]);
      const wp = w.total > 0 ? Math.round((w.longCount / w.total) * 100) : 0;
      const cp = c.total > 0 ? Math.round((c.longCount / c.total) * 100) : 0;
      setRecentStats({ williams: wp, chickfila: cp });
    } catch (e) {
      setRecentStats({ williams: 0, chickfila: 0 });
      setFeedError(true);
    } finally {
      setFeedLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [loadFeed])
  );

  const campusBusy = recentStats.williams != null && recentStats.chickfila != null
    ? Math.round((recentStats.williams + recentStats.chickfila) / 2)
    : 0;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn delay={0}>
          <View style={styles.header}>
            <Text style={[styles.greeting, TEXT_SHADOW]}>
              Yo, <Text style={styles.greetingAccent}>{name}</Text>!
            </Text>
            <View style={styles.activeRow}>
              <Text style={styles.activeText}>The Yard is</Text>
              <Text style={styles.activeWord}> Active</Text>
              <PulseDot />
            </View>
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn delay={ANIMATION.stagger}>
          <PulseCard campusBusyPercent={campusBusy} />
        </AnimatedFadeIn>

        <AnimatedFadeIn delay={ANIMATION.stagger * 2}>
          <View style={styles.pillRow}>
            {QUICK_ACTIONS.map(({ key, icon }) => (
              <PressableScale key={key} onPress={() => navigation.navigate(key)}>
                <View style={[styles.pill, GOLD_GLOW]}>
                  <Text style={styles.pillIcon}>{icon}</Text>
                </View>
              </PressableScale>
            ))}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn delay={ANIMATION.stagger * 2.5}>
          <Text style={styles.sectionTitle}>Recent report</Text>
        </AnimatedFadeIn>

        {feedLoading ? (
          <>
            <SkeletonCard style={styles.feedCardSkeleton} />
            <SkeletonCard style={styles.feedCardSkeleton} />
          </>
        ) : feedError ? (
          <TouchableOpacity style={styles.retryCard} onPress={loadFeed}>
            <Text style={styles.retryText}>Couldn’t load reports. Tap to retry.</Text>
          </TouchableOpacity>
        ) : (
          <>
            <RecentReportCard
              locationName={LOCATIONS.WILLIAMS_DINING}
              percent={recentStats.williams ?? 0}
              onPress={() => navigation.navigate('Dining')}
              index={0}
            />
            <RecentReportCard
              locationName={LOCATIONS.CHICKFILA}
              percent={recentStats.chickfila ?? 0}
              onPress={() => navigation.navigate('Dining')}
              index={1}
            />
          </>
        )}

        <View style={styles.moreRow}>
          <PressableScale onPress={() => navigation.navigate('Safety')}>
            <View style={styles.morePill}>
              <Text style={styles.morePillText}>🛡️ Safety</Text>
            </View>
          </PressableScale>
          <PressableScale onPress={() => navigation.navigate('Links')}>
            <View style={styles.morePill}>
              <Text style={styles.morePillText}>🔗 Links</Text>
            </View>
          </PressableScale>
        </View>
      </ScrollView>

      <PressableScale onPress={() => navigation.navigate('Exchange')}>
        <View style={[styles.fab, GOLD_GLOW_STRONG]}>
          <Text style={styles.fabIcon}>+</Text>
        </View>
      </PressableScale>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.xl, paddingBottom: 100 },
  header: { marginBottom: SPACING.xl },
  greeting: {
    fontSize: FONTS.titleLarge,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: Platform.OS === 'web' ? 'Montserrat_700Bold' : FONT_FAMILY.bold,
    letterSpacing: 0.5,
  },
  greetingAccent: {
    color: COLORS.aggieGold,
  },
  activeRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xs },
  activeText: {
    fontSize: FONTS.body,
    color: COLORS.gray,
    fontFamily: Platform.OS === 'web' ? 'Montserrat_400Regular' : FONT_FAMILY.regular,
  },
  activeWord: {
    fontSize: FONTS.body,
    color: COLORS.white,
    marginRight: SPACING.sm,
    fontFamily: Platform.OS === 'web' ? 'Montserrat_600SemiBold' : FONT_FAMILY.semiBold,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.aggieGold,
  },
  pulseCard: { padding: SPACING.xxl, marginBottom: SPACING.xl },
  pulseLabel: {
    fontSize: FONTS.overline,
    color: COLORS.gray,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  waveWrap: { alignItems: 'center', marginBottom: SPACING.md },
  pulsePercent: {
    fontSize: FONTS.subtitle,
    fontWeight: '700',
    color: COLORS.white,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  pill: {
    width: 56,
    height: 56,
    borderRadius: GLASS.borderRadiusPill,
    backgroundColor: GLASS.card,
    borderWidth: 2,
    borderColor: COLORS.aggieGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillIcon: { fontSize: 26 },
  sectionTitle: {
    fontSize: FONTS.overline,
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  feedCard: { padding: SPACING.xl, marginBottom: SPACING.md },
  feedCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedCardLeft: { flex: 1 },
  feedTitle: {
    fontSize: FONTS.subtitle,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  feedBusy: {
    fontSize: FONTS.body,
    color: COLORS.gray,
  },
  feedCardSkeleton: { marginBottom: SPACING.md },
  retryCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: GLASS.card,
    borderRadius: GLASS.borderRadius,
    borderWidth: 1,
    borderColor: GLASS.cardBorder,
    alignItems: 'center',
  },
  retryText: { color: COLORS.gray, fontSize: FONTS.body },
  moreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.sm },
  morePill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 20,
    backgroundColor: GLASS.card,
    borderWidth: 1,
    borderColor: GLASS.cardBorder,
  },
  morePillText: { color: COLORS.white, fontSize: FONTS.body },
  fab: {
    position: 'absolute',
    right: SPACING.xxl,
    bottom: SPACING.xxxl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.aggieGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.gradientStart,
    lineHeight: 38,
  },
});
