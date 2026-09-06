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
import { useHospitalData } from '../../context/HospitalDataContext';

export const WardViewScreen = ({ navigation }) => {
  const { beds, updateBedStatus } = useHospitalData();
  const [selectedWard, setSelectedWard] = useState('Ward A (CCU)');

  const wards = ['Ward A (CCU)', 'Ward B (General)', 'ICU Block 1', 'Pediatrics'];

  const handleBedTap = (bed) => {
    Alert.alert(
      `Bed Control: ${bed.number}`,
      `Current Status: ${bed.status.toUpperCase()}\nPatient: ${bed.patientName || 'None'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: bed.status === 'occupied' ? 'Mark for Discharge' : 'Mark Available',
          onPress: () => {
            updateBedStatus(bed.id, bed.status === 'occupied' ? 'cleaning' : 'available');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Ward Bed Matrix"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      {/* Ward Selector Chips */}
      <View style={styles.wardPicker}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {wards.map((w) => (
            <TouchableOpacity
              key={w}
              style={[
                styles.chip,
                selectedWard === w && styles.chipActive,
              ]}
              onPress={() => setSelectedWard(w)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedWard === w && styles.chipTextActive,
                ]}
              >
                {w}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>Total Beds: 12 • Occupied: 8 • Available: 3 • Sanitizing: 1</Text>
        </View>

        <View style={styles.grid}>
          {beds.map((b) => {
            const isOcc = b.status === 'occupied';
            const isClean = b.status === 'cleaning';

            return (
              <TouchableOpacity
                key={b.id}
                style={[
                  styles.bedBox,
                  isOcc && styles.bedOcc,
                  isClean && styles.bedClean,
                ]}
                activeOpacity={0.7}
                onPress={() => handleBedTap(b)}
              >
                <Ionicons
                  name={isOcc ? 'bed' : isClean ? 'sparkles' : 'checkmark-circle'}
                  size={26}
                  color={isOcc ? COLORS.triageRed : isClean ? COLORS.warning : COLORS.triageGreen}
                />
                <Text style={styles.bedNumber}>{b.number}</Text>
                <Text style={styles.bedPatient} numberOfLines={1}>
                  {b.patientName || 'Vacant'}
                </Text>
                <Text
                  style={[
                    styles.statusTag,
                    { color: isOcc ? COLORS.triageRed : isClean ? COLORS.warning : COLORS.triageGreen },
                  ]}
                >
                  {b.status}
                </Text>
              </TouchableOpacity>
            );
          })}
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
  wardPicker: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  chipsRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
  },
  chipTextActive: {
    color: COLORS.cardBg,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  summaryBar: {
    backgroundColor: COLORS.tealLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  bedBox: {
    width: '48%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.triageGreen,
  },
  bedOcc: {
    borderColor: COLORS.triageRed,
    backgroundColor: '#FEF2F2',
  },
  bedClean: {
    borderColor: COLORS.warning,
    backgroundColor: '#FFFBEB',
  },
  bedNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 6,
  },
  bedPatient: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
    textAlign: 'center',
  },
  statusTag: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 6,
    letterSpacing: 0.5,
  },
});
