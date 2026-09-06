// Hospital Doctor / Specialist Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export const DoctorCard = ({ doctor, onBook, onPress, style }) => {
  if (!doctor) return null;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <Avatar name={doctor.name} size={48} roleColor={COLORS.primary} image={doctor.avatar} />
        <View style={styles.infoCol}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.department} numberOfLines={1}>
            {doctor.department}
          </Text>
          <Text style={styles.qualification} numberOfLines={1}>
            {doctor.qualification}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color={COLORS.secondary} />
          <Text style={styles.metaText}>{doctor.experience}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="star" size={13} color="#eab308" />
          <Text style={styles.metaText}>{doctor.rating} Rating</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="cash-outline" size={13} color={COLORS.primary} />
          <Text style={styles.metaText}>{doctor.consultationFee}</Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.locationWrap}>
          <Ionicons name="location-outline" size={14} color={COLORS.textDim} />
          <Text style={styles.locationText}>{doctor.opdRoom}</Text>
        </View>

        {onBook && (
          <Button
            title="Book Consult"
            onPress={onBook}
            size="sm"
            variant="primary"
            icon="calendar-outline"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  department: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.primary,
    marginTop: 2,
  },
  qualification: {
    fontSize: 11,
    color: COLORS.textDim,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceSubtle,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.medium,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.medium,
  },
});

export default DoctorCard;
