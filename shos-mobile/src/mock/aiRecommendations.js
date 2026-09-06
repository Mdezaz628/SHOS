// AI Clinical & Operational Decision-Support Recommendations
// Decision-Support ONLY: Requires explicit human/admin authorization.

export const MOCK_AI_RECOMMENDATIONS = [
  {
    id: 'REC-01',
    code: 'REC-BED-20260906-01',
    category: 'Bed Management',
    title: 'Pre-allocate 8 HDU beds to Emergency Ward',
    reasoning: 'Bed occupancy model predicts 89.5% surge in adult respiratory admissions over the next 48 hours.',
    priority: 'High',
    expectedImpact: 'Reduces emergency bed turnaround time by ~28 mins; prevents ward bottleneck.',
    status: 'Pending Review',
    modelOrigin: 'M03-BED-OCCUPANCY',
    createdAt: 'Today, 08:00 AM',
  },
  {
    id: 'REC-02',
    code: 'REC-STF-20260906-02',
    category: 'Staff Allocation',
    title: 'Reassign 2 float nurses to Night Emergency ICU',
    reasoning: 'M04 predicts nurse shortage of 4 nurses during 00:00 - 08:00 shift due to scheduled leaves.',
    priority: 'Critical',
    expectedImpact: 'Maintains 1:2 ICU nurse-to-patient ratio required by NABH standards.',
    status: 'Pending Review',
    modelOrigin: 'M04-STAFF-SHORTAGE',
    createdAt: 'Today, 08:15 AM',
  },
  {
    id: 'REC-03',
    code: 'REC-PHARM-20260906-03',
    category: 'Pharmacy Supply',
    title: 'Emergency restock PO for 50 ampoules Noradrenaline',
    reasoning: 'Current inventory is 12 units; forecasted demand exceeds remaining safety stock by 18:00 hrs.',
    priority: 'Critical',
    expectedImpact: 'Averts zero-stock critical event for emergency vasopressors.',
    status: 'Pending Review',
    modelOrigin: 'M05-PHARMACY-DEMAND',
    createdAt: 'Today, 08:30 AM',
  },
  {
    id: 'REC-04',
    code: 'REC-OPD-20260906-04',
    category: 'Appointment Scheduling',
    title: 'Enable 10% controlled overbooking for General Medicine OPD',
    reasoning: 'No-show classification model estimates 14% non-attendance based on weather and historical trends.',
    priority: 'Medium',
    expectedImpact: 'Increases clinic operational throughput by 8% without extending doctor clinic hours.',
    status: 'Approved',
    modelOrigin: 'M07-NO-SHOW-RISK',
    createdAt: 'Yesterday, 04:00 PM',
  },
];

export default MOCK_AI_RECOMMENDATIONS;
