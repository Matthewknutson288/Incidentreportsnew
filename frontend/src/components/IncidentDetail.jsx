import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const fetchIncident = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.INCIDENTS}/${id}`);
      setIncident(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch incident');
      setLoading(false);
    }
  };

  const deleteIncident = async () => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
          try {
      await axios.delete(`${API_ENDPOINTS.INCIDENTS}/${id}`);
      navigate('/');
    } catch (err) {
        setError('Failed to delete incident');
      }
    }
  };

  if (loading) return <div className="loading">Loading incident...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!incident) return <div className="error">Incident not found</div>;

  return (
    <div className="incident-detail">
      <div className="header">
        <h1>{incident.title}</h1>
        <div className="header-actions">
          <Link to={`/edit/${id}`} className="btn btn-edit">
            Edit
          </Link>
          <button onClick={deleteIncident} className="btn btn-delete">
            Delete
          </button>
          <Link to="/" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>

      <div className="incident-content">
        <div className="incident-meta">
          <div className="meta-item">
            <span className="label">Status:</span>
            <span className={`status ${incident.status.toLowerCase()}`}>
              {incident.status}
            </span>
          </div>
          <div className="meta-item">
            <span className="label">Category:</span>
            <span className="category">{incident.incidentCategory}</span>
          </div>
          <div className="meta-item">
            <span className="label">Incident Type:</span>
            <span className="incident-type">{incident.incidentType}</span>
          </div>
          <div className="meta-item">
            <span className="label">Points:</span>
            <span className="points">{incident.points}</span>
          </div>
          <div className="meta-item">
            <span className="label">Location:</span>
            <span className="location">📍 {incident.location}</span>
          </div>
          <div className="meta-item">
            <span className="label">Reporter:</span>
            <span className="reporter">{incident.reporter}</span>
          </div>
          <div className="meta-item">
            <span className="label">Date:</span>
            <span className="date">
              {new Date(incident.date).toLocaleDateString()} at{' '}
              {new Date(incident.date).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="incident-description">
          <h3>Description</h3>
          <p>{incident.description}</p>
        </div>

        {incident.extraComments && (
          <div className="incident-comments">
            <h3>Extra Comments</h3>
            <p>{incident.extraComments}</p>
          </div>
        )}

        <div className="incident-timestamps">
          <div className="timestamp">
            <span className="label">Created:</span>
            <span>{new Date(incident.createdAt).toLocaleString()}</span>
          </div>
          <div className="timestamp">
            <span className="label">Last Updated:</span>
            <span>{new Date(incident.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetail; 