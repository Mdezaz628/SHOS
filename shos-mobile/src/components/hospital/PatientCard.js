// Hospital Patient Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';

export const PatientCard = ({ patient, onPress, style }) => {
  if (!patient) return null;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <Avatar name={patient.name} size={42} roleColor={COLORS.primary} />
        <View style={styles.infoCol}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.uhidText}>UHID: {patient.uhid}</Text>
        </View>
        <StatusBadge status={patient.admissionStatus} size="sm" />
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Age / Gender</Text>
          <Text style={styles.detailValue}>
            {patient.age} yrs • {patient.gender}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Blood Group</Text>
          <Text style={[styles.detailValue, { color: COLORS.criticalDark }]}>
            🩸 {patient.bloodGroup}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Assigned Ward</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {patient.ward || 'Outpatient Clinic'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Consultant</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {patient.consultantDoctor || 'OPD Triage'}
          </Text>
        </View>
      </View>

      {patient.vitals && (
        <View style={styles.vitalsStrip}>
          <View style={styles.vitalBadge}>
            <Text style={styles.vitalLabel}>BP</Text>
            <Text style={styles.vitalVal}>{patient.vitals.bp}</Text>
          </View>
          <View style={styles.vitalBadge}>
            <Text style={styles.vitalLabel}>Pulse</Text>
            <Text style={styles.vitalVal}>{patient.vitals.pulse}</Text>
          </View>
          <View style={styles.vitalBadge}>
            <Text style={styles.vitalLabel}>SpO2</Text>
            <Text style={[styles.vitalVal, { color: COLORS.secondary }]}>{patient.vitals.spo2}</Text>
          </View>
          <View style={styles.vitalBadge}>
            <Text style={styles.vitalLabel}>Temp</Text>
            <Text style={styles.vitalVal}>{patient.vitals.temp}</Text>
          </View>
        </View>
      )}
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
    marginBottom: 12,
  },
  infoCol: {
    flex: 1,
    marginLeft: 10,
  },
  patientName: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  uhidText: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: COLORS.primaryDark,
    fontWeight: TYPOGRAPHY.semibold,
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSubtle,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.bold,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.semibold,
    marginTop: 2,
  },
  vitalsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
  },
  vitalBadge: {
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 9,
    color: COLORS.textDim,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: 'uppercase',
  },
  vitalVal: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginTop: 1,
  },
});

export default PatientCard;
