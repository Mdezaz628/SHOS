// Reusable Triage & Priority Badge Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const PriorityBadge = ({ priority = 'Normal', style }) => {
  const norm = priority.toUpperCase();

  let bg = COLORS.surfaceSubtle;
  let text = COLORS.textMuted;
  let label = priority;

  if (norm.includes('STAT') || norm.includes('CRITICAL')) {
    bg = COLORS.critical;
    text = COLORS.textWhite;
    label = '🚨 STAT EMERGENCY';
  } else if (norm.includes('URGENT') || norm.includes('HIGH')) {
    bg = COLORS.warning;
    text = COLORS.textWhite;
    label = '⚡ URGENT';
  } else if (norm.includes('ROUTINE') || norm.includes('NORMAL')) {
    bg = COLORS.primarySubtle;
    text = COLORS.primaryDark;
    label = 'ROUTINE';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.heavy,
    letterSpacing: 0.5,
  },
});

export default PriorityBadge;
