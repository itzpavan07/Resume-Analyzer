const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  text: { type: String },
  skills: { type: [String], default: [] },
  fileName: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
