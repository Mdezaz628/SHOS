import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { ROLES } from '../constants/roles';

// Patient Screens
import { PatientDashboard } from '../screens/patient/PatientDashboard';
import { PatientProfile } from '../screens/patient/PatientProfile';
import { DoctorSearch } from '../screens/patient/DoctorSearch';
import { AppointmentBooking } from '../screens/patient/AppointmentBooking';
import { QueueScreen } from '../screens/patient/QueueScreen';
import { MedicalReports } from '../screens/patient/MedicalReports';
import { PrescriptionsScreen } from '../screens/patient/PrescriptionsScreen';
import { BillsScreen } from '../screens/patient/BillsScreen';
import { AdmissionBedScreen } from '../screens/patient/AdmissionBedScreen';
import { EmergencySOSScreen } from '../screens/patient/EmergencySOSScreen';
import { AmbulanceTrackingScreen } from '../screens/patient/AmbulanceTrackingScreen';

// Doctor Screens
import { DoctorDashboard } from '../screens/doctor/DoctorDashboard';
import { DoctorPatientList } from '../screens/doctor/DoctorPatientList';
import { PatientClinicalView } from '../screens/doctor/PatientClinicalView';

// Nurse Screens
import { NurseDashboard } from '../screens/nurse/NurseDashboard';
import { WardViewScreen } from '../screens/nurse/WardViewScreen';

// Operational Role Screens
import { WardBoyDashboard } from '../screens/wardboy/WardBoyDashboard';
import { LabDashboard } from '../screens/lab/LabDashboard';
import { PharmacyDashboard } from '../screens/pharmacy/PharmacyDashboard';
import { AmbulanceDriverDashboard } from '../screens/ambulance/AmbulanceDriverDashboard';
import { HousekeepingDashboard } from '../screens/housekeeping/HousekeepingDashboard';
import { ParkingDashboard } from '../screens/parking/ParkingDashboard';
import { ReceptionDashboard } from '../screens/reception/ReceptionDashboard';
import { BillingDashboard } from '../screens/billing/BillingDashboard';
import { HRDashboard } from '../screens/hr/HRDashboard';
import { DepartmentDashboard } from '../screens/department/DepartmentDashboard';

// Admin Screens
import { AdminCommandCenter } from '../screens/admin/AdminCommandCenter';
import { StaffGovernanceScreen } from '../screens/admin/StaffGovernanceScreen';
import { TomorrowHospitalPlan } from '../screens/admin/TomorrowHospitalPlan';
import { AIRecommendationCenter } from '../screens/admin/AIRecommendationCenter';
import { BedManagementScreen } from '../screens/admin/BedManagementScreen';
import { BloodBankScreen } from '../screens/admin/BloodBankScreen';
import { ResourceEquipmentScreen } from '../screens/admin/ResourceEquipmentScreen';

// Super Admin Screens
import { SuperAdminDashboard } from '../screens/superadmin/SuperAdminDashboard';
import { AuditLogsScreen } from '../screens/superadmin/AuditLogsScreen';
import { SecurityEventsScreen } from '../screens/superadmin/SecurityEventsScreen';

// Common Screens
import { NotificationsScreen } from '../screens/common/NotificationsScreen';
import { SettingsScreen } from '../screens/common/SettingsScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const commonScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

// -------------------------------------------------------------
// 1. PATIENT NAVIGATOR (Tab + Stack)
// -------------------------------------------------------------
const PatientTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.hospitalBlue,
      tabBarInactiveTintColor: COLORS.slate,
      tabBarStyle: {
        backgroundColor: COLORS.cardBg,
        borderTopColor: COLORS.borderLight,
        height: 60,
        paddingBottom: 8,
        paddingTop: 6,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '700',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = 'pulse';
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Doctors') iconName = focused ? 'search' : 'search-outline';
        else if (route.name === 'QueueTab') iconName = focused ? 'time' : 'time-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={22} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={PatientDashboard} options={{ tabBarLabel: 'Terminal' }} />
    <Tab.Screen name="Doctors" component={DoctorSearch} options={{ tabBarLabel: 'Specialists' }} />
    <Tab.Screen name="QueueTab" component={QueueScreen} options={{ tabBarLabel: 'Live Queue' }} />
    <Tab.Screen name="Profile" component={PatientProfile} options={{ tabBarLabel: 'Profile' }} />
  </Tab.Navigator>
);

export const PatientNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="PatientTabs" component={PatientTabNavigator} />
    <Stack.Screen name="DoctorSearch" component={DoctorSearch} />
    <Stack.Screen name="AppointmentBooking" component={AppointmentBooking} />
    <Stack.Screen name="Queue" component={QueueScreen} />
    <Stack.Screen name="MedicalReports" component={MedicalReports} />
    <Stack.Screen name="Prescriptions" component={PrescriptionsScreen} />
    <Stack.Screen name="Bills" component={BillsScreen} />
    <Stack.Screen name="AdmissionBed" component={AdmissionBedScreen} />
    <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} />
    <Stack.Screen name="AmbulanceTracking" component={AmbulanceTrackingScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 2. DOCTOR NAVIGATOR
// -------------------------------------------------------------
export const DoctorNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
    <Stack.Screen name="DoctorPatientList" component={DoctorPatientList} />
    <Stack.Screen name="PatientClinicalView" component={PatientClinicalView} />
    <Stack.Screen name="Queue" component={QueueScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 3. NURSE NAVIGATOR
// -------------------------------------------------------------
export const NurseNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="NurseDashboard" component={NurseDashboard} />
    <Stack.Screen name="WardView" component={WardViewScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 4. WARD BOY NAVIGATOR
// -------------------------------------------------------------
export const WardBoyNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="WardBoyDashboard" component={WardBoyDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 5. LAB NAVIGATOR
// -------------------------------------------------------------
export const LabNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="LabDashboard" component={LabDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 6. PHARMACY NAVIGATOR
// -------------------------------------------------------------
export const PharmacyNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="PharmacyDashboard" component={PharmacyDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 7. AMBULANCE NAVIGATOR
// -------------------------------------------------------------
export const AmbulanceNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="AmbulanceDriverDashboard" component={AmbulanceDriverDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 8. HOUSEKEEPING NAVIGATOR
// -------------------------------------------------------------
export const HousekeepingNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="HousekeepingDashboard" component={HousekeepingDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 9. PARKING NAVIGATOR
// -------------------------------------------------------------
export const ParkingNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="ParkingDashboard" component={ParkingDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 10. RECEPTION NAVIGATOR
// -------------------------------------------------------------
export const ReceptionNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="ReceptionDashboard" component={ReceptionDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 11. BILLING NAVIGATOR
// -------------------------------------------------------------
export const BillingNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="BillingDashboard" component={BillingDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 12. HR NAVIGATOR
// -------------------------------------------------------------
export const HRNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="HRDashboard" component={HRDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 13. DEPARTMENT NAVIGATOR
// -------------------------------------------------------------
export const DepartmentNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="DepartmentDashboard" component={DepartmentDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 14. ADMIN NAVIGATOR
// -------------------------------------------------------------
export const AdminNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="AdminCommandCenter" component={AdminCommandCenter} />
    <Stack.Screen name="StaffGovernance" component={StaffGovernanceScreen} />
    <Stack.Screen name="TomorrowHospitalPlan" component={TomorrowHospitalPlan} />
    <Stack.Screen name="AIRecommendationCenter" component={AIRecommendationCenter} />
    <Stack.Screen name="BedManagement" component={BedManagementScreen} />
    <Stack.Screen name="BloodBank" component={BloodBankScreen} />
    <Stack.Screen name="ResourceEquipment" component={ResourceEquipmentScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// -------------------------------------------------------------
// 15. SUPER ADMIN NAVIGATOR
// -------------------------------------------------------------
export const SuperAdminNavigator = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
    <Stack.Screen name="AuditLogs" component={AuditLogsScreen} />
    <Stack.Screen name="SecurityEvents" component={SecurityEventsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);
