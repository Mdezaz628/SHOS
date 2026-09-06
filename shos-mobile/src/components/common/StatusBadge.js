// Reusable Clinical Status Badge Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const StatusBadge = ({ status, size = 'md', style }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let bg = COLORS.surfaceSubtle;
  let text = COLORS.textMuted;
  let border = COLORS.border;

  if (
    normalized.includes('admitted') ||
    normalized.includes('available') ||
    normalized.includes('optimal') ||
    normalized.includes('completed') ||
    normalized.includes('approved') ||
    normalized.includes('paid') ||
    normalized.includes('confirmed') ||
    normalized.includes('present')
  ) {
    bg = COLORS.successSubtle;
    text = COLORS.successDark;
    border = 'rgba(16, 185, 129, 0.3)';
  } else if (
    normalized.includes('waiting') ||
    normalized.includes('pending') ||
    normalized.includes('processing') ||
    normalized.includes('reserved') ||
    normalized.includes('low') ||
    normalized.includes('upcoming') ||
    normalized.includes('review')
  ) {
    bg = COLORS.warningSubtle;
    text = COLORS.warningDark;
    border = 'rgba(245, 158, 11, 0.3)';
  } else if (
    normalized.includes('critical') ||
    normalized.includes('emergency') ||
    normalized.includes('stat') ||
    normalized.includes('occupied') ||
    normalized.includes('cancelled') ||
    normalized.includes('rejected') ||
    normalized.includes('shortage')
  ) {
    bg = COLORS.criticalSubtle;
    text = COLORS.criticalDark;
    border = 'rgba(239, 68, 68, 0.3)';
  } else if (normalized.includes('in consultation') || normalized.includes('in progress') || normalized.includes('en route')) {
    bg = COLORS.primarySubtle;
    text = COLORS.primaryDark;
    border = 'rgba(2, 132, 199, 0.3)';
  }

  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }, isSmall && styles.badgeSm, style]}>
      <Text style={[styles.text, { color: text }, isSmall && styles.textSm]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  text: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 10,
  },
});

export default StatusBadge;
