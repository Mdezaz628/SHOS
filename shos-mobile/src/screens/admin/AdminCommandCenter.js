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
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AIRecommendationCard } from '../../components/hospital/AIRecommendationCard';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const AdminCommandCenter = ({ navigation }) => {
  const { currentUser } = useAuth();
  const {
    beds,
    equipment,
    bloodBank,
    staff,
    oxygenTelemetry,
    aiRecommendations,
    approveRecommendation,
    rejectRecommendation,
    addBed,
  } = useHospitalData();

  const [refreshing, setRefreshing] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState(false);
  const [codeAlertModal, setCodeAlertModal] = useState(false);

  // Dynamic Live Metrics
  const totalBeds = beds?.length || 0;
  const occupiedBeds = beds ? beds.filter(b => b.status === 'occupied').length : 0;
  const occupancyPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const totalEquipment = equipment?.length || 0;
  const bloodList = Array.isArray(bloodBank) ? bloodBank : (bloodBank?.inventory || []);
  const totalBloodUnits = bloodList.reduce((acc, curr) => acc + (curr.units || 0), 0);
  const activeStaff = staff?.filter(s => s.status === 'on-duty')?.length || 18;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const navModules = [
    { title: 'Staff Governance & Authority', desc: `${activeStaff} Staff On Duty • Provision & Roster`, icon: 'people-circle', route: 'StaffGovernance', color: '#10B981' },
    { title: 'Bed & ICU Management', desc: `${occupiedBeds}/${totalBeds} Beds Occupied (${occupancyPercent}%) • Full CRUD`, icon: 'bed', route: 'BedManagement', color: '#8B5CF6' },
    { title: 'Equipment & Oxygen Plant', desc: `${totalEquipment} Monitored Assets • O2: ${oxygenTelemetry?.level || 94}%`, icon: 'hardware-chip', route: 'ResourceEquipment', color: '#F59E0B' },
    { title: 'Blood Bank Inventory', desc: `${totalBloodUnits} PRBC Bags • Cold Storage Control`, icon: 'water', route: 'BloodBank', color: COLORS.triageRed },
    { title: 'Tomorrow Hospital Plan', desc: 'AI Patient Volume & Surge Forecast', icon: 'sparkles', route: 'TomorrowHospitalPlan', color: COLORS.hospitalBlue },
    { title: 'AI Recommendation Center', desc: 'Human-in-the-loop Decision Support', icon: 'analytics', route: 'AIRecommendationCenter', color: COLORS.hospitalTeal },
  ];

  const pendingRec = aiRecommendations.find((r) => r.status === 'pending');

  const triggerCodeAlert = (codeName, severity) => {
    setCodeAlertModal(false);
    Alert.alert(
      `HOSPITAL-WIDE ${codeName.toUpperCase()} BROADCASTED`,
      `Campus audio sirens, staff pagers, and mobile notifications triggered for ${codeName} (Severity: ${severity}). Security & Critical Response Teams deployed.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="SHOS Command Center"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Command Center Title Header */}
        <View style={styles.commandHeader}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.commandLabel}>CENTRAL HOSPITAL COMMAND CENTER</Text>
            <Text style={styles.adminName}>{currentUser?.name || 'Dr. Rajiv Grover'}</Text>
            <Text style={styles.commandMeta}>Medical Superintendent & Chief of Operations • Main Campus</Text>
          </View>
        </View>

        {/* Quick Admin Action Toolbar */}
        <View style={styles.quickBar}>
          <TouchableOpacity
            style={[styles.quickBarBtn, { backgroundColor: COLORS.hospitalBlue }]}
            onPress={() => navigation.navigate('BedManagement')}
            activeOpacity={0.8}
          >
            <Ionicons name="bed" size={16} color={COLORS.cardBg} />
            <Text style={styles.quickBarText}>+ Manage Beds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBarBtn, { backgroundColor: '#10B981' }]}
            onPress={() => navigation.navigate('StaffGovernance')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add" size={16} color={COLORS.cardBg} />
            <Text style={styles.quickBarText}>+ Staff Roster</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBarBtn, { backgroundColor: COLORS.triageRed }]}
            onPress={() => setCodeAlertModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="warning" size={16} color={COLORS.cardBg} />
            <Text style={styles.quickBarText}>Code Siren</Text>
          </TouchableOpacity>
        </View>

        {/* Real-time Hospital Operating Metrics (Interactive) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>HOSPITAL OPERATIONAL PULSE (TOUCH TO MANAGE)</Text>
          <Text style={styles.sectionSub}>Live Telemetry</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Bed Occupancy"
            value={`${occupancyPercent}%`}
            change={`${occupiedBeds} / ${totalBeds} Beds`}
            changeType={occupancyPercent > 90 ? 'danger' : 'positive'}
            icon="bed"
            color={COLORS.hospitalBlue}
            onPress={() => navigation.navigate('BedManagement')}
          />
          <StatCard
            label="Staff On Duty"
            value={String(activeStaff)}
            change="Active Across Shifts"
            changeType="positive"
            icon="people"
            color={COLORS.hospitalTeal}
            onPress={() => navigation.navigate('StaffGovernance')}
          />
          <StatCard
            label="Blood Reserves"
            value={`${totalBloodUnits} Bags`}
            change="Central Bank"
            changeType={totalBloodUnits < 50 ? 'danger' : 'positive'}
            icon="water"
            color={COLORS.triageRed}
            onPress={() => navigation.navigate('BloodBank')}
          />
          <StatCard
            label="O2 Medical Liquid"
            value={`${oxygenTelemetry?.level || 94}%`}
            change="Cryo Tank A Active"
            changeType="positive"
            icon="flask"
            color={COLORS.triageGreen}
            onPress={() => navigation.navigate('ResourceEquipment')}
          />
        </View>

        {/* High Priority AI Recommendation Preview */}
        {pendingRec && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>AI OPERATIONAL RECOMMENDATION</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AIRecommendationCenter')}>
                <Text style={styles.linkText}>View All</Text>
              </TouchableOpacity>
            </View>
            <AIRecommendationCard
              recommendation={pendingRec}
              onApprove={approveRecommendation}
              onReject={rejectRecommendation}
            />
          </>
        )}

        {/* Navigation to Specialized Admin Modules */}
        <Text style={styles.sectionHeading}>CAMPUS OPERATIONAL CONTROLS</Text>
        <View style={styles.modulesList}>
          {navModules.map((mod, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.moduleCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(mod.route)}
            >
              <View style={[styles.moduleIconWrap, { backgroundColor: `${mod.color}15` }]}>
                <Ionicons name={mod.icon} size={22} color={mod.color} />
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{mod.title}</Text>
                <Text style={styles.moduleDesc}>{mod.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.slateLight} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Hospital Code Broadcast Alert Modal */}
      <Modal
        visible={codeAlertModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCodeAlertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="warning" size={22} color={COLORS.triageRed} />
                <Text style={styles.modalTitle}>Hospital Emergency Siren</Text>
              </View>
              <TouchableOpacity onPress={() => setCodeAlertModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.navy} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              Select emergency protocol to trigger broadcast alerts across the hospital paging system:
            </Text>

            <TouchableOpacity
              style={[styles.codeItem, { borderColor: COLORS.triageRed }]}
              onPress={() => triggerCodeAlert('Code Blue (Cardiac Arrest)', 'CRITICAL')}
            >
              <View style={[styles.codeBadge, { backgroundColor: COLORS.hospitalBlue }]}>
                <Text style={styles.codeBadgeText}>BLUE</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.codeTitle}>Code Blue - Cardiac / Respiratory Arrest</Text>
                <Text style={styles.codeDesc}>Paging Crash Cart & Resuscitation Team</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.codeItem, { borderColor: COLORS.triageRed }]}
              onPress={() => triggerCodeAlert('Code Red (Fire / Evacuation)', 'EMERGENCY')}
            >
              <View style={[styles.codeBadge, { backgroundColor: COLORS.triageRed }]}>
                <Text style={styles.codeBadgeText}>RED</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.codeTitle}>Code Red - Fire & Smoke Evacuation</Text>
                <Text style={styles.codeDesc}>Auto-seal fire doors, notify Fire Brigade</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.codeItem, { borderColor: '#F59E0B' }]}
              onPress={() => triggerCodeAlert('Code Yellow (Mass Casualty / Disaster)', 'HIGH')}
            >
              <View style={[styles.codeBadge, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.codeBadgeText}>YELLOW</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.codeTitle}>Code Yellow - Mass Casualty Disaster</Text>
                <Text style={styles.codeDesc}>Activate Emergency Trauma Surge Ward</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
  commandHeader: {
    backgroundColor: COLORS.navy,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  headerTitleWrap: {
    flex: 1,
  },
  commandLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
  },
  adminName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.cardBg,
    marginTop: 2,
  },
  commandMeta: {
    fontSize: 11,
    color: COLORS.slateLight,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  modulesList: {
    gap: 10,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  moduleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  moduleDesc: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  quickBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickBarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  quickBarText: {
    color: COLORS.cardBg,
    fontSize: 11,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.slate,
    marginBottom: 16,
    lineHeight: 16,
  },
  codeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeBadgeText: {
    color: COLORS.cardBg,
    fontSize: 11,
    fontWeight: '900',
  },
  codeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
  codeDesc: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
});
