import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, ROLE_ROUTES } from '../constants/roles';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to logged-in as admin for convenient development/preview, but allow toggling
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('shos_auth');
    return saved ? JSON.parse(saved) : true;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('shos_role') || ROLES.ADMIN;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('shos_user');
    if (savedUser) return JSON.parse(savedUser);

    return {
      id: 'USR-ADM-001',
      name: 'Dr. Alok Verma',
      email: 'admin@shos.hospital',
      phone: '+91 98110 23456',
      role: ROLES.ADMIN,
      avatar: '👨‍⚕️'
    };
  });

  const [registeredEmail, setRegisteredEmail] = useState('');

  useEffect(() => {
    localStorage.setItem('shos_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('shos_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('shos_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Login action
  const login = (email, password, role = currentRole) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    setCurrentUser({
      id: `USR-${role.toUpperCase()}-01`,
      name: email ? email.split('@')[0].toUpperCase() : 'Hospital User',
      email: email || `${role}@shos.hospital`,
      phone: '+91 98765 43210',
      role,
      avatar: '👤'
    });
    return true;
  };

  // Register action (automatically assigns 'patient' role)
  const register = ({ fullName, email, phone, password, emergencyContact }) => {
    setRegisteredEmail(email);
    // Prepared user object
    const newPatient = {
      id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fullName,
      email,
      phone,
      emergencyContact,
      role: ROLES.PATIENT,
      avatar: '🧑'
    };

    setCurrentUser(newPatient);
    setCurrentRole(ROLES.PATIENT);
    return true;
  };

  // Complete OTP verification
  const verifyOtp = (otpCode) => {
    setIsAuthenticated(true);
    return true;
  };

  // Logout action
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Switch role helper for testing all 15 personas
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    setIsAuthenticated(true);

    const mockNames = {
      [ROLES.PATIENT]: 'Rahul Sharma (Patient)',
      [ROLES.DOCTOR]: 'Dr. Vivek Mehra (Cardiologist)',
      [ROLES.NURSE]: 'Sister Mary Joseph (ICU Charge)',
      [ROLES.SUPPORT]: 'Ramesh Kumar (Ward Boy)',
      [ROLES.LAB]: 'Rohan Joshi (Lab Technician)',
      [ROLES.PHARMACY]: 'Karan Patel (Pharmacist)',
      [ROLES.AMBULANCE]: 'Manoj Kumar (ALS Driver)',
      [ROLES.HOUSEKEEPING]: 'Sunil Yadav (Sanitation Lead)',
      [ROLES.PARKING]: 'Dharmendra Singh (Parking Staff)',
      [ROLES.RECEPTION]: 'Pooja Sharma (OPD Receptionist)',
      [ROLES.BILLING]: 'Amitabh Sen (TPA Billing)',
      [ROLES.HR]: 'Neeta Malhotra (HR Manager)',
      [ROLES.DEPARTMENT]: 'Dr. Sunita Rao (HOD Medicine)',
      [ROLES.ADMIN]: 'Dr. Alok Verma (Hospital Admin)',
      [ROLES.SUPERADMIN]: 'Vikramaditya (Super Admin)'
    };

    setCurrentUser({
      id: `USR-${newRole.slice(0, 3).toUpperCase()}-01`,
      name: mockNames[newRole] || 'SHOS User',
      email: `${newRole}@shos.hospital`,
      phone: '+91 98000 12345',
      role: newRole,
      avatar: '🏥'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        currentRole,
        registeredEmail,
        login,
        register,
        verifyOtp,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
