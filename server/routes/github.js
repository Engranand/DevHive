const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { getRepoStats, getRecentCommits, getRecentPRs } = require('../services/githubService')
const Task = require('../models/Task')

router.use(protect)

// GET /api/github/activity
router.get('/activity', async (req, res, next) => {
  try {
    const [repo, commits, pullRequests] = await Promise.all([
      getRepoStats(),
      getRecentCommits(6),
      getRecentPRs(5),
    ])

    // Tasks linked to GitHub PRs that are done (auto-closed via webhook)
    const autoClosedTasks = await Task.find({
      githubPRUrl: { $exists: true, $ne: '' },
      status: 'done'
    }).select('title githubPRUrl')

    const linkedTasks = await Task.find({
      githubPRUrl: { $exists: true, $ne: '' }
    }).select('title githubPRUrl status')

    res.json({ repo, commits, pullRequests, autoClosedTasks, linkedTasks })
  } catch (err) {
    console.error('GitHub API error:', err.message)
    res.status(500).json({ message: 'Failed to fetch GitHub data' })
  }
})

module.exports = router