import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useHospitalData } from '../../context/HospitalDataContext';

export const QueueScreen = ({ navigation }) => {
  const { liveQueue, updateLiveQueue } = useHospitalData();

  const myToken = 24;
  const currentServing = liveQueue?.currentServing || liveQueue?.currentServingToken || 19;
  const peopleAhead = Math.max(0, myToken - currentServing);
  const estWaitMins = peopleAhead * 7;

  // Simulator button for testing real-time queue advancement
  const advanceQueue = () => {
    updateLiveQueue({
      ...liveQueue,
      currentServing: currentServing + 1,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Live OPD Queue"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Token Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.statusIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE CLINICAL QUEUE</Text>
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
            <Text style={[styles.detailVal, { color: COLORS.hospitalTeal }]}>
              {peopleAhead === 0 ? 'PLEASE ENTER CONSULTATION ROOM' : 'Waiting in OPD Lobby'}
            </Text>
          </View>
        </Card>

        {/* Queue Protocol Tips */}
        <View style={styles.tipBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.hospitalBlue} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Queue Protocol</Text>
            <Text style={styles.tipDesc}>
              Audio chime and OPD screen announcements activate when your token is within 2 positions. Please remain near Waiting Zone B.
            </Text>
          </View>
        </View>

        {/* Demo Advance Queue Trigger */}
        <Button
          title="Simulate Next Token Called (Demo)"
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
  tipBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.tealLight,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipContent: {
    marginLeft: 12,
    flex: 1,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
    marginBottom: 2,
  },
  tipDesc: {
    fontSize: 11,
    color: COLORS.navy,
    lineHeight: 16,
  },
  simBtn: {
    width: '100%',
    marginBottom: 24,
  },
});
