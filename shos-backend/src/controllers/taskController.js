import { store } from '../data/store.js';

export const getTasks = async (req, res) => {
  const tasks = store.get('tasks');
  return res.json({ success: true, count: tasks.length, data: tasks });
};

export const advanceTaskStatus = async (req, res) => {
  const task = store.findById('tasks', req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  const flow = {
    Assigned: 'Accepted',
    Accepted: 'In Progress',
    'In Progress': 'Completed',
  };

  const nextStatus = flow[task.status] || 'Completed';
  const updated = store.update('tasks', req.params.id, { status: nextStatus });

  return res.json({ success: true, message: `Task advanced to ${nextStatus}.`, data: updated });
};
