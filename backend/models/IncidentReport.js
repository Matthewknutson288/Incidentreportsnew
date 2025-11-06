const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    required: true,
    enum: [
      'Main Office',
      'Branch Office A',
      'Branch Office B',
      'Warehouse',
      'Parking Lot',
      'Server Room',
      'Conference Room',
      'Break Room',
      'Restroom',
      'Other'
    ]
  },
  incidentCategory: {
    type: String,
    required: true,
    enum: [
      'Attendance',
      'Appearance',
      'Cashiering',
      'Performance',
      'Project Sheet'
    ]
  },
  incidentType: {
    type: String,
    required: true,
    enum: [
      // Attendance
      'Absence', 'No Call No Show', 'Tardiness', 'Time Clock Error', 'Time Theft',
      // Appearance
      'Hygiene', 'Presentation',
      // Cashiering
      'Computer Efficiency', 'Drawer Discrepancy (under $10)', 'Drawer Discrepancy (over $10)', 
      'Drawer Discrepancy (over $99)', 'Employee Discount', 'Transaction Discrepancy (under $10)', 
      'Transaction Discrepancy (over $10)',
      // Performance
      'Communication', 'Customer', 'Customer Complaint/Review', 'Employee Knowledge', 
      'Loss Prevention', 'Phone/Computer Personal Use', 'Team Member', 'Work Efficiency',
      // Project Sheet
      'Closing Procedures (Cleaning)', 'Daily Sheet', 'Go Backs', 'Occurrency Log', 
      'Opening Procedures (Doors/Gate)', 'Order Processing/Receiving', 'Project Efficiency', 
      'Project Sheet', 'Repairs', 'Sales Floor', 'Sheets Log', 'Stockroom', 'Synology Log', 'Trading Cards'
    ]
  },
  points: {
    type: Number,
    required: true,
    default: 1
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  reporter: {
    type: String,
    required: true,
    enum: [
      'John Smith',
      'Jane Doe',
      'Mike Johnson',
      'Sarah Wilson',
      'David Brown',
      'Lisa Davis',
      'Robert Miller',
      'Emily Garcia',
      'Other'
    ]
  },
  extraComments: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IncidentReport', incidentReportSchema); 