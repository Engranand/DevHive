const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const Sprint = require('../models/Sprint')
const Task = require('../models/Task')

router.use(protect)

// GET /api/sprints?projectId=
router.get('/', async (req, res, next) => {
  try {
    const { projectId } = req.query
    const sprints = await Sprint.find({ project: projectId }).sort({ startDate: -1 })
    res.json({ sprints })
  } catch (err) { next(err) }
})

// POST /api/sprints
router.post('/', async (req, res, next) => {
  try {
    const sprint = await Sprint.create(req.body)
    res.status(201).json({ sprint })
  } catch (err) { next(err) }
})

// GET /api/sprints/:id/stats — task breakdown for a sprint
router.get('/:id/stats', async (req, res, next) => {
  try {
    const tasks = await Task.find({ sprint: req.params.id })

  const stats = {
  total: tasks.length,
  backlog: tasks.filter(t => t.status === 'backlog').length,
  in_progress: tasks.filter(t => t.status === 'in_progress').length,
  in_review: tasks.filter(t => t.status === 'in_review').length,
  done: tasks.filter(t => t.status === 'done').length,
  blocked: tasks.filter(t => t.status === 'in_review' && t.priority === 'critical').length,
}

    res.json({ stats })
  } catch (err) { next(err) }
})

module.exports = router