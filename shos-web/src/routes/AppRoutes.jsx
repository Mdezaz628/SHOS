import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_ROUTES, ROLES } from '../constants/roles';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Phase 3: Auth Screens
import {
  SplashScreen,
  WelcomeScreen,
  LoginScreen,
  RegisterScreen,
  OtpVerificationScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen
} from '../pages/auth';

// Phase 4: 15 Role Dashboards
import {
  PatientDashboard,
  DoctorDashboard,
  NurseDashboard,
  SupportDashboard,
  LabDashboard,
  PharmacyDashboard,
  AmbulanceDashboard,
  HousekeepingDashboard,
  ParkingDashboard,
  ReceptionDashboard,
  BillingDashboard,
  HRDashboard,
  DepartmentDashboard,
  AdminDashboard,
  SuperAdminDashboard
} from '../pages/dashboards';

export const AppRoutes = () => {
  const { isAuthenticated, currentRole } = useAuth();

  const roleHomeRoute = ROLE_ROUTES[currentRole] || '/admin';

  return (
    <Routes>
      {/* Root redirect: if authenticated -> role dashboard, else -> /welcome */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={roleHomeRoute} replace />
          ) : (
            <Navigate to="/welcome" replace />
          )
        }
      />

      {/* Phase 3: Authentication Routes */}
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/otp" element={<OtpVerificationScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />

      {/* Phase 4: 15 Role Protected Routes (wrapped in MainLayout) */}
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PatientDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DoctorDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/nurse/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NurseDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/support/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SupportDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/lab/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LabDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pharmacy/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PharmacyDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ambulance/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AmbulanceDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/housekeeping/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HousekeepingDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/parking/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ParkingDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reception/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReceptionDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BillingDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HRDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/department/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DepartmentDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SuperAdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
