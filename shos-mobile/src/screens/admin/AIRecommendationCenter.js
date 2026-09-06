import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { AIRecommendationCard } from '../../components/hospital/AIRecommendationCard';
import { useHospitalData } from '../../context/HospitalDataContext';

export const AIRecommendationCenter = ({ navigation }) => {
  const {
    aiRecommendations,
    approveRecommendation,
    rejectRecommendation,
  } = useHospitalData();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleApprove = (id) => {
    approveRecommendation(id);
    Alert.alert(
      'Recommendation Approved',
      `Recommendation #${id} has been verified by Medical Leadership and enacted into hospital operations.`
    );
  };

  const handleReject = (id) => {
    rejectRecommendation(id);
    Alert.alert('Recommendation Dismissed', `Recommendation #${id} dismissed.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="AI Decision Support Hub"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Safety Disclaimer Banner */}
        <View style={styles.safetyBox}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.hospitalTeal} />
          <View style={styles.safetyTextWrap}>
            <Text style={styles.safetyTitle}>NABH AI GOVERNANCE STANDARD</Text>
            <Text style={styles.safetyDesc}>
              All AI outputs are assistive clinical & operational decision support. Mandatory human verification required before execution.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>
          ACTIVE RECOMMENDATIONS ({aiRecommendations.length})
        </Text>

        {aiRecommendations.map((rec) => (
          <AIRecommendationCard
            key={rec.id}
            recommendation={rec}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}

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
  safetyBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.tealLight,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  safetyTextWrap: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
  },
  safetyDesc: {
    fontSize: 11,
    color: COLORS.navy,
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
});
