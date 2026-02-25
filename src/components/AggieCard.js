import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../theme';

/**
 * NC A&T style card: Aggie Gold background, Aggie Blue text, rounded corners, shadow.
 */
export default function AggieCard({ title, subtitle, onPress, style }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={[styles.card, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.aggieGold,
    padding: SPACING.xl,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    color: COLORS.aggieBlue,
    fontWeight: '700',
    fontSize: 18,
  },
  subtitle: {
    color: COLORS.aggieBlue,
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
});
