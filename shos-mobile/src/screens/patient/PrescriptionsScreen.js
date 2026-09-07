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
import { ClinicalDocumentModal } from '../../components/hospital/ClinicalDocumentModal';

export const PrescriptionsScreen = ({ navigation }) => {
  const { prescriptions } = useHospitalData();
  const [selectedRx, setSelectedRx] = React.useState(null);

  const [refillStatus, setRefillStatus] = React.useState({});

  const handleOrderPharmacy = (rx) => {
    setRefillStatus((prev) => ({ ...prev, [rx.id]: 'Dispensation Requested' }));
    Alert.alert(
      'Pharmacy Dispensing Alert 💊',
      `Prescription #${rx.id} transmitted to Hospital Central Pharmacy.\n\nEstimated Ready: ~12 minutes at Counter 3.\nSMS notification will be dispatched when ready for collection.`,
      [{ text: 'Acknowledged' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Active Prescriptions (eRx)"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pharmacy Refill Policy Notice */}
        <View style={styles.policyCard}>
          <Ionicons name="medkit" size={20} color={COLORS.hospitalBlue} />
          <View style={{ flex: 1 }}>
            <Text style={styles.policyTitle}>Direct Hospital Pharmacy Integration</Text>
            <Text style={styles.policyDesc}>
              Tap "Order at Pharmacy" to instantly route your digital prescription to the central pharmacy dispensing queue.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>CLINICAL PRESCRIPTIONS ({(prescriptions || []).length})</Text>

        {(prescriptions || []).map((rx) => {
          const isRefillActive = refillStatus[rx.id];

          return (
            <Card key={rx.id} style={styles.rxCard}>
              {/* Header with Doctor & Date */}
              <View style={styles.rxHeader}>
                <View>
                  <Text style={styles.docName}>{rx.doctorName}</Text>
                  <Text style={styles.docSpecialty}>{rx.specialty} • {rx.date}</Text>
                </View>
                <StatusBadge status={rx.status || 'active'} type="badge" />
              </View>

              {/* Refill status badge if active */}
              {isRefillActive && (
                <View style={styles.refillBadge}>
                  <Ionicons name="hourglass-outline" size={14} color="#D97706" />
                  <Text style={styles.refillBadgeText}>
                    Refill in Progress • Central Pharmacy Counter 3 (~12m)
                  </Text>
                </View>
              )}

              {/* Diagnosis */}
              <View style={styles.diagnosisBox}>
                <Text style={styles.diagnosisLabel}>CLINICAL DIAGNOSIS & INDICATION:</Text>
                <Text style={styles.diagnosisText}>{rx.diagnosis}</Text>
              </View>

              {/* Medicines List */}
              <Text style={styles.medsTitle}>PRESCRIBED MEDICATIONS</Text>
              {rx.medicines?.map((med, idx) => (
                <View key={idx} style={styles.medItem}>
                  <View style={styles.medIconWrap}>
                    <Ionicons name="medical" size={16} color={COLORS.hospitalBlue} />
                  </View>
                  <View style={styles.medDetails}>
                    <View style={styles.medNameRow}>
                      <Text style={styles.medName}>{med.name}</Text>
                      <Text style={styles.dosageBadge}>{med.dosage}</Text>
                    </View>
                    <Text style={styles.dosageInstruction}>
                      {med.frequency} • {med.duration} • {med.instructions}
                    </Text>
                    <View style={styles.timingRow}>
                      <View style={styles.timingChip}>
                        <Text style={styles.timingChipText}>☀️ Morn</Text>
                      </View>
                      <View style={styles.timingChip}>
                        <Text style={styles.timingChipText}>🌤️ Aft</Text>
                      </View>
                      <View style={styles.timingChip}>
                        <Text style={styles.timingChipText}>🌙 Night</Text>
                      </View>
                      <View style={[styles.timingChip, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.timingChipText, { color: '#B45309' }]}>After Meals</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              {/* Action Bar */}
              <View style={styles.actionBar}>
                <Button
                  title={isRefillActive ? 'Refill Ordered ✓' : 'Order Refill at Pharmacy'}
                  variant={isRefillActive ? 'outline' : 'primary'}
                  size="small"
                  icon={isRefillActive ? 'checkmark-circle' : 'cart-outline'}
                  onPress={() => handleOrderPharmacy(rx)}
                  disabled={!!isRefillActive}
                />
                <Button
                  title="Download eRx PDF"
                  variant="outline"
                  size="small"
                  icon="download-outline"
                  onPress={() => setSelectedRx(rx)}
                />
              </View>
            </Card>
          );
        })}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Official eRx PDF Modal */}
      <ClinicalDocumentModal
        visible={!!selectedRx}
        onClose={() => setSelectedRx(null)}
        type="prescription"
        data={selectedRx}
      />
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
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  rxCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  rxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  docName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  docSpecialty: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  diagnosisBox: {
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.hospitalTeal,
  },
  diagnosisLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
  },
  diagnosisText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.navy,
    marginTop: 2,
  },
  medsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  medIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  medDetails: {
    flex: 1,
  },
  medName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  dosage: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.hospitalBlue,
  },
  dosageInstruction: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  policyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  policyDesc: {
    fontSize: 11,
    color: COLORS.navy,
    lineHeight: 15,
    marginTop: 2,
  },
  refillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    gap: 6,
  },
  refillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  medNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dosageBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  timingRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  timingChip: {
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timingChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.slate,
  },
});
