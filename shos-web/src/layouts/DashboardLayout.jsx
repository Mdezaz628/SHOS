import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { Topbar } from '../components/common/Topbar';
import './DashboardLayout.css';

export const DashboardLayout = ({ activeTab, setActiveTab, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={`main-wrapper ${collapsed ? 'expanded' : ''}`}>
        <Topbar />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
};
