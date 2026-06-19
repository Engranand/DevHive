 const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Project = require('../models/Project');

router.use(protect);

// GET /api/projects/mine — logged in user ke projects
router.get('/mine', async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar')
      .sort({ createdAt: -1 })
    res.json({ projects, hasProject: projects.length > 0 })
  } catch (err) { next(err) }
})

// GET /api/projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar')
    res.json({ projects })
  } catch (err) { next(err) }
})

// POST /api/projects — naya project banao
router.post('/', async (req, res, next) => {
  try {
    const { name, description, githubRepoUrl } = req.body
    const project = await Project.create({
      name, description, githubRepoUrl,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'owner' }],
    })
    // Creator automatically owner ban gaya
    res.status(201).json({ project, hasProject: true })
  } catch (err) { next(err) }
})

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar')
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ project })
  } catch (err) { next(err) }
})

// GET /api/projects/:id/workload
router.get('/:id/workload', async (req, res, next) => {
  try {
    const Task = require('../models/Task')
    const project = await Project.findById(req.params.id)
      .populate('members.user', 'name')

    const weights = { critical: 4, high: 3, medium: 2, low: 1 }

    const workload = []
    for (const member of project.members) {
      const [openTasks, totalTasks] = await Promise.all([
        Task.find({ project: req.params.id, assignee: member.user._id, status: { $ne: 'done' } }),
        Task.find({ project: req.params.id, assignee: member.user._id })
      ])

      // Bug fix — openTasks use karo, tasks nahi
      const score = openTasks.reduce((sum, t) => sum + (weights[t.priority] || 1), 0)

      workload.push({
        userId: member.user._id,
        name: member.user.name,
        role: member.role,
        score,
        openTasks: openTasks.length,
        totalTasks: totalTasks.length,
      })
    }

    const avg = workload.length > 0
      ? workload.reduce((sum, w) => sum + w.score, 0) / workload.length
      : 0

    workload.forEach(w => {
      w.deviation = avg > 0 ? Math.round(((w.score - avg) / avg) * 100) : 0
      w.overloaded = w.deviation > 40
    })

    res.json({ workload, average: avg })
  } catch (err) { next(err) }
})

module.exports = router