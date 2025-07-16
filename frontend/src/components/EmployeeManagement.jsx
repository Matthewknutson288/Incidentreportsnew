import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.EMPLOYEES);
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  const resetPoints = async (employeeId, employeeName) => {
    if (window.confirm(`Are you sure you want to reset ${employeeName}'s points to 0?`)) {
      try {
        const response = await axios.post(`${API_ENDPOINTS.EMPLOYEES}/${employeeId}/reset-points`);
        setMessage(`${employeeName}'s points have been reset from ${response.data.previousPoints} to 0`);
        fetchEmployees(); // Refresh the list
        setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
      } catch (err) {
        setError('Failed to reset points');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'status-open';
      case 'Warning': return 'status-in-progress';
      case 'Final Warning': return 'status-resolved';
      case 'Terminated': return 'status-closed';
      default: return 'status-open';
    }
  };

  if (loading) return <div className="loading">Loading employees...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-management">
      <div className="header">
        <h1>Employee Management</h1>
        <p>Manage employee points and status</p>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="employees-grid">
        {employees.map((employee) => (
          <div key={employee._id} className="employee-card">
            <div className="employee-header">
              <h3>{employee.name}</h3>
              <span className={`status ${getStatusColor(employee.status)}`}>
                {employee.status}
              </span>
            </div>
            
            <div className="employee-details">
              <div className="points-display">
                <span className="label">Total Points:</span>
                <span className="points">{employee.totalPoints}</span>
              </div>
              
              <div className="write-ups">
                <span className="label">Write-ups:</span>
                <span className="write-up-count">{employee.writeUpCount}</span>
              </div>
            </div>

            <div className="employee-actions">
              <button
                onClick={() => resetPoints(employee._id, employee.name)}
                className="btn btn-warning"
                disabled={employee.totalPoints === 0}
              >
                Reset Points
              </button>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="no-employees">
          <p>No employees found.</p>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement; 