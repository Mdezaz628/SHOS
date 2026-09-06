import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Search,
  Calendar,
  Clock,
  FlaskConical,
  Pill,
  Receipt,
  HeartPulse,
  BedDouble,
  AlertTriangle,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { PatientHome } from './PatientHome';
import { PatientProfile } from './PatientProfile';
import { DoctorSearch } from './DoctorSearch';
import { AppointmentBookingModal } from './AppointmentBookingModal';
import { AppointmentManagement } from './AppointmentManagement';
import { PatientQueueScreen } from './PatientQueueScreen';
import { MedicalReports } from './MedicalReports';
import { PrescriptionView } from './PrescriptionView';
import { BillsAndPayments } from './BillsAndPayments';
import { PatientAdmissionBed } from './PatientAdmissionBed';
import { PatientEmergency } from './PatientEmergency';
import { AmbulanceTracker } from './AmbulanceTracker';

export const PatientPortal = () => {
  const { currentUser } = useAuth();
  const { appointments } = useHospital();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([
    { token: 'T-102', patient: 'Rahul Sharma', dept: 'Cardiology', doctor: 'Dr. Vivek Mehra', slot: 'Today, 09:20 AM', status: 'Waiting' },
    { token: 'T-042', patient: 'Rahul Sharma', dept: 'General Medicine', doctor: 'Dr. Radhika Roy', slot: '12 Aug 2026', status: 'Completed' }
  ]);

  // Sync with URL hash if present (#appointments, #reports, #prescriptions, #admission_bed, #emergency, #ambulance, etc.)
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (
      hash &&
      [
        'home',
        'profile',
        'doctors',
        'appointments',
        'queue',
        'reports',
        'prescriptions',
        'bills',
        'admission_bed',
        'emergency',
        'ambulance'
      ].includes(hash)
    ) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const handleBookDoctor = (doc) => {
    setSelectedDoctorForBooking(doc);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = (newAppt) => {
    setPatientAppointments((prev) => [newAppt, ...prev]);
  };

  const subNavItems = [
    { id: 'home', label: 'Overview', icon: LayoutDashboard },
    { id: 'doctors', label: 'Find Doctors', icon: Search },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'queue', label: 'Live Queue (#24)', icon: Clock, badge: 'Live' },
    { id: 'admission_bed', label: 'Bed & Ward', icon: BedDouble, badge: 'Ward A' },
    { id: 'emergency', label: 'Emergency SOS', icon: AlertTriangle, badge: '24/7', isEmergency: true },
    { id: 'ambulance', label: 'Ambulance', icon: Truck },
    { id: 'reports', label: 'Medical Reports', icon: FlaskConical },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'bills', label: 'Bills & Payments', icon: Receipt },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Patient Sub-Navigation Tab Bar */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          borderBottom: '1px solid var(--color-border)',
          overflowX: 'auto',
          paddingBottom: 4
        }}
      >
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDanger = item.isEmergency;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: isDanger
                  ? isActive
                    ? 'var(--color-critical)'
                    : '#fee2e2'
                  : isActive
                  ? 'var(--color-primary-subtle)'
                  : 'transparent',
                color: isDanger
                  ? isActive
                    ? '#ffffff'
                    : 'var(--color-critical)'
                  : isActive
                  ? 'var(--color-primary)'
                  : 'var(--color-text-muted)',
                fontWeight: isActive || isDanger ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isDanger
                      ? isActive
                        ? '#ffffff'
                        : 'var(--color-critical)'
                      : 'var(--color-secondary)',
                    color: isDanger && isActive ? 'var(--color-critical)' : '#ffffff',
                    fontWeight: 700
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Screen Views based on activeTab */}
      <div className="animate-fade-in">
        {activeTab === 'home' && (
          <PatientHome
            currentUser={currentUser}
            onNavigate={setActiveTab}
            onOpenBooking={() => {
              setSelectedDoctorForBooking(null);
              setBookingModalOpen(true);
            }}
            onOpenEmergency={() => setActiveTab('emergency')}
          />
        )}

        {activeTab === 'profile' && <PatientProfile currentUser={currentUser} />}

        {activeTab === 'doctors' && <DoctorSearch onBookDoctor={handleBookDoctor} />}

        {activeTab === 'appointments' && (
          <AppointmentManagement
            appointments={patientAppointments}
            onBookNew={() => {
              setSelectedDoctorForBooking(null);
              setBookingModalOpen(true);
            }}
          />
        )}

        {activeTab === 'queue' && <PatientQueueScreen />}

        {activeTab === 'admission_bed' && <PatientAdmissionBed currentUser={currentUser} />}

        {activeTab === 'emergency' && (
          <PatientEmergency currentUser={currentUser} onNavigate={setActiveTab} />
        )}

        {activeTab === 'ambulance' && (
          <AmbulanceTracker onCancel={() => setActiveTab('home')} />
        )}

        {activeTab === 'reports' && <MedicalReports />}

        {activeTab === 'prescriptions' && <PrescriptionView />}

        {activeTab === 'bills' && <BillsAndPayments />}
      </div>

      {/* Appointment Booking Wizard Modal */}
      <AppointmentBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialDoctor={selectedDoctorForBooking}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};
