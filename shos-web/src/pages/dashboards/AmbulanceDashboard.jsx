import React from 'react';
import { Ambulance, MapPin, Radio, AlertOctagon } from 'lucide-react';
import { MOCK_AMBULANCES } from '../../services/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AmbulanceCard } from '../../components/hospital/AmbulanceCard';

export const AmbulanceDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Emergency Ambulance Fleet & GPS Dispatch
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            24/7 Advanced Life Support (ALS) & Mobile Trauma Coordination
          </p>
        </div>
        <Button variant="critical" icon={AlertOctagon} onClick={() => alert('Broadcasting Emergency Code Red to Fleet!')}>
          Broadcast Code Red SOS
        </Button>
      </div>

      <Card title="Live Ambulance Telemetry Units" subtitle="Real-time GPS sectors, crew allocation, and portico ETA">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {MOCK_AMBULANCES.map((amb) => (
            <AmbulanceCard key={amb.id} ambulance={amb} />
          ))}
        </div>
      </Card>
    </div>
  );
};
