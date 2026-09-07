import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AppointmentCard } from '../../components/hospital/AppointmentCard';
import { QueueCard } from '../../components/hospital/QueueCard';
import { BedCard } from '../../components/hospital/BedCard';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const PatientDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const {
    appointments,
    liveQueue,
    beds,
    labOrders,
    bills,
    cancelAppointment,
  } = useHospitalData();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const upcomingAppointment = (appointments || []).find(
    (a) => a.status === 'confirmed' || a.status === 'pending' || a.status === 'Upcoming' || a.status === 'Confirmed'
  );

  const myBed = (beds || []).find((b) => b.patientName === currentUser?.name || b.patientId === 'PAT-001' || b.patientId === 'P-101');

  const pendingBillsCount = (bills || []).filter((b) => b.paymentStatus?.toLowerCase().includes('unpaid') || b.status?.toLowerCase() === 'pending').length;
  const pendingReportsCount = (labOrders || []).filter((l) => l.status === 'in_progress' || l.status === 'Processing').length;

  const quickActions = [
    { label: 'Book OPD', icon: 'calendar', color: COLORS.hospitalBlue, route: 'DoctorSearch' },
    { label: 'Live Queue', icon: 'time', color: COLORS.hospitalTeal, route: 'Queue' },
    { label: 'Lab Reports', icon: 'flask', color: '#EC4899', route: 'MedicalReports' },
    { label: 'My Rx', icon: 'medkit', color: '#8B5CF6', route: 'Prescriptions' },
    { label: 'Ward Beds', icon: 'bed', color: '#0284C7', route: 'AdmissionBed' },
    { label: 'Bills & TPA', icon: 'receipt', color: '#10B981', route: 'Bills' },
    { label: 'Ambulance SOS', icon: 'warning', color: COLORS.triageRed, route: 'EmergencySOS' },
    { label: 'Doctors', icon: 'person-search', color: '#6366F1', route: 'DoctorSearch' },
  ];

  const vitals = [
    { label: 'Pulse / HR', value: '74 bpm', status: 'Normal', icon: 'heart', color: COLORS.triageGreen },
    { label: 'SpO2 Oxygen', value: '98%', status: 'Optimal', icon: 'water', color: COLORS.hospitalBlue },
    { label: 'Blood Pressure', value: '120/80', status: 'Normal', icon: 'fitness', color: COLORS.hospitalTeal },
    { label: 'Body Temp', value: '98.4°F', status: 'Normal', icon: 'thermometer', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Patient Terminal"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Welcome & UHID Strip */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.patientName}>{currentUser?.name || 'Rahul Sharma'}</Text>
              <Text style={styles.patientEmail}>{currentUser?.email || 'patient@shos.hospital'}</Text>
            </View>
            <View style={styles.uhidBadge}>
              <Text style={styles.uhidLabel}>UHID / MRN</Text>
              <Text style={styles.uhidValue}>{currentUser?.uhid || 'SHOS-2026-8942'}</Text>
            </View>
          </View>
        </View>

        {/* Live Vitals Monitor Widget (Web Feature Parity) */}
        <View style={styles.headingRow}>
          <Text style={styles.sectionHeading}>LIVE VITALS TELEMETRY</Text>
          <Text style={styles.vitalsTimestamp}>Synced via Bedside Monitor</Text>
        </View>
        <View style={styles.vitalsGrid}>
          {vitals.map((v, i) => (
            <View key={i} style={styles.vitalCard}>
              <View style={[styles.vitalIconWrap, { backgroundColor: `${v.color}15` }]}>
                <Ionicons name={v.icon} size={18} color={v.color} />
              </View>
              <Text style={styles.vitalVal}>{v.value}</Text>
              <Text style={styles.vitalLabel}>{v.label}</Text>
              <View style={[styles.vitalStatusChip, { backgroundColor: `${v.color}18` }]}>
                <Text style={[styles.vitalStatusText, { color: v.color }]}>{v.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 🚨 Emergency SOS Banner */}
        <TouchableOpacity
          style={styles.emergencyBanner}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('EmergencySOS')}
        >
          <View style={styles.sosIconCircle}>
            <Ionicons name="warning" size={24} color={COLORS.cardBg} />
          </View>
          <View style={styles.sosTextWrap}>
            <Text style={styles.sosTitle}>EMERGENCY SOS DISPATCH</Text>
            <Text style={styles.sosDesc}>Call Hospital ER or request instant GPS Cardiac Ambulance</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.cardBg} />
        </TouchableOpacity>

        {/* Active Live Token Banner */}
        <TouchableOpacity
          style={styles.tokenBanner}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Queue')}
        >
          <View style={styles.tokenBannerHeader}>
            <View style={styles.tokenDot} />
            <Text style={styles.tokenBannerTitle}>ACTIVE OPD QUEUE TOKEN</Text>
            <Text style={styles.tokenTapHint}>Tap for live radar ›</Text>
          </View>
          <View style={styles.tokenRow}>
            <View style={styles.tokenBox}>
              <Text style={styles.tokenBoxLabel}>Your Token</Text>
              <Text style={styles.tokenNumber}>#24</Text>
            </View>
            <View style={styles.tokenDivider} />
            <View style={styles.tokenBox}>
              <Text style={styles.tokenBoxLabel}>Now Calling</Text>
              <Text style={styles.tokenCalling}>#19</Text>
            </View>
            <View style={styles.tokenDivider} />
            <View style={styles.tokenBox}>
              <Text style={styles.tokenBoxLabel}>Est. Wait</Text>
              <Text style={styles.tokenWait}>~15m</Text>
            </View>
          </View>
          <Text style={styles.tokenCabinInfo}>Room OPD-104 • Dr. Arvind Sharma (Cardiology)</Text>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeading}>CLINICAL SERVICES</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Queue Status */}
        <Text style={styles.sectionHeading}>OPD QUEUE STATUS</Text>
        <QueueCard
          queue={liveQueue}
          style={{ marginBottom: 14 }}
        />

        {/* Upcoming Appointment */}
        <View style={styles.headingRow}>
          <Text style={styles.sectionHeading}>NEXT APPOINTMENT</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorSearch')}>
            <Text style={styles.seeAllText}>Book New</Text>
          </TouchableOpacity>
        </View>

        {upcomingAppointment ? (
          <AppointmentCard
            appointment={upcomingAppointment}
            onCancel={(app) => cancelAppointment(app.id)}
            onPress={() => {}}
          />
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No upcoming appointments today.</Text>
          </Card>
        )}

        {/* Admission / Inpatient Bed Visual */}
        {myBed && (
          <>
            <Text style={styles.sectionHeading}>ADMITTED BED STATUS</Text>
            <BedCard
              bed={myBed}
              onPress={() => navigation.navigate('AdmissionBed')}
            />
          </>
        )}

        {/* Summaries: Pending Reports & Bills */}
        <Text style={styles.sectionHeading}>SUMMARY NOTICES</Text>
        <View style={styles.summaryRow}>
          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() => navigation.navigate('MedicalReports')}
          >
            <View style={styles.summaryIcon}>
              <Ionicons name="document-text" size={20} color={COLORS.hospitalBlue} />
            </View>
            <Text style={styles.summaryVal}>{pendingReportsCount} Reports</Text>
            <Text style={styles.summarySub}>Diagnostic status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() => navigation.navigate('Bills')}
          >
            <View style={[styles.summaryIcon, { backgroundColor: COLORS.warningLight }]}>
              <Ionicons name="receipt" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.summaryVal}>{pendingBillsCount} Invoices</Text>
            <Text style={styles.summarySub}>Pending payment</Text>
          </TouchableOpacity>
        </View>

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
  greetingSection: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 12,
    color: COLORS.slate,
    fontWeight: '600',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  patientEmail: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  uhidBadge: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  uhidLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  uhidValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
    marginTop: 1,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.triageRed,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.triageRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sosIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sosTextWrap: {
    flex: 1,
  },
  sosTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.cardBg,
    letterSpacing: 0.5,
  },
  sosDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 6,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  seeAllText: {
    fontSize: 12,
    color: COLORS.hospitalBlue,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  actionItem: {
    width: '31%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  actionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
  },
  emptyCard: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyCardText: {
    fontSize: 13,
    color: COLORS.slate,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  summarySub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  vitalsTimestamp: {
    fontSize: 10,
    color: COLORS.hospitalTeal,
    fontWeight: '700',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  vitalCard: {
    width: '48.5%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  vitalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  vitalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.navy,
  },
  vitalLabel: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
    fontWeight: '600',
  },
  vitalStatusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  vitalStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  tokenBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  tokenBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tokenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  tokenBannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    flex: 1,
  },
  tokenTapHint: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  tokenBox: {
    alignItems: 'center',
  },
  tokenBoxLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 2,
  },
  tokenNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38BDF8',
  },
  tokenDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#334155',
  },
  tokenCalling: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  tokenWait: {
    fontSize: 20,
    fontWeight: '900',
    color: '#34D399',
  },
  tokenCabinInfo: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
    textAlign: 'center',
  },
});
