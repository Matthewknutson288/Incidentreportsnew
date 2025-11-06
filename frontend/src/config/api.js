// API configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

export const API_ENDPOINTS = {
  INCIDENTS: `${API_BASE_URL}/api/incidents`,
  EMPLOYEES: `${API_BASE_URL}/api/employees`,
  EXCEL: `${API_BASE_URL}/api/excel`,
};

export default API_BASE_URL; 