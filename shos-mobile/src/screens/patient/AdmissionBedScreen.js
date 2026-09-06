import React from 'react';
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
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { useHospitalData } from '../../context/HospitalDataContext';

export const AdmissionBedScreen = ({ navigation }) => {
  const { beds } = useHospitalData();

  const handleNurseCall = () => {
    Alert.alert(
      'Nurse Station Alerted',
      'Nursing Officer Sister Priya Nair has received your bedside call for Ward A - Bed 04.',
      [{ text: 'OK' }]
    );
  };

  const wardBeds = [
    { number: 'Bed 01', status: 'available', color: COLORS.triageGreen, icon: 'checkmark-circle' },
    { number: 'Bed 02', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle' },
    { number: 'Bed 03', status: 'available', color: COLORS.triageGreen, icon: 'checkmark-circle' },
    { number: 'Bed 04', status: 'your_bed', color: COLORS.hospitalBlue, icon: 'person-circle' },
    { number: 'Bed 05', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle' },
    { number: 'Bed 06', status: 'cleaning', color: COLORS.warning, icon: 'sparkles' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Inpatient Ward & Bed"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admission Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.wardTitle}>Ward A — Cardiac Care Unit</Text>
              <Text style={styles.wardSubtitle}>Room 204 • 2nd Floor Block B</Text>
            </View>
            <StatusBadge status="admitted" type="badge" />
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.itemLabel}>Assigned Bed</Text>
              <Text style={styles.itemVal}>Bed 04 (Telemetry)</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.itemLabel}>Attending Doctor</Text>
              <Text style={styles.itemVal}>Dr. Vikram Malhotra</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.itemLabel}>Admission Date</Text>
              <Text style={styles.itemVal}>04 Sep 2026, 09:15 AM</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.itemLabel}>Ward In-Charge</Text>
              <Text style={styles.itemVal}>Sister Priya Nair</Text>
            </View>
          </View>

          {/* Nurse Call Button */}
          <Button
            title="Call Duty Nurse Station"
            variant="primary"
            size="medium"
            icon="notifications"
            onPress={handleNurseCall}
            style={styles.callNurseBtn}
          />
        </Card>

        {/* Visual Bed Grid (Phase 11 Spec) */}
        <Text style={styles.sectionHeading}>WARD A — BED CENSUS MATRIX</Text>
        <Card style={styles.matrixCard}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.triageGreen }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.triageRed }]} />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.hospitalBlue }]} />
              <Text style={styles.legendText}>Your Bed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.legendText}>Sanitizing</Text>
            </View>
          </View>

          <View style={styles.gridContainer}>
            {wardBeds.map((b, idx) => (
              <View
                key={idx}
                style={[
                  styles.gridBed,
                  b.status === 'your_bed' && styles.gridBedActive,
                ]}
              >
                <Ionicons name={b.icon} size={24} color={b.color} />
                <Text style={styles.bedNum}>{b.number}</Text>
                <Text style={[styles.bedStatus, { color: b.color }]}>
                  {b.status === 'your_bed' ? 'Assigned' : b.status}
                </Text>
              </View>
            ))}
          </View>
        </Card>

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
  summaryCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  wardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
  },
  wardSubtitle: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  detailsGrid: {
    backgroundColor: COLORS.offWhite,
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 12,
    color: COLORS.slate,
  },
  itemVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  callNurseBtn: {
    width: '100%',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  matrixCard: {
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.slate,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridBed: {
    width: '30%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  gridBedActive: {
    borderColor: COLORS.hospitalBlue,
    borderWidth: 2,
    backgroundColor: COLORS.tealLight,
  },
  bedNum: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 6,
  },
  bedStatus: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
