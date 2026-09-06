// Mock Parking Grid & Active Gate Passes

export const MOCK_PARKING = {
  totalSlots: 120,
  occupiedSlots: 86,
  availableSlots: 28,
  reservedSlots: 6,
  zones: [
    {
      name: 'Zone A — Doctor & Emergency Influx',
      slots: [
        { code: 'A-01', status: 'Occupied', vehicle: 'DL 01 AB 1001 (Doctor)', type: 'Doctor' },
        { code: 'A-02', status: 'Occupied', vehicle: 'DL 08 CA 8891 (Ambulance)', type: 'Emergency' },
        { code: 'A-03', status: 'Available', vehicle: null, type: 'Doctor' },
        { code: 'A-04', status: 'Reserved', vehicle: 'Reserved for HOD', type: 'Reserved' },
        { code: 'A-05', status: 'Occupied', vehicle: 'DL 03 XY 3341 (Doctor)', type: 'Doctor' },
        { code: 'A-06', status: 'Available', vehicle: null, type: 'Doctor' },
      ],
    },
    {
      name: 'Zone B — Patient & Visitor Parking',
      slots: [
        { code: 'B-01', status: 'Occupied', vehicle: 'DL 09 BC 4912', type: 'Patient' },
        { code: 'B-02', status: 'Occupied', vehicle: 'HR 26 DQ 7891', type: 'Visitor' },
        { code: 'B-03', status: 'Available', vehicle: null, type: 'Patient' },
        { code: 'B-04', status: 'Available', vehicle: null, type: 'Patient' },
        { code: 'B-05', status: 'Occupied', vehicle: 'UP 16 AT 5500', type: 'Patient' },
        { code: 'B-06', status: 'Reserved', vehicle: 'Handicapped Accessible', type: 'Reserved' },
      ],
    },
  ],
  recentPasses: [
    { passId: 'PK-9921', vehicle: 'DL 09 BC 4912', slot: 'B-01', type: 'Patient Outpatient', entryTime: 'Today 09:15 AM' },
    { passId: 'PK-9922', vehicle: 'HR 26 DQ 7891', slot: 'B-02', type: 'Visitor', entryTime: 'Today 09:40 AM' },
    { passId: 'PK-9923', vehicle: 'DL 01 AB 1001', slot: 'A-01', type: 'Doctor On-Duty', entryTime: 'Today 08:30 AM' },
  ],
};

export default MOCK_PARKING;
