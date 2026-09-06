import { store } from '../data/store.js';

export const getAIPredictions = async (req, res) => {
  const predictions = store.get('aiPredictions');
  return res.json({ success: true, data: predictions });
};

export const getHospitalPlan = async (req, res) => {
  const plan = store.get('hospitalPlan');
  return res.json({ success: true, data: plan });
};

export const getAIRecommendations = async (req, res) => {
  const recommendations = store.get('aiRecommendations');
  return res.json({ success: true, count: recommendations.length, data: recommendations });
};

export const approveRecommendation = async (req, res) => {
  const updated = store.update('aiRecommendations', req.params.id, { status: 'Approved' });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Recommendation not found.' });
  }

  // Record in audit log
  store.insert('auditLogs', {
    user: req.user?.name || 'Administrator',
    action: 'AI Recommendation Approved',
    module: 'AI Intelligence',
    details: `Approved ${updated.title}`,
    timestamp: new Date().toISOString(),
    severity: 'High',
  });

  return res.json({ success: true, message: 'AI Recommendation approved and hospital action triggered.', data: updated });
};

export const rejectRecommendation = async (req, res) => {
  const updated = store.update('aiRecommendations', req.params.id, { status: 'Rejected' });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Recommendation not found.' });
  }
  return res.json({ success: true, message: 'AI Recommendation rejected.', data: updated });
};
