import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const HousekeepingDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { beds, updateBedStatus } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const cleaningBeds = (Array.isArray(beds) ? beds : []).filter((b) => b.status === 'cleaning');

  const handleCompleteCleaning = (bed) => {
    updateBedStatus(bed.id, 'available');
    Alert.alert(
      'Bed Sanitized & Certified',
      `${bed.number} (${bed.ward}) has been terminally disinfected and is now AVAILABLE for new patient admissions.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Sanitization & Hygiene Terminal"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Card */}
        <View style={styles.profileHeader}>
          <Text style={styles.stationLabel}>WARD HYGIENE & INFECTION CONTROL</Text>
          <Text style={styles.workerName}>{currentUser?.name || 'Deepak Verma'}</Text>
          <Text style={styles.stationSub}>Assigned Zone: Inpatient Floor 2 & Critical Units</Text>
        </View>

        {/* Stats (Touch to interact) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.sectionHeading}>SANITIZATION METRICS</Text>
          <Text style={{ fontSize: 11, color: COLORS.hospitalBlue, fontWeight: '600' }}>Interactive Pipeline</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            label="Turnover Due"
            value={cleaningBeds.length.toString()}
            change="Pending Work"
            changeType="warning"
            icon="sparkles"
            color={COLORS.warning}
            onPress={() => Alert.alert('Turnover Workload', `${cleaningBeds.length} beds flagged for terminal sanitation and sterilization.`)}
          />
          <StatCard
            label="Sanitized Today"
            value="14"
            change="Sterilized & Ready"
            changeType="positive"
            icon="checkmark-circle"
            color={COLORS.triageGreen}
            onPress={() => Alert.alert('Sanitization Record', '14 inpatient beds sterilized today. NABH infection control audit cleared.')}
          />
          <StatCard
            label="Avg Turnover"
            value="18 min"
            change="NABH Benchmark"
            changeType="positive"
            icon="time"
            color={COLORS.hospitalBlue}
            onPress={() => Alert.alert('Performance Benchmark', 'Hospital bed turnover turnaround: 18 minutes (Target: <25 mins).')}
          />
        </View>

        {/* Turnover Queue */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View>
            <Text style={styles.sectionHeading}>BED TURNOVER REQUISITIONS ({cleaningBeds.length})</Text>
            <Text style={{ fontSize: 11, color: COLORS.slate }}>Tap card to certify decontamination and release bed</Text>
          </View>
        </View>

        {cleaningBeds.length > 0 ? (
          cleaningBeds.map((bed) => (
            <Card key={bed.id} style={styles.cleaningCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.bedTitle}>{bed.number} — {bed.ward}</Text>
                  <Text style={styles.bedMeta}>Discharged: 25 mins ago • Terminal Disinfection Required</Text>
                </View>
                <StatusBadge status="cleaning" type="badge" />
              </View>

              <View style={styles.checklist}>
                <View style={styles.checkItem}>
                  <Ionicons name="checkbox" size={16} color={COLORS.hospitalTeal} />
                  <Text style={styles.checkText}>Linen stripped & biohazard autoclaved</Text>
                </View>
                <View style={styles.checkItem}>
                  <Ionicons name="checkbox" size={16} color={COLORS.hospitalTeal} />
                  <Text style={styles.checkText}>Surface fumigation & telemetry wiping</Text>
                </View>
              </View>

              <Button
                title="Certify Sanitized & Release Bed"
                variant="primary"
                size="medium"
                icon="checkmark-done"
                onPress={() => handleCompleteCleaning(bed)}
                style={styles.certifyBtn}
              />
            </Card>
          ))
        ) : (
          <Card style={styles.allCleanCard}>
            <Ionicons name="shield-checkmark" size={36} color={COLORS.triageGreen} />
            <Text style={styles.allCleanTitle}>All Wards Sanitized</Text>
            <Text style={styles.allCleanSub}>No pending bed turnover requests currently active.</Text>
          </Card>
        )}

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
  profileHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  stationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  stationSub: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  cleaningCard: {
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  bedMeta: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  checklist: {
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 12,
    color: COLORS.navy,
  },
  certifyBtn: {
    width: '100%',
  },
  allCleanCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  allCleanTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 10,
  },
  allCleanSub: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 4,
    textAlign: 'center',
  },
});
