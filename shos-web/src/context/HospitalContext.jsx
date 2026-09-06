import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_METRICS,
  MOCK_AI_MODELS,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_EMERGENCY_CASES,
  MOCK_WARDS,
  MOCK_APPOINTMENTS,
  MOCK_PHARMACY,
  MOCK_LAB_ORDERS,
  MOCK_STAFF
} from '../services/mockData';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [aiModels] = useState(MOCK_AI_MODELS);
  const [recommendations, setRecommendations] = useState(MOCK_AI_RECOMMENDATIONS);
  const [emergencyCases, setEmergencyCases] = useState(MOCK_EMERGENCY_CASES);
  const [wards, setWards] = useState(MOCK_WARDS);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [pharmacyStock, setPharmacyStock] = useState(MOCK_PHARMACY);
  const [labOrders, setLabOrders] = useState(MOCK_LAB_ORDERS);
  const [staffList, setStaffList] = useState(MOCK_STAFF);

  // Biomedical Assets / High-Value Equipment State
  const [equipment, setEquipment] = useState([
    { id: 'EQ-101', name: 'Hamilton C6 Intensive Care Ventilator', category: 'Respiratory Support', department: 'ICU', status: 'Operational', serialNumber: 'VENT-HAM-8891' },
    { id: 'EQ-102', name: 'Philips HeartStart MRx Defibrillator', category: 'Resuscitation / CPR', department: 'Emergency Trauma', status: 'Operational', serialNumber: 'DEF-PHIL-4412' },
    { id: 'EQ-103', name: 'Fresenius 5008S Dialysis Machine', category: 'Nephrology', department: 'Dialysis Unit', status: 'Operational', serialNumber: 'DIA-FRES-2091' },
    { id: 'EQ-104', name: 'Mindray BeneVision N12 Patient Monitor', category: 'Multipara Telemetry', department: 'Ward A', status: 'Under Maintenance', serialNumber: 'MON-MIND-7714' },
    { id: 'EQ-105', name: 'Maquet ECMO Cardiohelp System', category: 'Extracorporeal Support', department: 'Cardiac OT', status: 'Operational', serialNumber: 'ECMO-MAQ-9011' }
  ]);

  // Central Cryogenic Oxygen Plant Telemetry State
  const [oxygenTelemetry, setOxygenTelemetry] = useState({
    level: 94,
    tankId: 'Cryo Tank A (Central Medical Oxygen Plant)',
    pressure: '4.2 bar',
    bufferHours: 48,
    lastRefill: 'Today, 06:00 AM'
  });

  // Blood Transfusion Reserve State
  const [bloodBank, setBloodBank] = useState([
    { group: 'A+', units: 24, status: 'Adequate' },
    { group: 'A-', units: 12, status: 'Adequate' },
    { group: 'B+', units: 36, status: 'Adequate' },
    { group: 'B-', units: 8, status: 'Low Buffer' },
    { group: 'AB+', units: 18, status: 'Adequate' },
    { group: 'AB-', units: 6, status: 'Critical Low' },
    { group: 'O+', units: 42, status: 'Adequate' },
    { group: 'O-', units: 4, status: 'Critical Low' }
  ]);

  // Hospital-wide Emergency Code Broadcast
  const [activeCodeAlert, setActiveCodeAlert] = useState(null);

  // Action: Approve AI Recommendation
  const approveRecommendation = (recId, notes = '') => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === recId
          ? { ...rec, status: 'approved', implementationNotes: notes, approvedAt: 'Just now' }
          : rec
      )
    );
  };

  // Action: Reject AI Recommendation
  const rejectRecommendation = (recId) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === recId
          ? { ...rec, status: 'rejected', rejectedAt: 'Just now' }
          : rec
      )
    );
  };

  // Action: Add Bed to Ward
  const addBed = (wardIndex, bedData) => {
    setWards((prev) => {
      const newWards = [...prev];
      const targetWard = { ...newWards[wardIndex] };
      const newBed = {
        id: bedData.id || `BED-${Math.floor(100 + Math.random() * 900)}`,
        patient: null,
        status: 'Available',
        condition: 'Sanitized & Ready',
        ventilator: Boolean(bedData.ventilator)
      };
      targetWard.beds = [...targetWard.beds, newBed];
      targetWard.total = targetWard.beds.length;
      targetWard.occupied = targetWard.beds.filter((b) => b.status === 'Occupied').length;
      newWards[wardIndex] = targetWard;
      return newWards;
    });
  };

  // Action: Remove / Decommission Bed
  const removeBed = (wardIndex, bedId) => {
    setWards((prev) => {
      const newWards = [...prev];
      const targetWard = { ...newWards[wardIndex] };
      targetWard.beds = targetWard.beds.filter((b) => b.id !== bedId);
      targetWard.total = targetWard.beds.length;
      targetWard.occupied = targetWard.beds.filter((b) => b.status === 'Occupied').length;
      newWards[wardIndex] = targetWard;
      return newWards;
    });
  };

  // Action: Assign Patient to Bed
  const assignBedPatient = (wardIndex, bedId, patientName, uhid, condition = 'Stable') => {
    setWards((prev) => {
      const newWards = [...prev];
      const targetWard = { ...newWards[wardIndex] };
      targetWard.beds = targetWard.beds.map((b) => {
        if (b.id === bedId) {
          return {
            ...b,
            status: 'Occupied',
            patient: `${patientName} (${uhid || 'UHID-New'})`,
            condition: condition
          };
        }
        return b;
      });
      targetWard.occupied = targetWard.beds.filter((b) => b.status === 'Occupied').length;
      newWards[wardIndex] = targetWard;
      return newWards;
    });
  };

  // Action: Discharge Patient & Send Bed to Cleaning
  const dischargeBedPatient = (wardIndex, bedId) => {
    setWards((prev) => {
      const newWards = [...prev];
      const targetWard = { ...newWards[wardIndex] };
      targetWard.beds = targetWard.beds.map((b) => {
        if (b.id === bedId) {
          return {
            ...b,
            status: 'Available',
            patient: null,
            condition: 'Sanitizing (Bleach / UV-C)'
          };
        }
        return b;
      });
      targetWard.occupied = targetWard.beds.filter((b) => b.status === 'Occupied').length;
      newWards[wardIndex] = targetWard;
      return newWards;
    });
  };

  // Action: Toggle Bed Status
  const toggleBedStatus = (wardIndex, bedId) => {
    setWards((prev) => {
      const newWards = [...prev];
      const ward = { ...newWards[wardIndex] };
      ward.beds = ward.beds.map((b) => {
        if (b.id === bedId) {
          const isNowOccupied = b.status !== 'Occupied';
          return {
            ...b,
            status: isNowOccupied ? 'Occupied' : 'Available',
            patient: isNowOccupied ? 'New Admitted Patient' : null,
            condition: isNowOccupied ? 'Stable' : 'Sanitized & Ready'
          };
        }
        return b;
      });
      ward.occupied = ward.beds.filter((b) => b.status === 'Occupied').length;
      newWards[wardIndex] = ward;
      return newWards;
    });
  };

  // Equipment Actions
  const addEquipment = (asset) => {
    setEquipment((prev) => [
      ...prev,
      {
        id: `EQ-${Math.floor(100 + Math.random() * 900)}`,
        name: asset.name,
        category: asset.category || 'Biomedical Asset',
        department: asset.department || 'General Clinical',
        status: 'Operational',
        serialNumber: asset.serialNumber || `SN-${Date.now().toString().slice(-6)}`
      }
    ]);
  };

  const removeEquipment = (assetId) => {
    setEquipment((prev) => prev.filter((e) => e.id !== assetId));
  };

  const updateEquipmentStatus = (assetId, status) => {
    setEquipment((prev) => prev.map((e) => (e.id === assetId ? { ...e, status } : e)));
  };

  const refillOxygen = () => {
    setOxygenTelemetry((prev) => ({
      ...prev,
      level: 100,
      bufferHours: 56,
      lastRefill: 'Just now (Cryo Tank A Refilled to 100%)'
    }));
  };

  // Blood Bank Actions
  const addBloodUnits = (group, count = 1) => {
    setBloodBank((prev) =>
      prev.map((b) =>
        b.group === group
          ? {
              ...b,
              units: b.units + count,
              status: b.units + count < 10 ? 'Low Buffer' : 'Adequate'
            }
          : b
      )
    );
  };

  const deductBloodUnits = (group, count = 1) => {
    setBloodBank((prev) =>
      prev.map((b) =>
        b.group === group
          ? {
              ...b,
              units: Math.max(0, b.units - count),
              status: Math.max(0, b.units - count) < 10 ? 'Low Buffer' : 'Adequate'
            }
          : b
      )
    );
  };

  // Staff Governance Actions
  const addStaff = (member) => {
    setStaffList((prev) => [
      ...prev,
      {
        id: `EMP-${Math.floor(10 + Math.random() * 90)}`,
        name: member.name,
        role: member.role,
        shift: member.shift || 'General Shift',
        department: member.department || 'Clinical Operations',
        status: 'Active',
        patientsAssigned: 0
      }
    ]);
  };

  const removeStaff = (staffId) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
  };

  const updateStaffStatus = (staffId, status) => {
    setStaffList((prev) => prev.map((s) => (s.id === staffId ? { ...s, status } : s)));
  };

  // Emergency Siren Broadcast
  const broadcastEmergencyCode = (code, details) => {
    setActiveCodeAlert({
      code,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const clearEmergencyCode = () => {
    setActiveCodeAlert(null);
  };

  // Action: Triage Emergency Case
  const addEmergencyCase = (newCase) => {
    setEmergencyCases((prev) => [newCase, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      emergencyAdmissions: prev.emergencyAdmissions + 1
    }));
  };

  return (
    <HospitalContext.Provider
      value={{
        metrics,
        aiModels,
        recommendations,
        emergencyCases,
        wards,
        appointments,
        pharmacyStock,
        labOrders,
        staffList,
        equipment,
        oxygenTelemetry,
        bloodBank,
        activeCodeAlert,
        approveRecommendation,
        rejectRecommendation,
        addBed,
        removeBed,
        assignBedPatient,
        dischargeBedPatient,
        toggleBedStatus,
        addEquipment,
        removeEquipment,
        updateEquipmentStatus,
        refillOxygen,
        addBloodUnits,
        deductBloodUnits,
        addStaff,
        removeStaff,
        updateStaffStatus,
        broadcastEmergencyCode,
        clearEmergencyCode,
        addEmergencyCase
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => useContext(HospitalContext);

