const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'contributor', 'viewer'], default: 'contributor' },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  description:   { type: String, default: '' },
  owner:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members:       [memberSchema],
  githubRepoUrl: { type: String, default: '' },
  status:        { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });

projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Project', projectSchema);