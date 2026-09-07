// SHOS Mobile Authentication Context with AsyncStorage Session Persistence

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { ROLES, DEMO_PRESETS } from '../constants/roles';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Synchronously initialize with default demo patient so app renders on frame 0
  const defaultPreset = DEMO_PRESETS[0];
  const initialDemoUser = {
    id: 'USR-DEMO-01',
    name: defaultPreset.name,
    email: defaultPreset.email,
    role: defaultPreset.role,
    uhid: 'SHOS-2026-8942',
    token: 'mock-jwt-session',
  };

  const [currentUser, setCurrentUser] = useState(initialDemoUser);
  const [currentRole, setCurrentRole] = useState(ROLES.PATIENT);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);

  // Restore saved session on app launch in background
  useEffect(() => {
    let isMounted = true;
    const loadSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (isMounted && session) {
          setCurrentUser(session);
          setCurrentRole(session.role || ROLES.PATIENT);
        }
      } catch (err) {
        console.warn('Background session load warning:', err);
      }
    };
    loadSession();
    return () => { isMounted = false; };
  }, []);

  // Login handler
  const login = async (email, password, role) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password, role);
      if (res.success) {
        setCurrentUser(res.user);
        setCurrentRole(res.user.role);
        return res;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Registration handler - does not set active user until OTP is verified
  const register = async (formData) => {
    // Note: Do not toggle global isLoading here to avoid unmounting AuthNavigator during navigation
    return await authService.register(formData);
  };

  // Complete OTP verification and activate user session
  const completeOtpLogin = async (user, token) => {
    if (user) {
      const activeUser = {
        ...user,
        role: user.role || ROLES.PATIENT,
        token: token || user.token || 'shos-session-' + Date.now(),
      };
      setCurrentUser(activeUser);
      setCurrentRole(activeUser.role);
      await AsyncStorage.setItem('@shos_user', JSON.stringify(activeUser));
      await AsyncStorage.setItem('@shos_token', activeUser.token);
      await AsyncStorage.setItem('@shos_role', activeUser.role);
      try {
        await AsyncStorage.removeItem('@shos_pending_user');
        await AsyncStorage.removeItem('@shos_pending_token');
      } catch (e) {}
    }
  };

  // Instant Persona Fast-Switcher (Demo & Testing Feature)
  const switchRole = async (newRole) => {
    const updatedUser = await authService.switchRole(newRole);
    setCurrentUser(updatedUser);
    setCurrentRole(newRole);
    setIsRoleModalVisible(false);
  };

  // Logout handler
  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCurrentRole(ROLES.PATIENT);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoading,
        login,
        register,
        completeOtpLogin,
        logout,
        switchRole,
        isRoleModalVisible,
        setIsRoleModalVisible,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
