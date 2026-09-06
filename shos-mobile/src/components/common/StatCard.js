import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const StatCard = ({
  title,
  label,
  value,
  subtitle,
  change,
  icon,
  color,
  iconColor = COLORS.primary,
  trend,
  trendType = 'up', // up | down | neutral
  changeType,
  style,
  onPress,
}) => {
  const displayTitle = title || label || '';
  const displaySubtitle = subtitle || change || '';
  const effectiveColor = color || iconColor;
  const isDown = trendType === 'down' || changeType === 'negative';
  const displayTrend = trend;

  const CardWrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { activeOpacity: 0.75, onPress } : {};

  return (
    <CardWrapper
      style={[
        styles.card,
        onPress && styles.interactiveCard,
        style,
      ]}
      {...wrapperProps}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {displayTitle}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {icon && (
            <View style={[styles.iconWrap, { backgroundColor: effectiveColor + '18' }]}>
              <Ionicons name={icon} size={18} color={effectiveColor} />
            </View>
          )}
          {onPress && (
            <Ionicons name="chevron-forward" size={14} color={COLORS.textDim} style={{ marginLeft: 2 }} />
          )}
        </View>
      </View>

      <Text style={styles.value}>{value}</Text>

      {(displaySubtitle || displayTrend) && (
        <View style={styles.bottomRow}>
          {displayTrend && (
            <View style={styles.trendRow}>
              <Ionicons
                name={isDown ? 'trending-down' : 'trending-up'}
                size={13}
                color={isDown ? COLORS.critical : COLORS.success}
              />
              <Text
                style={[
                  styles.trendText,
                  { color: isDown ? COLORS.critical : COLORS.success },
                ]}
              >
                {displayTrend}
              </Text>
            </View>
          )}
          {displaySubtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {displaySubtitle}
            </Text>
          )}
        </View>
      )}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flex: 1,
    minWidth: 140,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  interactiveCard: {
    borderColor: `${COLORS.hospitalBlue}40`,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  value: {
    fontSize: TYPOGRAPHY.xxl,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  trendText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textDim,
    flex: 1,
  },
});

export default StatCard;
