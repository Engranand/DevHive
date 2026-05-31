const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

router.use(protect);

// GET /api/tasks?projectId=
router.get('/', async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const tasks = await Task.find({ project: projectId })
      .populate('assignee', 'name avatar')
      .sort({ order: 1, createdAt: -1 });
    res.json({ tasks });
  } catch (err) { next(err); }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    await task.populate('assignee', 'name avatar');
    req.app.get('io')?.to(`project:${task.project}`).emit('task_created', task);
    res.status(201).json({ task });
  } catch (err) { next(err); }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignee', 'name avatar');
    req.app.get('io')?.to(`project:${task.project}`).emit('task_updated', task);
    res.json({ task });
  } catch (err) { next(err); }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    req.app.get('io')?.to(`project:${task.project}`).emit('task_deleted', { _id: task._id });
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
});

module.exports = router;