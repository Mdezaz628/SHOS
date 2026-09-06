import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useHospitalData } from '../../context/HospitalDataContext';

export const BloodBankScreen = ({ navigation }) => {
  const { bloodBank, addBloodUnits, deductBloodUnits } = useHospitalData();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('O-');
  const [inputUnits, setInputUnits] = useState('5');
  const [donorSource, setDonorSource] = useState('Red Cross Drive');

  const bloodList = Array.isArray(bloodBank) ? bloodBank : (bloodBank?.inventory || []);
  const totalUnits = bloodList.reduce((acc, curr) => acc + (curr.units || 0), 0);
  const criticalGroups = bloodList.filter(b => b.units < 10);

  const handleQuickAdd = (group) => {
    addBloodUnits(group, 1);
    Alert.alert('Unit Added', `1 unit added to ${group} reserve.`);
  };

  const handleQuickDeduct = (group, currentUnits) => {
    if (currentUnits <= 0) {
      Alert.alert('Reserve Depleted', `Cannot issue from empty ${group} inventory.`);
      return;
    }
    Alert.alert(
      'Confirm Blood Issue',
      `Issue 1 unit of ${group} PRBC for cross-match / patient transfusion?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Issue Unit',
          style: 'destructive',
          onPress: () => {
            deductBloodUnits(group, 1);
            Alert.alert('Blood Issued', `1 unit ${group} issued to Blood Transfusion Unit.`);
          },
        },
      ]
    );
  };

  const handleReceiveDonationBatch = () => {
    const qty = parseInt(inputUnits, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Units', 'Please enter a valid positive number of blood bags.');
      return;
    }
    addBloodUnits(selectedGroup, qty);
    setModalVisible(false);
    setInputUnits('5');
    Alert.alert(
      'Donation Batch Processed',
      `Successfully logged ${qty} bags of ${selectedGroup} from ${donorSource || 'Voluntary Donor'} into central cold storage.`
    );
  };

  const handleEmergencyRequisition = () => {
    Alert.alert(
      'Emergency Requisition Dispatched',
      'Dispatched automated emergency requisition for 20 units O-Negative & 15 units AB-Positive PRBC to Central Regional Transfusion Center.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Blood Transfusion Reserve"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total Reserve Banner */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerLabel}>TOTAL PRBC INVENTORY</Text>
            <Text style={styles.bannerVal}>{totalUnits} Units Available</Text>
          </View>
          <TouchableOpacity
            style={styles.addBatchBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={18} color={COLORS.cardBg} />
            <Text style={styles.addBatchText}>+ Receive Batch</Text>
          </TouchableOpacity>
        </View>

        {/* Critical Blood Alert if any */}
        {criticalGroups.length > 0 && (
          <View style={styles.alertBox}>
            <Ionicons name="water" size={24} color={COLORS.cardBg} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>CRITICAL RESERVES ALERT</Text>
              <Text style={styles.alertDesc}>
                {criticalGroups.map(g => `${g.bloodGroup || g.group} (${g.units} units)`).join(', ')} below safe buffer (10 units). Immediate replenishment recommended.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>BLOOD GROUP INVENTORY & ADMIN STEPPERS</Text>
          <Text style={styles.sectionSub}>Tap +/- to adjust</Text>
        </View>

        <View style={styles.bloodGrid}>
          {bloodList.map((item, idx) => {
            const grp = item.bloodGroup || item.group;
            const isLow = item.units < 10;

            return (
              <View
                key={idx}
                style={[
                  styles.bloodCard,
                  isLow && styles.bloodCardLow,
                ]}
              >
                <View style={styles.bloodTopRow}>
                  <Text style={styles.groupText}>{grp}</Text>
                  {isLow && (
                    <View style={styles.lowBadge}>
                      <Text style={styles.lowBadgeText}>LOW</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.unitsText, isLow && { color: COLORS.triageRed }]}>
                  {item.units} <Text style={styles.unitSub}>Units</Text>
                </Text>
                <Text style={styles.subText}>PRBC Component</Text>

                {/* Admin Stepper Controls */}
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    style={[styles.stepBtn, styles.stepDeduct]}
                    onPress={() => handleQuickDeduct(grp, item.units)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="remove" size={16} color={COLORS.triageRed} />
                  </TouchableOpacity>

                  <Text style={styles.stepLabel}>1 Unit</Text>

                  <TouchableOpacity
                    style={[styles.stepBtn, styles.stepAdd]}
                    onPress={() => handleQuickAdd(grp)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={16} color={COLORS.cardBg} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Component Stocks */}
        <Text style={styles.sectionHeading}>COMPONENTS & APHERESIS</Text>
        <Card style={styles.componentCard}>
          <View style={styles.compRow}>
            <View>
              <Text style={styles.compName}>Platelet Concentrates (SDP)</Text>
              <Text style={styles.compSub}>Agitator shelf temp: 22°C</Text>
            </View>
            <Text style={styles.compVal}>28 Units</Text>
          </View>
          <View style={styles.compRow}>
            <View>
              <Text style={styles.compName}>Fresh Frozen Plasma (FFP)</Text>
              <Text style={styles.compSub}>Deep freeze: -30°C</Text>
            </View>
            <Text style={styles.compVal}>64 Bags</Text>
          </View>
          <View style={[styles.compRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.compName}>Cryoprecipitate</Text>
              <Text style={styles.compSub}>Factor VIII & Fibrinogen</Text>
            </View>
            <Text style={styles.compVal}>18 Units</Text>
          </View>
        </Card>

        <Button
          title="Emergency Blood Requisition"
          variant="danger"
          size="medium"
          icon="water-outline"
          onPress={handleEmergencyRequisition}
          style={{ marginBottom: 16 }}
        />

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add Blood Batch Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Receive Blood Donation Batch</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Blood Group</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupPicker}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                <TouchableOpacity
                  key={grp}
                  style={[
                    styles.groupChip,
                    selectedGroup === grp && styles.groupChipActive,
                  ]}
                  onPress={() => setSelectedGroup(grp)}
                >
                  <Text
                    style={[
                      styles.groupChipText,
                      selectedGroup === grp && styles.groupChipTextActive,
                    ]}
                  >
                    {grp}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Number of Bags (Units)</Text>
            <TextInput
              style={styles.textInput}
              value={inputUnits}
              onChangeText={setInputUnits}
              keyboardType="number-pad"
              placeholder="e.g. 10"
            />

            <Text style={styles.inputLabel}>Source / Campaign</Text>
            <TextInput
              style={styles.textInput}
              value={donorSource}
              onChangeText={setDonorSource}
              placeholder="e.g. Red Cross Camp, Voluntary Donor"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleReceiveDonationBatch}
              >
                <Text style={styles.modalSubmitText}>Intake Units</Text>
              </TouchableOpacity>
            </View>
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
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.borderLight,
    letterSpacing: 0.8,
  },
  bannerVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.cardBg,
    marginTop: 4,
  },
  addBatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.triageRed,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  addBatchText: {
    color: COLORS.cardBg,
    fontSize: 12,
    fontWeight: '800',
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.triageRed,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cardBg,
    letterSpacing: 0.5,
  },
  alertDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
  },
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  bloodCard: {
    width: '48%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  bloodCardLow: {
    borderColor: COLORS.triageRed,
    backgroundColor: '#FEF2F2',
  },
  bloodTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.triageRed,
  },
  lowBadge: {
    backgroundColor: COLORS.triageRed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowBadgeText: {
    color: COLORS.cardBg,
    fontSize: 9,
    fontWeight: '900',
  },
  unitsText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.navy,
    marginTop: 4,
  },
  unitSub: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate,
  },
  subText: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 1,
    marginBottom: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDeduct: {
    backgroundColor: '#FEE2E2',
  },
  stepAdd: {
    backgroundColor: COLORS.hospitalBlue,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate,
  },
  componentCard: {
    marginBottom: 16,
  },
  compRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  compName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  compSub: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 2,
  },
  compVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 6,
    marginTop: 10,
  },
  groupPicker: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  groupChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.offWhite,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  groupChipActive: {
    backgroundColor: COLORS.triageRed,
    borderColor: COLORS.triageRed,
  },
  groupChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
  groupChipTextActive: {
    color: COLORS.cardBg,
  },
  textInput: {
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.navy,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: COLORS.slate,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    backgroundColor: COLORS.triageRed,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  modalSubmitText: {
    color: COLORS.cardBg,
    fontWeight: '800',
  },
});

