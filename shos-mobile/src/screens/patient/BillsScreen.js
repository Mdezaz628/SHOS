import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
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
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payModalBill, setPayModalBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  // Line items breakdown matching web specification:
  // Consultation, Lab, Medicine, Room, Procedure, Emergency
  const defaultItems = [
    { category: 'Consultation', description: 'OPD Senior Specialist Consultation (Dr. Vivek Mehra)', amount: 800.0 },
    { category: 'Lab & Pathology', description: 'Comprehensive Lipid Profile & Liver Function Panel', amount: 1200.0 },
    { category: 'Medicine', description: 'Outpatient Pharmacy Dispensation (Atorvastatin, Amlodipine)', amount: 650.0 },
    { category: 'Room', description: 'Day Care Observation Bed (3 Hours)', amount: 900.0 },
    { category: 'Procedure', description: '12-Lead Electrocardiogram (ECG) & BP Profiling', amount: 450.0 },
    { category: 'Emergency', description: 'Trauma Triage & Nursing Care Assessment', amount: 350.0 },
  ];

  const subtotal = defaultItems.reduce((acc, item) => acc + item.amount, 0); // 4350
  const tax = subtotal * 0.05; // 217.50
  const concession = 200.0;
  const insuranceCover = 2500.0; // Star Health TPA Cashless Pre-authorization
  const netPayable = Math.max(0, subtotal + tax - concession - insuranceCover); // ~1867.50

  const [localBills, setLocalBills] = useState([
    {
      id: 'SHOS-INV-2026-9901',
      date: '06 Sep 2026',
      department: 'Cardiology & Emergency Triage',
      paymentStatus: 'pending',
      subtotal: subtotal,
      tax: tax,
      concession: concession,
      insuranceCover: insuranceCover,
      insuranceProvider: 'Star Health & Allied Insurance',
      amount: netPayable,
      items: defaultItems,
    },
    {
      id: 'SHOS-INV-2026-8842',
      date: '15 Aug 2026',
      department: 'Pathology & Radiology Diagnostic',
      paymentStatus: 'paid',
      subtotal: 2400.0,
      tax: 120.0,
      concession: 0,
      insuranceCover: 1800.0,
      insuranceProvider: 'HDFC ERGO Cashless',
      amount: 720.0,
      items: [
        { category: 'Lab & Pathology', description: 'Thyroid Panel & HbA1c Glycated Hemoglobin', amount: 1400.0 },
        { category: 'Procedure', description: 'Chest X-Ray Digital Single View', amount: 1000.0 },
      ],
    },
  ]);

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const targetId = payModalBill.id;
      setLocalBills((prev) =>
        prev.map((b) => (b.id === targetId ? { ...b, paymentStatus: 'paid' } : b))
      );
      const paidBill = { ...payModalBill, paymentStatus: 'paid' };
      setPayModalBill(null);
      Alert.alert(
        'Payment Successful! 🎉',
        `₹${paidBill.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} received via ${paymentMethod.toUpperCase()}.\n\nGST Tax Invoice receipt generated. Digilocker copy synced.`,
        [
          {
            text: 'Download GST Invoice',
            onPress: () => setSelectedInvoice(paidBill),
          },
          { text: 'Done', style: 'cancel' },
        ]
      );
    }, 1200);
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
        {/* Cashless Insurance Desk Banner */}
        <View style={styles.tpaCard}>
          <View style={styles.tpaIconWrap}>
            <Ionicons name="shield-checkmark" size={22} color={COLORS.hospitalTeal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tpaTitle}>Cashless TPA Pre-Auth Active</Text>
            <Text style={styles.tpaSub}>
              Star Health Insurance cashless claim approved for ₹2,500. Deducted automatically at billing terminal.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>
          OUTSTANDING & SETTLED INVOICES ({localBills.length})
        </Text>

        {localBills.map((bill) => {
          const isPaid = bill.paymentStatus === 'paid';

          return (
            <Card key={bill.id} style={styles.billCard}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.billId}>INVOICE #{bill.id}</Text>
                  <Text style={styles.billDate}>{bill.date} • {bill.department}</Text>
                </View>
                <StatusBadge status={isPaid ? 'paid' : 'pending'} type="badge" />
              </View>

              {/* Itemized Categories Breakdown (Web Feature Parity) */}
              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownHeader}>ITEMIZED CLINICAL EXPENSES</Text>
                {bill.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                      <Text style={styles.itemDesc}>{item.description}</Text>
                    </View>
                    <Text style={styles.itemVal}>₹{item.amount.toLocaleString('en-IN')}</Text>
                  </View>
                ))}

                <View style={styles.divider} />

                {/* Subtotal & Tax */}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryVal}>₹{bill.subtotal.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Healthcare GST (5%)</Text>
                  <Text style={styles.summaryVal}>+ ₹{bill.tax.toFixed(2)}</Text>
                </View>
                {bill.concession > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: COLORS.triageGreen }]}>Hospital Senior Concession</Text>
                    <Text style={[styles.summaryVal, { color: COLORS.triageGreen }]}>- ₹{bill.concession.toFixed(2)}</Text>
                  </View>
                )}
                {bill.insuranceCover > 0 && (
                  <View style={[styles.summaryRow, styles.insuranceRow]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="shield-checkmark" size={14} color={COLORS.hospitalTeal} />
                      <Text style={styles.insuranceLabel}>TPA Insurance ({bill.insuranceProvider})</Text>
                    </View>
                    <Text style={styles.insuranceVal}>- ₹{bill.insuranceCover.toFixed(2)}</Text>
                  </View>
                )}
              </View>

              {/* Total Row */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Payable Total:</Text>
                <Text style={styles.totalAmount}>
                  {isPaid ? '₹0.00 (PAID)' : `₹${bill.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                {!isPaid ? (
                  <Button
                    title="Pay via UPI / Card / NetBanking"
                    variant="primary"
                    size="medium"
                    icon="card-outline"
                    onPress={() => setPayModalBill(bill)}
                    style={styles.payBtn}
                  />
                ) : (
                  <Button
                    title="Download Official Tax Invoice (GST)"
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

      {/* Interactive Payment Modal (Web Feature Parity) */}
      <Modal
        visible={!!payModalBill}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPayModalBill(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Settle Hospital Invoice</Text>
                <Text style={styles.modalSubtitle}>Invoice #{payModalBill?.id}</Text>
              </View>
              <TouchableOpacity onPress={() => setPayModalBill(null)}>
                <Ionicons name="close" size={22} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            <View style={styles.amountDisplay}>
              <Text style={styles.amountLabel}>NET PAYABLE AMOUNT</Text>
              <Text style={styles.amountBig}>
                ₹{payModalBill?.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </Text>
              <Text style={styles.taxInclusive}>Includes all diagnostic & pharmacy charges (5% GST)</Text>
            </View>

            {/* Payment Method Selector */}
            <Text style={styles.methodTitle}>SELECT PAYMENT METHOD</Text>
            <View style={styles.methodRow}>
              {[
                { id: 'upi', label: 'Instant UPI', icon: 'flash' },
                { id: 'card', label: 'Card (Debit/Credit)', icon: 'card' },
                { id: 'netbanking', label: 'Net Banking', icon: 'business' },
              ].map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.methodBtn,
                    paymentMethod === m.id && styles.methodBtnActive,
                  ]}
                  onPress={() => setPaymentMethod(m.id)}
                >
                  <Ionicons
                    name={m.icon}
                    size={16}
                    color={paymentMethod === m.id ? COLORS.cardBg : COLORS.navy}
                  />
                  <Text
                    style={[
                      styles.methodText,
                      paymentMethod === m.id && styles.methodTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {paymentMethod === 'upi' && (
              <View style={styles.upiBox}>
                <Text style={styles.upiBoxLabel}>Supported UPI Apps:</Text>
                <View style={styles.upiAppsRow}>
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app, i) => (
                    <View key={i} style={styles.upiAppBadge}>
                      <Text style={styles.upiAppText}>{app}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.upiHandleText}>Virtual Payment Address: <Text style={{ fontWeight: '700', color: COLORS.hospitalBlue }}>{upiId}</Text></Text>
              </View>
            )}

            <Button
              title={isProcessing ? 'Contacting Payment Gateway...' : `Authorize ₹${payModalBill?.amount.toFixed(2)} Payment`}
              variant="primary"
              size="large"
              icon="lock-closed"
              onPress={handleConfirmPayment}
              loading={isProcessing}
              style={{ width: '100%', marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>

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
  tpaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    gap: 12,
  },
  tpaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 118, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tpaTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  tpaSub: {
    fontSize: 11,
    color: COLORS.navy,
    lineHeight: 15,
    marginTop: 2,
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
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
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
    borderRadius: 12,
    marginBottom: 12,
  },
  breakdownHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    textTransform: 'uppercase',
  },
  itemDesc: {
    fontSize: 12,
    color: COLORS.navy,
    marginTop: 1,
  },
  itemVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.slate,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
  },
  insuranceRow: {
    backgroundColor: '#F0FDF4',
    padding: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  insuranceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalTeal,
  },
  insuranceVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  amountDisplay: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
  },
  amountBig: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
    marginVertical: 4,
  },
  taxInclusive: {
    fontSize: 11,
    color: COLORS.slate,
  },
  methodTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  methodBtnActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  methodText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
  },
  methodTextActive: {
    color: COLORS.cardBg,
  },
  upiBox: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  upiBoxLabel: {
    fontSize: 10,
    color: COLORS.slate,
    fontWeight: '600',
    marginBottom: 6,
  },
  upiAppsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  upiAppBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  upiAppText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  upiHandleText: {
    fontSize: 11,
    color: COLORS.navy,
  },
});
