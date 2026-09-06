// Hospital Ambulance Telemetry Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { StatusBadge } from '../common/StatusBadge';

export const AmbulanceCard = ({ ambulance, onCallDriver, onTrack, style }) => {
  if (!ambulance) return null;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.badgeWrap}>
          <Ionicons name="car-sport" size={18} color={COLORS.primary} />
          <Text style={styles.vehicleNum}>{ambulance.vehicleNumber}</Text>
        </View>
        <StatusBadge status={ambulance.status} size="sm" />
      </View>

      <Text style={styles.callSign}>{ambulance.callSign}</Text>
      <Text style={styles.typeText}>{ambulance.type}</Text>

      <View style={styles.middleStrip}>
        <View style={styles.stripItem}>
          <Text style={styles.stripLabel}>Pilot / Driver</Text>
          <Text style={styles.stripVal}>{ambulance.driverName}</Text>
        </View>
        <View style={styles.stripItem}>
          <Text style={styles.stripLabel}>EMT Lead</Text>
          <Text style={styles.stripVal}>{ambulance.emtName}</Text>
        </View>
        <View style={styles.stripItem}>
          <Text style={styles.stripLabel}>ETA Status</Text>
          <Text style={[styles.stripVal, { color: COLORS.criticalDark }]}>
            {ambulance.etaMinutes > 0 ? `${ambulance.etaMinutes} mins` : 'Base Ready'}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        {onCallDriver && (
          <TouchableOpacity style={styles.callBtn} onPress={onCallDriver} activeOpacity={0.7}>
            <Ionicons name="call" size={14} color={COLORS.secondaryDark} />
            <Text style={styles.callBtnText}>Call Pilot ({ambulance.driverPhone})</Text>
          </TouchableOpacity>
        )}

        {onTrack && (
          <TouchableOpacity style={styles.trackBtn} onPress={onTrack} activeOpacity={0.7}>
            <Ionicons name="navigate" size={14} color={COLORS.primary} />
            <Text style={styles.trackBtnText}>Live Route</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleNum: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.heavy,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: COLORS.text,
  },
  callSign: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primaryDark,
  },
  typeText: {
    fontSize: 11,
    color: COLORS.textDim,
    marginTop: 2,
  },
  middleStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  stripItem: {
    flex: 1,
  },
  stripLabel: {
    fontSize: 9,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.bold,
  },
  stripVal: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.secondarySubtle,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  callBtnText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.secondaryDark,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySubtle,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  trackBtnText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
});

export default AmbulanceCard;
