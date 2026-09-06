// Mock Live Queue Telemetry

export const MOCK_QUEUE = {
  department: 'Cardiology OPD',
  doctorName: 'Dr. Vikram Malhotra',
  opdRoom: 'OPD Room 204',
  currentServingToken: 19,
  userToken: 24,
  peopleAhead: 5,
  estimatedWaitMinutes: 35,
  averageConsultTimeMins: 7,
  queueStatus: 'Flowing Normally',
  activeTokensList: [
    { token: 19, uhid: 'SHOS-2026-3392', patient: 'Deepak Saxena', status: 'In Consultation' },
    { token: 20, uhid: 'SHOS-2026-7781', patient: 'Meena Kumari', status: 'Next Up' },
    { token: 21, uhid: 'SHOS-2026-1192', patient: 'Harish Chander', status: 'Waiting' },
    { token: 22, uhid: 'SHOS-2026-5541', patient: 'Farida Begum', status: 'Waiting' },
    { token: 23, uhid: 'SHOS-2026-9022', patient: 'Amitabh Sen', status: 'Waiting' },
    { token: 24, uhid: 'SHOS-2026-8942', patient: 'Rahul Sharma (You)', status: 'Waiting' },
    { token: 25, uhid: 'SHOS-2026-4421', patient: 'Pooja Verma', status: 'Waiting' },
  ],
};

export default MOCK_QUEUE;
