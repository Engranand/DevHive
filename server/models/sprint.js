const mongoose = require('mongoose')

const sprintSchema = new mongoose.Schema({
  project:  { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name:     { type: String, required: true, trim: true },
  goal:     { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },
  status:   { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
}, { timestamps: true })

sprintSchema.index({ project: 1, status: 1 })

module.exports = mongoose.model('Sprint', sprintSchema)