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

module.exports = router;