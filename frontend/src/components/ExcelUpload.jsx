import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if it's an Excel file
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axios.post(`${API_ENDPOINTS.EXCEL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setFile(null);
      // Reset file input
      document.getElementById('file-input').value = '';
      
      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.EXCEL}/template`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'incident-template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error downloading template');
    }
  };

  const downloadExport = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.EXCEL}/export`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'incident-reports.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error downloading export');
    }
  };

  return (
    <div className="excel-upload">
      <div className="upload-section">
        <h3>Import from Excel</h3>
        <div className="file-input-container">
          <input
            type="file"
            id="file-input"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            Choose Excel File
          </label>
        </div>
        
        {file && (
          <div className="selected-file">
            <span>Selected: {file.name}</span>
            <button onClick={() => setFile(null)} className="btn btn-secondary btn-sm">
              Clear
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn btn-primary"
        >
          {uploading ? 'Uploading...' : 'Upload Excel File'}
        </button>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="download-section">
        <h3>Export & Templates</h3>
        <div className="download-buttons">
          <button onClick={downloadTemplate} className="btn btn-secondary">
            Download Template
          </button>
          <button onClick={downloadExport} className="btn btn-view">
            Export to Excel
          </button>
        </div>
      </div>

      <div className="instructions">
        <h4>How to use Excel import:</h4>
        <ol>
          <li>Download the template to see the correct format</li>
          <li>Fill in your incident data in Excel</li>
          <li>Save as .xlsx format</li>
          <li>Upload the file here</li>
          <li>Your incidents will be imported to the database</li>
        </ol>
        <p><strong>Note:</strong> The first row should contain headers. Data should start from row 2.</p>
      </div>
    </div>
  );
}

export default ExcelUpload; 