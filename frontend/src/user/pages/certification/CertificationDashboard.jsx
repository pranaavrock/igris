// CertificationDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiSearch, FiFilter } from 'react-icons/fi';
import './CertificationDashboard.css';

const CertificationDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Sample certification data with Google-style placeholder images
  const certifications = [
    {
      id: 'CERT-2023-12345',
      courseName: 'Advanced React Development',
      completionDate: 'June 15, 2023',
      instructor: 'Jane Smith',
      duration: '8 weeks',
      status: 'completed',
      thumbnail: 'https://www.patterns.dev/img/reactjs/react-logo@3x.svg'

    },
    {
      id: 'CERT-2023-12346',
      courseName: 'Node.js Fundamentals',
      completionDate: 'May 10, 2023',
      instructor: 'John Doe',
      duration: '6 weeks',
      status: 'completed',
      thumbnail: 'https://www.patterns.dev/img/reactjs/react-logo@3x.svg'
    },
    {
      id: 'CERT-2023-12347',
      courseName: 'UI/UX Design Principles',
      completionDate: 'April 5, 2023',
      instructor: 'Alex Johnson',
      duration: '4 weeks',
      status: 'completed',
      thumbnail: 'https://www.patterns.dev/img/reactjs/react-logo@3x.svg'
    },
    {
      id: 'CERT-2023-12348',
      courseName: 'Cloud Architecture',
      completionDate: 'March 22, 2023',
      instructor: 'Sam Wilson',
      duration: '10 weeks',
      status: 'completed',
      thumbnail: 'https://www.patterns.dev/img/reactjs/react-logo@3x.svg'
    }
  ];

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || cert.status === filter;
    return matchesSearch && matchesFilter;
  });

  const viewCertificate = (certId) => {
    navigate(`/certificates/${certId}`);
  };

  return (
    <div className="certification-dashboard">
      <div className="dashboard-header">
        <h1>
          <FiAward className="header-icon" />
          My Certifications
        </h1>
        <div className="controls">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search certifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <FiFilter className="filter-icon" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCertifications.length > 0 ? (
        <div className="certification-grid">
          {filteredCertifications.map((cert) => (
            <div 
              key={cert.id} 
              className="certification-card"
              onClick={() => viewCertificate(cert.id)}
            >
              <div className="card-image">
                <img src={cert.thumbnail} alt={cert.courseName} />
                <div className="badge">Completed</div>
              </div>
              <div className="card-content">
                <h3>{cert.courseName}</h3>
                <div className="meta">
                  <span className="instructor">{cert.instructor}</span>
                  <span className="duration">{cert.duration}</span>
                </div>
                <div className="completion-date">
                  Completed: {cert.completionDate}
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="view-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    viewCertificate(cert.id);
                  }}
                >
                  View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No certifications found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default CertificationDashboard;