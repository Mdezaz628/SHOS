import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Layers,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { SearchBar } from '../components/ui/SearchBar';
import { Dropdown } from '../components/ui/Dropdown';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROLES, ROLE_LABELS, ROLE_ROUTES } from '../constants/roles';

export const Topbar = () => {
  const navigate = useNavigate();
  const { currentUser, currentRole, switchRole, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');

  const handleRoleSelect = (roleKey) => {
    switchRole(roleKey);
    const targetRoute = ROLE_ROUTES[roleKey] || '/admin';
    navigate(targetRoute);
  };

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  const mockNotifications = [
    { id: 1, title: 'Level 1 Trauma Alert', time: '2m ago', desc: 'Cath Lab activated for incoming STEMI', critical: true },
    { id: 2, title: 'AI Bed Model Warning', time: '14m ago', desc: 'HDU beds surge anticipated (89.5%)', critical: false },
    { id: 3, title: 'STAT Lab Report Released', time: '28m ago', desc: 'Troponin-I ready for Rajesh Malhotra', critical: false }
  ];

  return (
    <header className="shos-topbar">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          onClick={() => navigate(ROLE_ROUTES[currentRole] || '/admin')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #38bdf8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--color-text)', lineHeight: 1 }}>
                SHOS
              </strong>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#ffffff', display: 'inline-block' }} />
                AI LIVE
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Smart Hospital OS
            </span>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="topbar-search-wrapper" style={{ flex: 1, maxWidth: 480, margin: '0 20px', display: 'flex' }}>
        <SearchBar
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClear={() => setSearchValue('')}
          placeholder="Search UHID, patients, doctors, drugs, beds, diagnostics..."
        />
      </div>

      {/* Actions: Persona Switcher, Notifications, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Rapid Persona Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <Layers size={14} style={{ color: 'var(--color-primary)' }} />
          <span className="topbar-role-label" style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Role:
          </span>
          <select
            value={currentRole}
            onChange={(e) => handleRoleSelect(e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {Object.values(ROLES).map((roleKey) => (
              <option key={roleKey} value={roleKey}>
                {ROLE_LABELS[roleKey]}
              </option>
            ))}
          </select>
        </div>

        {/* 1-Click Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Hospital Light Mode" : "Switch to Telemetry Dark Mode"}
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#38bdf8' : '#0284c7',
            backgroundColor: 'var(--color-surface)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#0284c7' }} />}
        </button>

        {/* Notifications Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div
              style={{
                position: 'relative',
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-surface)',
                cursor: 'pointer'
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-critical)'
                }}
              />
            </div>
          }
        >
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '0.85rem' }}>Hospital Notifications</strong>
            <Badge variant="critical" size="sm">3 New</Badge>
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {mockNotifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: n.critical ? 'var(--color-critical-subtle)' : 'var(--color-surface)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ color: n.critical ? 'var(--color-critical)' : 'var(--color-text)' }}>{n.title}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{n.time}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{n.desc}</div>
              </div>
            ))}
          </div>
        </Dropdown>

        {/* Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar name={currentUser?.name || 'User'} size="sm" status="online" />
              <div style={{ textAlign: 'left', lineHeight: 1.2, display: 'none' }} className="user-text-lg">
                <strong style={{ fontSize: '0.82rem', color: 'var(--color-text)', display: 'block' }}>
                  {currentUser?.name?.split(' (')[0]}
                </strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>
                  {ROLE_LABELS[currentRole]}
                </span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--color-text-dim)' }} />
            </div>
          }
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'block' }}>
              {currentUser?.name}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
              {currentUser?.email}
            </span>
          </div>

          {/* Explicit Dark Mode Toggle Option in Profile (Requested by User) */}
          <div
            onClick={toggleTheme}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {isDark ? <Moon size={16} style={{ color: '#38bdf8' }} /> : <Sun size={16} style={{ color: '#f59e0b' }} />}
              <span>Dark Mode</span>
            </div>
            <div
              style={{
                width: 38,
                height: 20,
                borderRadius: 10,
                backgroundColor: isDark ? '#0284c7' : '#cbd5e1',
                position: 'relative',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div
                className="shos-toggle-knob"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: 2,
                  left: isDark ? 20 : 2,
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>

          <div
            onClick={handleLogout}
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.82rem',
              color: 'var(--color-critical)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
