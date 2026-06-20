const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const Invitation = require('../models/Invitation')
const Project = require('../models/Project')
const User = require('../models/User')

router.use(protect)

// POST /api/invitations — naya invite bhejo
router.post('/', async (req, res, next) => {
  try {
    const { projectId, email, role } = req.body

    // Check — already member hai kya?
    const project = await Project.findById(projectId).populate('members.user', 'email')
    const alreadyMember = project.members.some(m => m.user.email === email.toLowerCase())
    if (alreadyMember) {
      return res.status(400).json({ message: 'Already a member of this project' })
    }

    // Check — already pending invite hai kya?
    const existing = await Invitation.findOne({ 
      project: projectId, 
      email: email.toLowerCase(), 
      status: 'pending' 
    })
    if (existing) {
      return res.status(400).json({ message: 'Invite already sent to this email' })
    }

    const invitation = await Invitation.create({
      project: projectId,
      email: email.toLowerCase(),
      invitedBy: req.user._id,
      role: role || 'contributor',
    })

    res.status(201).json({ invitation })
  } catch (err) { next(err) }
})

// GET /api/invitations/pending — logged-in user ke pending invites
router.get('/pending', async (req, res, next) => {
  try {
    const invitations = await Invitation.find({ 
      email: req.user.email.toLowerCase(), 
      status: 'pending' 
    })
      .populate('project', 'name description')
      .populate('invitedBy', 'name')

    res.json({ invitations })
  } catch (err) { next(err) }
})

// POST /api/invitations/:id/accept
router.post('/:id/accept', async (req, res, next) => {
  try {
    const invitation = await Invitation.findById(req.params.id)
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' })
    if (invitation.email !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: 'This invitation is not for you' })
    }

    // Project mein member add karo
    const project = await Project.findById(invitation.project)
    const alreadyMember = project.members.some(m => m.user.toString() === req.user._id.toString())
    
    if (!alreadyMember) {
      project.members.push({ user: req.user._id, role: invitation.role })
      await project.save()
    }

    invitation.status = 'accepted'
    await invitation.save()

    res.json({ message: 'Invitation accepted', project })
  } catch (err) { next(err) }
})

// POST /api/invitations/:id/decline
router.post('/:id/decline', async (req, res, next) => {
  try {
    const invitation = await Invitation.findById(req.params.id)
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' })
    
    invitation.status = 'declined'
    await invitation.save()

    res.json({ message: 'Invitation declined' })
  } catch (err) { next(err) }
})

module.exports = router