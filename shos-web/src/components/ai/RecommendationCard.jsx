import React, { useState } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const RecommendationCard = ({ recommendation }) => {
  const { approveRecommendation, rejectRecommendation } = useHospital();
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);

  const priorityColors = {
    Critical: 'badge-danger',
    High: 'badge-warning',
    Medium: 'badge-ai',
    Low: 'badge-cyan'
  };

  const handleApprove = () => {
    approveRecommendation(recommendation.id, notes || 'Approved by administrator');
    setShowNotesModal(false);
  };

  return (
    <div className={`recommendation-card glass-panel ${recommendation.status === 'approved' ? 'approved' : ''}`}>
      <div className="rec-header">
        <div className="rec-code-group">
          <BrainCircuit size={18} className="text-cyan" />
          <span className="rec-code">{recommendation.code}</span>
          <span className={`badge ${priorityColors[recommendation.priority] || 'badge-cyan'}`}>
            {recommendation.priority} Priority
          </span>
        </div>
        <div className="rec-status-group">
          {recommendation.status === 'approved' && (
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> Approved
            </span>
          )}
          {recommendation.status === 'pending' && (
            <span className="badge badge-warning">
              <Clock size={12} /> Pending Review
            </span>
          )}
          {recommendation.status === 'rejected' && (
            <span className="badge badge-danger">
              <XCircle size={12} /> Rejected
            </span>
          )}
        </div>
      </div>

      <h3 className="rec-title">{recommendation.title}</h3>
      <p className="rec-reasoning">{recommendation.reasoning}</p>

      <div className="rec-action-box">
        <div className="action-tag">
          <Sparkles size={14} className="text-cyan" />
          <span>Recommended Hospital Action:</span>
        </div>
        <p className="action-text">{recommendation.suggestedAction}</p>
      </div>

      <div className="rec-impact-row">
        <span className="impact-text">
          <strong>Expected Impact:</strong> {recommendation.impact}
        </span>
        <span className="timestamp-text">{recommendation.createdAt}</span>
      </div>

      {recommendation.status === 'pending' && (
        <div className="rec-buttons-row">
          <button
            className="btn btn-success"
            onClick={() => setShowNotesModal(true)}
          >
            <CheckCircle2 size={16} /> Approve & Implement
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => rejectRecommendation(recommendation.id)}
          >
            <XCircle size={16} /> Dismiss
          </button>
        </div>
      )}

      {recommendation.status === 'approved' && recommendation.implementationNotes && (
        <div className="approval-notes-box">
          <CheckCircle2 size={14} className="text-emerald" />
          <span>Notes: {recommendation.implementationNotes}</span>
        </div>
      )}

      {/* Quick Approval Modal */}
      {showNotesModal && (
        <div className="modal-backdrop">
          <div className="modal-box glass-panel-glow">
            <h3>Approve AI Recommendation</h3>
            <p className="modal-desc">
              Reviewing <strong>{recommendation.code}</strong>. You can append administrative review notes:
            </p>
            <textarea
              className="notes-textarea"
              placeholder="e.g. Reviewed and approved. Shift in-charge notified."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowNotesModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleApprove}>
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
