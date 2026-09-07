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
import { Button } from '../../components/common/Button';
import { useHospitalData } from '../../context/HospitalDataContext';

export const QueueScreen = ({ navigation }) => {
  const { liveQueue, updateLiveQueue } = useHospitalData();
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [showDirections, setShowDirections] = useState(false);

  const myToken = 24;
  const currentServing = liveQueue?.currentServing || liveQueue?.currentServingToken || 19;
  const peopleAhead = Math.max(0, myToken - currentServing);
  const estWaitMins = peopleAhead * 7;

  // Simulator button for testing real-time queue advancement
  const advanceQueue = () => {
    const nextToken = currentServing + 1;
    updateLiveQueue({
      ...liveQueue,
      currentServing: nextToken,
    });
    if (chimeEnabled && nextToken >= myToken - 1) {
      Alert.alert(
        '🔔 OPD Chime Notification',
        `Token #${nextToken} called for Room 104. You are next in line! Please proceed to Cabin 104 waiting bench.`
      );
    }
  };

  const steps = [
    { label: 'OPD Check-In', completed: true, icon: 'checkmark-circle' },
    { label: 'Vitals Recorded', completed: true, icon: 'checkmark-circle' },
    { label: 'Waiting Lounge', completed: peopleAhead > 0, active: peopleAhead > 0, icon: 'time' },
    { label: 'Consultation', completed: peopleAhead === 0, active: peopleAhead === 0, icon: 'medkit' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Live OPD Queue Radar"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Token Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.statusIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE CLINICAL QUEUE RADAR</Text>
          </View>

          <View style={styles.tokenRow}>
            <View style={styles.tokenBox}>
              <Text style={styles.tokenBoxLabel}>YOUR TOKEN</Text>
              <Text style={styles.myTokenNum}>#{myToken}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.tokenBox}>
              <Text style={styles.tokenBoxLabel}>NOW CALLING</Text>
              <Text style={styles.currentNum}>#{currentServing}</Text>
            </View>
          </View>

          <View style={styles.waitStatsRow}>
            <View style={styles.waitStatItem}>
              <Ionicons name="people-outline" size={16} color={COLORS.hospitalBlue} />
              <Text style={styles.waitStatVal}>{peopleAhead} Patients</Text>
              <Text style={styles.waitStatLabel}>Ahead of you</Text>
            </View>

            <View style={styles.waitStatItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.hospitalTeal} />
              <Text style={styles.waitStatVal}>~{estWaitMins} mins</Text>
              <Text style={styles.waitStatLabel}>Est. wait time</Text>
            </View>
          </View>
        </Card>

        {/* 4-Step Queue Progress Timeline (Web Parity) */}
        <Text style={styles.sectionHeading}>VISIT STAGE TIMELINE</Text>
        <Card style={styles.timelineCard}>
          <View style={styles.timelineRow}>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.timelineStep}>
                <View
                  style={[
                    styles.stepCircle,
                    step.completed && styles.stepCompleted,
                    step.active && styles.stepActive,
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={14}
                    color={step.completed || step.active ? '#FFF' : COLORS.slate}
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    (step.completed || step.active) && styles.stepLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Doctor & Room Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardHeader}>CONSULTATION DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned Doctor</Text>
            <Text style={styles.detailVal}>{liveQueue.doctorName || 'Dr. Vikram Malhotra'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Clinical Specialty</Text>
            <Text style={styles.detailVal}>{liveQueue.specialty || 'Interventional Cardiology'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>OPD Consultation Room</Text>
            <Text style={[styles.detailVal, { color: COLORS.hospitalBlue, fontWeight: '800' }]}>
              {liveQueue.roomNumber || 'Room OPD-204 (2nd Floor)'}
            </Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>Queue Status</Text>
            <Text style={[styles.detailVal, { color: peopleAhead === 0 ? COLORS.triageGreen : COLORS.hospitalTeal, fontWeight: '800' }]}>
              {peopleAhead === 0 ? 'PLEASE ENTER CONSULTATION ROOM' : 'Waiting in OPD Lobby'}
            </Text>
          </View>
        </Card>

        {/* Indoor Wayfinding Navigation Toggle (Web Parity) */}
        <TouchableOpacity
          style={styles.directionsToggle}
          onPress={() => setShowDirections(!showDirections)}
          activeOpacity={0.8}
        >
          <View style={styles.directionsHeader}>
            <Ionicons name="navigate-circle" size={20} color={COLORS.hospitalBlue} />
            <Text style={styles.directionsTitle}>Indoor Hospital Wayfinding to Room 204</Text>
            <Ionicons
              name={showDirections ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={COLORS.slate}
            />
          </View>
          {showDirections && (
            <View style={styles.directionsBody}>
              <View style={styles.dirStep}>
                <Text style={styles.dirStepNum}>1</Text>
                <Text style={styles.dirStepText}>Take Elevator B to the 2nd Floor.</Text>
              </View>
              <View style={styles.dirStep}>
                <Text style={styles.dirStepNum}>2</Text>
                <Text style={styles.dirStepText}>Turn left past Nursing Station #2.</Text>
              </View>
              <View style={styles.dirStep}>
                <Text style={styles.dirStepNum}>3</Text>
                <Text style={styles.dirStepText}>Room OPD-204 (Cardiology) is the second door on your right.</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Audio Chime Notification Switch */}
        <View style={styles.chimeCard}>
          <View style={styles.chimeIconWrap}>
            <Ionicons name="volume-high" size={20} color={COLORS.hospitalBlue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.chimeTitle}>Audio & Haptic Chime Alerts</Text>
            <Text style={styles.chimeDesc}>Vibrate and sound chime when your token is within 2 slots</Text>
          </View>
          <Switch
            value={chimeEnabled}
            onValueChange={setChimeEnabled}
            trackColor={{ false: '#CBD5E1', true: COLORS.hospitalBlue }}
            thumbColor="#FFF"
          />
        </View>

        {/* Demo Advance Queue Trigger */}
        <Button
          title="Simulate Next Token Called (Advance Queue)"
          variant="outline"
          size="medium"
          icon="arrow-forward-circle-outline"
          onPress={advanceQueue}
          style={styles.simBtn}
        />
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
  heroCard: {
    backgroundColor: COLORS.offWhite,
    borderWidth: 1.5,
    borderColor: COLORS.tealLight,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.triageGreen,
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tokenBox: {
    alignItems: 'center',
  },
  tokenBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  myTokenNum: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
  },
  currentNum: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.navy,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: COLORS.border,
  },
  waitStatsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    justifyContent: 'space-around',
  },
  waitStatItem: {
    alignItems: 'center',
  },
  waitStatVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  waitStatLabel: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 1,
  },
  infoCard: {
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.slate,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  timelineCard: {
    marginBottom: 16,
    paddingVertical: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepCompleted: {
    backgroundColor: COLORS.triageGreen,
  },
  stepActive: {
    backgroundColor: COLORS.hospitalBlue,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.slate,
    textAlign: 'center',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: COLORS.navy,
    fontWeight: '800',
  },
  directionsToggle: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  directionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  directionsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
    flex: 1,
  },
  directionsBody: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  dirStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dirStepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.tealLight,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  dirStepText: {
    fontSize: 12,
    color: COLORS.navy,
    flex: 1,
  },
  chimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  chimeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chimeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
  },
  chimeDesc: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 2,
  },
  simBtn: {
    width: '100%',
    marginBottom: 24,
  },
});
