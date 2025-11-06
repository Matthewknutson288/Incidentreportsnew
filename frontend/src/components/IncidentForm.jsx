import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DynamicDropdown from './DynamicDropdown';
import { API_ENDPOINTS } from '../config/api';

function IncidentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    location: 'Main Office',
    incidentCategory: '',
    incidentType: '',
    severity: 'Medium',
    status: 'Open',
    employee: '',
    reporter: 'John Smith',
    extraComments: ''
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
    if (isEditing) {
      fetchIncident();
    }
  }, [id]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.EMPLOYEES);
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchIncident = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.INCIDENTS}/${id}`);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to fetch incident');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      incidentCategory: category,
      incidentType: ''
    });
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      incidentType: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await axios.put(`${API_ENDPOINTS.INCIDENTS}/${id}`, formData);
      } else {
        await axios.post(API_ENDPOINTS.INCIDENTS, formData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save incident');
      setLoading(false);
    }
  };

  return (
    <div className="incident-form">
      <div className="header">
        <h1>{isEditing ? 'Edit Incident' : 'New Incident Report'}</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="Main Office">Main Office</option>
            <option value="Branch Office A">Branch Office A</option>
            <option value="Branch Office B">Branch Office B</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Parking Lot">Parking Lot</option>
            <option value="Server Room">Server Room</option>
            <option value="Conference Room">Conference Room</option>
            <option value="Break Room">Break Room</option>
            <option value="Restroom">Restroom</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <DynamicDropdown
          selectedCategory={formData.incidentCategory}
          selectedType={formData.incidentType}
          onCategoryChange={handleCategoryChange}
          onTypeChange={handleTypeChange}
        />

        <div className="form-group">
          <label htmlFor="employee">Employee *</label>
          <select
            id="employee"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name} (Current Points: {employee.totalPoints})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="severity">Severity</label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reporter">Reporter *</label>
          <select
            id="reporter"
            name="reporter"
            value={formData.reporter}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="John Smith">John Smith</option>
            <option value="Jane Doe">Jane Doe</option>
            <option value="Mike Johnson">Mike Johnson</option>
            <option value="Sarah Wilson">Sarah Wilson</option>
            <option value="David Brown">David Brown</option>
            <option value="Lisa Davis">Lisa Davis</option>
            <option value="Robert Miller">Robert Miller</option>
            <option value="Emily Garcia">Emily Garcia</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="extraComments">Extra Comments</label>
          <textarea
            id="extraComments"
            name="extraComments"
            value={formData.extraComments}
            onChange={handleChange}
            rows="3"
            placeholder="Add any additional notes or comments here..."
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Incident' : 'Create Incident')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default IncidentForm; 