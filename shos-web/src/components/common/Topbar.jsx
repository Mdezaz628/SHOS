import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { HOSPITAL_INFO } from '../../services/mockData';
import {
  Bell,
  Search,
  UserCheck,
  Building2,
  Clock,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const Topbar = () => {
  const { currentRole, currentUser, switchRole } = useAuth();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      {/* Left: Hospital Info & Time */}
      <div className="topbar-left">
        <div className="hospital-tag">
          <Building2 size={16} className="text-cyan" />
          <span className="hospital-name">{HOSPITAL_INFO.name}</span>
          <span className="location-pill">{HOSPITAL_INFO.location}</span>
        </div>
        <div className="live-clock">
          <Clock size={15} className="text-dim" />
          <span>{time}</span>
        </div>
      </div>

      {/* Center: Search & Hotline */}
      <div className="topbar-center">
        <div className="emergency-hotline-pill">
          <PhoneCall size={14} className="pulse-danger" />
          <span>ER Hotline:</span>
          <strong>{HOSPITAL_INFO.emergencyHotline}</strong>
        </div>
      </div>

      {/* Right: Role Switcher & User Profile */}
      <div className="topbar-right">
        {/* Role Switcher */}
        <div className="role-selector-box">
          <UserCheck size={16} className="role-icon" />
          <div className="role-select-wrap">
            <label className="role-label">Active View:</label>
            <select
              value={currentRole}
              onChange={(e) => switchRole(e.target.value)}
              className="role-dropdown"
            >
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications */}
        <button className="topbar-icon-btn" title="Critical Clinical Alerts">
          <Bell size={18} />
          <span className="notification-indicator" />
        </button>

        {/* User Chip */}
        <div className="user-profile-chip">
          <div className="user-avatar-circle">{currentUser.avatar}</div>
          <div className="user-info-text">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role-tag">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
