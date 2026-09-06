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
import { LabReportCard } from '../../components/hospital/LabReportCard';
import { useHospitalData } from '../../context/HospitalDataContext';
import { ClinicalDocumentModal } from '../../components/hospital/ClinicalDocumentModal';

export const MedicalReports = ({ navigation }) => {
  const { labOrders } = useHospitalData();
  const [selectedReport, setSelectedReport] = React.useState(null);

  const handleOpenReport = (report) => {
    setSelectedReport(report);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Diagnostic & Lab Reports"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.hospitalTeal} />
          <Text style={styles.infoText}>
            All laboratory investigations are verified by NABL-accredited diagnostic pathologists. Click any report to view & print the official PDF.
          </Text>
        </View>

        <Text style={styles.sectionHeading}>
          REPORTS & INVESTIGATIONS ({(labOrders || []).length})
        </Text>

        {(labOrders || []).map((report) => (
          <LabReportCard
            key={report.id}
            report={report}
            onDownload={() => handleOpenReport(report)}
            onView={() => handleOpenReport(report)}
            onPress={() => handleOpenReport(report)}
          />
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

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
    fontSize: 12,
    color: COLORS.hospitalBlue,
    flex: 1,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
});
