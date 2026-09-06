// Map Placeholder Component with GPS Telemetric Schematic
// Ready to be swapped with react-native-maps / Mapbox later without altering screens.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const MapPlaceholder = ({
  etaMinutes = 8,
  progress = 65,
  pickupLocation = 'Patient Location',
  destinationHospital = 'SHOS Central Hospital',
  speed = '48 km/h',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Schematic Grid Map Simulation */}
      <View style={styles.gridOverlay}>
        <View style={styles.headerRow}>
          <View style={styles.gpsTag}>
            <View style={styles.pulseDot} />
            <Text style={styles.gpsText}>GPS ACTIVE • ACCURACY ±3m • {speed}</Text>
          </View>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>ETA {etaMinutes} MINS</Text>
          </View>
        </View>

        {/* Visual Route Track */}
        <View style={styles.routeTrack}>
          {/* Vertical Connecting Pulse Track */}
          <View style={styles.trackLine}>
            <View style={[styles.activeProgressLine, { height: `${progress}%` }]} />
          </View>

          {/* Destination Pin: Patient */}
          <View style={styles.pinNode}>
            <View style={styles.pinCircleRed}>
              <Ionicons name="location" size={16} color={COLORS.textWhite} />
            </View>
            <View style={styles.pinTextCol}>
              <Text style={styles.pinTitle}>PICKUP LOCATION 📍</Text>
              <Text style={styles.pinSubtitle} numberOfLines={1}>
                {pickupLocation}
              </Text>
            </View>
          </View>

          {/* Dynamic Ambulance Moving Node */}
          <View style={[styles.pinNode, styles.ambulanceNode]}>
            <View style={styles.ambulanceCircle}>
              <Ionicons name="car" size={18} color={COLORS.critical} />
            </View>
            <View style={styles.pinTextCol}>
              <Text style={styles.ambulanceTitle}>CARDIAC MOBILE ICU #08</Text>
              <Text style={styles.ambulanceSub}>Approaching via Ring Road Expressway</Text>
            </View>
          </View>

          {/* Hospital Origin Pin */}
          <View style={styles.pinNode}>
            <View style={styles.pinCircleBlue}>
              <Ionicons name="business" size={16} color={COLORS.textWhite} />
            </View>
            <View style={styles.pinTextCol}>
              <Text style={styles.pinTitle}>DESTINATION BASE 🏥</Text>
              <Text style={styles.pinSubtitle} numberOfLines={1}>
                {destinationHospital}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 14,
  },
  gridOverlay: {
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gpsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  gpsText: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.heavy,
    color: '#38bdf8',
  },
  etaBadge: {
    backgroundColor: COLORS.critical,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  etaText: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.textWhite,
  },
  routeTrack: {
    position: 'relative',
    paddingLeft: 10,
    gap: 24,
  },
  trackLine: {
    position: 'absolute',
    left: 24,
    top: 18,
    bottom: 18,
    width: 3,
    backgroundColor: '#334155',
    borderRadius: 1.5,
  },
  activeProgressLine: {
    width: 3,
    backgroundColor: COLORS.critical,
    borderRadius: 1.5,
  },
  pinNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    zIndex: 2,
  },
  pinCircleRed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.critical,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  pinCircleBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  ambulanceCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  pinTextCol: {
    flex: 1,
  },
  pinTitle: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.heavy,
    color: '#94a3b8',
    letterSpacing: 0.3,
  },
  pinSubtitle: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.semibold,
    color: '#f8fafc',
    marginTop: 1,
  },
  ambulanceTitle: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.heavy,
    color: '#38bdf8',
  },
  ambulanceSub: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 1,
  },
});

export default MapPlaceholder;
