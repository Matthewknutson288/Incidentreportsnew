import { useState, useEffect } from 'react';

function DynamicDropdown({ 
  selectedCategory, 
  selectedType, 
  onCategoryChange, 
  onTypeChange, 
  className = "form-select" 
}) {
  const [incidentTypes, setIncidentTypes] = useState([]);

  const categoryTypes = {
    'Attendance': [
      'Absence', 'No Call No Show', 'Tardiness', 'Time Clock Error', 'Time Theft'
    ],
    'Appearance': [
      'Hygiene', 'Presentation'
    ],
    'Cashiering': [
      'Computer Efficiency', 'Drawer Discrepancy (under $10)', 'Drawer Discrepancy (over $10)', 
      'Drawer Discrepancy (over $99)', 'Employee Discount', 'Transaction Discrepancy (under $10)', 
      'Transaction Discrepancy (over $10)'
    ],
    'Performance': [
      'Communication', 'Customer', 'Customer Complaint/Review', 'Employee Knowledge', 
      'Loss Prevention', 'Phone/Computer Personal Use', 'Team Member', 'Work Efficiency'
    ],
    'Project Sheet': [
      'Closing Procedures (Cleaning)', 'Daily Sheet', 'Go Backs', 'Occurrency Log', 
      'Opening Procedures (Doors/Gate)', 'Order Processing/Receiving', 'Project Efficiency', 
      'Project Sheet', 'Repairs', 'Sales Floor', 'Sheets Log', 'Stockroom', 'Synology Log', 'Trading Cards'
    ]
  };

  useEffect(() => {
    if (selectedCategory && categoryTypes[selectedCategory]) {
      setIncidentTypes(categoryTypes[selectedCategory]);
      // Reset type if it's not in the new category
      if (!categoryTypes[selectedCategory].includes(selectedType)) {
        onTypeChange(categoryTypes[selectedCategory][0]);
      }
    } else {
      setIncidentTypes([]);
    }
  }, [selectedCategory, selectedType, onTypeChange]);

  return (
    <div className="dynamic-dropdown">
      <div className="form-group">
        <label htmlFor="incidentCategory">Incident Category *</label>
        <select
          id="incidentCategory"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          required
          className={className}
        >
          <option value="">Select Category</option>
          <option value="Attendance">Attendance</option>
          <option value="Appearance">Appearance</option>
          <option value="Cashiering">Cashiering</option>
          <option value="Performance">Performance</option>
          <option value="Project Sheet">Project Sheet</option>
        </select>
      </div>

      {selectedCategory && (
        <div className="form-group">
          <label htmlFor="incidentType">Incident Type *</label>
          <select
            id="incidentType"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            required
            className={className}
          >
            <option value="">Select Type</option>
            {incidentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default DynamicDropdown; 