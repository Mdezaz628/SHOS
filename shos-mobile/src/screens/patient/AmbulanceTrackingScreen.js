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
  const [status, setStatus] = useState('en_route');

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaMins((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCallDriver = () => {
    Alert.alert('Calling Ambulance Driver', 'Connecting to Rajesh Yadav: +91 98765 43217.');
  };

  const handleCancel = () => {
    Alert.alert('Cancel Dispatch', 'Are you sure you wish to cancel this ambulance dispatch?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => navigation.goBack() },
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
        {/* Real-time Map Visual */}
        <MapPlaceholder
          title="GPS Emergency Telemetry Stream"
          subtitle={`Ambulance #08 • Live Satellite Tracking • ETA ~${etaMins} mins`}
          height={200}
        />

        {/* ETA & Status Hero */}
        <Card style={styles.etaCard}>
          <View style={styles.etaHeader}>
            <View>
              <Text style={styles.vehicleName}>Cardiac ALS Ambulance #08</Text>
              <Text style={styles.regNo}>KA-01-EQ-9042 • Mobile ICU</Text>
            </View>
            <StatusBadge status="en_route" type="badge" />
          </View>

          <View style={styles.etaRow}>
            <View style={styles.etaBlock}>
              <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
              <Text style={styles.etaValue}>0{etaMins} MINS</Text>
            </View>
            <View style={styles.etaBlock}>
              <Text style={styles.etaLabel}>CURRENT SPEED</Text>
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
              <Text style={styles.personName}>Sister Sunita / Dr. R. K. Sen</Text>
            </View>
            <View style={styles.alsBadge}>
              <Text style={styles.alsText}>ALS CERTIFIED</Text>
            </View>
          </View>
        </Card>

        {/* Onboard Life-Support Readiness */}
        <Text style={styles.sectionHeading}>ONBOARD LIFE SUPPORT SYSTEMS</Text>
        <Card style={styles.equipmentCard}>
          <View style={styles.equipItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.triageGreen} />
            <Text style={styles.equipText}>Dual 10L O2 Medical Oxygen Cylinders (Full)</Text>
          </View>
          <View style={styles.equipItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.triageGreen} />
            <Text style={styles.equipText}>Biphasic Defibrillator & 12-Lead Tele-ECG</Text>
          </View>
          <View style={styles.equipItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.triageGreen} />
            <Text style={styles.equipText}>Emergency Ventilator & Suction Apparatus</Text>
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
});
