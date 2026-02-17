const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  resumeLink: {
    type: String,
    required: true
  },

  coverLetter: {
    type: String,
    required: true
  },

  skills: {
    type: String
  },

  experience: {
    type: String
  },

  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
