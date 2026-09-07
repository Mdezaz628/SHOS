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
import { DoctorCard } from '../../components/hospital/DoctorCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useHospitalData } from '../../context/HospitalDataContext';

export const DoctorSearch = ({ navigation }) => {
  const { doctors } = useHospitalData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = [
    'All',
    'Cardiology',
    'Pulmonology',
    'Orthopaedics',
    'Neurology',
    'General Medicine',
    'Pediatrics',
    'Dermatology',
  ];

  const filteredDoctors = (doctors || []).filter((doc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      (doc.name || '').toLowerCase().includes(query) ||
      (doc.department || '').toLowerCase().includes(query) ||
      (doc.specialty || '').toLowerCase().includes(query) ||
      (doc.qualification || '').toLowerCase().includes(query);
    const matchesDept =
      selectedDept === 'All' ||
      (doc.department || '').toLowerCase().includes(selectedDept.toLowerCase()) ||
      (doc.specialty || '').toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Find a Specialist"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <View style={styles.searchSection}>
        <SearchBar
          placeholder="Search by doctor name or condition..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Department Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deptChips}
        >
          {departments.map((dept) => (
            <TouchableOpacity
              key={dept}
              style={[
                styles.deptChip,
                selectedDept === dept && styles.deptChipActive,
              ]}
              onPress={() => setSelectedDept(dept)}
            >
              <Text
                style={[
                  styles.deptChipText,
                  selectedDept === dept && styles.deptChipTextActive,
                ]}
              >
                {dept}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsCount}>
          AVAILABLE DOCTORS ({filteredDoctors.length})
        </Text>

        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onBook={(d) => navigation.navigate('AppointmentBooking', { doctor: d })}
              onPress={() => navigation.navigate('AppointmentBooking', { doctor: doc })}
            />
          ))
        ) : (
          <EmptyState
            icon="search-outline"
            title="No Specialists Found"
            message="Try searching for a different name, department, or medical condition."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedDept('All');
            }}
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
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  deptChips: {
    gap: 8,
    paddingVertical: 8,
  },
  deptChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deptChipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
  },
  deptChipTextActive: {
    color: COLORS.cardBg,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
});
