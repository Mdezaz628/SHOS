// Authentication Service Layer
// Integrated with SHOS Unified Backend API

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { DEMO_PRESETS, ROLES } from '../constants/roles';

export const authService = {
  // Login with email and password via unified backend
  login: async (email, password, selectedRole) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.success && res.data.user) {
        const user = res.data.user;
        const token = res.data.token;
        await AsyncStorage.setItem('@shos_user', JSON.stringify(user));
        await AsyncStorage.setItem('@shos_token', token);
        await AsyncStorage.setItem('@shos_role', user.role);
        return { success: true, user, token };
      }
    } catch (err) {
      console.log('[authService] Backend login fallback to local session:', err.message);
    }

    // Fallback if backend offline
    const matchedPreset = DEMO_PRESETS.find((p) => p.email.toLowerCase() === email.toLowerCase()) || {
      role: selectedRole || ROLES.PATIENT,
      name: email.split('@')[0] || 'Clinical User',
      email: email,
    };

    const user = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      email: matchedPreset.email,
      name: matchedPreset.name,
      role: selectedRole || matchedPreset.role,
      token: 'shos-jwt-fallback-' + Date.now(),
    };

    await AsyncStorage.setItem('@shos_user', JSON.stringify(user));
    await AsyncStorage.setItem('@shos_token', user.token);
    await AsyncStorage.setItem('@shos_role', user.role);

    return { success: true, user };
  },

  // Register new patient via backend - Dispatches OTP and requires OTP verification
  register: async (formData) => {
    try {
      // 1. Create account in backend
      const res = await apiClient.post('/auth/register', {
        name: formData.fullName || formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // 2. Dispatch real OTP email to user's registered email
      try {
        await apiClient.post('/auth/forgot-password', { email: formData.email });
        console.log('[authService] Registration OTP dispatched to:', formData.email);
      } catch (otpErr) {
        console.warn('[authService] Could not trigger OTP email:', otpErr.message);
      }

      if (res.data?.success && res.data.user) {
        const user = res.data.user;
        const token = res.data.token;
        // Do NOT log in immediately into active state; store pending registration
        await AsyncStorage.setItem('@shos_pending_user', JSON.stringify(user));
        await AsyncStorage.setItem('@shos_pending_token', token);
        return { success: true, user, token, requiresOtp: true };
      }
    } catch (err) {
      console.log('[authService] Backend register error:', err.message);
      // Even if network fallback, trigger OTP attempt
      try {
        await apiClient.post('/auth/forgot-password', { email: formData.email });
      } catch (e) {}
    }

    // Fallback if offline
    const user = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      uhid: 'SHOS-2026-' + (formData.phone ? formData.phone.slice(-4) : '8942'),
      name: formData.fullName || formData.name,
      email: formData.email,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup || 'B+',
      role: ROLES.PATIENT,
      token: 'shos-jwt-patient-' + Date.now(),
    };

    await AsyncStorage.setItem('@shos_pending_user', JSON.stringify(user));
    await AsyncStorage.setItem('@shos_pending_token', user.token);

    return { success: true, user, requiresOtp: true };
  },

  // Send OTP for Forgot Password / Verification via backend
  forgotPassword: async (email) => {
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      return { success: true, message: res.data?.message || 'OTP sent successfully.' };
    } catch (err) {
      console.log('[authService] forgotPassword error:', err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Could not send OTP. Check backend connection.',
      };
    }
  },

  // Resend OTP
  resendOtp: async (email) => {
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      return { success: true, message: res.data?.message || 'OTP resent successfully.' };
    } catch (err) {
      return { success: false, message: 'Could not resend OTP.' };
    }
  },

  // Verify OTP via backend
  verifyOtp: async (otp, email) => {
    try {
      const res = await apiClient.post('/auth/verify-otp', { otp, email });
      return { success: true, verified: res.data?.success };
    } catch (e) {
      // In offline/demo fallback allow 4-6 digit tokens
      if (otp && (otp.length === 4 || otp.length === 6)) {
        return { success: true, verified: true };
      }
      return { success: false, verified: false, message: 'Invalid OTP' };
    }
  },

  // Switch Role (Demo Mode) via backend
  switchRole: async (newRole) => {
    try {
      const res = await apiClient.post('/auth/switch-role', { role: newRole });
      if (res.data?.success && res.data.user) {
        const updatedUser = res.data.user;
        const token = res.data.token;
        await AsyncStorage.setItem('@shos_user', JSON.stringify(updatedUser));
        await AsyncStorage.setItem('@shos_token', token);
        await AsyncStorage.setItem('@shos_role', newRole);
        return updatedUser;
      }
    } catch (err) {
      console.log('[authService] Backend switchRole fallback:', err.message);
    }

    // Fallback
    const preset = DEMO_PRESETS.find((p) => p.role === newRole) || {
      role: newRole,
      name: 'Clinical Officer',
      email: `${newRole}@shos.hospital`,
    };

    const updatedUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      email: preset.email,
      name: preset.name,
      role: newRole,
      token: 'shos-jwt-' + newRole + '-' + Date.now(),
    };

    await AsyncStorage.setItem('@shos_user', JSON.stringify(updatedUser));
    await AsyncStorage.setItem('@shos_role', newRole);

    return updatedUser;
  },

  // Check persisted session
  getCurrentSession: async () => {
    try {
      const userJson = await AsyncStorage.getItem('@shos_user');
      const token = await AsyncStorage.getItem('@shos_token');
      if (userJson && token) {
        return JSON.parse(userJson);
      }
    } catch (e) {
      // Return null on storage error
    }
    return null;
  },

  // Logout
  logout: async () => {
    await AsyncStorage.removeItem('@shos_user');
    await AsyncStorage.removeItem('@shos_token');
    await AsyncStorage.removeItem('@shos_role');
    return { success: true };
  },
};

export default authService;
