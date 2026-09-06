import React, { useState } from 'react';
import {
  FlaskConical,
  FileText,
  Eye,
  Download,
  Calendar,
  User,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Tabs } from '../../components/ui/Tabs';
import { SearchBar } from '../../components/ui/SearchBar';

export const MedicalReports = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModal, setViewModal] = useState(null);

  const categories = [
    { id: 'all', label: 'All Reports' },
    { id: 'blood', label: 'Blood Test' },
    { id: 'xray', label: 'X-Ray' },
    { id: 'ct', label: 'CT Scan' },
    { id: 'mri', label: 'MRI' },
    { id: 'prescription', label: 'Prescription' },
    { id: 'discharge', label: 'Discharge Summary' }
  ];

  const reportsList = [
    {
      id: 'REP-001',
      name: 'Comprehensive Lipid Profile & Liver Function Panel',
      category: 'blood',
      categoryLabel: 'Blood Test',
      date: '05 Sep 2026',
      doctor: 'Dr. Vivek Mehra',
      status: 'Report Ready',
      findings: 'Serum Total Cholesterol: 184 mg/dL (Normal). Triglycerides: 142 mg/dL. HDL: 46 mg/dL. Liver enzymes AST/ALT within normal limits.'
    },
    {
      id: 'REP-002',
      name: 'Chest X-Ray PA View (Digital Radiography)',
      category: 'xray',
      categoryLabel: 'X-Ray',
      date: '02 Sep 2026',
      doctor: 'Dr. S. K. Gupta',
      status: 'Report Ready',
      findings: 'Bilateral lung fields clear. No focal consolidation, pneumothorax, or pleural effusion. Cardiothoracic ratio is normal.'
    },
    {
      id: 'REP-003',
      name: 'High-Resolution Computed Tomography (HRCT Chest)',
      category: 'ct',
      categoryLabel: 'CT Scan',
      date: '28 Aug 2026',
      doctor: 'Dr. S. K. Gupta',
      status: 'Report Ready',
      findings: 'Mild bronchial wall thickening observed. No bronchiectasis or pulmonary thromboembolism. Visualized coronary calcification minimal.'
    },
    {
      id: 'REP-004',
      name: 'Magnetic Resonance Imaging (MRI Brain & Angio)',
      category: 'mri',
      categoryLabel: 'MRI',
      date: '15 Jul 2026',
      doctor: 'Dr. Rohan Mathur',
      status: 'Report Ready',
      findings: 'Normal cerebral hemispheres without acute infarct or hemorrhage. Major intracranial flow voids preserved.'
    },
    {
      id: 'REP-005',
      name: 'Cardiology Post-Consultation Prescription',
      category: 'prescription',
      categoryLabel: 'Prescription',
      date: '05 Sep 2026',
      doctor: 'Dr. Vivek Mehra',
      status: 'Active',
      findings: 'Tab Atorvastatin 20mg (1-0-0), Tab Amlodipine 5mg (0-0-1). Continue low-sodium diet and daily 30m aerobic walk.'
    },
    {
      id: 'REP-006',
      name: 'Inpatient Ward Discharge Summary (Elective Observation)',
      category: 'discharge',
      categoryLabel: 'Discharge Summary',
      date: '18 Jan 2026',
      doctor: 'Dr. Radhika Roy',
      status: 'Archived',
      findings: 'Discharged in stable clinical condition. Vitals stable at discharge: BP 120/78 mmHg, PR 72/min, SpO2 99% on room air.'
    }
  ];

  const filtered = reportsList.filter((r) => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const printAndDownloadReport = (report) => {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for SHOS Hospital Portal to view and print your PDF report.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SHOS Diagnostic Report - ${report.id}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #1e293b; background: #fff; }
          .header { border-bottom: 3px solid #1e40af; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .hospital-title { font-size: 20px; font-weight: 900; color: #1e40af; text-transform: uppercase; }
          .hospital-sub { font-size: 11px; color: #0f766e; font-weight: bold; margin-top: 2px; }
          .hospital-addr { font-size: 10px; color: #64748b; }
          .meta-box { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 11px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { font-size: 9px; font-weight: bold; color: #64748b; text-transform: uppercase; }
          .meta-val { font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 2px; }
          .section-title { font-size: 13px; font-weight: 800; color: #1e40af; background: #eff6ff; padding: 8px 12px; border-left: 4px solid #1e40af; margin-bottom: 12px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          .table th { background: #f1f5f9; text-align: left; padding: 8px 10px; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; }
          .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .obs-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px; border-radius: 4px; margin-bottom: 24px; }
          .obs-title { font-size: 11px; font-weight: bold; color: #166534; text-transform: uppercase; margin-bottom: 4px; }
          .obs-text { font-size: 12px; color: #14532d; line-height: 1.6; }
          .footer-section { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; }
          .auth-box { text-align: right; }
          .sign-script { font-size: 18px; font-weight: bold; font-family: cursive; color: #0f172a; }
          .sign-line { width: 180px; height: 1px; background: #64748b; margin: 4px 0 4px auto; }
          .sign-title { font-size: 11px; font-weight: bold; color: #1e40af; }
          .sign-meta { font-size: 10px; color: #64748b; }
          .disclaimer { font-size: 9px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
          @media print {
            .no-print { display: none; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-title">🏥 SHOS MULTISPECIALTY HOSPITAL</div>
            <div class="hospital-sub">NABL Accredited Central Pathology & Diagnostic Imaging</div>
            <div class="hospital-addr">Health City, New Delhi - 110001 | Phone: 011-23456789 | NABL Reg: MC-2026-904</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px; font-weight: bold; color: #1e40af;">OFFICIAL DIAGNOSTIC REPORT</div>
            <div style="font-size: 10px; color: #64748b;">NABL Certified E-Report</div>
          </div>
        </div>

        <div class="meta-box">
          <div class="meta-item">
            <span class="meta-label">Patient Name</span>
            <span class="meta-val">Rahul Sharma</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">UHID / MRN</span>
            <span class="meta-val">SHOS-2026-90214</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Age / Gender</span>
            <span class="meta-val">34 Yrs / Male</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Report Date</span>
            <span class="meta-val">${report.date}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Ordering Physician</span>
            <span class="meta-val">${report.doctor}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Sample Barcode</span>
            <span class="meta-val">BRC-782910</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Specimen</span>
            <span class="meta-val">Venous Blood / Imaging</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Report ID</span>
            <span class="meta-val">${report.id}</span>
          </div>
        </div>

        <div class="section-title">INVESTIGATION: ${report.name.toUpperCase()}</div>

        <table class="table">
          <thead>
            <tr>
              <th>Investigation Parameter</th>
              <th style="text-align: center;">Biological Ref Interval</th>
              <th style="text-align: right;">Result & Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${report.name}</strong><br><span style="font-size: 10px; color: #64748b;">Method: Fully Automated Enzymatic / Digital High-Definition Modality</span></td>
              <td style="text-align: center; color: #64748b;">Normal Range</td>
              <td style="text-align: right; font-weight: bold; color: #0f766e;">VERIFIED NORMAL</td>
            </tr>
          </tbody>
        </table>

        <div class="obs-box">
          <div class="obs-title">Clinical Findings & Authorized Diagnostic Impression</div>
          <div class="obs-text">${report.findings}</div>
        </div>

        <div class="footer-section">
          <div>
            <div style="font-size: 10px; color: #64748b;">QR Verification Code</div>
            <div style="display: inline-block; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-family: monospace; font-size: 9px; background: #f8fafc; margin-top: 4px;">
              [VERIFIED_NABL_ABHA_${report.id}]
            </div>
            <div style="font-size: 9px; color: #94a3b8; margin-top: 4px;">ABHA Linked Digitally</div>
          </div>
          <div class="auth-box">
            <div class="sign-script">Dr. R. K. Sen</div>
            <div class="sign-line"></div>
            <div class="sign-title">Dr. R. K. Sen, MD (Pathology)</div>
            <div class="sign-meta">Senior Consultant Pathologist & Chief of Diagnostics</div>
            <div class="sign-meta">Reg. No: MCI-DL-19842 | Electronically Signed on ${report.date}</div>
          </div>
        </div>

        <div class="disclaimer">
          This is an electronically generated and verified medical document in accordance with Section 65B of the Indian Evidence Act.
          No physical signature is required. Diagnostic interpretation is subject to clinical correlation by the treating physician.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
          Diagnostic & Medical Reports
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Verified digital lab panels, radiology imaging results, and discharge summaries.
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Tabs tabs={categories} activeTab={activeCategory} onChange={setActiveCategory} />

        <div style={{ maxWidth: 420 }}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search report name or ordering physician..."
          />
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-dim)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
            No reports found in this category.
          </div>
        ) : (
          filtered.map((report) => (
            <div
              key={report.id}
              className="shos-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.98rem', color: 'var(--color-text)' }}>
                      {report.name}
                    </strong>
                    <Badge variant="primary" size="sm">{report.categoryLabel}</Badge>
                    <StatusBadge status={report.status} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>Date: <strong>{report.date}</strong></span>
                    <span>Doctor: <strong>{report.doctor}</strong></span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>ID: {report.id}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button variant="outline" size="sm" icon={Eye} onClick={() => setViewModal(report)}>
                  View
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Download}
                  onClick={() => printAndDownloadReport(report)}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Findings View Modal */}
      {viewModal && (
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
          onClick={() => setViewModal(null)}
        >
          <div
            className="shos-card animate-fade-in"
            style={{ width: '100%', maxWidth: 540, padding: 24, backgroundColor: 'var(--color-surface)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: 12, marginBottom: 14 }}>
              <div>
                <Badge variant="primary" size="sm" style={{ marginBottom: 4 }}>{viewModal.categoryLabel}</Badge>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{viewModal.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                  Ordered by {viewModal.doctor} • Authorized on {viewModal.date}
                </span>
              </div>
            </div>

            <div style={{ padding: 14, backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: 16 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
                Clinical Observations & Interpretation:
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginTop: 6, lineHeight: 1.5 }}>
                {viewModal.findings}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="outline" size="sm" onClick={() => setViewModal(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm" icon={Download} onClick={() => printAndDownloadReport(viewModal)}>
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
