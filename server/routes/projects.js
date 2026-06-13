const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Project = require('../models/Project');

router.use(protect);

// GET /api/projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar');
    res.json({ projects });
  } catch (err) { next(err); }
});

// POST /api/projects
router.post('/', async (req, res, next) => {
  try {
    const { name, description, githubRepoUrl } = req.body;
    const project = await Project.create({
      name, description, githubRepoUrl,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'owner' }],
    });
    res.status(201).json({ project });
  } catch (err) { next(err); }
});

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) { next(err); }
});

 // GET /api/projects/:id/workload
router.get('/:id/workload', async (req, res, next) => {
  try {
    const Task = require('../models/Task')
    const project = await Project.findById(req.params.id).populate('members.user', 'name')

    const weights = { critical: 4, high: 3, medium: 2, low: 1 }

    const workload = []
    for (const member of project.members) {
      const tasks = await Task.find({
        project: req.params.id,
        assignee: member.user._id,
        status: { $ne: 'done' }
      })

      const score = tasks.reduce((sum, t) => sum + (weights[t.priority] || 1), 0)

      workload.push({
        userId: member.user._id,
        name: member.user.name,
        score,
        openTasks: tasks.length,
      })
    }

    const avg = workload.reduce((sum, w) => sum + w.score, 0) / workload.length

    workload.forEach(w => {
      w.deviation = avg > 0 ? Math.round(((w.score - avg) / avg) * 100) : 0
      w.overloaded = w.deviation > 40
    })

    res.json({ workload, average: avg })
  } catch (err) { next(err) }
})

module.exports = router;