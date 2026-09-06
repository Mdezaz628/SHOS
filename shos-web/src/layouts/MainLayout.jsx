import React from 'react';
import { HospitalTicker } from './HospitalTicker';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import './MainLayout.css';

export const MainLayout = ({ children }) => {
  return (
    <div className="shos-layout-container">
      <HospitalTicker />
      <Topbar />
      <div className="shos-body-container">
        <Sidebar />
        <main className="shos-main-content animate-fade-in">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
};
