// API configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  INCIDENTS: `${API_BASE_URL}/.netlify/functions/api/incidents`,
  EMPLOYEES: `${API_BASE_URL}/.netlify/functions/api/employees`,
  EXCEL: `${API_BASE_URL}/.netlify/functions/api/excel`,
};

export default API_BASE_URL; 