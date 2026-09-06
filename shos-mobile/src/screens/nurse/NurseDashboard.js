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
import { BedCard } from '../../components/hospital/BedCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const NurseDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { beds, updateBedStatus } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);
  const [workloadFilter, setWorkloadFilter] = useState('all'); // all | inpatients | available | vitals | meds

  // Vitals Entry Modal State
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('74');
  const [spo2, setSpo2] = useState('99%');
  const [temp, setTemp] = useState('98.6°F');

  // Dynamic Today's Nursing Workload Roster with Patient Names
  const [nursingWorkload, setNursingWorkload] = useState([
    {
      id: 'NW-01',
      patientName: 'Smt. Kamala Devi',
      uhid: 'SHOS-2026-1142',
      bed: 'ICU Bed 03',
      ward: 'Intensive Care Unit',
      task: 'Hourly Vitals & SpO2 Titration (O2 via Nasal Cannula 3 L/min)',
      dueTime: '11:00 AM',
      type: 'vitals',
      priority: 'STAT High',
      priorityColor: COLORS.triageRed,
      status: 'Due Now',
    },
    {
      id: 'NW-02',
      patientName: 'Mr. Anand Rathi',
      uhid: 'SHOS-2026-3829',
      bed: 'Ward A-102',
      ward: 'Ward A (Stepdown)',
      task: 'IV Ceftriaxone 1g + Paracetamol Infusion Due',
      dueTime: '11:15 AM',
      type: 'meds',
      priority: 'Scheduled Round',
      priorityColor: COLORS.hospitalBlue,
      status: 'Pending Administration',
    },
    {
      id: 'NW-03',
      patientName: 'Sunil Joshi',
      uhid: 'SHOS-2026-4912',
      bed: 'Ward B-205',
      ward: 'Ward B (Post-Surgical)',
      task: 'Post-Operative Abdominal Surgical Dressing & Drain Check',
      dueTime: '11:45 AM',
      type: 'inpatients',
      priority: 'Clinical Routine',
      priorityColor: COLORS.hospitalTeal,
      status: 'Awaiting Dressing Cart',
    },
    {
      id: 'NW-04',
      patientName: 'Mrs. Farah Khan',
      uhid: 'SHOS-2026-7730',
      bed: 'CCU Bed 01',
      ward: 'Cardiac Care Unit',
      task: 'Pre-Meal Capillary Blood Glucose (CBG) & Regular Insulin 6 Units',
      dueTime: '12:00 PM',
      type: 'meds',
      priority: 'Critical Insulin',
      priorityColor: COLORS.warning,
      status: 'Ready for Test',
    },
    {
      id: 'NW-05',
      patientName: 'Rajeev Nair',
      uhid: 'SHOS-2026-9041',
      bed: 'Ward A-105',
      ward: 'Ward A (Stepdown)',
      task: 'Nebulization with Levolin & Budecort (15 mins)',
      dueTime: '12:30 PM',
      type: 'vitals',
      priority: 'Respiratory Care',
      priorityColor: COLORS.hospitalBlue,
      status: 'Scheduled',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const occupiedBeds = (beds || []).filter((b) => b.status === 'occupied').length;
  const availableBeds = (beds || []).filter((b) => b.status === 'available').length;

  const handleOpenVitals = (bedOrPatient) => {
    const name = typeof bedOrPatient === 'string' ? bedOrPatient : (bedOrPatient.patientName || 'Admitted Patient');
    setSelectedPatient(name);
    setIsVitalsModalOpen(true);
  };

  const handleSaveVitals = () => {
    setIsVitalsModalOpen(false);
    Alert.alert('Vitals Recorded', `Bedside nursing vitals for ${selectedPatient} synced to Hospital EHR.`);
    setNursingWorkload((prev) =>
      prev.map((item) =>
        item.patientName === selectedPatient ? { ...item, status: 'Completed (Logged)' } : item
      )
    );
  };

  const handleAdministerMeds = (item) => {
    setNursingWorkload((prev) =>
      prev.map((w) => (w.id === item.id ? { ...w, status: 'Administered & Verified' } : w))
    );
    Alert.alert(
      'Medication Round Confirmed',
      `Administered prescribed dosage to ${item.patientName} (${item.bed}). Marked in Medication Administration Record (MAR).`
    );
  };

  const filteredWorkload = nursingWorkload.filter((item) => {
    if (workloadFilter === 'all') return true;
    if (workloadFilter === 'inpatients') return item.type === 'inpatients';
    if (workloadFilter === 'vitals') return item.type === 'vitals';
    if (workloadFilter === 'meds') return item.type === 'meds';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Nursing Officer Station"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Nurse Shift Header */}
        <View style={styles.shiftHeader}>
          <View>
            <Text style={styles.shiftLabel}>WARD A & ICU • MORNING SHIFT (08:00 - 16:00)</Text>
            <Text style={styles.nurseName}>{currentUser?.name || 'Sister Priya Nair, B.Sc Nursing'}</Text>
            <Text style={styles.shiftMeta}>Critical Care & Ward Telemetry In-Charge</Text>
          </View>
        </View>

        {/* Stats Grid (Touch to filter workload) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>WARD CENSUS & WORKLOAD</Text>
          <Text style={styles.tapHint}>Tap card to filter</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Inpatients"
            value={occupiedBeds.toString()}
            change={workloadFilter === 'inpatients' ? '● Active Filter' : 'Ward A Census'}
            changeType="neutral"
            icon="bed"
            color={COLORS.hospitalBlue}
            onPress={() => setWorkloadFilter(workloadFilter === 'inpatients' ? 'all' : 'inpatients')}
            style={workloadFilter === 'inpatients' ? styles.activeFilterCard : null}
          />
          <StatCard
            label="Available Beds"
            value={availableBeds.toString()}
            change="Ready for Intake"
            changeType="positive"
            icon="checkmark-circle"
            color={COLORS.triageGreen}
            onPress={() => navigation.navigate('WardView')}
          />
          <StatCard
            label="Vitals Due"
            value={nursingWorkload.filter(w => w.type === 'vitals').length.toString()}
            change={workloadFilter === 'vitals' ? '● Active Filter' : 'Next 30 mins'}
            changeType="negative"
            icon="pulse"
            color={COLORS.warning}
            onPress={() => setWorkloadFilter(workloadFilter === 'vitals' ? 'all' : 'vitals')}
            style={workloadFilter === 'vitals' ? styles.activeFilterCard : null}
          />
          <StatCard
            label="Meds Round"
            value={nursingWorkload.filter(w => w.type === 'meds').length.toString()}
            change={workloadFilter === 'meds' ? '● Active Filter' : '11:00 AM Round'}
            changeType="neutral"
            icon="medical"
            color={COLORS.hospitalTeal}
            onPress={() => setWorkloadFilter(workloadFilter === 'meds' ? 'all' : 'meds')}
            style={workloadFilter === 'meds' ? styles.activeFilterCard : null}
          />
        </View>

        {/* Interactive Today's Nursing Workload Roster */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionHeading}>
              TODAY'S CLINICAL NURSING WORKLOAD ({filteredWorkload.length})
            </Text>
            <Text style={styles.listSub}>Tap card for vitals logging, IV admin & dressing notes</Text>
          </View>
          {workloadFilter !== 'all' && (
            <TouchableOpacity onPress={() => setWorkloadFilter('all')}>
              <Text style={styles.resetFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredWorkload.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => handleOpenVitals(item.patientName)}
          >
            <Card style={styles.workloadCard}>
              <View style={styles.cardHeader}>
                <View style={styles.bedBadge}>
                  <Text style={styles.bedBadgeText}>{item.bed}</Text>
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientTitle}>{item.patientName}</Text>
                  <Text style={styles.patientMeta}>
                    {item.uhid} • {item.ward} • Due: {item.dueTime}
                  </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: `${item.priorityColor}18` }]}>
                  <Text style={[styles.priorityText, { color: item.priorityColor }]}>
                    {item.priority}
                  </Text>
                </View>
              </View>

              <View style={styles.taskDetailBox}>
                <Ionicons name="clipboard-outline" size={14} color={COLORS.hospitalBlue} />
                <Text style={styles.taskText}>{item.task}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.statusIndicator}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          item.status.includes('Completed') || item.status.includes('Administered')
                            ? COLORS.triageGreen
                            : COLORS.warning,
                      },
                    ]}
                  />
                  <Text style={styles.statusLabel}>{item.status}</Text>
                </View>

                <View style={styles.actionBtns}>
                  <TouchableOpacity
                    style={styles.logVitalsBtn}
                    onPress={() => handleOpenVitals(item.patientName)}
                  >
                    <Ionicons name="pulse" size={13} color={COLORS.hospitalBlue} />
                    <Text style={styles.logVitalsText}>Log Vitals</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.administerBtn}
                    onPress={() => handleAdministerMeds(item)}
                  >
                    <Ionicons name="checkmark" size={13} color={COLORS.cardBg} />
                    <Text style={styles.administerText}>Administer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Beds Census & Fast Action */}
        <View style={[styles.sectionHeaderRow, { marginTop: 14 }]}>
          <Text style={styles.sectionHeading}>INPATIENT BEDS UNDER SUPERVISION</Text>
          <TouchableOpacity onPress={() => navigation.navigate('WardView')}>
            <Text style={styles.linkText}>View Ward Map</Text>
          </TouchableOpacity>
        </View>

        {beds.slice(0, 4).map((bed) => (
          <View key={bed.id} style={styles.bedItemWrap}>
            <BedCard bed={bed} onPress={() => handleOpenVitals(bed)} />
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Bedside Vitals Entry Modal */}
      <Modal
        visible={isVitalsModalOpen}
        title={`Bedside Vitals: ${selectedPatient}`}
        onClose={() => setIsVitalsModalOpen(false)}
      >
        <View style={styles.modalRow}>
          <View style={styles.halfInput}>
            <Input
              label="Blood Pressure"
              value={bp}
              onChangeText={setBp}
              placeholder="120/80"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Pulse (bpm)"
              value={pulse}
              onChangeText={setPulse}
              placeholder="72"
            />
          </View>
        </View>

        <View style={styles.modalRow}>
          <View style={styles.halfInput}>
            <Input
              label="SpO2 Level"
              value={spo2}
              onChangeText={setSpo2}
              placeholder="98%"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Temperature"
              value={temp}
              onChangeText={setTemp}
              placeholder="98.6°F"
            />
          </View>
        </View>

        <Button
          title="Save & Transmit to Hospital EHR"
          variant="primary"
          size="medium"
          icon="save"
          onPress={handleSaveVitals}
          style={{ marginTop: 14 }}
        />
      </Modal>
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
  shiftHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  shiftLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
  },
  nurseName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  shiftMeta: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tapHint: {
    fontSize: 11,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  activeFilterCard: {
    borderColor: COLORS.hospitalBlue,
    borderWidth: 2,
    backgroundColor: `${COLORS.hospitalBlue}08`,
  },
  listSub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  resetFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  workloadCard: {
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bedBadge: {
    backgroundColor: `${COLORS.hospitalBlue}15`,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  patientInfo: {
    flex: 1,
  },
  patientTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  patientMeta: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  taskDetailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.offWhite,
    padding: 9,
    borderRadius: 8,
    marginTop: 10,
  },
  taskText: {
    fontSize: 12,
    color: COLORS.navy,
    fontWeight: '600',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: COLORS.slate,
    fontWeight: '600',
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  logVitalsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${COLORS.hospitalBlue}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logVitalsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  administerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.hospitalBlue,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  administerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cardBg,
  },
  bedItemWrap: {
    marginBottom: 14,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
});

export default NurseDashboard;
