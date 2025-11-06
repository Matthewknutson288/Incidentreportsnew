import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Incident Reports
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            All Incidents
          </Link>
          <Link to="/new" className="nav-link">
            New Incident
          </Link>
          <Link to="/employees" className="nav-link">
            Employee Management
          </Link>
          <Link to="/excel" className="nav-link">
            Excel Import/Export
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 