import React, { useState } from 'react';
import { Search, Stethoscope, Star, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

export const DoctorSearch = ({ onBookDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  const doctorsList = [
    {
      id: 'DOC-01',
      name: 'Dr. Vivek Mehra',
      specialty: 'Interventional Cardiology',
      department: 'Cardiology',
      experience: '18 Years Experience',
      education: 'MBBS, MD, DM (Cardiology) - AIIMS',
      cabin: 'OPD-204 (2nd Floor)',
      timings: '09:00 AM - 01:00 PM',
      availableToday: true,
      fee: '₹ 800'
    },
    {
      id: 'DOC-02',
      name: 'Dr. Ananya Nair',
      specialty: 'Trauma & Orthopaedic Surgery',
      department: 'Orthopaedics',
      experience: '14 Years Experience',
      education: 'MBBS, MS (Ortho), M.Ch (Trauma)',
      cabin: 'OPD-108 (1st Floor)',
      timings: '10:00 AM - 03:00 PM',
      availableToday: true,
      fee: '₹ 750'
    },
    {
      id: 'DOC-03',
      name: 'Dr. Rohan Mathur',
      specialty: 'Consultant Neurologist & Stroke Specialist',
      department: 'Neurology',
      experience: '12 Years Experience',
      education: 'MBBS, MD, DM (Neurology)',
      cabin: 'OPD-302 (3rd Floor)',
      timings: '11:00 AM - 04:00 PM',
      availableToday: false,
      fee: '₹ 900'
    },
    {
      id: 'DOC-04',
      name: 'Dr. Radhika Roy',
      specialty: 'General Medicine & Critical Care',
      department: 'General Medicine',
      experience: '16 Years Experience',
      education: 'MBBS, MD (Internal Medicine)',
      cabin: 'OPD-102 (Ground Floor)',
      timings: '09:00 AM - 02:00 PM',
      availableToday: true,
      fee: '₹ 600'
    },
    {
      id: 'DOC-05',
      name: 'Dr. Meenakshi Rao',
      specialty: 'Senior Consultant Pediatrician',
      department: 'Pediatrics',
      experience: '15 Years Experience',
      education: 'MBBS, MD (Pediatrics), DCH',
      cabin: 'OPD-115 (1st Floor)',
      timings: '09:30 AM - 01:30 PM',
      availableToday: true,
      fee: '₹ 700'
    },
    {
      id: 'DOC-06',
      name: 'Dr. S. K. Gupta',
      specialty: 'Pulmonology & Sleep Medicine',
      department: 'Pulmonology',
      experience: '20 Years Experience',
      education: 'MBBS, MD, DNB (Respiratory)',
      cabin: 'OPD-210 (2nd Floor)',
      timings: '11:00 AM - 03:00 PM',
      availableToday: true,
      fee: '₹ 800'
    }
  ];

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchesAvail =
      selectedAvailability === 'All' ||
      (selectedAvailability === 'Today' && doc.availableToday) ||
      (selectedAvailability === 'Tomorrow' && !doc.availableToday);

    return matchesSearch && matchesDept && matchesAvail;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
          Find & Consult Specialist Doctors
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Search NABH verified clinical specialists, view OPD timings, and schedule consultations.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search doctor by name, specialty, or condition..."
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="shos-input-field"
          style={{ width: 'auto', minWidth: 160 }}
        >
          <option value="All">All Departments</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Orthopaedics">Orthopaedics</option>
          <option value="Neurology">Neurology</option>
          <option value="General Medicine">General Medicine</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Pulmonology">Pulmonology</option>
        </select>

        <select
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          className="shos-input-field"
          style={{ width: 'auto', minWidth: 150 }}
        >
          <option value="All">All Availability</option>
          <option value="Today">Available Today</option>
          <option value="Tomorrow">Available Tomorrow</option>
        </select>
      </div>

      {/* Doctors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="shos-card"
            style={{
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 14,
              borderTop: '3px solid var(--color-primary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <Avatar name={doc.name} size="lg" status={doc.availableToday ? 'online' : 'offline'} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)' }}>
                    {doc.name}
                  </h3>
                  <Badge variant={doc.availableToday ? 'success' : 'neutral'} size="sm">
                    {doc.availableToday ? 'Available Today' : 'On Leave'}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: 2 }}>
                  {doc.specialty}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                  {doc.education} • {doc.experience}
                </div>
              </div>
            </div>

            <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Cabin: <strong>{doc.cabin}</strong></span>
              <span>Timings: <strong>{doc.timings}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Consultation Fee</span>
                <div style={{ fontWeight: 800, color: 'var(--color-text)' }}>{doc.fee}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline" size="sm" onClick={() => alert(`Doctor Profile: ${doc.name} - ${doc.education}`)}>
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!doc.availableToday}
                  onClick={() => onBookDoctor?.(doc)}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
