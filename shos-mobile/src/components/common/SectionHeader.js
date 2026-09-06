// Reusable Section Header Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const SectionHeader = ({
  title,
  subtitle,
  actionTitle,
  onAction,
  icon,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleColumn}>
        <View style={styles.titleRow}>
          {icon && (
            <Ionicons name={icon} size={18} color={COLORS.primary} style={styles.icon} />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {actionTitle && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={styles.actionBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>{actionTitle}</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  titleColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  title: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textDim,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
});

export default SectionHeader;
