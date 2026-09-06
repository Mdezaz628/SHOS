import React, { useState, useEffect, useCallback } from 'react';
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
import { Modal } from '../../components/common/Modal';
import { PatientCard } from '../../components/hospital/PatientCard';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const DoctorDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { patients, appointments, liveQueue, updateLiveQueue } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);
  const [liveAppointments, setLiveAppointments] = useState([]);
  const [workloadFilter, setWorkloadFilter] = useState('all'); // all | appointments | waiting | emergency | reports
  const [selectedCase, setSelectedCase] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Dynamic Today's Clinical Workload Cases with Full Names & Interactive Workflows
  const [workloadCases, setWorkloadCases] = useState([
    {
      id: 'WL-DOC-01',
      patientName: 'Ramesh Chand Verma',
      uhid: 'SHOS-2026-8942',
      age: 58,
      gender: 'M',
      timeSlot: '10:00 AM',
      type: 'emergency',
      chiefComplaint: 'Acute Sub-sternal Chest Pain • Radiating to Left Arm',
      urgency: 'Emergency / STAT',
      urgencyColor: COLORS.triageRed,
      status: 'Waiting in Triage',
      room: 'OPD-204',
      token: 41,
    },
    {
      id: 'WL-DOC-02',
      patientName: 'Ananya Deshmukh',
      uhid: 'SHOS-2026-9014',
      age: 34,
      gender: 'F',
      timeSlot: '10:20 AM',
      type: 'waiting',
      chiefComplaint: 'Post-CABG Follow-up • Beta-blocker Dosage Review',
      urgency: 'Follow-up',
      urgencyColor: COLORS.hospitalBlue,
      status: 'In Waiting Bay',
      room: 'OPD-204',
      token: 42,
    },
    {
      id: 'WL-DOC-03',
      patientName: 'Vikram Patel',
      uhid: 'SHOS-2026-7831',
      age: 49,
      gender: 'M',
      timeSlot: '10:45 AM',
      type: 'appointments',
      chiefComplaint: 'Uncontrolled Hypertension • BP 168/104 mmHg',
      urgency: 'High Priority',
      urgencyColor: COLORS.warning,
      status: 'Registered Walk-in',
      room: 'OPD-204',
      token: 43,
    },
    {
      id: 'WL-DOC-04',
      patientName: 'Pooja Hegde',
      uhid: 'SHOS-2026-6419',
      age: 27,
      gender: 'F',
      timeSlot: '11:15 AM',
      type: 'reports',
      chiefComplaint: '2D Echocardiogram & Lipid Profile Review',
      urgency: 'Lab Review',
      urgencyColor: COLORS.hospitalTeal,
      status: 'Reports Uploaded',
      room: 'OPD-204',
      token: 44,
    },
    {
      id: 'WL-DOC-05',
      patientName: 'Mohd. Tariq Khan',
      uhid: 'SHOS-2026-5120',
      age: 62,
      gender: 'M',
      timeSlot: '11:30 AM',
      type: 'waiting',
      chiefComplaint: 'Shortness of Breath on Exertion (NYHA Class II)',
      urgency: 'Normal OPD',
      urgencyColor: COLORS.hospitalBlue,
      status: 'Token Dispensed',
      room: 'OPD-204',
      token: 45,
    },
  ]);

  const fetchDoctorQueue = async () => {
    try {
      const { apiClient } = require('../../api/client');
      const res = await apiClient.get('/appointments');
      const list = res.data?.data || res.data?.appointments || [];
      if (Array.isArray(list) && list.length > 0) {
        setLiveAppointments(list);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchDoctorQueue();
    const interval = setInterval(fetchDoctorQueue, 8000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDoctorQueue();
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const waitingPatients = (patients || []).filter((p) => p.status === 'waiting' || p.status === 'in_consultation');
  const emergencyCases = (patients || []).filter((p) => p.triage === 'critical');

  const callNextPatient = () => {
    const nextServing = (liveQueue.currentServing || 41) + 1;
    updateLiveQueue({
      ...liveQueue,
      currentServing: nextServing,
    });
    const nextCase = workloadCases.find((c) => c.token === nextServing) || workloadCases[0];
    const name = nextCase ? nextCase.patientName : `Patient #${nextServing}`;
    Alert.alert('Chime Alert & Station Broadcast', `Calling Token #${nextServing}: ${name} to OPD Room 204.`);
  };

  const handleTouchCase = (item) => {
    setSelectedCase(item);
    setIsActionModalOpen(true);
  };

  const handleStartConsultation = (item) => {
    setIsActionModalOpen(false);
    setWorkloadCases((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, status: 'In Active Consultation' } : c))
    );
    const matchedPatient = (patients || []).find((p) => p.name === item.patientName) || {
      id: item.uhid,
      name: item.patientName,
      uhid: item.uhid,
      age: item.age,
      gender: item.gender,
      chiefComplaint: item.chiefComplaint,
      triage: item.type === 'emergency' ? 'critical' : 'normal',
    };
    navigation.navigate('PatientClinicalView', { patient: matchedPatient });
  };

  const handleCallTokenForCase = (item) => {
    setIsActionModalOpen(false);
    updateLiveQueue({
      ...liveQueue,
      currentServing: item.token,
    });
    Alert.alert('Chime Station Broadcast', `Token #${item.token} (${item.patientName}) called to OPD Room 204.`);
  };

  const handleOrderTests = (item) => {
    setIsActionModalOpen(false);
    Alert.alert('Diagnostic Test Requisition', `STAT 12-Lead ECG & Cardiac Troponin-I requisition created for ${item.patientName} (${item.uhid}). Sent to Central Pathology Lab.`);
  };

  const handleMarkAttended = (item) => {
    setIsActionModalOpen(false);
    setWorkloadCases((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, status: 'Consultation Complete' } : c))
    );
    Alert.alert('Consultation Completed', `Clinical encounter closed for ${item.patientName}. Digital prescription synced.`);
  };

  const filteredCases = workloadCases.filter((c) => {
    if (workloadFilter === 'all') return true;
    if (workloadFilter === 'appointments') return c.type === 'appointments';
    if (workloadFilter === 'waiting') return c.type === 'waiting';
    if (workloadFilter === 'emergency') return c.type === 'emergency';
    if (workloadFilter === 'reports') return c.type === 'reports';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Consultant Clinical Terminal"
        navigation={navigation}
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Doctor Header Banner */}
        <View style={styles.docHeader}>
          <View style={styles.docInfo}>
            <Text style={styles.docGreeting}>OPD Station • Room 204</Text>
            <Text style={styles.docName}>{currentUser?.name || 'Dr. Vikram Malhotra'}</Text>
            <Text style={styles.docSub}>Sr. Consultant Interventional Cardiology • Cardia Desk</Text>
          </View>

          {/* Quick Call Next Token Button */}
          <TouchableOpacity style={styles.callNextBtn} onPress={callNextPatient} activeOpacity={0.8}>
            <Ionicons name="megaphone" size={18} color={COLORS.cardBg} />
            <Text style={styles.callNextText}>Call Next (#{ (liveQueue.currentServing || 41) + 1 })</Text>
          </TouchableOpacity>
        </View>

        {/* Workload Stats Grid (Touch to Filter) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>TODAY'S CLINICAL WORKLOAD</Text>
          <Text style={styles.tapHint}>Tap any card to filter</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="All Cases"
            value={workloadCases.length.toString()}
            change={workloadFilter === 'all' ? '● Active Filter' : 'Tap to View'}
            changeType="positive"
            icon="layers"
            color={COLORS.navy}
            onPress={() => setWorkloadFilter('all')}
            style={workloadFilter === 'all' ? styles.activeFilterCard : null}
          />
          <StatCard
            label="In Waiting OPD"
            value={workloadCases.filter(c => c.type === 'waiting').length.toString()}
            change={workloadFilter === 'waiting' ? '● Active Filter' : 'Queue Active'}
            changeType="positive"
            icon="time"
            color={COLORS.hospitalTeal}
            onPress={() => setWorkloadFilter('waiting')}
            style={workloadFilter === 'waiting' ? styles.activeFilterCard : null}
          />
          <StatCard
            label="Emergency Cases"
            value={workloadCases.filter(c => c.type === 'emergency').length.toString()}
            change={workloadFilter === 'emergency' ? '● Active Filter' : 'STAT Urgent'}
            changeType="negative"
            icon="warning"
            color={COLORS.triageRed}
            onPress={() => setWorkloadFilter('emergency')}
            style={workloadFilter === 'emergency' ? styles.activeFilterCard : null}
          />
          <StatCard
            label="Pending Reports"
            value={workloadCases.filter(c => c.type === 'reports').length.toString()}
            change={workloadFilter === 'reports' ? '● Active Filter' : 'Diagnostics'}
            changeType="neutral"
            icon="flask"
            color={COLORS.warning}
            onPress={() => setWorkloadFilter('reports')}
            style={workloadFilter === 'reports' ? styles.activeFilterCard : null}
          />
        </View>

        {/* Queue Calling Action Strip */}
        <Card style={styles.queueStrip}>
          <View style={styles.queueRow}>
            <View>
              <Text style={styles.queueLabel}>NOW CONSULTING IN OPD-204</Text>
              <Text style={styles.tokenDisplay}>Token #{liveQueue.currentServing || 41}</Text>
            </View>
            <Button
              title="Next Token"
              variant="primary"
              size="small"
              icon="arrow-forward"
              onPress={callNextPatient}
            />
          </View>
        </Card>

        {/* Interactive Today's Workload Patient List */}
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionHeading}>
              TODAY'S PATIENT WORKLOAD ({filteredCases.length})
            </Text>
            <Text style={styles.listSub}>Tap patient card for consultation, Rx & orders</Text>
          </View>
          {workloadFilter !== 'all' && (
            <TouchableOpacity onPress={() => setWorkloadFilter('all')}>
              <Text style={styles.resetFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredCases.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => handleTouchCase(item)}
          >
            <Card style={styles.workloadCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenText}>#{item.token}</Text>
                </View>
                <View style={styles.nameWrap}>
                  <Text style={styles.patientName}>{item.patientName}</Text>
                  <Text style={styles.patientSub}>
                    {item.uhid} • {item.age}y/{item.gender} • Slot: {item.timeSlot}
                  </Text>
                </View>
                <View style={[styles.urgencyBadge, { backgroundColor: `${item.urgencyColor}18` }]}>
                  <Text style={[styles.urgencyText, { color: item.urgencyColor }]}>
                    {item.urgency}
                  </Text>
                </View>
              </View>

              <View style={styles.complaintRow}>
                <Ionicons name="medkit-outline" size={14} color={COLORS.slate} />
                <Text style={styles.complaintText} numberOfLines={2}>
                  {item.chiefComplaint}
                </Text>
              </View>

              <View style={styles.cardActionsRow}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: item.status.includes('Complete') ? COLORS.triageGreen : COLORS.warning }]} />
                  <Text style={styles.statusLabel}>{item.status}</Text>
                </View>
                <View style={styles.btnGroup}>
                  <TouchableOpacity
                    style={styles.quickCallBtn}
                    onPress={() => handleCallTokenForCase(item)}
                  >
                    <Ionicons name="megaphone-outline" size={14} color={COLORS.hospitalBlue} />
                    <Text style={styles.quickBtnText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.consultBtn}
                    onPress={() => handleStartConsultation(item)}
                  >
                    <Ionicons name="stethoscope" size={14} color={COLORS.cardBg} />
                    <Text style={styles.consultBtnText}>Consult</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Waiting Patients General Queue */}
        <View style={[styles.listHeader, { marginTop: 14 }]}>
          <Text style={styles.sectionHeading}>HOSPITAL CLINICAL DIRECTORY ({patients.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorPatientList')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {patients.slice(0, 3).map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onPress={() => navigation.navigate('PatientClinicalView', { patient })}
          />
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Interactive Quick Consultation Modal */}
      {selectedCase && (
        <Modal
          visible={isActionModalOpen}
          title={`Clinical Encounter: ${selectedCase.patientName}`}
          onClose={() => setIsActionModalOpen(false)}
        >
          <View style={styles.modalInfoBox}>
            <Text style={styles.modalUhid}>UHID: {selectedCase.uhid} • Token #{selectedCase.token}</Text>
            <Text style={styles.modalComplaintHeader}>Chief Clinical Presentation:</Text>
            <Text style={styles.modalComplaint}>{selectedCase.chiefComplaint}</Text>
            <Text style={styles.modalMeta}>Scheduled Slot: {selectedCase.timeSlot} • Station: {selectedCase.room}</Text>
          </View>

          <View style={styles.modalActions}>
            <Button
              title="Begin Clinical Consultation"
              variant="primary"
              size="medium"
              icon="stethoscope"
              onPress={() => handleStartConsultation(selectedCase)}
            />
            <Button
              title="Call Patient to OPD-204 (Chime)"
              variant="outline"
              size="medium"
              icon="megaphone-outline"
              onPress={() => handleCallTokenForCase(selectedCase)}
            />
            <Button
              title="Order STAT Laboratory / ECG Tests"
              variant="outline"
              size="medium"
              icon="flask-outline"
              onPress={() => handleOrderTests(selectedCase)}
            />
            <Button
              title="Mark Encounter Completed"
              variant="secondary"
              size="medium"
              icon="checkmark-done"
              onPress={() => handleMarkAttended(selectedCase)}
            />
          </View>
        </Modal>
      )}
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
  docHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  docInfo: {
    marginBottom: 12,
  },
  docGreeting: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  docName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  docSub: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  callNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.hospitalBlue,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  callNextText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cardBg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
  },
  tapHint: {
    fontSize: 11,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
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
  queueStrip: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalTeal,
  },
  queueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
  },
  tokenDisplay: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
    marginTop: 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  workloadCard: {
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tokenBadge: {
    backgroundColor: `${COLORS.hospitalBlue}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tokenText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  nameWrap: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  patientSub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '800',
  },
  complaintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.offWhite,
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  complaintText: {
    fontSize: 12,
    color: COLORS.navy,
    fontWeight: '600',
    flex: 1,
  },
  cardActionsRow: {
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
  btnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  quickCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${COLORS.hospitalBlue}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  consultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.hospitalBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  consultBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cardBg,
  },
  modalInfoBox: {
    backgroundColor: COLORS.offWhite,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalUhid: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    marginBottom: 6,
  },
  modalComplaintHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate,
  },
  modalComplaint: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
    marginVertical: 4,
  },
  modalMeta: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 4,
  },
  modalActions: {
    gap: 10,
  },
});

export default DoctorDashboard;
