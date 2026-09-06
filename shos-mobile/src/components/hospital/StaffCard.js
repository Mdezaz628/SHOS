// Hospital Staff Card Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';

export const StaffCard = ({ staff, style }) => {
  if (!staff) return null;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Avatar name={staff.name} size={40} roleColor={COLORS.primary} />
        <View style={styles.infoCol}>
          <Text style={styles.name}>{staff.name}</Text>
          <Text style={styles.dept}>{staff.role} • {staff.department}</Text>
        </View>
        <StatusBadge status={staff.status} size="sm" />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color={COLORS.textDim} />
          <Text style={styles.metaText}>{staff.shift}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="speedometer-outline" size={13} color={COLORS.secondary} />
          <Text style={styles.metaText}>Workload: {staff.workloadScore}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCol: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  dept: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSubtle,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textDim,
    fontWeight: TYPOGRAPHY.medium,
  },
});

export default StaffCard;
