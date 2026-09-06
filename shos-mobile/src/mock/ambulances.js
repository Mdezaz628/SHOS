// Mock Fleet Telemetry & Ambulance Status

export const MOCK_AMBULANCES = [
  {
    id: 'AMB-08',
    vehicleNumber: 'DL 01 AB 9081',
    callSign: 'Cardiac Mobile ICU #08',
    type: 'Advanced Life Support (ALS) with Defibrillator',
    driverName: 'Rajesh Yadav',
    driverPhone: '+91 98110 88219',
    emtName: 'Sanjay Rawat, EMT-P',
    emtPhone: '+91 98110 88220',
    status: 'En Route to Patient',
    gpsSpeed: '48 km/h',
    etaMinutes: 8,
    progressPercent: 65,
    patientLocation: 'B-42, Hauz Khas Enclave, New Delhi',
    destinationHospital: 'SHOS Central Hospital (Trauma Bay Red Zone)',
    assignedDoctor: 'Dr. Sameer Khan (Emergency On-Duty)',
    assignedTime: 'Today, 10:42 AM',
    equipmentStatus: 'Oxygen: 98% • Defibrillator: Armed • Ventilator: Ready',
    coordinates: {
      latitude: 28.5494,
      longitude: 77.2001,
    }
  },
  {
    id: 'AMB-02',
    vehicleNumber: 'DL 01 AB 4402',
    callSign: 'Trauma Unit #02',
    type: 'Basic Life Support (BLS)',
    driverName: 'Mohd. Aslam',
    driverPhone: '+91 98711 44021',
    emtName: 'Kishore Patil',
    emtPhone: '+91 98711 44022',
    status: 'Available at Base',
    gpsSpeed: '0 km/h',
    etaMinutes: 0,
    progressPercent: 0,
    patientLocation: 'SHOS Hospital Ambulance Bay 2',
    destinationHospital: 'SHOS Central Hospital',
    assignedDoctor: null,
    assignedTime: null,
    equipmentStatus: 'Fully Sanitized & Ready',
    coordinates: {
      latitude: 28.5672,
      longitude: 77.2100,
    }
  }
];

export default MOCK_AMBULANCES;
