// Mock Tomorrow's Hospital Operational Forecast & Plan

export const MOCK_HOSPITAL_PLAN = {
  date: 'Tomorrow (2026-09-07)',
  overallRiskLevel: 'HIGH', // LOW | MODERATE | HIGH | CRITICAL
  riskReason: 'Heavy respiratory admission spike forecasted + ICU nursing deficit on night shift.',
  
  // Forecasted Patient & Clinical Load
  expectedPatients: 144,
  expectedEmergencyCases: 48,
  expectedBedOccupancyPercent: 89.5,

  // Staffing Capacity Breakdown
  staffingPlan: {
    doctors: {
      required: 28,
      available: 26,
      shortage: 2,
      critical: false,
    },
    nurses: {
      required: 54,
      available: 50,
      shortage: 4,
      critical: true,
    },
    support: {
      required: 24,
      available: 23,
      shortage: 1,
      critical: false,
    },
  },

  // Operational Modules Workload
  pharmacyDemandUnits: 310,
  labWorkloadTests: 412,
  resourceDemandIndex: '88% (High Demand for Ventilators & Monitors)',
  staffWorkloadScore: '84% (High Strain)',
  anomalyScore: '0.04 (Low Risk - Isolated)',
  readmissionRiskPercent: '6.8% (Benchmark < 8%)',

  // Critical Action Items
  actionChecklist: [
    { text: 'Authorize 8 HDU bed reservation for Emergency Trauma Bay', status: 'Pending Approval' },
    { text: 'Call in 2 on-call night nurses for Critical Care Unit', status: 'Pending Approval' },
    { text: 'Procure 50 ampoules Noradrenaline emergency stock from central depot', status: 'Pending PO Sign-off' },
    { text: 'Confirm Cath Lab standby for morning scheduled angioplasties', status: 'Confirmed' }
  ],
};

export default MOCK_HOSPITAL_PLAN;
