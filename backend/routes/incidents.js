const express = require('express');
const router = express.Router();
const IncidentReport = require('../models/IncidentReport');
const Employee = require('../models/Employee');
const { getPointsForIncidentType, getCategoryForIncidentType } = require('../utils/pointsConfig');

// GET all incident reports
router.get('/', async (req, res) => {
  try {
    const incidents = await IncidentReport.find()
      .populate('employee', 'name totalPoints status')
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single incident report
router.get('/:id', async (req, res) => {
  try {
    const incident = await IncidentReport.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident report not found' });
    }
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new incident report
router.post('/', async (req, res) => {
  try {
    const incidentType = req.body.incidentType;
    const points = getPointsForIncidentType(incidentType);
    const category = getCategoryForIncidentType(incidentType);

    // Get employee name for the description
    const employee = await Employee.findById(req.body.employee);
    const employeeName = employee ? employee.name : 'Unknown Employee';

    const incident = new IncidentReport({
      title: `${employeeName} - ${incidentType}`,
      description: `Incident type: ${incidentType} for ${employeeName}`,
      location: req.body.location,
      incidentCategory: category,
      incidentType: incidentType,
      points: points,
      severity: req.body.severity,
      status: req.body.status,
      employee: req.body.employee,
      reporter: req.body.reporter,
      extraComments: req.body.extraComments
    });

    const newIncident = await incident.save();

    // Add points to employee
    if (req.body.employee) {
      const employee = await Employee.findById(req.body.employee);
      if (employee) {
        employee.totalPoints += points;
        await employee.save();
      }
    }

    res.status(201).json(newIncident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update incident report
router.put('/:id', async (req, res) => {
  try {
    const incident = await IncidentReport.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident report not found' });
    }

    if (req.body.title) incident.title = req.body.title;
    if (req.body.description) incident.description = req.body.description;
    if (req.body.location) incident.location = req.body.location;
    if (req.body.incidentType) {
      incident.incidentType = req.body.incidentType;
      incident.incidentCategory = getCategoryForIncidentType(req.body.incidentType);
      incident.points = getPointsForIncidentType(req.body.incidentType);
    }
    if (req.body.severity) incident.severity = req.body.severity;
    if (req.body.status) incident.status = req.body.status;
    if (req.body.reporter) incident.reporter = req.body.reporter;
    if (req.body.extraComments !== undefined) incident.extraComments = req.body.extraComments;

    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE incident report
router.delete('/:id', async (req, res) => {
  try {
    const incident = await IncidentReport.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident report not found' });
    }

    // Subtract points from employee before deleting the incident
    if (incident.employee) {
      const employee = await Employee.findById(incident.employee);
      if (employee) {
        employee.totalPoints -= incident.points;
        // Ensure points don't go below 0
        if (employee.totalPoints < 0) {
          employee.totalPoints = 0;
        }
        await employee.save();
        console.log(`Subtracted ${incident.points} points from ${employee.name}. New total: ${employee.totalPoints}`);
      }
    }

    await incident.deleteOne();
    res.json({ 
      message: 'Incident report deleted',
      pointsSubtracted: incident.points,
      employeeName: incident.employee ? (await Employee.findById(incident.employee))?.name : 'Unknown'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 