import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { MapPlaceholder } from '../../components/hospital/MapPlaceholder';

export const AmbulanceTrackingScreen = ({ navigation }) => {
  const [etaMins, setEtaMins] = useState(8);
  const [distanceKm, setDistanceKm] = useState(3.6);
  const [routeProgress, setRouteProgress] = useState(25);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaMins((prev) => (prev > 1 ? prev - 1 : 1));
      setDistanceKm((prev) => (prev > 0.4 ? +(prev - 0.4).toFixed(1) : 0.3));
      setRouteProgress((prev) => (prev < 90 ? prev + 10 : 95));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleCallDriver = () => {
    Alert.alert('Calling Ambulance Driver', 'Connecting to Rajesh Yadav: +91 98765 43217.');
  };

  const handleCallEMT = () => {
    Alert.alert('Calling Paramedic EMT', 'Connecting to EMT Specialist Sister Sunita: +91 98765 43219.');
  };

  const handleCancel = () => {
    Alert.alert('Cancel Emergency Dispatch', 'Are you sure you wish to cancel this ambulance dispatch?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel Dispatch', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Ambulance GPS Radar"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hospital Trauma Team Alerted Banner (Web Parity) */}
        <View style={styles.traumaBanner}>
          <View style={styles.traumaDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.traumaTitle}>Hospital Emergency Resus Bay Pre-Alerted</Text>
            <Text style={styles.traumaDesc}>
              Trauma surgical team and ER Senior Registrar have been briefed on incoming cardiac telemetry.
            </Text>
          </View>
        </View>

        {/* Real-time Map Visual */}
        <MapPlaceholder
          title="GPS Emergency Telemetry Stream"
          subtitle={`Ambulance #08 • Live Satellite Tracking • ${distanceKm} km away`}
          height={200}
        />

        {/* ETA & Status Hero Card */}
        <Card style={styles.etaCard}>
          <View style={styles.etaHeader}>
            <View>
              <Text style={styles.vehicleName}>Cardiac ALS Ambulance #08</Text>
              <Text style={styles.regNo}>KA-01-EQ-9042 • Mobile Intensive Care Unit</Text>
            </View>
            <StatusBadge status="en_route" type="badge" />
          </View>

          {/* Route Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>DISPATCH BASE</Text>
              <Text style={styles.progressLabel}>ARRIVING AT PATIENT</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${routeProgress}%` }]} />
            </View>
          </View>

          <View style={styles.etaRow}>
            <View style={styles.etaBlock}>
              <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
              <Text style={styles.etaValue}>0{etaMins} MINS</Text>
            </View>
            <View style={styles.etaBlock}>
              <Text style={styles.etaLabel}>DISTANCE TO YOU</Text>
              <Text style={styles.distanceValue}>{distanceKm} KM</Text>
            </View>
            <View style={styles.etaBlock}>
              <Text style={styles.etaLabel}>SPEED</Text>
              <Text style={styles.speedValue}>54 km/h</Text>
            </View>
          </View>
        </Card>

        {/* Driver & EMT Card */}
        <Text style={styles.sectionHeading}>FIRST RESPONDER TEAM</Text>
        <Card style={styles.teamCard}>
          <View style={styles.personRow}>
            <View style={styles.personIcon}>
              <Ionicons name="car" size={20} color={COLORS.hospitalBlue} />
            </View>
            <View style={styles.personMeta}>
              <Text style={styles.personRole}>Ambulance Pilot / Driver</Text>
              <Text style={styles.personName}>Rajesh Yadav</Text>
            </View>
            <TouchableOpacity style={styles.callCircle} onPress={handleCallDriver}>
              <Ionicons name="call" size={18} color={COLORS.cardBg} />
            </TouchableOpacity>
          </View>

          <View style={[styles.personRow, { borderBottomWidth: 0, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.borderLight }]}>
            <View style={[styles.personIcon, { backgroundColor: COLORS.tealLight }]}>
              <Ionicons name="fitness" size={20} color={COLORS.hospitalTeal} />
            </View>
            <View style={styles.personMeta}>
              <Text style={styles.personRole}>Emergency Medical Technician (EMT)</Text>
              <Text style={styles.personName}>Sister Sunita (ALS Specialist)</Text>
            </View>
            <TouchableOpacity style={[styles.callCircle, { backgroundColor: COLORS.hospitalTeal }]} onPress={handleCallEMT}>
              <Ionicons name="call" size={18} color={COLORS.cardBg} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Onboard Life-Support Readiness */}
        <Text style={styles.sectionHeading}>ONBOARD LIFE SUPPORT SYSTEMS</Text>
        <Card style={styles.equipmentCard}>
          <View style={styles.equipItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.triageGreen} />
            <Text style={styles.equipText}>Dual 10L O2 Medical Oxygen Cylinders (100% Full)</Text>
          </View>
          <View style={styles.equipItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.triageGreen} />
            <Text style={styles.equipText}>Biphasic Defibrillator & 12-Lead Tele-ECG</Text>
          </View>
          <View style={styles.equipItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.triageGreen} />
            <Text style={styles.equipText}>Emergency Transport Ventilator & Suction</Text>
          </View>
          <View style={styles.equipItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.triageGreen} />
            <Text style={styles.equipText}>IV Infusion Pumps & Resuscitation Kit</Text>
          </View>
        </Card>

        {/* Cancel Button */}
        <Button
          title="Cancel Emergency Dispatch"
          variant="outline"
          size="medium"
          icon="close-circle-outline"
          onPress={handleCancel}
          style={styles.cancelBtn}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  etaCard: {
    marginTop: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  etaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
  },
  regNo: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  etaRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  etaBlock: {
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  etaValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
  },
  speedValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.navy,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  teamCard: {
    marginBottom: 16,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  personMeta: {
    flex: 1,
  },
  personRole: {
    fontSize: 11,
    color: COLORS.slate,
  },
  personName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 1,
  },
  callCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.hospitalBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alsBadge: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alsText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  equipmentCard: {
    marginBottom: 16,
    gap: 8,
  },
  equipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  equipText: {
    fontSize: 12,
    color: COLORS.navy,
  },
  cancelBtn: {
    width: '100%',
    borderColor: COLORS.triageRed,
    marginBottom: 16,
  },
  traumaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    gap: 10,
  },
  traumaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.triageRed,
  },
  traumaTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
  },
  traumaDesc: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 2,
    lineHeight: 15,
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.hospitalBlue,
    borderRadius: 4,
  },
  distanceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.hospitalTeal,
  },
});
