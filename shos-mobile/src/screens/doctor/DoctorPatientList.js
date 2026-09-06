import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { SearchBar } from '../../components/common/SearchBar';
import { Tabs } from '../../components/common/Tabs';
import { PatientCard } from '../../components/hospital/PatientCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useHospitalData } from '../../context/HospitalDataContext';

export const DoctorPatientList = ({ navigation }) => {
  const { patients } = useHospitalData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filterTabs = [
    { key: 'All', label: 'All (6)' },
    { key: 'waiting', label: 'Waiting (2)' },
    { key: 'in_consultation', label: 'In Room (1)' },
    { key: 'admitted', label: 'Ward (2)' },
  ];

  const filteredPatients = (patients || []).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uhid?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Doctor Patient Registry"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <View style={styles.filterSection}>
        <SearchBar
          placeholder="Search patient name, UHID, or token..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <Tabs
          tabs={filterTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              onPress={() => navigation.navigate('PatientClinicalView', { patient: p })}
            />
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            title="No Matching Patients"
            message="No patients found in this queue category."
          />
        )}
      </ScrollView>
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
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
