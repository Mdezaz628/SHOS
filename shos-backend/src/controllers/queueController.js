import { store } from '../data/store.js';

export const getLiveQueue = async (req, res) => {
  const queue = store.getQueue();
  return res.json({ success: true, data: queue });
};

export const advanceQueue = async (req, res) => {
  const updatedQueue = store.advanceQueue();
  return res.json({ success: true, message: 'Queue advanced to next patient token.', data: updatedQueue });
};
