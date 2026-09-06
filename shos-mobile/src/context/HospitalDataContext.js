// Central Hospital Operations Reactive State Context
// Full CRUD Operations for Admin, Clinical, and Operational Workflows

import React, { createContext, useContext, useState } from 'react';
import { MOCK_APPOINTMENTS } from '../mock/appointments';
import { MOCK_BEDS } from '../mock/beds';
import { MOCK_TASKS } from '../mock/tasks';
import { MOCK_AI_RECOMMENDATIONS } from '../mock/aiRecommendations';
import { MOCK_QUEUE } from '../mock/queue';
import { MOCK_LAB_ORDERS } from '../mock/labOrders';
import { MOCK_PRESCRIPTIONS } from '../mock/prescriptions';
import { MOCK_BILLING } from '../mock/billing';
import { MOCK_PATIENTS } from '../mock/patients';
import { MOCK_DOCTORS } from '../mock/doctors';
import { MOCK_MEDICINES } from '../mock/medicines';
import { MOCK_STAFF } from '../mock/staff';
import { MOCK_BLOOD_BANK } from '../mock/bloodBank';

const INITIAL_EQUIPMENT = [
  { id: 'EQ-01', name: 'Liquid Medical Oxygen (LMO Plant)', detail: 'Cryogenic Tank A • 14.8 Bar • 99.4% Purity', status: 'optimal', icon: 'flask', reserve: '72 hrs reserve', department: 'O2 Facility' },
  { id: 'EQ-02', name: 'ICU Mechanical Ventilators', detail: '28 Total • 22 In Clinical Use • 6 Standby', status: 'active', icon: 'speedometer', reserve: '6 available', department: 'ICU' },
  { id: 'EQ-03', name: 'Hemodialysis Stations', detail: 'Nephrology Ward • 8 Units • 6 Connected', status: 'active', icon: 'fitness', reserve: '2 free', department: 'Nephrology' },
  { id: 'EQ-04', name: '128-Slice Siemens CT Scanner', detail: 'Radiology Bay 1 • 42 Scans Today', status: 'optimal', icon: 'aperture', reserve: 'Calibrated', department: 'Radiology' },
  { id: 'EQ-05', name: '3.0 Tesla Philips MRI Suite', detail: 'Helium Level: 96.2% • RF Coil OK', status: 'optimal', icon: 'scan', reserve: 'Operational', department: 'Radiology' },
  { id: 'EQ-06', name: 'Biplane Cath Lab System', detail: 'Interventional Cardiology • Room 1', status: 'active', icon: 'heart', reserve: 'In Procedure', department: 'Cardiology' },
];

const HospitalDataContext = createContext();

export const HospitalDataProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS || []);
  const [beds, setBeds] = useState(MOCK_BEDS || []);
  const [tasks, setTasks] = useState(MOCK_TASKS || []);
  const [recommendations, setRecommendations] = useState(MOCK_AI_RECOMMENDATIONS || []);
  const [queue, setQueue] = useState(MOCK_QUEUE || { currentServing: 42, peopleAhead: 8 });
  const [labOrders, setLabOrders] = useState(MOCK_LAB_ORDERS || []);
  const [prescriptions, setPrescriptions] = useState(MOCK_PRESCRIPTIONS || []);
  const [bills, setBills] = useState(MOCK_BILLING || []);
  const [patients, setPatients] = useState(MOCK_PATIENTS || []);
  const [doctors, setDoctors] = useState(MOCK_DOCTORS || []);
  const [medicines, setMedicines] = useState(MOCK_MEDICINES || []);
  const [staff, setStaff] = useState(MOCK_STAFF || []);
  const initialBloodBank = Array.isArray(MOCK_BLOOD_BANK)
    ? MOCK_BLOOD_BANK
    : (MOCK_BLOOD_BANK?.inventory || []);
  const [bloodBank, setBloodBank] = useState(initialBloodBank);
  const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT);
  const [oxygenTelemetry, setOxygenTelemetry] = useState({ capacity: 94.2, autonomyHours: 72.4, status: 'optimal' });

  // -------------------------------------------------------------
  // 1. BED & WARD OPERATIONS (Full Admin CRUD)
  // -------------------------------------------------------------
  const addBed = ({ ward, number, type = 'Standard', department = 'General' }) => {
    const newBed = {
      id: 'BED-' + Date.now().toString().slice(-4),
      number: number || `B-${Math.floor(100 + Math.random() * 900)}`,
      ward: ward || 'Ward A (Stepdown)',
      type,
      department,
      status: 'available',
      patientName: null,
      uhid: null,
      oxygenSupport: type === 'ICU' || type === 'Ventilator',
      ventilator: type === 'Ventilator',
      vitals: null,
      lastCleaned: 'Just now',
    };
    setBeds((prev) => [newBed, ...prev]);
    return newBed;
  };

  const removeBed = (bedId) => {
    setBeds((prev) => prev.filter((b) => b.id !== bedId));
  };

  const updateBedStatus = (bedId, newStatus, patientData = null) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: newStatus,
              patientName: patientData ? patientData.name : newStatus === 'available' ? null : b.patientName,
              uhid: patientData ? patientData.uhid : newStatus === 'available' ? null : b.uhid,
            }
          : b
      )
    );
  };

  const assignBed = (bedId, patientName, uhid) => {
    updateBedStatus(bedId, 'occupied', { name: patientName, uhid: uhid || 'SHOS-2026-8942' });
  };

  const dischargeBed = (bedId) => {
    updateBedStatus(bedId, 'cleaning', null);
  };

  // -------------------------------------------------------------
  // 2. BIOMEDICAL ASSETS & OXYGEN PLANT (Full Admin CRUD)
  // -------------------------------------------------------------
  const addEquipment = (item) => {
    const newAsset = {
      id: 'EQ-' + Date.now().toString().slice(-4),
      name: item.name,
      detail: item.detail || 'Standard Diagnostic / Life Support Asset',
      status: item.status || 'optimal',
      icon: item.icon || 'hardware-chip',
      reserve: item.reserve || 'Operational',
      department: item.department || 'Biomedical Operations',
    };
    setEquipment((prev) => [newAsset, ...prev]);
    return newAsset;
  };

  const removeEquipment = (assetId) => {
    setEquipment((prev) => prev.filter((e) => e.id !== assetId && e.name !== assetId));
  };

  const updateEquipmentStatus = (assetId, newStatus) => {
    setEquipment((prev) =>
      prev.map((e) => (e.id === assetId || e.name === assetId ? { ...e, status: newStatus } : e))
    );
  };

  const refillOxygen = (percentage = 100) => {
    setOxygenTelemetry({
      capacity: percentage,
      autonomyHours: Math.round(percentage * 0.77 * 10) / 10,
      status: 'optimal',
    });
  };

  // -------------------------------------------------------------
  // 3. BLOOD BANK INVENTORY (Full Admin CRUD)
  // -------------------------------------------------------------
  const addBloodUnits = (group, unitsToAdd = 1) => {
    setBloodBank((prev) => {
      const list = Array.isArray(prev) ? prev : (prev?.inventory || []);
      return list.map((b) =>
        (b.bloodGroup || b.group) === group
          ? { ...b, units: (b.units || 0) + unitsToAdd }
          : b
      );
    });
  };

  const deductBloodUnits = (group, unitsToDeduct = 1) => {
    setBloodBank((prev) => {
      const list = Array.isArray(prev) ? prev : (prev?.inventory || []);
      return list.map((b) =>
        (b.bloodGroup || b.group) === group
          ? { ...b, units: Math.max(0, (b.units || 0) - unitsToDeduct) }
          : b
      );
    });
  };

  // -------------------------------------------------------------
  // 4. APPOINTMENT & CONSULTATION WORKLOAD
  // -------------------------------------------------------------
  const addAppointment = (newAppt) => {
    setAppointments((prev) => [newAppt, ...prev]);
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
    );
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // -------------------------------------------------------------
  // 5. STAFF & HUMAN RESOURCES (Admin CRUD)
  // -------------------------------------------------------------
  const addStaff = (staffMember) => {
    const newMember = {
      id: 'STF-' + Date.now().toString().slice(-4),
      name: staffMember.name,
      role: staffMember.role,
      department: staffMember.department || 'Clinical',
      shift: staffMember.shift || 'Morning (08:00 - 16:00)',
      phone: staffMember.phone || '+91 98765 43210',
      status: 'active',
      workloadScore: '60% (Normal)',
    };
    setStaff((prev) => [newMember, ...prev]);
    return newMember;
  };

  const removeStaff = (staffId) => {
    setStaff((prev) => prev.filter((s) => s.id !== staffId && s._id !== staffId));
  };

  const updateStaffStatus = (staffId, status) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId || s._id === staffId ? { ...s, status } : s))
    );
  };

  // -------------------------------------------------------------
  // 6. TASKS & WORKFLOW PIPELINE
  // -------------------------------------------------------------
  const addTask = (newTask) => {
    const taskObj = {
      id: 'TSK-' + Date.now().toString().slice(-4),
      title: newTask.title,
      patientName: newTask.patientName || 'Clinical Patient',
      uhid: newTask.uhid || 'SHOS-2026-8942',
      from: newTask.from || 'OPD',
      to: newTask.to || 'Ward A',
      status: newTask.status || 'Assigned',
      priority: newTask.priority || 'Normal',
      createdAt: 'Just now',
    };
    setTasks((prev) => [taskObj, ...prev]);
    return taskObj;
  };

  const removeTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const advanceTaskStatus = (taskId, forcedNext = null) => {
    const statusFlow = {
      pending: 'in_progress',
      Assigned: 'Accepted',
      Accepted: 'In Progress',
      'In Progress': 'Completed',
      in_progress: 'completed',
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const next = forcedNext || statusFlow[t.status] || 'Completed';
          return { ...t, status: next };
        }
        return t;
      })
    );
  };

  // -------------------------------------------------------------
  // 7. AI RECOMMENDATIONS & DECISION AUDIT
  // -------------------------------------------------------------
  const approveRecommendation = (id) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
  };

  const rejectRecommendation = (id) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
  };

  // -------------------------------------------------------------
  // 8. QUEUE MANAGEMENT
  // -------------------------------------------------------------
  const callNextQueueToken = () => {
    setQueue((prev) => ({
      ...prev,
      currentServingToken: (prev.currentServingToken || prev.currentServing || 0) + 1,
      currentServing: (prev.currentServing || prev.currentServingToken || 0) + 1,
      peopleAhead: Math.max(0, (prev.peopleAhead || 0) - 1),
    }));
  };

  // -------------------------------------------------------------
  // 9. LAB DIAGNOSTICS
  // -------------------------------------------------------------
  const updateLabResult = (orderId, newResults, isVerified = true) => {
    setLabOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              results: newResults,
              status: isVerified ? 'Completed' : 'Processing',
              verifiedBy: isVerified ? 'Dr. S. K. Gupta, MD (Pathology)' : 'Pending Verification',
            }
          : order
      )
    );
  };

  const addLabOrder = (newOrder) => {
    setLabOrders((prev) => [newOrder, ...prev]);
  };

  // -------------------------------------------------------------
  // 10. PHARMACY DISPENSARY
  // -------------------------------------------------------------
  const addPrescription = (newRx) => {
    setPrescriptions((prev) => [newRx, ...prev]);
  };

  const dispensePrescription = (rxId) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === rxId ? { ...rx, status: 'Dispensed', dispensedAt: 'Just now' } : rx))
    );
  };

  // -------------------------------------------------------------
  // 11. PATIENT REGISTRATION
  // -------------------------------------------------------------
  const addPatient = (newPatient) => {
    setPatients((prev) => [newPatient, ...prev]);
  };

  return (
    <HospitalDataContext.Provider
      value={{
        // Appointments & Consultations
        appointments,
        addAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        // Beds & Census
        beds,
        addBed,
        removeBed,
        updateBedStatus,
        assignBed,
        dischargeBed,
        // Equipment & O2 Plant
        equipment,
        addEquipment,
        removeEquipment,
        updateEquipmentStatus,
        oxygenTelemetry,
        refillOxygen,
        // Blood Bank
        bloodBank,
        addBloodUnits,
        deductBloodUnits,
        // Tasks & Workload
        tasks,
        addTask,
        removeTask,
        advanceTaskStatus,
        updateTaskStatus: advanceTaskStatus,
        // Recommendations
        recommendations,
        aiRecommendations: recommendations,
        approveRecommendation,
        rejectRecommendation,
        // Queue
        queue,
        liveQueue: queue,
        callNextQueueToken,
        updateLiveQueue: callNextQueueToken,
        // Diagnostics & Orders
        labOrders,
        updateLabResult,
        completeLabOrder: updateLabResult,
        addLabOrder,
        // Pharmacy
        prescriptions,
        addPrescription,
        dispensePrescription,
        medicines,
        // Financials & Admin
        bills,
        setBills,
        patients,
        addPatient,
        doctors,
        staff,
        addStaff,
        removeStaff,
        updateStaffStatus,
      }}
    >
      {children}
    </HospitalDataContext.Provider>
  );
};

export const useHospitalData = () => {
  const context = useContext(HospitalDataContext);
  if (!context) {
    return {
      appointments: [],
      beds: [],
      tasks: [],
      equipment: INITIAL_EQUIPMENT,
      oxygenTelemetry: { capacity: 94.2, autonomyHours: 72.4, status: 'optimal' },
      recommendations: [],
      aiRecommendations: [],
      queue: {},
      liveQueue: {},
      labOrders: [],
      prescriptions: [],
      bills: [],
      patients: [],
      doctors: [],
      medicines: [],
      staff: [],
      bloodBank: [],
      addBed: () => {},
      removeBed: () => {},
      updateBedStatus: () => {},
      assignBed: () => {},
      dischargeBed: () => {},
      addEquipment: () => {},
      removeEquipment: () => {},
      updateEquipmentStatus: () => {},
      refillOxygen: () => {},
      addBloodUnits: () => {},
      deductBloodUnits: () => {},
      addStaff: () => {},
      removeStaff: () => {},
      updateStaffStatus: () => {},
      addTask: () => {},
      removeTask: () => {},
      advanceTaskStatus: () => {},
      updateTaskStatus: () => {},
      updateAppointmentStatus: () => {},
      dispensePrescription: () => {},
    };
  }
  return context;
};

export default HospitalDataContext;
