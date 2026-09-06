import React, { useState } from 'react';
import {
  User,
  HeartPulse,
  Phone,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export const PatientProfile = ({ currentUser }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: currentUser?.name?.split(' (')[0] || 'Rahul Sharma',
    dob: '1992-05-14',
    gender: 'Male',
    bloodGroup: 'B+',
    phone: currentUser?.phone || '+91 98765 43210',
    email: currentUser?.email || 'rahul.sharma@example.com',
    address: 'B-402, Green Glen Heights, New Delhi, India'
  });

  const [medicalHistory, setMedicalHistory] = useState({
    chronicConditions: 'Hypertension (Diagnosed 2021)',
    allergies: 'Penicillin, Dust Mites',
    pastSurgeries: 'Appendectomy (2018)',
    currentMedications: 'Atorvastatin 20mg, Amlodipine 5mg'
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: currentUser?.emergencyContact?.split(' (')[0] || 'Sunita Sharma',
    relation: 'Spouse',
    phone: '+91 98111 22233'
  });

  const [insurance, setInsurance] = useState({
    provider: 'Star Health & Allied Insurance',
    policyNumber: 'SH-POL-9821-4402',
    tpa: 'Medi Assist TPA',
    sumInsured: '₹ 10,00,000',
    validTill: '31 Dec 2026',
    status: 'Active & Verified'
  });

  const [documents] = useState([
    { name: 'Government ID (Aadhaar Card).pdf', date: 'Uploaded on 12 Jan 2026', size: '1.2 MB' },
    { name: 'Previous Discharge Summary (2018).pdf', date: 'Uploaded on 14 Jan 2026', size: '2.8 MB' },
    { name: 'COVID-19 Vaccination Certificate.pdf', date: 'Uploaded on 15 Jan 2026', size: '0.8 MB' }
  ]);

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Patient Electronic Health Profile
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Comprehensive EHR records, medical history, emergency contacts, and insurance details.
          </p>
        </div>
        {saved && (
          <Badge variant="success" icon={CheckCircle2}>
            Profile Updates Saved to EHR
          </Badge>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 1. Personal Information */}
        <Card title="Personal Information" subtitle="Demographic & contact credentials">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <Input
              label="Full Name"
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={personalInfo.dob}
              onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
            />
            <Input
              label="Blood Group"
              value={personalInfo.bloodGroup}
              onChange={(e) => setPersonalInfo({ ...personalInfo, bloodGroup: e.target.value })}
            />
            <Input
              label="Phone Number"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            />
            <Input
              label="Residential Address"
              value={personalInfo.address}
              onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
            />
          </div>
        </Card>

        {/* 2. Medical History */}
        <Card title="Clinical & Medical History" subtitle="Vital health background for attending doctors">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <Input
              label="Chronic Conditions"
              value={medicalHistory.chronicConditions}
              onChange={(e) => setMedicalHistory({ ...medicalHistory, chronicConditions: e.target.value })}
            />
            <Input
              label="Known Drug / Food Allergies"
              value={medicalHistory.allergies}
              onChange={(e) => setMedicalHistory({ ...medicalHistory, allergies: e.target.value })}
            />
            <Input
              label="Past Surgeries / Procedures"
              value={medicalHistory.pastSurgeries}
              onChange={(e) => setMedicalHistory({ ...medicalHistory, pastSurgeries: e.target.value })}
            />
            <Input
              label="Current Daily Medications"
              value={medicalHistory.currentMedications}
              onChange={(e) => setMedicalHistory({ ...medicalHistory, currentMedications: e.target.value })}
            />
          </div>
        </Card>

        {/* 3. Emergency Contact */}
        <Card title="Emergency Contact & Next of Kin" subtitle="Direct contact during trauma or medical emergencies">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <Input
              label="Contact Person Name"
              value={emergencyContact.name}
              onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
            />
            <Input
              label="Relationship"
              value={emergencyContact.relation}
              onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
            />
            <Input
              label="Emergency Phone"
              value={emergencyContact.phone}
              onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
            />
          </div>
        </Card>

        {/* 4. Insurance Information */}
        <Card title="Health Insurance & TPA Coverage" subtitle="Cashless hospitalization eligibility">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Insurance Provider</span>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{insurance.provider}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Policy Number</span>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>{insurance.policyNumber}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>TPA Desk</span>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{insurance.tpa}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Sum Insured</span>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{insurance.sumInsured}</div>
            </div>
          </div>
        </Card>

        {/* 5. Uploaded Documents */}
        <Card title="Uploaded Medical Documents & Records" subtitle="Government IDs, discharge summaries, and vaccination proofs">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {documents.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>{doc.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>
                      {doc.date} • {doc.size}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => alert(`Opening document: ${doc.name}`)}>
                  View Document
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button type="submit" variant="primary" size="md">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
