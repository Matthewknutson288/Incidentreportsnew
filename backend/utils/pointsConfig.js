const pointsConfig = {
  'Attendance': {
    'Absence': 1,
    'No Call No Show': 5,
    'Tardiness': 0.5,
    'Time Clock Error': 0.5,
    'Time Theft': 5
  },
  'Appearance': {
    'Hygiene': 1,
    'Presentation': 1
  },
  'Cashiering': {
    'Computer Efficiency': 1,
    'Drawer Discrepancy (under $10)': 5,
    'Drawer Discrepancy (over $10)': 5,
    'Drawer Discrepancy (over $99)': 20,
    'Employee Discount': 2,
    'Transaction Discrepancy (under $10)': 1,
    'Transaction Discrepancy (over $10)': 2
  },
  'Performance': {
    'Communication': 1,
    'Customer': 1,
    'Customer Complaint/Review': 10,
    'Employee Knowledge': 1,
    'Loss Prevention': 10,
    'Phone/Computer Personal Use': 2,
    'Team Member': 2,
    'Work Efficiency': 1
  },
  'Project Sheet': {
    'Closing Procedures (Cleaning)': 1,
    'Daily Sheet': 1,
    'Go Backs': 1,
    'Occurrency Log': 1,
    'Opening Procedures (Doors/Gate)': 1,
    'Order Processing/Receiving': 1,
    'Project Efficiency': 1,
    'Project Sheet': 1,
    'Repairs': 1,
    'Sales Floor': 1,
    'Sheets Log': 1,
    'Stockroom': 1,
    'Synology Log': 1,
    'Trading Cards': 1
  }
};

// Helper function to get points for an incident type
const getPointsForIncidentType = (incidentType) => {
  for (const category in pointsConfig) {
    if (pointsConfig[category][incidentType]) {
      return pointsConfig[category][incidentType];
    }
  }
  return 1; // Default points
};

// Helper function to get category for an incident type
const getCategoryForIncidentType = (incidentType) => {
  for (const category in pointsConfig) {
    if (pointsConfig[category][incidentType]) {
      return category;
    }
  }
  return 'Performance'; // Default category
};

module.exports = {
  pointsConfig,
  getPointsForIncidentType,
  getCategoryForIncidentType
}; 