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
import { SearchBar } from '../../components/common/SearchBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { useHospitalData } from '../../context/HospitalDataContext';
import { ClinicalDocumentModal } from '../../components/hospital/ClinicalDocumentModal';

export const MedicalReports = ({ navigation }) => {
  const { labOrders } = useHospitalData();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [findingsModalReport, setFindingsModalReport] = useState(null);

  const categories = [
    { id: 'all', label: 'All Reports' },
    { id: 'blood', label: 'Blood Test' },
    { id: 'xray', label: 'X-Ray' },
    { id: 'ct', label: 'CT Scan' },
    { id: 'mri', label: 'MRI' },
    { id: 'prescription', label: 'Prescription' },
    { id: 'discharge', label: 'Discharge Summary' },
  ];

  // Comprehensive reports dataset matching web specification
  const reportsList = [
    {
      id: 'REP-001',
      testName: 'Comprehensive Lipid Profile & Liver Function Panel',
      category: 'blood',
      categoryLabel: 'Blood Test',
      date: '05 Sep 2026',
      doctor: 'Dr. Vivek Mehra',
      status: 'completed',
      specimen: 'Venous Whole Blood (Serum)',
      labTechnician: 'Pathologist Dr. Anita Rao (MD)',
      findings: 'Serum Total Cholesterol: 184 mg/dL (Normal: <200). Triglycerides: 142 mg/dL. HDL: 46 mg/dL. Liver enzymes AST/ALT within normal limits.',
      parameters: [
        { name: 'Total Cholesterol', value: '184 mg/dL', range: '< 200 mg/dL', flag: 'Normal' },
        { name: 'Triglycerides', value: '142 mg/dL', range: '< 150 mg/dL', flag: 'Normal' },
        { name: 'HDL Cholesterol', value: '46 mg/dL', range: '> 40 mg/dL', flag: 'Normal' },
        { name: 'LDL Cholesterol', value: '109 mg/dL', range: '< 100 mg/dL', flag: 'Borderline' },
        { name: 'SGOT / AST', value: '28 U/L', range: '10 - 40 U/L', flag: 'Normal' },
        { name: 'SGPT / ALT', value: '31 U/L', range: '7 - 56 U/L', flag: 'Normal' },
      ],
    },
    {
      id: 'REP-002',
      testName: 'Chest X-Ray PA View (Digital Radiography)',
      category: 'xray',
      categoryLabel: 'X-Ray',
      date: '02 Sep 2026',
      doctor: 'Dr. S. K. Gupta',
      status: 'completed',
      specimen: 'High-Res Digital Imaging',
      labTechnician: 'Radiologist Dr. S. K. Gupta',
      findings: 'Bilateral lung fields clear. No focal consolidation, pneumothorax, or pleural effusion. Cardiothoracic ratio is normal (CTR < 0.5).',
      parameters: [
        { name: 'Cardiothoracic Ratio', value: '0.46', range: '< 0.50', flag: 'Normal' },
        { name: 'Pulmonary Parenchyma', value: 'Clear', range: 'Clear', flag: 'Normal' },
        { name: 'Costophrenic Angles', value: 'Sharp', range: 'Sharp', flag: 'Normal' },
      ],
    },
    {
      id: 'REP-003',
      testName: 'High-Resolution Computed Tomography (HRCT Chest)',
      category: 'ct',
      categoryLabel: 'CT Scan',
      date: '28 Aug 2026',
      doctor: 'Dr. S. K. Gupta',
      status: 'completed',
      specimen: 'Multi-slice 128-Slice CT',
      labTechnician: 'Senior Imaging Tech Rajan',
      findings: 'Mild bronchial wall thickening observed. No bronchiectasis or pulmonary thromboembolism. Visualized coronary calcification minimal.',
      parameters: [
        { name: 'Coronary Calcium Score', value: 'Minimal (<10)', range: '0 - 10', flag: 'Normal' },
        { name: 'Mediastinal Nodes', value: 'Non-enlarged', range: '< 10 mm', flag: 'Normal' },
      ],
    },
    {
      id: 'REP-004',
      testName: 'Magnetic Resonance Imaging (MRI Brain & Angio)',
      category: 'mri',
      categoryLabel: 'MRI',
      date: '15 Jul 2026',
      doctor: 'Dr. Rohan Mathur',
      status: 'completed',
      specimen: '3.0 Tesla High-Field MRI',
      labTechnician: 'Neuro-Radiologist Dr. Mathur',
      findings: 'Normal cerebral hemispheres without acute infarct or hemorrhage. Major intracranial flow voids preserved. Ventricles and sulci normal for age.',
      parameters: [
        { name: 'Intracranial Flow', value: 'Preserved', range: 'Patent', flag: 'Normal' },
        { name: 'White Matter', value: 'No acute ischemia', range: 'Normal', flag: 'Normal' },
      ],
    },
    {
      id: 'REP-005',
      testName: 'Cardiology Post-Consultation Prescription',
      category: 'prescription',
      categoryLabel: 'Prescription',
      date: '05 Sep 2026',
      doctor: 'Dr. Vivek Mehra',
      status: 'completed',
      specimen: 'OPD Clinical Evaluation',
      labTechnician: 'Clinical Pharmacologist Dr. Roy',
      findings: 'Tab Atorvastatin 20mg (1-0-0), Tab Amlodipine 5mg (0-0-1). Continue low-sodium diet and daily 30m aerobic walk.',
      parameters: [
        { name: 'Blood Pressure Target', value: '< 130/80 mmHg', range: '< 130/80', flag: 'Target' },
        { name: 'Follow-up Interval', value: '4 Weeks', range: 'Monthly', flag: 'Scheduled' },
      ],
    },
    {
      id: 'REP-006',
      testName: 'Inpatient Ward Discharge Summary (Elective Observation)',
      category: 'discharge',
      categoryLabel: 'Discharge Summary',
      date: '18 Jan 2026',
      doctor: 'Dr. Radhika Roy',
      status: 'completed',
      specimen: 'IPD Record #8942',
      labTechnician: 'Chief Medical Registrar',
      findings: 'Discharged in stable clinical condition. Vitals stable at discharge: BP 120/78 mmHg, PR 72/min, SpO2 99% on room air. Ambulation normal.',
      parameters: [
        { name: 'Discharge Condition', value: 'Clinically Stable', range: 'Stable', flag: 'Normal' },
        { name: 'Mobility Status', value: 'Full Ambulation', range: 'Normal', flag: 'Normal' },
      ],
    },
  ];

  // Merge with any dynamic labOrders
  const combinedReports = [
    ...reportsList,
    ...(labOrders || []).map((lo) => ({
      id: lo.id || `LAB-${Math.floor(100 + Math.random() * 900)}`,
      testName: lo.testName || 'Diagnostic Panel',
      category: 'blood',
      categoryLabel: 'Blood Test',
      date: lo.date || 'Today',
      doctor: lo.doctorName || 'Dr. Vivek Mehra',
      status: lo.status || 'completed',
      specimen: 'Blood Specimen',
      labTechnician: 'NABL Certified Diagnostic Lab',
      findings: lo.findings || 'Test specimen processed successfully. Parameters within clinical threshold.',
      parameters: [
        { name: 'Result Index', value: 'Normal', range: 'Standard Range', flag: 'Normal' },
      ],
    })),
  ];

  const filtered = combinedReports.filter((r) => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      r.testName.toLowerCase().includes(query) ||
      r.doctor.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Diagnostic & Lab Reports"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <View style={styles.filterSection}>
        <SearchBar
          placeholder="Search by test name, doctor or ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Category Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catChips}
        >
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.catChip,
                activeCategory === c.id && styles.catChipActive,
              ]}
              onPress={() => setActiveCategory(c.id)}
            >
              <Text
                style={[
                  styles.catChipText,
                  activeCategory === c.id && styles.catChipTextActive,
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.hospitalTeal} />
          <Text style={styles.infoText}>
            NABL-accredited diagnostic reports with encrypted digital signatures. Tap any report to inspect clinical findings or generate official PDF.
          </Text>
        </View>

        <Text style={styles.sectionHeading}>
          REPORTS & INVESTIGATIONS ({filtered.length})
        </Text>

        {filtered.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCard}
            activeOpacity={0.8}
            onPress={() => setFindingsModalReport(report)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>{report.categoryLabel}</Text>
              </View>
              <StatusBadge status={report.status} type="badge" />
            </View>

            <Text style={styles.testTitle}>{report.testName}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={13} color={COLORS.slate} />
                <Text style={styles.metaText}>{report.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={13} color={COLORS.slate} />
                <Text style={styles.metaText}>{report.doctor}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="barcode-outline" size={13} color={COLORS.hospitalBlue} />
                <Text style={[styles.metaText, { color: COLORS.hospitalBlue, fontWeight: '700' }]}>
                  {report.id}
                </Text>
              </View>
            </View>

            <Text style={styles.findingsSnippet} numberOfLines={2}>
              {report.findings}
            </Text>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.viewFindingsBtn}
                onPress={() => setFindingsModalReport(report)}
              >
                <Ionicons name="eye-outline" size={14} color={COLORS.hospitalBlue} />
                <Text style={styles.viewFindingsText}>Detailed Findings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pdfBtn}
                onPress={() => setSelectedReport(report)}
              >
                <Ionicons name="document-text-outline" size={14} color={COLORS.cardBg} />
                <Text style={styles.pdfBtnText}>Print PDF</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Detailed Clinical Findings Modal (Web Parity) */}
      <Modal
        visible={!!findingsModalReport}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFindingsModalReport(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalBadge}>{findingsModalReport?.categoryLabel}</Text>
                <Text style={styles.modalTitle}>{findingsModalReport?.testName}</Text>
                <Text style={styles.modalSubtitle}>Ref ID: {findingsModalReport?.id} • {findingsModalReport?.date}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setFindingsModalReport(null)}
              >
                <Ionicons name="close" size={20} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              <View style={styles.clinicalBox}>
                <Text style={styles.clinicalHeader}>LABORATORY CLINICAL SUMMARY</Text>
                <Text style={styles.findingsFullText}>{findingsModalReport?.findings}</Text>
                <View style={styles.doctorSignRow}>
                  <Text style={styles.doctorSignText}>Verified by: {findingsModalReport?.doctor}</Text>
                  <Text style={styles.technicianText}>{findingsModalReport?.labTechnician}</Text>
                </View>
              </View>

              {/* Parameters Table */}
              {findingsModalReport?.parameters && (
                <View style={styles.paramTable}>
                  <Text style={styles.paramTableHeader}>INVESTIGATION PARAMETERS</Text>
                  {findingsModalReport.parameters.map((p, idx) => (
                    <View key={idx} style={styles.paramRow}>
                      <View style={{ flex: 1.5 }}>
                        <Text style={styles.paramName}>{p.name}</Text>
                        <Text style={styles.paramRange}>Ref: {p.range}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', flex: 1 }}>
                        <Text style={styles.paramVal}>{p.value}</Text>
                        <View style={[styles.flagBadge, p.flag === 'Normal' ? styles.flagNormal : styles.flagAlert]}>
                          <Text style={[styles.flagText, p.flag === 'Normal' ? styles.flagNormalText : styles.flagAlertText]}>
                            {p.flag}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Download Official NABL PDF"
                variant="primary"
                size="medium"
                icon="download-outline"
                onPress={() => {
                  const rep = findingsModalReport;
                  setFindingsModalReport(null);
                  setSelectedReport(rep);
                }}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Official Diagnostic PDF Modal */}
      <ClinicalDocumentModal
        visible={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        type="report"
        data={selectedReport}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.cardBg,
  },
  catChips: {
    gap: 8,
    paddingVertical: 10,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catChipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
  },
  catChipTextActive: {
    color: COLORS.cardBg,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.hospitalBlue,
    flex: 1,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  reportCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    textTransform: 'uppercase',
  },
  testTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.slate,
  },
  findingsSnippet: {
    fontSize: 12,
    color: COLORS.navyLight,
    lineHeight: 16,
    backgroundColor: COLORS.offWhite,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  viewFindingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewFindingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.hospitalBlue,
  },
  pdfBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cardBg,
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
  },
  modalSubtitle: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicalBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  clinicalHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  findingsFullText: {
    fontSize: 13,
    color: COLORS.navy,
    lineHeight: 18,
  },
  doctorSignRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  doctorSignText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
  },
  technicianText: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 1,
  },
  paramTable: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
  },
  paramTableHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  paramName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  paramRange: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 1,
  },
  paramVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
  flagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  flagNormal: {
    backgroundColor: '#DCFCE7',
  },
  flagAlert: {
    backgroundColor: '#FEF3C7',
  },
  flagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  flagNormalText: {
    color: '#16A34A',
  },
  flagAlertText: {
    color: '#D97706',
  },
  modalFooter: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
});
