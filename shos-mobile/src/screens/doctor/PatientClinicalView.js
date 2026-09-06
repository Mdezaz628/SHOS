import React, { useState } from 'react';
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
import { Avatar } from '../../components/common/Avatar';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useHospitalData } from '../../context/HospitalDataContext';

export const PatientClinicalView = ({ route, navigation }) => {
  const { patient } = route.params || {};
  const { addPrescription, addLabOrder } = useHospitalData();

  // Modals state
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);

  // Form states
  const [clinicalNotes, setClinicalNotes] = useState('Patient presents with 3-day history of exertional angina and mild dyspnea. S1/S2 heard, no murmurs. Lungs clear to auscultation.');
  const [rxMedicine, setRxMedicine] = useState('Aspirin');
  const [rxDosage, setRxDosage] = useState('75 mg');
  const [rxFrequency, setRxFrequency] = useState('1-0-0 (Post Meal)');
  const [selectedLabTest, setSelectedLabTest] = useState('Troponin-I High-Sensitivity');
  const [referralSpecialty, setReferralSpecialty] = useState('Cardiac Electrophysiology');

  const handleSaveNotes = () => {
    setIsNotesModalOpen(false);
    Alert.alert('Clinical Notes Saved', 'Notes updated in patient electronic medical record (EHR).');
  };

  const handleCreateRx = () => {
    addPrescription({
      id: `RX-2026-${Date.now().toString().slice(-4)}`,
      patientName: patient?.name || 'Rahul Sharma',
      patientId: patient?.uhid || 'SHOS-2026-8942',
      doctorName: 'Dr. Vikram Malhotra',
      specialty: 'Cardiology',
      date: '06 Sep 2026',
      diagnosis: 'Ischemic Heart Disease / Exertional Angina',
      status: 'active',
      medicines: [
        { name: rxMedicine, dosage: rxDosage, frequency: rxFrequency, duration: '30 days', instructions: 'After lunch' },
      ],
    });
    setIsRxModalOpen(false);
    Alert.alert('eRx Dispatched', `Prescription for ${rxMedicine} created and sent to Hospital Pharmacy.`);
  };

  const handleCreateLab = () => {
    addLabOrder({
      id: `LAB-2026-${Date.now().toString().slice(-4)}`,
      patientName: patient?.name || 'Rahul Sharma',
      patientId: patient?.uhid || 'SHOS-2026-8942',
      testName: selectedLabTest,
      orderedBy: 'Dr. Vikram Malhotra',
      date: '06 Sep 2026',
      status: 'in_progress',
      priority: 'high',
    });
    setIsLabModalOpen(false);
    Alert.alert('Lab Order Created', `${selectedLabTest} requisition sent to Central Pathology Lab.`);
  };

  const handleReferral = () => {
    setIsReferModalOpen(false);
    Alert.alert('Referral Requisition', `Internal transfer and referral to ${referralSpecialty} initiated.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Clinical EHR Desk"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Patient Profile Card */}
        <Card style={styles.patientCard}>
          <View style={styles.profileRow}>
            <Avatar name={patient?.name || 'Rahul Sharma'} size="medium" role="patient" />
            <View style={styles.metaCol}>
              <Text style={styles.patientName}>{patient?.name || 'Rahul Sharma'}</Text>
              <Text style={styles.demographics}>
                {patient?.age || '42'} Yrs • {patient?.gender || 'Male'} • Blood: O+
              </Text>
              <Text style={styles.uhidText}>UHID: {patient?.uhid || 'SHOS-2026-8942'}</Text>
            </View>
            <PriorityBadge priority={patient?.triage || 'urgent'} />
          </View>
        </Card>

        {/* Realtime Bedside / OPD Vitals Grid */}
        <Text style={styles.sectionHeading}>RECORDED PATIENT VITALS</Text>
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCard}>
            <Ionicons name="heart" size={18} color={COLORS.triageRed} />
            <Text style={styles.vitalVal}>{patient?.vitals?.bp || '130/85'}</Text>
            <Text style={styles.vitalUnit}>mmHg (BP)</Text>
          </View>
          <View style={styles.vitalCard}>
            <Ionicons name="pulse" size={18} color={COLORS.hospitalTeal} />
            <Text style={styles.vitalVal}>{patient?.vitals?.pulse || '76'}</Text>
            <Text style={styles.vitalUnit}>bpm (Pulse)</Text>
          </View>
          <View style={styles.vitalCard}>
            <Ionicons name="speedometer" size={18} color={COLORS.hospitalBlue} />
            <Text style={styles.vitalVal}>{patient?.vitals?.spo2 || '98%'}</Text>
            <Text style={styles.vitalUnit}>SpO2</Text>
          </View>
          <View style={styles.vitalCard}>
            <Ionicons name="thermometer" size={18} color={COLORS.warning} />
            <Text style={styles.vitalVal}>{patient?.vitals?.temp || '98.4°F'}</Text>
            <Text style={styles.vitalUnit}>Body Temp</Text>
          </View>
        </View>

        {/* Clinical Action Bar */}
        <Text style={styles.sectionHeading}>CLINICAL ACTIONS</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsNotesModalOpen(true)}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: COLORS.tealLight }]}>
              <Ionicons name="document-text" size={20} color={COLORS.hospitalBlue} />
            </View>
            <Text style={styles.actionLabel}>Clinical Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsRxModalOpen(true)}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="medkit" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.actionLabel}>Prescribe eRx</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsLabModalOpen(true)}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="flask" size={20} color="#EC4899" />
            </View>
            <Text style={styles.actionLabel}>Order Labs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsReferModalOpen(true)}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="swap-horizontal" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.actionLabel}>Referral / Admit</Text>
          </TouchableOpacity>
        </View>

        {/* Allergies & Clinical Cautions */}
        <Text style={styles.sectionHeading}>ALLERGIES & CHRONIC CONDITIONS</Text>
        <Card style={styles.allergyCard}>
          <View style={styles.allergyItem}>
            <Ionicons name="alert-circle" size={18} color={COLORS.triageRed} />
            <Text style={styles.allergyText}>
              Severe Allergy: <Text style={{ fontWeight: '800' }}>Penicillin & Beta-Lactams</Text>
            </Text>
          </View>
          <View style={styles.allergyItem}>
            <Ionicons name="fitness" size={18} color={COLORS.warning} />
            <Text style={styles.allergyText}>
              Pre-existing: Type 2 Diabetes Mellitus, Mild Bronchospasm
            </Text>
          </View>
        </Card>

        {/* Active Clinical Notes */}
        <Text style={styles.sectionHeading}>ATTENDING CONSULTANT NOTES</Text>
        <Card style={styles.notesCard}>
          <Text style={styles.notesContent}>{clinicalNotes}</Text>
          <TouchableOpacity
            style={styles.editNotesBtn}
            onPress={() => setIsNotesModalOpen(true)}
          >
            <Ionicons name="pencil" size={14} color={COLORS.hospitalBlue} />
            <Text style={styles.editNotesText}>Update Clinical Notes</Text>
          </TouchableOpacity>
        </Card>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 1. Clinical Notes Modal */}
      <Modal
        visible={isNotesModalOpen}
        title="Write Clinical Examination Notes"
        onClose={() => setIsNotesModalOpen(false)}
      >
        <Input
          label="Observations & Clinical Assessment"
          value={clinicalNotes}
          onChangeText={setClinicalNotes}
          numberOfLines={4}
          multiline
        />
        <Button
          title="Save Clinical Record"
          variant="primary"
          size="medium"
          icon="save-outline"
          onPress={handleSaveNotes}
          style={{ marginTop: 12 }}
        />
      </Modal>

      {/* 2. Prescription Creator Modal */}
      <Modal
        visible={isRxModalOpen}
        title="Generate Electronic Prescription (eRx)"
        onClose={() => setIsRxModalOpen(false)}
      >
        <Input
          label="Medicine Name"
          value={rxMedicine}
          onChangeText={setRxMedicine}
          placeholder="e.g. Atorvastatin"
        />
        <Input
          label="Strength / Dosage"
          value={rxDosage}
          onChangeText={setRxDosage}
          placeholder="e.g. 20 mg"
        />
        <Input
          label="Frequency & Instructions"
          value={rxFrequency}
          onChangeText={setRxFrequency}
          placeholder="e.g. 0-0-1 (Night, with water)"
        />
        <Button
          title="Transmit eRx to Pharmacy"
          variant="primary"
          size="medium"
          icon="send"
          onPress={handleCreateRx}
          style={{ marginTop: 12 }}
        />
      </Modal>

      {/* 3. Lab Order Modal */}
      <Modal
        visible={isLabModalOpen}
        title="Order Diagnostic Investigation"
        onClose={() => setIsLabModalOpen(false)}
      >
        <Text style={styles.modalSub}>Select investigation to order:</Text>
        {['Troponin-I High-Sensitivity', '2D Echocardiography', 'Lipid Profile', 'Serum Creatinine', 'Chest X-Ray PA'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.labChoiceBtn,
              selectedLabTest === t && styles.labChoiceActive,
            ]}
            onPress={() => setSelectedLabTest(t)}
          >
            <Text style={[styles.labChoiceText, selectedLabTest === t && styles.labChoiceTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
        <Button
          title="Send Requisition to Lab"
          variant="primary"
          size="medium"
          icon="flask"
          onPress={handleCreateLab}
          style={{ marginTop: 14 }}
        />
      </Modal>

      {/* 4. Referral / Admission Modal */}
      <Modal
        visible={isReferModalOpen}
        title="Referral / Inpatient Admission"
        onClose={() => setIsReferModalOpen(false)}
      >
        <Input
          label="Target Department / Specialist"
          value={referralSpecialty}
          onChangeText={setReferralSpecialty}
          placeholder="e.g. Nephrology / ICU Stepdown"
        />
        <Button
          title="Initiate Inter-Department Transfer"
          variant="primary"
          size="medium"
          icon="swap-horizontal"
          onPress={handleReferral}
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
  patientCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaCol: {
    marginLeft: 12,
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
  },
  demographics: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  uhidText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  vitalCard: {
    width: '23%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  vitalVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 4,
  },
  vitalUnit: {
    fontSize: 9,
    color: COLORS.slate,
    fontWeight: '600',
    marginTop: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionBtn: {
    width: '23%',
    alignItems: 'center',
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
  },
  allergyCard: {
    marginBottom: 16,
    gap: 8,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  allergyText: {
    fontSize: 12,
    color: COLORS.navy,
    flex: 1,
  },
  notesCard: {
    marginBottom: 16,
  },
  notesContent: {
    fontSize: 13,
    color: COLORS.navy,
    lineHeight: 18,
    marginBottom: 10,
  },
  editNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  editNotesText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.slate,
    marginBottom: 10,
  },
  labChoiceBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.offWhite,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  labChoiceActive: {
    backgroundColor: COLORS.tealLight,
    borderColor: COLORS.hospitalBlue,
  },
  labChoiceText: {
    fontSize: 13,
    color: COLORS.navy,
    fontWeight: '600',
  },
  labChoiceTextActive: {
    color: COLORS.hospitalBlue,
    fontWeight: '800',
  },
});
