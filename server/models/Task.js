const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sprint:      { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  assignee:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status:      { type: String, enum: ['backlog', 'in_progress', 'in_review', 'done'], default: 'backlog' },
  priority:    { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  dueDate:     { type: Date, default: null },
  githubPRUrl: { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1 });

module.exports = mongoose.model('Task', taskSchema);