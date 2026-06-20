const mongoose = require('mongoose')

const invitationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  role: { type: String, enum: ['admin', 'contributor', 'viewer'], default: 'contributor' },
}, { timestamps: true })

invitationSchema.index({ email: 1, status: 1 })
invitationSchema.index({ project: 1 })

module.exports = mongoose.model('Invitation', invitationSchema)