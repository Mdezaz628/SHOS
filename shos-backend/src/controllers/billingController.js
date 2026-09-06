import { store } from '../data/store.js';

export const getBills = async (req, res) => {
  const billing = store.get('billing');
  return res.json({ success: true, count: billing.length, data: billing });
};

export const payBill = async (req, res) => {
  const updated = store.update('billing', req.params.id, { paymentStatus: 'paid' });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Invoice not found.' });
  }
  return res.json({ success: true, message: 'Payment recorded and GST invoice issued.', data: updated });
};
