import React, { useState } from 'react';
import {
  Pill,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Package,
  ShoppingCart,
  Search,
  Sparkles,
  ArrowRight,
  Eye,
  FileText,
  Printer,
  X,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const PharmacyPage = () => {
  const { pharmacyStock, recommendations } = useHospital();
  const [stockList, setStockList] = useState(pharmacyStock);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedRx, setSelectedRx] = useState(null);
  const [pharmacyToast, setPharmacyToast] = useState('');

  // Today's Patient Prescription Dispensing Workload Queue
  const [rxQueue, setRxQueue] = useState([
    {
      id: 'RX-701',
      patient: 'Rahul Sharma',
      bed: 'Ward A - Bed 02',
      uhid: 'UHID-10492',
      doctor: 'Dr. Vivek Mehra',
      medications: 'Metoprolol Succinate 50mg (OD) + Ecosprin 75mg (OD)',
      priority: 'Due Now',
      status: 'Ready for Dispatch',
      time: '01:45 PM',
      batch: 'BATCH-MET-8842',
      expiry: '04/2028'
    },
    {
      id: 'RX-702',
      patient: 'Anita Deshmukh',
      bed: 'Ward A - Bed 04',
      uhid: 'UHID-10512',
      doctor: 'Dr. Sunita Rao',
      medications: 'Cefuroxime 500mg IV Infusion (BD) + Pantoprazole 40mg IV',
      priority: 'Urgent',
      status: 'Pending Verification',
      time: '01:50 PM',
      batch: 'BATCH-CEF-9120',
      expiry: '11/2027'
    },
    {
      id: 'RX-703',
      patient: 'Vikramaditya Rao',
      bed: 'Ward A - Bed 03',
      uhid: 'UHID-10902',
      doctor: 'Dr. Sunita Rao',
      medications: 'Inj. Tramadol 50mg IV STAT + Inj. Ondansetron 4mg IV STAT',
      priority: 'STAT (Emergency)',
      status: 'Ready for Dispatch',
      time: '02:00 PM',
      batch: 'BATCH-TRM-3301',
      expiry: '08/2028'
    },
    {
      id: 'RX-704',
      patient: 'Kamala Devi',
      bed: 'Ward A - Bed 01',
      uhid: 'UHID-10488',
      doctor: 'Dr. Radhika Roy',
      medications: 'Budecort 0.5mg Respules + Levolin 0.63mg Nebulization',
      priority: 'Routine',
      status: 'Dispensed',
      time: '12:30 PM',
      batch: 'BATCH-BUD-5510',
      expiry: '02/2029'
    }
  ]);

  const showToast = (msg) => {
    setPharmacyToast(msg);
    setTimeout(() => setPharmacyToast(''), 4500);
  };

  const handleDispenseMedication = (rxId, patientName, meds) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRxQueue((prev) =>
      prev.map((rx) =>
        rx.id === rxId
          ? { ...rx, status: `Dispensed at ${timeNow} (Ward Delivered)` }
          : rx
      )
    );
    setSelectedRx(null);
    showToast(`✓ Dispensed "${meds}" for ${patientName} to Ward In-Charge at ${timeNow}!`);
  };

  const pharmRec = recommendations.find((r) => r.code.includes('PHARM'));

  const handleReorder = (itemCode) => {
    setStockList((prev) =>
      prev.map((item) =>
        item.code === itemCode
          ? { ...item, stock: item.stock + 100, status: 'Adequate' }
          : item
      )
    );
    showToast(`✓ PO Generated: Restocked +100 units for ${itemCode}!`);
  };

  const filtered = stockList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'All' || item.category.includes(filterCategory);
    return matchesSearch && matchesCat;
  });

  const criticalCount = stockList.filter((item) => item.status.includes('Critical') || item.status.includes('Low')).length;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Toast Alert */}
      {pharmacyToast && (
        <div
          style={{
            backgroundColor: '#065f46',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(6,95,70,0.3)',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{pharmacyToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Pill className="text-cyan" />
            Pharmacy & Inpatient Medication Dispensing
          </h1>
          <p className="page-subtitle">
            Automated stock ledger, batch tracking, critical shortage alerts, and AI consumption forecasting.
          </p>
        </div>
        <div className="header-actions">
          {criticalCount > 0 && (
            <span className="badge badge-warning">
              <AlertTriangle size={13} /> {criticalCount} Items Below Threshold
            </span>
          )}
        </div>
      </div>

      {/* Pharmacy Stats */}
      <div className="stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Tracked Catalog Items</span>
            <div className="stat-icon-wrap bg-cyan-glow">
              <Package size={18} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value">1,248</div>
          </div>
          <div className="stat-footer">
            <span>Essential Drug List</span>
            <span>Central Medical Store</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Critical Under-Stock</span>
            <div className="stat-icon-wrap bg-rose-glow">
              <AlertTriangle size={18} className="text-rose" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-rose">{criticalCount} SKU</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              Immediate PO recommended
            </span>
            <span>Safety buffer &lt;24h</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Dispensed Today</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <CheckCircle2 size={18} className="text-emerald" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-emerald">310 Units</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-down">
              84 Inpatient prescriptions
            </span>
            <span>ER / ICU fulfillment: 100%</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">AI Demand Predictor</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              <TrendingUp size={18} className="text-purple" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-purple">+18.5%</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              Seasonal respiratory demand
            </span>
            <span>Model R²: 0.924</span>
          </div>
        </div>
      </div>

      {/* AI Pharmacy Demand Alert Banner */}
      {pharmRec && (
        <div
          className="section-panel glass-panel-glow"
          style={{
            marginBottom: '24px',
            borderLeft: '4px solid var(--amber-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', width: '42px', height: '42px' }}>
              <Sparkles className="text-amber" size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-warning">AI Inventory Warning</span>
                <strong style={{ fontSize: '0.95rem' }}>{pharmRec.title}</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                {pharmRec.reasoning}
              </p>
            </div>
          </div>
          <div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleReorder('MED-001')}
            >
              <ShoppingCart size={14} /> Quick Restock All Low Items
            </button>
          </div>
        </div>
      )}

      {/* TODAY'S INPATIENT PRESCRIPTION DISPENSING WORKLOAD */}
      <div className="section-panel glass-panel" style={{ marginBottom: '24px' }}>
        <div className="section-panel-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="section-panel-title">
            <Pill className="text-cyan" size={20} />
            <span>Today's Inpatient Prescription Dispensing Queue</span>
          </div>
          <span className="badge badge-cyan">Shift B Inpatient Fulfillment</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rx ID</th>
                <th>Patient & Bed</th>
                <th>Prescribed Medication</th>
                <th>Doctor</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Dispensation Action</th>
              </tr>
            </thead>
            <tbody>
              {rxQueue.map((rx) => {
                const isStat = rx.priority.includes('STAT');
                const isDue = rx.priority === 'Due Now';
                const isDispensed = rx.status.includes('Dispensed');
                return (
                  <tr key={rx.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-light)' }}>
                      {rx.id}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedRx(rx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontWeight: 700,
                          color: 'var(--cyan-light)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        title="Click to view Prescription Batch Details"
                      >
                        <span>{rx.patient}</span>
                        <Eye size={13} style={{ opacity: 0.7 }} />
                      </button>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        {rx.bed} • {rx.uhid}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{rx.medications}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)' }}>{rx.doctor}</span>
                    </td>
                    <td>
                      <span className={`badge ${isStat ? 'badge-danger pulse' : isDue ? 'badge-warning' : 'badge-cyan'}`}>
                        {rx.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isDispensed ? 'badge-success' : 'badge-secondary'}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={isDispensed}
                          onClick={() => handleDispenseMedication(rx.id, rx.patient, rx.medications)}
                        >
                          {isDispensed ? 'Dispensed ✓' : 'Dispense'}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setSelectedRx(rx)}
                        >
                          <FileText size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Table */}
      <div className="section-panel glass-panel">
        <div className="section-panel-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="section-panel-title">
            <Package className="text-cyan" size={20} />
            <span>Medication Inventory & Formulary</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-dim)' }}
              />
              <input
                type="text"
                placeholder="Search medicine name, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem'
                }}
              />
            </div>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Medicine Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Threshold</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isCritical = item.status === 'Critical Low';
                const isLow = item.status === 'Low Stock';
                return (
                  <tr key={item.code}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-light)' }}>
                      {item.code}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.category}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: isCritical ? 'var(--rose-danger)' : isLow ? 'var(--amber-warning)' : 'var(--emerald-success)'
                        }}
                      >
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        {item.minLevel} {item.unit}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>₹{item.price}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          isCritical ? 'badge-danger pulse' : isLow ? 'badge-warning' : 'badge-success'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleReorder(item.code)}
                        title="Restock +100 units"
                      >
                        <ShoppingCart size={13} /> Reorder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PHARMACY DISPENSING & BATCH VERIFICATION MODAL */}
      {selectedRx && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
        >
          <div
            className="section-panel glass-panel animate-scale-up"
            style={{
              backgroundColor: '#0f172a',
              maxWidth: 580,
              width: '100%',
              padding: 24,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 12,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 16
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Pill size={20} className="text-cyan" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    Inpatient Prescription #{selectedRx.id}
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                  Patient: <strong style={{ color: '#ffffff' }}>{selectedRx.patient}</strong> ({selectedRx.uhid}) • {selectedRx.bed}
                </div>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
              <div style={{ padding: 14, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Prescribed Medication Regimen
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
                  {selectedRx.medications}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: 4 }}>
                  Prescribed by: {selectedRx.doctor} • Due Time: {selectedRx.time}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Assigned Batch No.
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff', marginTop: 2 }}>
                    {selectedRx.batch}
                  </div>
                </div>

                <div style={{ padding: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Expiry Verification
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981', marginTop: 2 }}>
                    {selectedRx.expiry} (Verified OK)
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#10b981' }}>
                <ShieldCheck size={16} />
                <span>Pharmacist Quality Checked & Barcode Reconciled</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => alert(`Printing Inpatient Dispense Label for ${selectedRx.patient}...`)}
                >
                  <Printer size={14} /> Print Label
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDispenseMedication(selectedRx.id, selectedRx.patient, selectedRx.medications)}
                >
                  <CheckCircle2 size={14} /> Dispense & Deliver to Ward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
