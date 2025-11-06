const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Import your models
const IncidentReport = require('../../backend/models/IncidentReport.js');
const Employee = require('../../backend/models/Employee.js');

// CORS middleware
const corsHandler = cors({
  origin: true,
  credentials: true,
});

exports.handler = async (event, context) => {
  // Connect to MongoDB
  await connectDB();
  
  // Enable CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
    };
  }

  const { path, httpMethod } = event;
  const pathSegments = path.replace('/.netlify/functions/api', '').split('/');

  try {
    // Handle different API routes
    if (pathSegments[1] === 'incidents') {
      return await handleIncidents(event, pathSegments);
    } else if (pathSegments[1] === 'employees') {
      return await handleEmployees(event, pathSegments);
    } else if (pathSegments[1] === 'excel') {
      return await handleExcel(event, pathSegments);
    }

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Route not found' }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Internal server error', error: error.message, stack: error.stack }),
    };
  }
};

async function handleIncidents(event, pathSegments) {
  const { httpMethod } = event;
  const id = pathSegments[2];

  switch (httpMethod) {
    case 'GET':
      if (id) {
        // Get single incident
        const incident = await IncidentReport.findById(id);
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(incident),
        };
      } else {
        // Get all incidents
        const incidents = await IncidentReport.find().sort({ createdAt: -1 });
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(incidents),
        };
      }

    case 'POST':
      const incidentData = JSON.parse(event.body);
      const newIncident = new IncidentReport(incidentData);
      await newIncident.save();
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIncident),
      };

    case 'PUT':
      const updateData = JSON.parse(event.body);
      const updatedIncident = await IncidentReport.findByIdAndUpdate(id, updateData, { new: true });
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedIncident),
      };

    case 'DELETE':
      await IncidentReport.findByIdAndDelete(id);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Incident deleted' }),
      };

    default:
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
  }
}

async function handleEmployees(event, pathSegments) {
  const { httpMethod } = event;
  const id = pathSegments[2];

  switch (httpMethod) {
    case 'GET':
      const employees = await Employee.find().sort({ name: 1 });
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employees),
      };

    case 'POST':
      if (pathSegments[3] === 'reset-points') {
        const employee = await Employee.findById(id);
        const previousPoints = employee.points;
        employee.points = 0;
        await employee.save();
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Points reset', previousPoints }),
        };
      }
      break;

    default:
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
  }
}

async function handleExcel(event, pathSegments) {
  const { httpMethod } = event;
  const action = pathSegments[2];

  switch (httpMethod) {
    case 'GET':
      if (action === 'template') {
        // Return template download
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="incident-template.xlsx"',
          },
          body: 'Template data here', // You'd need to generate actual Excel file
        };
      } else if (action === 'export') {
        // Return export download
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="incident-reports.xlsx"',
          },
          body: 'Export data here', // You'd need to generate actual Excel file
        };
      }
      break;

    default:
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
  }
} 