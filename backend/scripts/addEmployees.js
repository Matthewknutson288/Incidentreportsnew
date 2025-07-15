const mongoose = require('mongoose');
const Employee = require('../models/Employee');
require('dotenv').config();

const employees = [
  { name: 'Matthew', email: 'matthew@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'Test', email: 'test@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'Fred', email: 'fred@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'David', email: 'david@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'Frank', email: 'frank@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'George', email: 'george@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'Cloud', email: 'cloud@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'Tifa', email: 'tifa@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'Barret', email: 'barret@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'RedXIII', email: 'redxiii@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'Yuffie', email: 'yuffie@company.com', managerEmail: 'manager@company.com', totalPoints: 0 },
  { name: 'Aerith', email: 'aerith@company.com', managerEmail: 'manager@company.com', totalPoints: 0 }
];

async function addEmployees() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing employees (optional - remove this if you want to keep existing ones)
    // await Employee.deleteMany({});
    // console.log('Cleared existing employees');

    // Add new employees
    for (const employeeData of employees) {
      const existingEmployee = await Employee.findOne({ name: employeeData.name });
      
      if (existingEmployee) {
        console.log(`Employee ${employeeData.name} already exists, skipping...`);
      } else {
        const employee = new Employee(employeeData);
        await employee.save();
        console.log(`Added employee: ${employeeData.name}`);
      }
    }

    console.log('All employees added successfully!');
    
    // Display all employees
    const allEmployees = await Employee.find().sort({ name: 1 });
    console.log('\nCurrent employees in database:');
    allEmployees.forEach(emp => {
      console.log(`${emp.name}: ${emp.totalPoints} points`);
    });

  } catch (error) {
    console.error('Error adding employees:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addEmployees(); 