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
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { useHospitalData } from '../../context/HospitalDataContext';
import { ClinicalDocumentModal } from '../../components/hospital/ClinicalDocumentModal';

export const BillsScreen = ({ navigation }) => {
  const { bills } = useHospitalData();
  const [localBills, setLocalBills] = useState(bills);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handlePay = (bill) => {
    Alert.alert(
      'Proceed to Payment',
      `Pay ₹${bill.amount?.toLocaleString('en-IN') || '4,250'} for Invoice #${bill.id} via Hospital UPI / NetBanking / TPA?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now (Simulated)',
          onPress: () => {
            setLocalBills((prev) =>
              prev.map((b) => (b.id === bill.id ? { ...b, paymentStatus: 'paid' } : b))
            );
            Alert.alert('Payment Successful', `Receipt generated for ₹${bill.amount}. Digilocker / GST invoice downloaded.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Hospital Invoices & TPA"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>OUTSTANDING & SETTLED INVOICES ({localBills.length})</Text>

        {localBills.map((bill) => {
          const isPaid = bill.paymentStatus === 'paid';

          return (
            <Card key={bill.id} style={styles.billCard}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.billId}>INVOICE #{bill.id}</Text>
                  <Text style={styles.billDate}>{bill.date || '06 Sep 2026'} • {bill.department || 'Cardiology OPD'}</Text>
                </View>
                <StatusBadge status={isPaid ? 'paid' : 'pending'} type="badge" />
              </View>

              {/* Items Breakdown */}
              <View style={styles.breakdownBox}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Clinical OPD & Consultation</Text>
                  <Text style={styles.itemVal}>₹800</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Diagnostic Labs & ECG</Text>
                  <Text style={styles.itemVal}>₹2,100</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Hospital Pharmacy Dispensation</Text>
                  <Text style={styles.itemVal}>₹1,350</Text>
                </View>
                <View style={[styles.itemRow, styles.insuranceRow]}>
                  <Text style={styles.insuranceLabel}>Insurance / TPA Coverage (Star Health)</Text>
                  <Text style={styles.insuranceVal}>- ₹1,500</Text>
                </View>
              </View>

              {/* Total Row */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Payable Total:</Text>
                <Text style={styles.totalAmount}>₹{bill.amount?.toLocaleString('en-IN') || '2,750'}</Text>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                {!isPaid ? (
                  <Button
                    title="Pay via UPI / Card"
                    variant="primary"
                    size="medium"
                    icon="card-outline"
                    onPress={() => handlePay(bill)}
                    style={styles.payBtn}
                  />
                ) : (
                  <Button
                    title="Download Tax Invoice (GST)"
                    variant="outline"
                    size="medium"
                    icon="download-outline"
                    onPress={() => setSelectedInvoice(bill)}
                    style={styles.payBtn}
                  />
                )}
              </View>
            </Card>
          );
        })}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Official Tax Invoice Modal */}
      <ClinicalDocumentModal
        visible={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        type="invoice"
        data={selectedInvoice}
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
  billCard: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  billId: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  billDate: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  breakdownBox: {
    backgroundColor: COLORS.offWhite,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemLabel: {
    fontSize: 12,
    color: COLORS.navyLight,
  },
  itemVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
  },
  insuranceRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: 4,
    paddingTop: 6,
  },
  insuranceLabel: {
    fontSize: 12,
    color: COLORS.hospitalTeal,
    fontWeight: '600',
  },
  insuranceVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalTeal,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
  },
  actions: {
    width: '100%',
  },
  payBtn: {
    width: '100%',
  },
});
