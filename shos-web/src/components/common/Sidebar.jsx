import React from 'react';
import { NAV_ITEMS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { ROLE_PERMISSIONS } from '../../constants/roles';
import { Activity, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { currentRole } = useAuth();
  const allowedTabs = ROLE_PERMISSIONS[currentRole] || ['*'];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-logo-container">
          <div className="logo-icon-box">
            <Activity className="logo-icon" size={24} />
          </div>
          {!collapsed && (
            <div className="brand-titles">
              <span className="brand-title">SHOS</span>
              <span className="brand-subtitle">Smart Hospital OS</span>
            </div>
          )}
        </div>
        <button
          className="collapse-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Hospital Status Banner */}
      {!collapsed && (
        <div className="hospital-status-badge">
          <div className="pulse-dot" />
          <div className="status-text">
            <span className="status-live">ER & ICU Live</span>
            <span className="status-network">Central AI Active</span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">{!collapsed && 'Operational Modules'}</div>
        {NAV_ITEMS.map((item) => {
          const isAllowed = allowedTabs.includes('*') || allowedTabs.includes(item.id);
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item-btn ${isActive ? 'active' : ''} ${!isAllowed ? 'restricted' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <div className="nav-item-icon-wrap">
                <Icon size={20} />
              </div>
              {!collapsed && (
                <>
                  <span className="nav-item-label">{item.label}</span>
                  {item.badge && (
                    <span className={`badge badge-${item.badgeVariant || 'neutral'}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Medical Compliance Footer */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="compliance-box">
            <ShieldCheck size={16} className="text-cyan" />
            <span>NABH & HIPAA Compliant</span>
          </div>
          <div className="version-tag">SHOS Clinical v2.4</div>
        </div>
      )}
    </aside>
  );
};
