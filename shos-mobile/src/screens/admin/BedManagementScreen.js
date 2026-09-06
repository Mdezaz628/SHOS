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
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useHospitalData } from '../../context/HospitalDataContext';

export const BedManagementScreen = ({ navigation }) => {
  const {
    beds,
    addBed,
    removeBed,
    updateBedStatus,
    assignBed,
    dischargeBed,
  } = useHospitalData();

  // Add Bed Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWard, setNewWard] = useState('Ward A (Stepdown)');
  const [newBedNumber, setNewBedNumber] = useState('');
  const [newBedType, setNewBedType] = useState('Standard');

  // Assign Patient Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetBed, setTargetBed] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [uhid, setUhid] = useState('');

  const [wardFilter, setWardFilter] = useState('All');

  const safeBeds = Array.isArray(beds) ? beds : [];
  const totalBeds = safeBeds.length;
  const occupiedCount = safeBeds.filter((b) => b.status === 'occupied').length;
  const availableCount = safeBeds.filter((b) => b.status === 'available').length;
  const cleaningCount = safeBeds.filter((b) => b.status === 'cleaning').length;

  const wardsList = ['All', 'Ward A (Stepdown)', 'Ward B (Post-Surgical)', 'Intensive Care Unit (ICU)', 'Cardiac Care Unit (CCU / HDU)', 'Pediatric Care', 'Emergency Observation Bay'];

  const handleCreateBed = () => {
    if (!newBedNumber.trim()) {
      Alert.alert('Missing Field', 'Please enter a bed number / identifier.');
      return;
    }
    const created = addBed({
      ward: newWard,
      number: newBedNumber.trim(),
      type: newBedType,
    });
    setIsAddModalOpen(false);
    setNewBedNumber('');
    Alert.alert('Bed Provisioned', `Bed ${created.number} successfully added to ${created.ward}.`);
  };

  const handleDeleteBed = (bed) => {
    Alert.alert(
      'Remove Bed from Hospital Grid',
      `Permanently decommission Bed ${bed.number} (${bed.ward})? This will update the hospital occupancy capacity.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Bed',
          style: 'destructive',
          onPress: () => {
            removeBed(bed.id);
            Alert.alert('Bed Decommissioned', `Bed ${bed.number} removed from active hospital census.`);
          },
        },
      ]
    );
  };

  const handleOpenAssign = (bed) => {
    setTargetBed(bed);
    setPatientName('');
    setUhid(`SHOS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!patientName.trim()) {
      Alert.alert('Missing Field', 'Please enter the patient full name.');
      return;
    }
    assignBed(targetBed.id, patientName.trim(), uhid.trim());
    setIsAssignModalOpen(false);
    Alert.alert('Patient Admitted & Assigned', `Patient ${patientName} allocated to Bed ${targetBed.number} (${targetBed.ward}).`);
  };

  const handleDischargePatient = (bed) => {
    Alert.alert(
      'Discharge Patient',
      `Discharge ${bed.patientName || 'patient'} from Bed ${bed.number}? The bed will be flagged for Housekeeping sanitation.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discharge & Clean',
          onPress: () => {
            dischargeBed(bed.id);
            Alert.alert('Discharge Recorded', `Bed ${bed.number} marked for housekeeping turnover disinfection.`);
          },
        },
      ]
    );
  };

  const handleCycleStatus = (bed) => {
    const nextStatusMap = {
      available: 'maintenance',
      maintenance: 'available',
      cleaning: 'available',
      occupied: 'cleaning',
    };
    const next = nextStatusMap[bed.status] || 'available';
    updateBedStatus(bed.id, next);
    Alert.alert('Bed Status Changed', `Bed ${bed.number} status set to ${next.toUpperCase()}.`);
  };

  const filteredBeds = safeBeds.filter((b) => {
    if (wardFilter === 'All') return true;
    return b.ward === wardFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Admin Bed & Ward Control"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admin Action Bar */}
        <View style={styles.adminActionBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminBarTitle}>HOSPITAL BED INVENTORY</Text>
            <Text style={styles.adminBarSub}>Full administrative authority to add, allocate, or decommission beds.</Text>
          </View>
          <Button
            title="+ Add Bed"
            variant="primary"
            size="small"
            icon="add-circle"
            onPress={() => setIsAddModalOpen(true)}
          />
        </View>

        {/* Live Operational Metrics */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Capacity"
            value={totalBeds.toString()}
            change="Beds Active"
            changeType="neutral"
            icon="bed"
            color={COLORS.hospitalBlue}
            onPress={() => setWardFilter('All')}
          />
          <StatCard
            label="Occupied"
            value={occupiedCount.toString()}
            change={`${Math.round((occupiedCount / (totalBeds || 1)) * 100)}% Occupancy`}
            changeType="positive"
            icon="people"
            color={COLORS.navy}
            onPress={() => Alert.alert('Occupancy Rate', `${occupiedCount} of ${totalBeds} beds currently occupied by clinical inpatients.`)}
          />
          <StatCard
            label="Available"
            value={availableCount.toString()}
            change="Immediate Intake"
            changeType="positive"
            icon="checkmark-circle"
            color={COLORS.triageGreen}
            onPress={() => Alert.alert('Immediate Intake', `${availableCount} sanitized beds ready for intake across all departments.`)}
          />
          <StatCard
            label="Sanitizing"
            value={cleaningCount.toString()}
            change="In Turnover"
            changeType="warning"
            icon="sparkles"
            color={COLORS.warning}
            onPress={() => Alert.alert('Housekeeping Queue', `${cleaningCount} beds currently undergoing terminal sterilization.`)}
          />
        </View>

        {/* Ward Filter Scroll */}
        <Text style={styles.sectionHeading}>FILTER BY CLINICAL WARD</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
        >
          {wardsList.map((w) => (
            <TouchableOpacity
              key={w}
              onPress={() => setWardFilter(w)}
              style={[
                styles.wardChip,
                wardFilter === w && styles.wardChipActive,
              ]}
            >
              <Text
                style={[
                  styles.wardChipText,
                  wardFilter === w && styles.wardChipTextActive,
                ]}
              >
                {w}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Individual Bed Control Cards */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            BED UNITS DIRECTORY ({filteredBeds.length})
          </Text>
          <Text style={styles.adminHint}>Tap buttons to Assign, Discharge or Delete</Text>
        </View>

        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'occupied';

          return (
            <Card key={bed.id} style={styles.bedCard}>
              <View style={styles.bedHeader}>
                <View style={styles.bedNumberWrap}>
                  <Text style={styles.bedNumberText}>{bed.number}</Text>
                  <Text style={styles.bedWardText}>{bed.ward}</Text>
                </View>
                <StatusBadge status={bed.status} type="badge" />
              </View>

              {/* Patient Info If Occupied */}
              {isOccupied && (
                <View style={styles.patientBanner}>
                  <Ionicons name="person" size={14} color={COLORS.hospitalBlue} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.patientNameText}>{bed.patientName || 'Admitted Inpatient'}</Text>
                    <Text style={styles.patientUhidText}>UHID: {bed.uhid || 'SHOS-2026-8942'}</Text>
                  </View>
                </View>
              )}

              {/* Bed Specs */}
              <View style={styles.specsRow}>
                <Text style={styles.specTag}>Type: {bed.type || 'Standard'}</Text>
                {bed.oxygenSupport && <Text style={[styles.specTag, { color: COLORS.hospitalTeal }]}>• O2 Pipeline</Text>}
                {bed.ventilator && <Text style={[styles.specTag, { color: COLORS.triageRed }]}>• Mechanical Ventilator</Text>}
              </View>

              {/* Admin Action Buttons */}
              <View style={styles.actionsRow}>
                {!isOccupied ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: `${COLORS.hospitalBlue}15` }]}
                    onPress={() => handleOpenAssign(bed)}
                  >
                    <Ionicons name="person-add-outline" size={14} color={COLORS.hospitalBlue} />
                    <Text style={[styles.actionBtnText, { color: COLORS.hospitalBlue }]}>Assign Patient</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: `${COLORS.warning}15` }]}
                    onPress={() => handleDischargePatient(bed)}
                  >
                    <Ionicons name="log-out-outline" size={14} color={COLORS.warning} />
                    <Text style={[styles.actionBtnText, { color: COLORS.warning }]}>Discharge</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: `${COLORS.navy}10` }]}
                  onPress={() => handleCycleStatus(bed)}
                >
                  <Ionicons name="sync-outline" size={14} color={COLORS.navy} />
                  <Text style={[styles.actionBtnText, { color: COLORS.navy }]}>Toggle Status</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: `${COLORS.triageRed}15` }]}
                  onPress={() => handleDeleteBed(bed)}
                >
                  <Ionicons name="trash-outline" size={14} color={COLORS.triageRed} />
                  <Text style={[styles.actionBtnText, { color: COLORS.triageRed }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add Bed Modal */}
      <Modal
        visible={isAddModalOpen}
        title="Provision New Hospital Bed"
        onClose={() => setIsAddModalOpen(false)}
      >
        <Input
          label="Bed Number / Label *"
          placeholder="e.g. ICU-05 or B-112"
          value={newBedNumber}
          onChangeText={setNewBedNumber}
          leftIcon="bed-outline"
        />

        <Text style={styles.modalFieldLabel}>Select Ward Location *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {wardsList.filter(w => w !== 'All').map((w) => (
            <TouchableOpacity
              key={w}
              onPress={() => setNewWard(w)}
              style={[
                styles.modalOptionChip,
                newWard === w && styles.modalOptionChipActive,
              ]}
            >
              <Text style={[styles.modalOptionText, newWard === w && styles.modalOptionTextActive]}>
                {w}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.modalFieldLabel}>Select Bed Clinical Type *</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {['Standard', 'ICU', 'Ventilator', 'Dialysis'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setNewBedType(t)}
              style={[
                styles.modalOptionChip,
                newBedType === t && styles.modalOptionChipActive,
              ]}
            >
              <Text style={[styles.modalOptionText, newBedType === t && styles.modalOptionTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Create & Provision Bed Unit"
          variant="primary"
          size="medium"
          icon="add-circle-outline"
          onPress={handleCreateBed}
        />
      </Modal>

      {/* Assign Patient Modal */}
      {targetBed && (
        <Modal
          visible={isAssignModalOpen}
          title={`Admit Patient to Bed ${targetBed.number}`}
          onClose={() => setIsAssignModalOpen(false)}
        >
          <View style={{ backgroundColor: COLORS.offWhite, padding: 12, borderRadius: 10, marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.navy }}>{targetBed.number} • {targetBed.ward}</Text>
            <Text style={{ fontSize: 11, color: COLORS.slate, marginTop: 2 }}>Bed Type: {targetBed.type || 'Standard'}</Text>
          </View>

          <Input
            label="Patient Full Name *"
            placeholder="e.g. Anand Mahindra"
            value={patientName}
            onChangeText={setPatientName}
            leftIcon="person-outline"
          />

          <Input
            label="UHID Number *"
            value={uhid}
            onChangeText={setUhid}
            leftIcon="card-outline"
          />

          <Button
            title="Confirm Admission & Lock Bed"
            variant="primary"
            size="medium"
            icon="checkmark-circle-outline"
            onPress={handleConfirmAssign}
            style={{ marginTop: 10 }}
          />
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
  adminActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.offWhite,
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  adminBarTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 0.5,
  },
  adminBarSub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
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
  adminHint: {
    fontSize: 10,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
  },
  wardChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  wardChipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  wardChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
  },
  wardChipTextActive: {
    color: COLORS.cardBg,
  },
  bedCard: {
    marginBottom: 12,
    padding: 14,
  },
  bedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bedNumberWrap: {
    flex: 1,
  },
  bedNumberText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
  },
  bedWardText: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  patientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${COLORS.hospitalBlue}10`,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  patientNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
  patientUhidText: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  specTag: {
    fontSize: 11,
    color: COLORS.slate,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate,
    marginBottom: 6,
  },
  modalOptionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginRight: 6,
  },
  modalOptionChipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  modalOptionText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
  },
  modalOptionTextActive: {
    color: COLORS.cardBg,
  },
});

export default BedManagementScreen;
