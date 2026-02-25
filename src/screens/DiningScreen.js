import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import AnimatedFadeIn from '../components/AnimatedFadeIn';
import PressableScale from '../components/PressableScale';
import { SkeletonCard } from '../components/SkeletonCard';
import { COLORS, FONTS, GLASS, GOLD_GLOW, SPACING, ANIMATION } from '../../theme';
import { LOCATIONS, getLineStats, submitLineReport } from '../services/lineCheck';

function getBusyColor(percent) {
  if (percent <= 30) return COLORS.busyGreen;
  if (percent <= 70) return COLORS.busyGold;
  return COLORS.busyRed;
}

function LineCheckCard({ locationName, refreshTrigger }) {
  const [stats, setStats] = useState({ total: 0, longCount: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await getLineStats(locationName);
      setStats(s);
    } catch (e) {
      setStats({ total: 0, longCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [locationName]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  React.useEffect(() => {
    if (refreshTrigger) load();
  }, [refreshTrigger, load]);

  const percentLong = stats.total > 0 ? Math.round((stats.longCount / stats.total) * 100) : 0;
  const busyColor = getBusyColor(percentLong);

  const handleVote = async (isLong) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (_) {}
    }
    setSubmitting(true);
    const ok = await submitLineReport(locationName, isLong);
    setSubmitting(false);
    if (ok) {
      await load();
    } else {
      Alert.alert('Error', 'Could not submit. Check your connection and try again.');
    }
  };

  const gradientColors = percentLong <= 30
    ? [COLORS.busyGreen, '#34D399']
    : percentLong <= 70
      ? [COLORS.busyGold, COLORS.goldLight]
      : [COLORS.busyRed, '#FB923C'];

  return (
    <GlassCard style={styles.card} accent>
      <Text style={styles.locationName}>{locationName}</Text>
      {loading ? (
        <SkeletonCard style={styles.skeleton} />
      ) : (
        <>
          <View style={styles.ringContainer}>
            <View style={styles.ringBg} />
            <View style={[styles.ringFill, { width: `${percentLong}%` }]}>
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
              />
            </View>
          </View>
          <Text style={styles.percentText}>
            {stats.total === 0
              ? 'No reports in the last 30 min'
              : `${percentLong}% say line is long (${stats.longCount}/${stats.total})`}
          </Text>
          <View style={styles.buttons}>
            <PressableScale onPress={() => handleVote(true)} disabled={submitting}>
              <View style={[styles.voteBtn, styles.longBtn, GOLD_GLOW]}>
                <Text style={styles.voteBtnText}>Long line</Text>
              </View>
            </PressableScale>
            <PressableScale onPress={() => handleVote(false)} disabled={submitting}>
              <View style={[styles.voteBtn, styles.shortBtn]}>
                <Text style={styles.voteBtnText}>Short / OK</Text>
              </View>
            </PressableScale>
          </View>
        </>
      )}
      <TouchableOpacity onPress={load} style={styles.refreshLink}>
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    </GlassCard>
  );
}

export default function DiningScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger((t) => t + 1);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.aggieGold]}
            tintColor={COLORS.aggieGold}
          />
        }
      >
        <AnimatedFadeIn delay={0}>
          <Text style={styles.intro}>Crowdsourced line check — last 30 minutes.</Text>
        </AnimatedFadeIn>
        <AnimatedFadeIn delay={ANIMATION.stagger}>
          <LineCheckCard locationName={LOCATIONS.WILLIAMS_DINING} refreshTrigger={refreshTrigger} />
        </AnimatedFadeIn>
        <AnimatedFadeIn delay={ANIMATION.stagger * 2}>
          <LineCheckCard locationName={LOCATIONS.CHICKFILA} refreshTrigger={refreshTrigger} />
        </AnimatedFadeIn>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.xl, paddingBottom: 40 },
  intro: {
    fontSize: FONTS.body,
    color: COLORS.gray,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  card: { padding: SPACING.xxl, marginBottom: SPACING.xl },
  locationName: {
    fontSize: FONTS.subtitle,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  skeleton: { marginVertical: SPACING.sm },
  ringContainer: {
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  ringBg: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  ringFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 11,
    overflow: 'hidden',
  },
  percentText: { fontSize: FONTS.caption, color: COLORS.gray, marginBottom: SPACING.lg },
  buttons: { flexDirection: 'row', gap: SPACING.md },
  voteBtn: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
  },
  longBtn: { backgroundColor: COLORS.aggieGold },
  shortBtn: { backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: GLASS.cardBorder },
  voteBtnText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.body },
  refreshLink: { marginTop: SPACING.md, alignSelf: 'center' },
  refreshText: { fontSize: FONTS.caption, color: COLORS.aggieGold },
});
