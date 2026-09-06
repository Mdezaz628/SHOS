import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { ROLES } from '../constants/roles';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { RoleSwitcherModal } from './RoleSwitcherModal';

import {
  PatientNavigator,
  DoctorNavigator,
  NurseNavigator,
  WardBoyNavigator,
  LabNavigator,
  PharmacyNavigator,
  AmbulanceNavigator,
  HousekeepingNavigator,
  ParkingNavigator,
  ReceptionNavigator,
  BillingNavigator,
  HRNavigator,
  DepartmentNavigator,
  AdminNavigator,
  SuperAdminNavigator,
} from './RoleNavigators';

export const RootNavigator = () => {
  const { currentUser, currentRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.hospitalBlue} />
      </View>
    );
  }

  // If unauthenticated, show Auth stack
  if (!currentUser) {
    return (
      <>
        <AuthNavigator />
        <RoleSwitcherModal />
      </>
    );
  }

  // Render role-specific navigation tree
  const renderRoleNavigator = () => {
    switch (currentRole) {
      case ROLES.DOCTOR:
        return <DoctorNavigator />;
      case ROLES.NURSE:
        return <NurseNavigator />;
      case ROLES.WARDBOY:
        return <WardBoyNavigator />;
      case ROLES.LAB:
        return <LabNavigator />;
      case ROLES.PHARMACY:
        return <PharmacyNavigator />;
      case ROLES.AMBULANCE:
        return <AmbulanceNavigator />;
      case ROLES.HOUSEKEEPING:
        return <HousekeepingNavigator />;
      case ROLES.PARKING:
        return <ParkingNavigator />;
      case ROLES.RECEPTION:
        return <ReceptionNavigator />;
      case ROLES.BILLING:
        return <BillingNavigator />;
      case ROLES.HR:
        return <HRNavigator />;
      case ROLES.DEPARTMENT:
        return <DepartmentNavigator />;
      case ROLES.ADMIN:
        return <AdminNavigator />;
      case ROLES.SUPERADMIN:
        return <SuperAdminNavigator />;
      case ROLES.PATIENT:
      default:
        return <PatientNavigator />;
    }
  };

  return (
    <>
      {renderRoleNavigator()}
      <RoleSwitcherModal />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
  },
});

export default RootNavigator;
