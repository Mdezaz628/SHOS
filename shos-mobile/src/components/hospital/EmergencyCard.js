// Prominent Emergency SOS Hotline & Dispatch Banner Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const EmergencyCard = ({ onRequestAmbulance, onCallEmergency, onEmergencyContact, style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <View style={styles.alertIconPulse}>
            <Ionicons name="warning" size={20} color={COLORS.textWhite} />
          </View>
          <View>
            <Text style={styles.title}>EMERGENCY SOS (24x7)</Text>
            <Text style={styles.subtitle}>STAT Trauma Hotline: 108 / (011) 2940-1000</Text>
          </View>
        </View>
      </View>

      <Text style={styles.descText}>
        Immediate cardiac, stroke, poly-trauma, or acute respiratory distress dispatch.
      </Text>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.btnAmbulance}
          onPress={onRequestAmbulance}
          activeOpacity={0.8}
        >
          <Ionicons name="car" size={16} color={COLORS.textWhite} />
          <Text style={styles.btnAmbulanceText}>Request Ambulance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnCall}
          onPress={onCallEmergency}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={15} color={COLORS.criticalDark} />
          <Text style={styles.btnCallText}>Call 108</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff1f2',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fecdd3',
    padding: 16,
    marginBottom: 14,
    shadowColor: COLORS.critical,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertIconPulse: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.critical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.criticalDark,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#9f1239',
    marginTop: 1,
    fontWeight: TYPOGRAPHY.semibold,
  },
  descText: {
    fontSize: 11,
    color: '#881337',
    lineHeight: 16,
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnAmbulance: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.critical,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  btnAmbulanceText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.textWhite,
  },
  btnCall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 4,
  },
  btnCallText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.criticalDark,
  },
});

export default EmergencyCard;
