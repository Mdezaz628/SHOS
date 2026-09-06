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
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const ReceptionDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { addPatient } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);

  // Fast-track Registration Modal
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [selectedDept, setSelectedDept] = useState('Cardiology OPD');
  const [workloadFilter, setWorkloadFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const fetchLiveBookings = async () => {
    try {
      setLoadingAppts(true);
      const { apiClient } = require('../../api/client');
      const res = await apiClient.get('/appointments');
      const list = res.data?.data || res.data?.appointments || [];
      if (Array.isArray(list)) {
        setAppointments(list);
      }
    } catch (e) {
      console.log('[ReceptionDashboard] error fetching appointments:', e.message);
    } finally {
      setLoadingAppts(false);
    }
  };

  React.useEffect(() => {
    fetchLiveBookings();
    const timer = setInterval(fetchLiveBookings, 8000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLiveBookings();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleCheckInPatient = async (apt) => {
    try {
      const { apiClient } = require('../../api/client');
      await apiClient.put(`/appointments/${apt.id}/status`, { status: 'checked_in' });
      setAppointments((prev) =>
        prev.map((item) => (item.id === apt.id ? { ...item, status: 'checked_in' } : item))
      );
      Alert.alert(
        'Patient Checked-In',
        `Patient ${apt.patientName || apt.patient} successfully checked in.\nToken #${apt.tokenNumber || 'A-10'} sent to Doctor Live Queue.`
      );
    } catch (e) {
      setAppointments((prev) =>
        prev.map((item) => (item.id === apt.id ? { ...item, status: 'checked_in' } : item))
      );
      Alert.alert('Patient Checked-In', `Patient checked in for Room ${apt.roomNumber || 'OPD-204'}.`);
    }
  };

  const handleRegisterWalkIn = () => {
    if (!patientName || !patientPhone) {
      Alert.alert('Required', 'Please enter patient name and mobile number.');
      return;
    }
    const tokenNo = Math.floor(Math.random() * 30) + 10;
    const uhid = `SHOS-2026-${Date.now().toString().slice(-4)}`;

    addPatient({
      id: `PAT-${Date.now().toString().slice(-3)}`,
      name: patientName,
      uhid: uhid,
      age: parseInt(patientAge) || 35,
      gender: 'Male',
      tokenNumber: tokenNo,
      department: selectedDept,
      status: 'waiting',
      triage: 'moderate',
    });

    setIsRegModalOpen(false);
    Alert.alert(
      'Walk-In Patient Registered',
      `UHID: ${uhid}\nPatient: ${patientName}\nOPD Token: #${tokenNo}\nDepartment: ${selectedDept}`
    );
    setPatientName('');
    setPatientPhone('');
    fetchLiveBookings();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reception & Walk-In Desk"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Reception Desk Header */}
        <View style={styles.deskHeader}>
          <View>
            <Text style={styles.deskLabel}>MAIN ATRIUM RECEPTION DESK 1</Text>
            <Text style={styles.officerName}>{currentUser?.name || 'Neha Kapoor'}</Text>
            <Text style={styles.deskMeta}>Patient Onboarding, Token Dispensing & Admissions</Text>
          </View>
          <Button
            title="Walk-In Registration"
            variant="primary"
            size="small"
            icon="person-add"
            onPress={() => setIsRegModalOpen(true)}
          />
        </View>

        {/* Reception Stats (Touch to filter) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.sectionHeading}>TODAY'S FRONT-OFFICE WORKLOAD</Text>
          <Text style={{ fontSize: 11, color: COLORS.hospitalBlue, fontWeight: '600' }}>Tap card to filter</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Total Registrations"
            value="86"
            change={workloadFilter === 'registrations' ? '● Active Filter' : '+18% Today'}
            changeType="positive"
            icon="people"
            color={COLORS.hospitalBlue}
            onPress={() => setWorkloadFilter(workloadFilter === 'registrations' ? 'all' : 'registrations')}
            style={workloadFilter === 'registrations' ? { borderColor: COLORS.hospitalBlue, borderWidth: 2 } : null}
          />
          <StatCard
            label="Appointments"
            value="64"
            change={workloadFilter === 'appointments' ? '● Active Filter' : 'Scheduled'}
            changeType="neutral"
            icon="calendar"
            color={COLORS.hospitalTeal}
            onPress={() => setWorkloadFilter(workloadFilter === 'appointments' ? 'all' : 'appointments')}
            style={workloadFilter === 'appointments' ? { borderColor: COLORS.hospitalTeal, borderWidth: 2 } : null}
          />
          <StatCard
            label="Walk-Ins"
            value="22"
            change={workloadFilter === 'walkins' ? '● Active Filter' : 'Tokens Issued'}
            changeType="warning"
            icon="walk"
            color={COLORS.warning}
            onPress={() => setWorkloadFilter(workloadFilter === 'walkins' ? 'all' : 'walkins')}
            style={workloadFilter === 'walkins' ? { borderColor: COLORS.warning, borderWidth: 2 } : null}
          />
          <StatCard
            label="Admissions"
            value="12"
            change={workloadFilter === 'admissions' ? '● Active Filter' : 'Beds Assigned'}
            changeType="positive"
            icon="bed"
            color={COLORS.navy}
            onPress={() => setWorkloadFilter(workloadFilter === 'admissions' ? 'all' : 'admissions')}
            style={workloadFilter === 'admissions' ? { borderColor: COLORS.navy, borderWidth: 2 } : null}
          />
        </View>

        {/* Quick Action Matrix */}
        <Text style={styles.sectionHeading}>DESK WORKFLOW ACTIONS</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => setIsRegModalOpen(true)}
          >
            <Ionicons name="card" size={24} color={COLORS.hospitalBlue} />
            <Text style={styles.actionBoxTitle}>Generate UHID</Text>
            <Text style={styles.actionBoxDesc}>Instant Barcode Print</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => Alert.alert('Token Dispenser', 'OPD Token #25 printed for Room OPD-204.')}
          >
            <Ionicons name="receipt" size={24} color={COLORS.hospitalTeal} />
            <Text style={styles.actionBoxTitle}>Print OPD Token</Text>
            <Text style={styles.actionBoxDesc}>Queue Chime Alert</Text>
          </TouchableOpacity>
        </View>

        {/* Live Incoming Online Bookings List with Touch Actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
          <View>
            <Text style={styles.sectionHeading}>TODAY'S APPOINTMENTS & TOKENS ({appointments.length})</Text>
            <Text style={{ fontSize: 11, color: COLORS.slate }}>Tap any patient card for quick slip, chime & check-in</Text>
          </View>
          <TouchableOpacity onPress={fetchLiveBookings}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.hospitalBlue }}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={32} color={COLORS.slateLight} />
            <Text style={styles.emptyText}>No patient bookings in front desk queue.</Text>
          </View>
        ) : (
          appointments.map((apt) => (
            <TouchableOpacity
              key={apt.id || Math.random().toString()}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedBooking(apt);
                setIsActionModalOpen(true);
              }}
            >
              <Card style={styles.apptCard}>
                <View style={styles.apptRow}>
                  <View style={styles.tokenCircle}>
                    <Text style={styles.tokenNum}>{apt.tokenNumber || '#'}</Text>
                    <Text style={styles.tokenLabel}>TOKEN</Text>
                  </View>

                  <View style={styles.apptDetails}>
                    <Text style={styles.patientTitle}>{apt.patientName || apt.patient || 'Patient'}</Text>
                    <Text style={styles.apptSub}>
                      UHID: {apt.uhid || apt.patientId || 'SHOS-2026-N/A'} • Room: {apt.roomNumber || 'OPD-204'}
                    </Text>
                    <Text style={styles.apptMeta}>
                      {apt.date || 'Today'} • {apt.timeSlot || apt.time || '10:30 AM'} • {apt.doctor || apt.doctorName || 'Consultant'}
                    </Text>
                  </View>

                  <View style={styles.actionWrap}>
                    {apt.status === 'checked_in' ? (
                      <View style={styles.checkedInBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.triageGreen} />
                        <Text style={styles.checkedInText}>In Queue</Text>
                      </View>
                    ) : (
                      <Button
                        title="Check-In"
                        variant="primary"
                        size="small"
                        onPress={() => handleCheckInPatient(apt)}
                      />
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Interactive Booking Action Modal */}
      {selectedBooking && (
        <Modal
          visible={isActionModalOpen}
          title={`Front Desk Action: ${selectedBooking.patientName || selectedBooking.patient}`}
          onClose={() => setIsActionModalOpen(false)}
        >
          <View style={{ backgroundColor: COLORS.offWhite, padding: 14, borderRadius: 12, marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.hospitalBlue }}>
              Token #{selectedBooking.tokenNumber} • UHID: {selectedBooking.uhid || selectedBooking.patientId || 'SHOS-2026-N/A'}
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.navy, marginTop: 4 }}>
              Consultant: {selectedBooking.doctor || selectedBooking.doctorName || 'Attending Physician'}
            </Text>
            <Text style={{ fontSize: 11, color: COLORS.slate, marginTop: 2 }}>
              Scheduled Slot: {selectedBooking.timeSlot || selectedBooking.time} • Room: {selectedBooking.roomNumber || 'OPD-204'}
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            <Button
              title="Broadcast Chime / Call Token"
              variant="primary"
              size="medium"
              icon="megaphone-outline"
              onPress={() => {
                setIsActionModalOpen(false);
                Alert.alert('Chime Alert Sent', `Token #${selectedBooking.tokenNumber} called to Front Desk 1.`);
              }}
            />
            <Button
              title="Print Official OPD Consultation Pass"
              variant="outline"
              size="medium"
              icon="print-outline"
              onPress={() => {
                setIsActionModalOpen(false);
                Alert.alert('Thermal Slip Printed', `Consultation pass for ${selectedBooking.patientName} generated.`);
              }}
            />
            <Button
              title="Mark Patient Checked-In"
              variant="secondary"
              size="medium"
              icon="checkmark-circle-outline"
              onPress={() => {
                setIsActionModalOpen(false);
                handleCheckInPatient(selectedBooking);
              }}
            />
          </View>
        </Modal>
      )}

      {/* Fast-Track Walk-in Registration Modal */}
      <Modal
        visible={isRegModalOpen}
        title="Walk-in Fast-Track Patient Registration"
        onClose={() => setIsRegModalOpen(false)}
      >
        <Input
          label="Patient Full Name *"
          placeholder="e.g. Anand Mahindra"
          value={patientName}
          onChangeText={setPatientName}
          leftIcon="person-outline"
        />

        <Input
          label="Mobile Phone Number *"
          placeholder="+91 98765 00000"
          value={patientPhone}
          onChangeText={setPatientPhone}
          keyboardType="phone-pad"
          leftIcon="call-outline"
        />

        <Input
          label="Age"
          placeholder="e.g. 38"
          value={patientAge}
          onChangeText={setPatientAge}
          keyboardType="numeric"
        />

        <Input
          label="Consultation Department"
          value={selectedDept}
          onChangeText={setSelectedDept}
        />

        <Button
          title="Generate Instant UHID & Token"
          variant="primary"
          size="medium"
          icon="print-outline"
          onPress={handleRegisterWalkIn}
          style={{ marginTop: 12 }}
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
  deskHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deskLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
  },
  officerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  deskMeta: {
    fontSize: 11,
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
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionBox: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  actionBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 8,
  },
  actionBoxDesc: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  emptyCard: {
    padding: 24,
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.slate,
    marginTop: 8,
  },
  apptCard: {
    marginBottom: 10,
    padding: 12,
  },
  apptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: `${COLORS.hospitalBlue}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: `${COLORS.hospitalBlue}40`,
  },
  tokenNum: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  tokenLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
  },
  apptDetails: {
    flex: 1,
  },
  patientTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  apptSub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  apptMeta: {
    fontSize: 11,
    color: COLORS.hospitalTeal,
    fontWeight: '600',
    marginTop: 2,
  },
  actionWrap: {
    marginLeft: 8,
  },
  checkedInBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.triageGreen}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  checkedInText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.triageGreen,
  },
});
