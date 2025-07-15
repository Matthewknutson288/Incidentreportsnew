import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import IncidentList from './components/IncidentList';
import IncidentForm from './components/IncidentForm';
import IncidentDetail from './components/IncidentDetail';
import ExcelUpload from './components/ExcelUpload';
import EmployeeManagement from './components/EmployeeManagement';
import Navbar from './components/Navbar';
import ViewToggle from './components/ViewToggle';

function App() {
  const [viewMode, setViewMode] = useState('auto');
  const [isMobile, setIsMobile] = useState(false);

  // Auto-detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      if (viewMode === 'auto') {
        setIsMobile(window.innerWidth <= 768);
      } else if (viewMode === 'mobile') {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [viewMode]);

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <Router>
      <div className={`App ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
        <Navbar />
        <ViewToggle onViewChange={handleViewChange} />
        <div className="container">
          <Routes>
            <Route path="/" element={<IncidentList />} />
            <Route path="/new" element={<IncidentForm />} />
            <Route path="/incident/:id" element={<IncidentDetail />} />
            <Route path="/edit/:id" element={<IncidentForm />} />
            <Route path="/excel" element={<ExcelUpload />} />
            <Route path="/employees" element={<EmployeeManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
