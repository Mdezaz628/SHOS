import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { MapPlaceholder } from '../../components/hospital/MapPlaceholder';
import { useAuth } from '../../context/AuthContext';

export const AmbulanceDriverDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [missionStep, setMissionStep] = useState(1); // 0: Dispatched, 1: En Route, 2: At Scene, 3: In Transit, 4: Reached Hospital

  const steps = [
    { label: 'Dispatched', icon: 'flash' },
    { label: 'En Route', icon: 'navigate' },
    { label: 'At Scene', icon: 'location' },
    { label: 'In Transit', icon: 'car-sport' },
    { label: 'Reached ER', icon: 'business' },
  ];

  const handleNextStep = () => {
    if (missionStep < steps.length - 1) {
      const next = missionStep + 1;
      setMissionStep(next);
      Alert.alert(
        'Telemetry Updated',
        `Ambulance status updated to: "${steps[next].label}". Notified Hospital Emergency Triage Desk.`
      );
    } else {
      Alert.alert('Mission Complete', 'Patient successfully handed over to Trauma Team. Resetting for next dispatch.');
      setMissionStep(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Ambulance Pilot Terminal"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pilot Shift & Online Switch */}
        <Card style={styles.pilotCard}>
          <View style={styles.pilotRow}>
            <View>
              <Text style={styles.pilotLabel}>CARDIAC MOBILE ICU #08</Text>
              <Text style={styles.pilotName}>{currentUser?.name || 'Rajesh Yadav'}</Text>
              <Text style={styles.pilotMeta}>KA-01-EQ-9042 • EMT Dr. Sen Onboard</Text>
            </View>
            <View style={styles.switchWrap}>
              <Text style={[styles.switchLabel, { color: isOnline ? COLORS.triageGreen : COLORS.slate }]}>
                {isOnline ? 'ON DUTY' : 'OFF DUTY'}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: COLORS.border, true: COLORS.triageGreen }}
                thumbColor={COLORS.cardBg}
              />
            </View>
          </View>
        </Card>

        {/* Live Mission GPS */}
        <MapPlaceholder
          title="Live Emergency Mission Navigation"
          subtitle="Route to Metro Pillar 412, Outer Ring Road • Fast Emergency Clearance"
          height={160}
        />

        {/* Mission Progress Stepper */}
        <Text style={styles.sectionHeading}>EMERGENCY MISSION PROGRESSION</Text>
        <Card style={styles.stepperCard}>
          <View style={styles.stepsRow}>
            {steps.map((s, idx) => {
              const isPast = idx <= missionStep;
              const isCurrent = idx === missionStep;

              return (
                <View key={idx} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      isPast && styles.stepCirclePast,
                      isCurrent && styles.stepCircleCurrent,
                    ]}
                  >
                    <Ionicons
                      name={s.icon}
                      size={14}
                      color={isPast ? COLORS.cardBg : COLORS.slate}
                    />
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCurrent && styles.stepLabelCurrent,
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Step Action Button */}
          <Button
            title={`Advance: Mark ${steps[Math.min(missionStep + 1, steps.length - 1)].label}`}
            variant="danger"
            size="medium"
            icon="arrow-forward-circle"
            onPress={handleNextStep}
            style={styles.advanceBtn}
          />
        </Card>

        {/* Patient Emergency Details */}
        <Text style={styles.sectionHeading}>PATIENT IN-TRANSIT CLINICAL DATA</Text>
        <Card style={styles.patientCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patient Name</Text>
            <Text style={styles.infoVal}>Rahul Sharma (42Y / M)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chief Complaint</Text>
            <Text style={[styles.infoVal, { color: COLORS.triageRed }]}>Acute chest tightness, diaphoresis</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Group</Text>
            <Text style={[styles.infoVal, { fontWeight: '800' }]}>O+ Positive</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Destination ER</Text>
            <Text style={[styles.infoVal, { color: COLORS.hospitalBlue }]}>SHOS Red Trauma Bay 1</Text>
          </View>
        </Card>

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
  pilotCard: {
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.triageRed,
  },
  pilotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pilotLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.triageRed,
    letterSpacing: 0.5,
  },
  pilotName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  pilotMeta: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  switchWrap: {
    alignItems: 'flex-end',
  },
  switchLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 12,
  },
  stepperCard: {
    marginBottom: 14,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepItem: {
    alignItems: 'center',
    width: '19%',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepCirclePast: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  stepCircleCurrent: {
    backgroundColor: COLORS.triageRed,
    borderColor: COLORS.triageRed,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.slate,
    textAlign: 'center',
  },
  stepLabelCurrent: {
    color: COLORS.triageRed,
    fontWeight: '800',
  },
  advanceBtn: {
    width: '100%',
  },
  patientCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.slate,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
});
