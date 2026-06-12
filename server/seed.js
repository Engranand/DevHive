const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/User')
const Project = require('./models/Project')
const Task = require('./models/Task')

dotenv.config()

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Find Anand (already exists)
  const anand = await User.findOne({ email: 'anand@test.com' })
  if (!anand) {
    console.log('Anand not found — login pehle karo')
    process.exit(1)
  }

  // Create other users
  const rohan = await User.findOneAndUpdate(
    { email: 'rohan@test.com' },
    { name: 'Rohan', email: 'rohan@test.com', password: '123456' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  const sneha = await User.findOneAndUpdate(
    { email: 'sneha@test.com' },
    { name: 'Sneha', email: 'sneha@test.com', password: '123456' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  const kiran = await User.findOneAndUpdate(
    { email: 'kiran@test.com' },
    { name: 'Kiran', email: 'kiran@test.com', password: '123456' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  console.log('Users ready:', anand.name, rohan.name, sneha.name, kiran.name)

  // Find or create project
  let project = await Project.findOne({ name: 'Project Atlas' })
  if (!project) {
    project = await Project.create({
      name: 'Project Atlas',
      description: 'DevHive main project',
      owner: anand._id,
      members: [
        { user: anand._id, role: 'owner' },
        { user: rohan._id, role: 'contributor' },
        { user: sneha._id, role: 'contributor' },
        { user: kiran._id, role: 'contributor' },
      ],
    })
  }
  console.log('Project ID:', project._id.toString())

  // Clear old tasks for this project
  await Task.deleteMany({ project: project._id })

  // Create tasks
  const tasks = [
    { title: 'Setup Redis caching', priority: 'high', status: 'backlog', assignee: anand._id },
    { title: 'Add rate limiting', priority: 'medium', status: 'backlog', assignee: rohan._id },
    { title: 'Write unit tests', priority: 'low', status: 'backlog', assignee: sneha._id },
    { title: 'Workload score v2', priority: 'high', status: 'in_progress', assignee: anand._id },
    { title: 'Kanban DnD performance', priority: 'medium', status: 'in_progress', assignee: sneha._id },
    { title: 'OAuth callback', priority: 'critical', status: 'in_review', assignee: rohan._id, githubPRUrl: 'https://github.com/anand/devhive/pull/142' },
    { title: 'Socket room scoping', priority: 'high', status: 'done', assignee: anand._id },
    { title: 'DB schema v2', priority: 'medium', status: 'done', assignee: kiran._id },
  ]

  for (const t of tasks) {
    await Task.create({ ...t, project: project._id })
  }

  console.log(`${tasks.length} tasks created`)
  console.log('SEED COMPLETE')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})