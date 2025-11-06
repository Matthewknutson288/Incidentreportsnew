const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { sendWriteUpNotification, sendTerminationNotification } = require('../services/emailService');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee({
      name: req.body.name,
      email: req.body.email,
      managerEmail: req.body.managerEmail
    });
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (req.body.name) employee.name = req.body.name;
    if (req.body.email) employee.email = req.body.email;
    if (req.body.managerEmail) employee.managerEmail = req.body.managerEmail;
    if (req.body.status) employee.status = req.body.status;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST add points to employee
router.post('/:id/add-points', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const pointsToAdd = req.body.points || 0;
    employee.totalPoints += pointsToAdd;

    // Check for write-ups and termination thresholds
    let notificationSent = false;

    if (employee.totalPoints >= 255) {
      employee.status = 'Terminated';
      await sendTerminationNotification(employee.name, employee.totalPoints);
      notificationSent = true;
    } else if (employee.totalPoints >= 200) {
      employee.status = 'Final Warning';
      if (employee.writeUpCount < 3) {
        employee.writeUpCount = 3;
        await sendWriteUpNotification(employee.name, employee.totalPoints, '3rd');
        notificationSent = true;
      }
    } else if (employee.totalPoints >= 100) {
      employee.status = 'Warning';
      if (employee.writeUpCount < 2) {
        employee.writeUpCount = 2;
        await sendWriteUpNotification(employee.name, employee.totalPoints, '2nd');
        notificationSent = true;
      }
    } else if (employee.totalPoints >= 50) {
      if (employee.writeUpCount < 1) {
        employee.writeUpCount = 1;
        await sendWriteUpNotification(employee.name, employee.totalPoints, '1st');
        notificationSent = true;
      }
    }

    const updatedEmployee = await employee.save();
    
    res.json({
      employee: updatedEmployee,
      notificationSent,
      message: notificationSent ? 'Points added and notification sent' : 'Points added successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST reset employee points
router.post('/:id/reset-points', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const previousPoints = employee.totalPoints;
    employee.totalPoints = 0;
    employee.writeUpCount = 0;
    employee.status = 'Active';
    await employee.save();

    res.json({
      message: `Points reset for ${employee.name}`,
      employee: employee,
      previousPoints: previousPoints,
      newPoints: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.deleteOne();
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 