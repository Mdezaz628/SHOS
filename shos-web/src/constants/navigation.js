import {
  LayoutDashboard,
  BrainCircuit,
  Ambulance,
  CalendarDays,
  BedDouble,
  Pill,
  FlaskConical,
  Users2
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Command Center',
    icon: LayoutDashboard,
    badge: 'Live',
    badgeVariant: 'success'
  },
  {
    id: 'ai-ops',
    label: 'AI Intelligence',
    icon: BrainCircuit,
    badge: '8 Models',
    badgeVariant: 'primary'
  },
  {
    id: 'emergency',
    label: 'Emergency & ER',
    icon: Ambulance,
    badge: 'High Alert',
    badgeVariant: 'danger'
  },
  {
    id: 'appointments',
    label: 'OPD & Tokens',
    icon: CalendarDays,
    badge: 'Queue: 38',
    badgeVariant: 'neutral'
  },
  {
    id: 'beds',
    label: 'Wards & Beds',
    icon: BedDouble,
    badge: '88% Full',
    badgeVariant: 'warning'
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy & Stock',
    icon: Pill,
    badge: '4 Low',
    badgeVariant: 'warning'
  },
  {
    id: 'laboratory',
    label: 'Lab & Pathology',
    icon: FlaskConical,
    badge: '18 Pending',
    badgeVariant: 'neutral'
  },
  {
    id: 'staff',
    label: 'Staff Rosters',
    icon: Users2,
    badge: 'Shift B',
    badgeVariant: 'neutral'
  }
];
