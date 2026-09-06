// Hospital Bed Allocation Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { StatusBadge } from '../common/StatusBadge';

export const BedCard = ({ bed, onPress, style }) => {
  if (!bed) return null;

  const isAvailable = bed.status === 'Available';
  const isOccupied = bed.status === 'Occupied';
  const isReserved = bed.status === 'Reserved';

  const getBorderColor = () => {
    if (isAvailable) return COLORS.success;
    if (isOccupied) return COLORS.critical;
    if (isReserved) return COLORS.warning;
    return COLORS.border;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getBorderColor() }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.bedCodeWrap}>
          <Ionicons
            name="bed-outline"
            size={18}
            color={isAvailable ? COLORS.successDark : isOccupied ? COLORS.criticalDark : COLORS.warningDark}
          />
          <Text style={styles.bedCode}>{bed.code}</Text>
        </View>

        <StatusBadge status={bed.status} size="sm" />
      </View>

      <Text style={styles.wardText}>{bed.ward} • {bed.floor}</Text>
      <Text style={styles.typeText}>{bed.type}</Text>

      {isOccupied ? (
        <View style={styles.patientInfoBox}>
          <Text style={styles.patientLabel}>ADMITTED PATIENT</Text>
          <Text style={styles.patientName}>{bed.patientName}</Text>
          <Text style={styles.uhidText}>UHID: {bed.uhid} • Dr: {bed.doctor}</Text>
        </View>
      ) : isReserved ? (
        <View style={[styles.patientInfoBox, { backgroundColor: COLORS.warningSubtle }]}>
          <Text style={[styles.patientLabel, { color: COLORS.warningDark }]}>RESERVATION NOTICE</Text>
          <Text style={styles.patientName}>{bed.patientName}</Text>
        </View>
      ) : (
        <View style={[styles.patientInfoBox, { backgroundColor: COLORS.successSubtle }]}>
          <Text style={[styles.patientLabel, { color: COLORS.successDark }]}>SANITY & HYGIENE VERIFIED</Text>
          <Text style={[styles.patientName, { color: COLORS.successDark }]}>Ready for Admission</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bedCodeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bedCode: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.text,
  },
  wardText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.medium,
  },
  typeText: {
    fontSize: 10,
    color: COLORS.textDim,
    marginTop: 1,
  },
  patientInfoBox: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  patientLabel: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.textDim,
    textTransform: 'uppercase',
  },
  patientName: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  uhidText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export default BedCard;
