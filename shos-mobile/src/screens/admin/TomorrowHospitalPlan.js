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
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';

export const TomorrowHospitalPlan = ({ navigation }) => {
  const handleAcknowledge = () => {
    Alert.alert(
      'Operational Plan Enacted',
      'Tomorrow Hospital Plan approved by Medical Superintendent. Automated SMS alerts dispatched to department heads and duty rosters.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Tomorrow's Hospital Plan"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.bannerHeader}>
            <View style={styles.aiTag}>
              <Ionicons name="sparkles" size={14} color={COLORS.hospitalTeal} />
              <Text style={styles.aiTagText}>AI PREDICTIVE ENGINE (07 SEP 2026)</Text>
            </View>
            <Text style={styles.confidenceText}>Confidence: 94.8%</Text>
          </View>
          <Text style={styles.bannerHeadline}>Tomorrow Operational Demand Plan</Text>
          <Text style={styles.bannerSub}>
            Trained on 36 months historical clinical admission patterns, weather trends, and OPD scheduling data.
          </Text>
        </View>

        {/* Forecast Numbers */}
        <Text style={styles.sectionHeading}>PROJECTED VOLUME & CAPACITY</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Projected OPD"
            value="520"
            change="+24% vs Mon avg"
            changeType="warning"
            icon="people"
            color={COLORS.hospitalBlue}
          />
          <StatCard
            label="Emergency Surge"
            value="68%"
            change="High Risk 18:00+"
            changeType="negative"
            icon="warning"
            color={COLORS.triageRed}
          />
          <StatCard
            label="Peak Bed Need"
            value="92%"
            change="CCU Saturation"
            changeType="negative"
            icon="bed"
            color={COLORS.warning}
          />
          <StatCard
            label="Staff Shortage"
            value="+4 Needed"
            change="ER + Pediatrics"
            changeType="warning"
            icon="people-circle"
            color={COLORS.hospitalTeal}
          />
        </View>

        {/* Actionable Staffing Requirements */}
        <Text style={styles.sectionHeading}>AI STAFFING RECOMMENDATIONS</Text>
        <Card style={styles.reqCard}>
          <View style={styles.reqItem}>
            <Ionicons name="fitness" size={20} color={COLORS.hospitalBlue} />
            <View style={styles.reqMeta}>
              <Text style={styles.reqTitle}>Emergency Nursing: Deploy +3 Officers</Text>
              <Text style={styles.reqDesc}>Shift B (16:00 - 00:00) anticipated acute trauma surge</Text>
            </View>
          </View>

          <View style={[styles.reqItem, { borderBottomWidth: 0, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.borderLight }]}>
            <Ionicons name="medkit" size={20} color={COLORS.hospitalTeal} />
            <View style={styles.reqMeta}>
              <Text style={styles.reqTitle}>Pediatric OPD: Add 1 On-Call Specialist</Text>
              <Text style={styles.reqDesc}>Seasonal viral respiratory cases expected +35%</Text>
            </View>
          </View>
        </Card>

        {/* Resource Allocation Checklist */}
        <Text style={styles.sectionHeading}>RESOURCE ALLOCATION CHECKLIST</Text>
        <Card style={styles.reqCard}>
          <View style={styles.checkRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.triageGreen} />
            <Text style={styles.checkText}>Reserve 4 Stepdown Beds in Ward B by 12:00 PM</Text>
          </View>
          <View style={styles.checkRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.triageGreen} />
            <Text style={styles.checkText}>Replenish 20 Units O-Negative PRBC at Blood Bank</Text>
          </View>
          <View style={styles.checkRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.triageGreen} />
            <Text style={styles.checkText}>Pre-warm Operation Theater 3 for Emergency Vascular Cases</Text>
          </View>
        </Card>

        {/* Enact Plan Button */}
        <Button
          title="Enact Tomorrow Hospital Plan"
          variant="primary"
          size="large"
          icon="shield-checkmark"
          onPress={handleAcknowledge}
          style={styles.enactBtn}
        />

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
  aiBanner: {
    backgroundColor: COLORS.navy,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  aiTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
  },
  confidenceText: {
    fontSize: 10,
    color: COLORS.slateLight,
    fontWeight: '600',
  },
  bannerHeadline: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.cardBg,
  },
  bannerSub: {
    fontSize: 12,
    color: COLORS.slateLight,
    marginTop: 4,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  reqCard: {
    marginBottom: 16,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reqMeta: {
    flex: 1,
  },
  reqTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  reqDesc: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  checkText: {
    fontSize: 12,
    color: COLORS.navy,
    flex: 1,
  },
  enactBtn: {
    width: '100%',
  },
});
