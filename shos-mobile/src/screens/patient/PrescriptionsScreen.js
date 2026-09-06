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

  const handleOrderPharmacy = (rx) => {
    Alert.alert(
      'Sent to Central Pharmacy',
      `Prescription #${rx.id} has been transmitted to Central Hospital Pharmacy for rapid dispensing.`,
      [{ text: 'OK' }]
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
        <Text style={styles.sectionHeading}>CLINICAL PRESCRIPTIONS ({(prescriptions || []).length})</Text>

        {(prescriptions || []).map((rx) => (
          <Card key={rx.id} style={styles.rxCard}>
            {/* Header with Doctor & Date */}
            <View style={styles.rxHeader}>
              <View>
                <Text style={styles.docName}>{rx.doctorName}</Text>
                <Text style={styles.docSpecialty}>{rx.specialty} • {rx.date}</Text>
              </View>
              <StatusBadge status={rx.status || 'active'} type="badge" />
            </View>

            {/* Diagnosis */}
            <View style={styles.diagnosisBox}>
              <Text style={styles.diagnosisLabel}>DIAGNOSIS:</Text>
              <Text style={styles.diagnosisText}>{rx.diagnosis}</Text>
            </View>

            {/* Medicines List */}
            <Text style={styles.medsTitle}>PRESCRIBED MEDICINES</Text>
            {rx.medicines?.map((med, idx) => (
              <View key={idx} style={styles.medItem}>
                <View style={styles.medIconWrap}>
                  <Ionicons name="medical" size={16} color={COLORS.hospitalBlue} />
                </View>
                <View style={styles.medDetails}>
                  <Text style={styles.medName}>
                    {med.name} <Text style={styles.dosage}>({med.dosage})</Text>
                  </Text>
                  <Text style={styles.dosageInstruction}>
                    {med.frequency} • {med.duration} • {med.instructions}
                  </Text>
                </View>
              </View>
            ))}

            {/* Action Bar */}
            <View style={styles.actionBar}>
              <Button
                title="Order at Pharmacy"
                variant="primary"
                size="small"
                icon="cart-outline"
                onPress={() => handleOrderPharmacy(rx)}
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
        ))}

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
});
