import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, AlertTriangle, Eye, RefreshCw, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const AppointmentManagement = ({ appointments = [], onBookNew }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [list, setList] = useState(appointments);
  const [selectedForCancel, setSelectedForCancel] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: list.filter((a) => a.status === 'Waiting' || a.status === 'Consulting').length },
    { id: 'completed', label: 'Completed', count: list.filter((a) => a.status === 'Completed').length },
    { id: 'cancelled', label: 'Cancelled', count: list.filter((a) => a.status === 'Cancelled').length }
  ];

  const handleCancelAppointment = () => {
    if (!selectedForCancel) return;
    setList((prev) =>
      prev.map((a) =>
        a.token === selectedForCancel.token ? { ...a, status: 'Cancelled' } : a
      )
    );
    setSelectedForCancel(null);
  };

  const handleReschedule = (appt) => {
    alert(`Reschedule request initiated for ${appt.token}. Select new slot.`);
  };

  const filtered = list.filter((a) => {
    if (activeTab === 'upcoming') return a.status === 'Waiting' || a.status === 'Consulting';
    if (activeTab === 'completed') return a.status === 'Completed';
    if (activeTab === 'cancelled') return a.status === 'Cancelled';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            My Consultations & Appointments
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Manage scheduled doctor visits, view consultation details, or reschedule tokens.
          </p>
        </div>
        <Button variant="primary" icon={Calendar} onClick={onBookNew}>
          Book New Consultation
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-dim)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
            No {activeTab} appointments found.
          </div>
        ) : (
          filtered.map((appt) => (
            <div
              key={appt.token}
              className="shos-card"
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                borderLeft: appt.status === 'Cancelled' ? '4px solid var(--color-critical)' : '4px solid var(--color-primary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-subtle)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Token</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                    {appt.token}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>
                      {appt.doctor}
                    </strong>
                    <StatusBadge status={appt.status} />
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {appt.dept} • Slot: <strong>{appt.slot}</strong>
                  </div>
                </div>
              </div>

              {/* Actions: View Details, Reschedule, Cancel */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button variant="outline" size="sm" icon={Eye} onClick={() => setDetailsModal(appt)}>
                  View Details
                </Button>

                {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                  <>
                    <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => handleReschedule(appt)}>
                      Reschedule
                    </Button>
                    <Button variant="ghost" size="sm" icon={XCircle} onClick={() => setSelectedForCancel(appt)} style={{ color: 'var(--color-critical)' }}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal for Cancellation */}
      <ConfirmationModal
        isOpen={!!selectedForCancel}
        onClose={() => setSelectedForCancel(null)}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel your consultation token ${selectedForCancel?.token} with ${selectedForCancel?.doctor}?`}
        confirmLabel="Yes, Cancel Visit"
        variant="critical"
      />

      {/* View Details Dialog */}
      {detailsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
          onClick={() => setDetailsModal(null)}
        >
          <div
            className="shos-card animate-fade-in"
            style={{ width: '100%', maxWidth: 440, padding: 24, backgroundColor: 'var(--color-surface)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 12 }}>
              Consultation Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
              <div>Token: <strong style={{ color: 'var(--color-primary)' }}>{detailsModal.token}</strong></div>
              <div>Doctor: <strong>{detailsModal.doctor}</strong></div>
              <div>Department: <strong>{detailsModal.dept}</strong></div>
              <div>Consultation Slot: <strong>{detailsModal.slot}</strong></div>
              <div>Cabin: <strong>OPD-204 (2nd Floor, Block B)</strong></div>
              <div>Status: <strong>{detailsModal.status}</strong></div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm" onClick={() => setDetailsModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
