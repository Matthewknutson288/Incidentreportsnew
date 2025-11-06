import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.INCIDENTS);
      setIncidents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch incidents');
      setLoading(false);
    }
  };

  const deleteIncident = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await axios.delete(`${API_ENDPOINTS.INCIDENTS}/${id}`);
        fetchIncidents(); // Refresh the list
      } catch (err) {
        setError('Failed to delete incident');
      }
    }
  };

  if (loading) return <div className="loading">Loading incidents...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="incident-list">
      <div className="header">
        <h1>Incident Reports</h1>
        <Link to="/new" className="btn btn-primary">
          New Incident
        </Link>
      </div>
      
      {incidents.length === 0 ? (
        <div className="no-incidents">
          <p>No incidents found. Create your first incident report!</p>
        </div>
      ) : (
        <div className="incidents-grid">
          {incidents.map((incident) => (
            <div key={incident._id} className="incident-card">
              <div className="incident-header">
                <h3>{incident.title}</h3>
                <span className={`status ${incident.status.toLowerCase()}`}>
                  {incident.status}
                </span>
              </div>
              <p className="description">{incident.description}</p>
              <div className="incident-details">
                <span className="location">📍 {incident.location}</span>
                <span className="incident-type">{incident.incidentType}</span>
                <span className="points">Points: {incident.points}</span>
              </div>
              <div className="incident-footer">
                <span className="reporter">By: {incident.reporter}</span>
                <span className="date">
                  {new Date(incident.date).toLocaleDateString()}
                </span>
              </div>
              <div className="incident-actions">
                <Link to={`/incident/${incident._id}`} className="btn btn-view">
                  View
                </Link>
                <Link to={`/edit/${incident._id}`} className="btn btn-edit">
                  Edit
                </Link>
                <button
                  onClick={() => deleteIncident(incident._id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IncidentList; 