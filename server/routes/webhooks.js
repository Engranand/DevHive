const express = require('express')
const router = express.Router()
const Task = require('../models/Task')

// POST /api/webhooks/github
router.post('/github', async (req, res) => {
  try {
    const event = req.body

    console.log('Webhook received:', event.action)

    // Sirf PR merge events handle karo
    if (event.action === 'closed' && event.pull_request?.merged === true) {
      const prUrl = event.pull_request.html_url
      const prNumber = event.pull_request.number

      console.log(`PR #${prNumber} merged: ${prUrl}`)

      // Linked task dhundo — githubPRUrl match karo
      const task = await Task.findOne({ githubPRUrl: { $regex: `/${prNumber}$` } })

      if (task) {
        task.status = 'done'
        await task.save()

        console.log(`Task "${task.title}" auto-moved to Done`)

        // Socket.io se sabko batao
        const io = req.app.get('io')
        if (io) {
          io.to(`project:${task.project}`).emit('task_moved', {
            taskId: task._id,
            to: 'done',
            task: task,
          })
        }

        return res.json({ message: 'Task auto-closed', task })
      }

      return res.json({ message: 'No linked task found' })
    }

    res.json({ message: 'Event ignored — not a merge' })
  } catch (err) {
    console.error('Webhook error:', err.message)
    res.status(500).json({ message: 'Webhook processing failed' })
  }
})

module.exports = router