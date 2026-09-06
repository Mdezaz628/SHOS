// Official Clinical Document & PDF Viewer Modal
// Displays digitally signed Lab Reports, Prescriptions (eRx), and GST Invoices

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../common/Modal';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Button } from '../common/Button';

export const ClinicalDocumentModal = ({
  visible,
  onClose,
  type = 'report', // 'report' | 'prescription' | 'invoice'
  data,
}) => {
  if (!data) return null;

  const handleShareOrPrint = async () => {
    try {
      const docTitle =
        type === 'report'
          ? `SHOS Lab Report - ${data.testName || 'Diagnostic'}`
          : type === 'prescription'
          ? `SHOS Digital Prescription - ${data.doctorName || 'Doctor'}`
          : `SHOS GST Hospital Invoice #${data.id || 'INV'}`;

      const summaryText =
        type === 'report'
          ? `SHOS Hospital Diagnostic Report\nTest: ${data.testName}\nCategory: ${data.category}\nOrdered by: ${data.orderedBy}\nDate: ${data.orderDate}\nStatus: ${data.status}\nVerification: NABL Accredited Digital Signature (Dr. R. K. Sen, MD Pathologist)`
          : type === 'prescription'
          ? `SHOS e-Prescription\nDoctor: ${data.doctorName} (${data.specialty})\nDiagnosis: ${data.diagnosis}\nDate: ${data.date}\nMedicines: ${(data.medicines || []).map((m) => `${m.name} (${m.dosage}) - ${m.frequency}`).join(', ')}`
          : `SHOS GST Hospital Tax Invoice #${data.id}\nDate: ${data.date || '06 Sep 2026'}\nPayable Total: ₹${data.amount || '2,750'}\nGSTIN: 07AAAAA0000A1Z5\nStatus: Paid (Settled)`;

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.print) {
          window.print();
        } else {
          Alert.alert('Document Ready', `${docTitle} downloaded successfully.`);
        }
      } else {
        await Share.share({
          title: docTitle,
          message: summaryText,
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to share or print document.');
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={
        type === 'report'
          ? 'Diagnostic Laboratory Report'
          : type === 'prescription'
          ? 'Digital Prescription (eRx)'
          : 'Hospital Tax Invoice (GST)'
      }
      subtitle="Digitally Signed Clinical Document"
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Close"
            variant="ghost"
            size="small"
            onPress={onClose}
          />
          <Button
            title={Platform.OS === 'web' ? 'Print / Save PDF' : 'Share / Download PDF'}
            variant="primary"
            size="small"
            icon={Platform.OS === 'web' ? 'print-outline' : 'download-outline'}
            onPress={handleShareOrPrint}
          />
        </View>
      }
    >
      <View style={styles.documentSheet}>
        {/* Hospital Official Letterhead */}
        <View style={styles.letterhead}>
          <View style={styles.hospitalBranding}>
            <View style={styles.logoBadge}>
              <Ionicons name="medical" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.hospitalName}>SHOS MULTISPECIALTY HOSPITAL</Text>
              <Text style={styles.hospitalMeta}>NABH & NABL Accredited Tertiary Healthcare</Text>
              <Text style={styles.hospitalAddress}>Plot 42, Health City, New Delhi - 110001 | Reg: DL/HOSP/2026/089</Text>
            </View>
          </View>
          <View style={styles.letterheadDivider} />
        </View>

        {/* Patient & Order Metadata */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>PATIENT NAME</Text>
            <Text style={styles.metaValue}>Rahul Sharma</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>UHID / MRN</Text>
            <Text style={styles.metaValue}>SHOS-2026-90214</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>AGE / GENDER</Text>
            <Text style={styles.metaValue}>34 Yrs / Male</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>DATE & TIME</Text>
            <Text style={styles.metaValue}>{data.orderDate || data.date || '06 Sep 2026'}</Text>
          </View>
        </View>

        {/* Specific Body Content */}
        {type === 'report' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>INVESTIGATION RESULTS: {data.testName?.toUpperCase()}</Text>
              <Text style={styles.refText}>SAMPLE: {data.sampleType || 'Venous Blood'} (BARCODE: {data.barcode || '782910'})</Text>
            </View>

            {/* Test Parameter Table */}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.th, { flex: 2 }]}>Investigation Test</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Observed</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Reference</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Status</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.td, { flex: 2, fontWeight: '700' }]}>{data.testName}</Text>
                <Text style={[styles.td, { flex: 1, textAlign: 'center', color: COLORS.hospitalTeal, fontWeight: '800' }]}>
                  {data.observedValue || '184 mg/dL'}
                </Text>
                <Text style={[styles.td, { flex: 1, textAlign: 'center', color: COLORS.slate }]}>
                  {data.refRange || '120 - 200 mg/dL'}
                </Text>
                <Text style={[styles.td, { flex: 1, textAlign: 'right', color: COLORS.emerald, fontWeight: '700' }]}>
                  NORMAL
                </Text>
              </View>

              {data.parameters?.map((param, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.td, { flex: 2 }]}>{param.name}</Text>
                  <Text style={[styles.td, { flex: 1, textAlign: 'center', fontWeight: '600' }]}>{param.value}</Text>
                  <Text style={[styles.td, { flex: 1, textAlign: 'center', color: COLORS.slate }]}>{param.unit}</Text>
                  <Text style={[styles.td, { flex: 1, textAlign: 'right', color: COLORS.emerald, fontWeight: '700' }]}>NORMAL</Text>
                </View>
              ))}
            </View>

            <View style={styles.clinicalNotes}>
              <Text style={styles.notesTitle}>PATHOLOGIST CLINICAL INTERPRETATION:</Text>
              <Text style={styles.notesBody}>
                {data.clinicalImpression ||
                  'Parameters are well within biological reference intervals for age & gender cohort. No immediate therapeutic intervention required. Correlate with clinical findings.'}
              </Text>
            </View>
          </View>
        )}

        {type === 'prescription' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CONSULTANT PHYSICIAN: {data.doctorName?.toUpperCase()}</Text>
              <Text style={styles.refText}>{data.specialty} • Reg. No. MCI-67891-DL</Text>
            </View>

            <View style={styles.diagnosisBanner}>
              <Text style={styles.diagLabel}>CLINICAL DIAGNOSIS:</Text>
              <Text style={styles.diagVal}>{data.diagnosis || 'Essential Hypertension with Mild Dyslipidemia'}</Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 14, marginBottom: 8 }]}>Rx (PRESCRIPTION MEDICINES):</Text>
            {(data.medicines || []).map((med, i) => (
              <View key={i} style={styles.rxItemBox}>
                <View style={styles.rxNumber}>
                  <Text style={styles.rxNumberText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rxMedName}>{med.name} <Text style={styles.rxDosage}>({med.dosage})</Text></Text>
                  <Text style={styles.rxTiming}>{med.frequency} • Duration: {med.duration}</Text>
                  <Text style={styles.rxInstructions}>Instructions: {med.instructions}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {type === 'invoice' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TAX INVOICE #{data.id || 'INV-2026-9901'}</Text>
              <Text style={styles.refText}>GSTIN: 07AAAAA0000A1Z5 • Cashless TPA / Direct</Text>
            </View>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.th, { flex: 3 }]}>Service / Item Description</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Amount (₹)</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.td, { flex: 3 }]}>Consultation & Clinical OPD Assessment</Text>
                <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>₹ 800.00</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.td, { flex: 3 }]}>Diagnostic Biochemistry & ECG Panels</Text>
                <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>₹ 2,100.00</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.td, { flex: 3 }]}>Central Pharmacy Medication Dispensation</Text>
                <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>₹ 1,350.00</Text>
              </View>
              <View style={[styles.tableRow, { backgroundColor: '#F0FDF4' }]}>
                <Text style={[styles.td, { flex: 3, color: COLORS.emerald, fontWeight: '700' }]}>TPA Insurance Settled (Star Health)</Text>
                <Text style={[styles.td, { flex: 1, textAlign: 'right', color: COLORS.emerald, fontWeight: '700' }]}>- ₹ 1,500.00</Text>
              </View>
            </View>

            <View style={styles.invoiceTotalBox}>
              <Text style={styles.invoiceTotalLabel}>Net Amount Paid:</Text>
              <Text style={styles.invoiceTotalVal}>₹ {data.amount || '2,750'}.00</Text>
            </View>
          </View>
        )}

        {/* Digital Signature & Verification Barcode */}
        <View style={styles.signatureRow}>
          <View style={styles.qrCol}>
            <View style={styles.qrBox}>
              <Ionicons name="qr-code-outline" size={44} color={COLORS.navy} />
            </View>
            <Text style={styles.qrText}>Scan for NABL / Ayushman Bharat Digital Verification</Text>
          </View>

          <View style={styles.signCol}>
            <Text style={styles.signScript}>Dr. R. K. Sen, MD</Text>
            <View style={styles.signLine} />
            <Text style={styles.signTitle}>Senior Pathologist & Medical Officer</Text>
            <Text style={styles.signHospital}>SHOS Diagnostic Services</Text>
            <Text style={styles.timestamp}>Digitally Authenticated: 06-Sep-2026 11:30 IST</Text>
          </View>
        </View>

        {/* Legal Disclaimer */}
        <Text style={styles.disclaimer}>
          This is an electronically generated and digitally authenticated report under Section 65B of the Indian Evidence Act.
          No physical signature is required. For inquiries, contact hospital support at +91 11 2345 6789.
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  documentSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  letterhead: {
    marginBottom: 10,
  },
  hospitalBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.hospitalBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalName: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 0.5,
  },
  hospitalMeta: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.hospitalTeal,
    marginTop: 1,
  },
  hospitalAddress: {
    fontSize: 8,
    color: COLORS.slate,
    marginTop: 1,
  },
  letterheadDivider: {
    height: 2,
    backgroundColor: COLORS.hospitalBlue,
    marginTop: 8,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaCol: {
    width: '50%',
    paddingVertical: 3,
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.slate,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 1,
  },
  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.hospitalBlue,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  refText: {
    fontSize: 9,
    color: COLORS.slate,
    marginTop: 2,
    fontWeight: '600',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableHeader: {
    backgroundColor: '#F8FAFC',
    borderBottomColor: '#CBD5E1',
  },
  th: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.navy,
    textTransform: 'uppercase',
  },
  td: {
    fontSize: 10,
    color: '#1E293B',
  },
  clinicalNotes: {
    backgroundColor: '#F0FDFA',
    borderRadius: 6,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.hospitalTeal,
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    marginBottom: 2,
  },
  notesBody: {
    fontSize: 10,
    color: '#0F766E',
    lineHeight: 14,
  },
  diagnosisBanner: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  diagLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#92400E',
  },
  diagVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78350F',
    marginTop: 2,
  },
  rxItemBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rxNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.hospitalBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rxNumberText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '800',
  },
  rxMedName: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.navy,
  },
  rxDosage: {
    color: COLORS.hospitalTeal,
    fontWeight: '700',
  },
  rxTiming: {
    fontSize: 9,
    color: COLORS.slate,
    marginTop: 2,
    fontWeight: '600',
  },
  rxInstructions: {
    fontSize: 9,
    color: '#475569',
    marginTop: 1,
    fontStyle: 'italic',
  },
  invoiceTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  invoiceTotalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
  },
  invoiceTotalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  qrCol: {
    alignItems: 'center',
    width: 100,
  },
  qrBox: {
    backgroundColor: '#F8FAFC',
    padding: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrText: {
    fontSize: 7,
    color: COLORS.slate,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 9,
  },
  signCol: {
    alignItems: 'flex-end',
  },
  signScript: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    fontStyle: 'italic',
  },
  signLine: {
    width: 130,
    height: 1,
    backgroundColor: '#94A3B8',
    marginVertical: 3,
  },
  signTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.navy,
  },
  signHospital: {
    fontSize: 8,
    color: COLORS.slate,
  },
  timestamp: {
    fontSize: 7,
    color: '#94A3B8',
    marginTop: 2,
  },
  disclaimer: {
    fontSize: 7,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 10,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
});

export default ClinicalDocumentModal;
