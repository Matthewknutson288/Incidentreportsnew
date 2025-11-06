const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  managerEmail: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Warning', 'Final Warning', 'Terminated'],
    default: 'Active'
  },
  writeUpCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema); 