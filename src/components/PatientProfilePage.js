import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PatientProfile from './PatientProfile';

function PatientProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from location state
  const { structuredData, originalText, imageData } = location.state || {};

  // If no data in state, try to get from localStorage (fallback)
  const fallbackStructuredData = structuredData || JSON.parse(localStorage.getItem('lastAnalysis') || '{}');
  const fallbackOriginalText = originalText || localStorage.getItem('lastAnalysisText') || '';
  const fallbackImageData = imageData; // Use imageData from navigation state only

  // Debug: Log the data to see what we're working with
  console.log('PatientProfilePage - structuredData:', fallbackStructuredData);
  console.log('PatientProfilePage - originalText:', fallbackOriginalText);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="apollo-homepage">
      {/* Subtle background pattern */}
      <div className="apollo-background-pattern"></div>
      
      {/* Flowing lines background */}
      <div className="flowing-lines-container">
        <div className="flowing-line line-1"></div>
        <div className="flowing-line line-2"></div>
        <div className="flowing-line line-3"></div>
        <div className="flowing-line line-4"></div>
        <div className="flowing-line line-5"></div>
        <div className="flowing-line line-6"></div>
        <div className="flowing-line line-7"></div>
        <div className="flowing-line line-8"></div>
        <div className="flowing-line line-9"></div>
      </div>
      
      {/* Subtle glow effects */}
      <div className="apollo-glow-1"></div>
      <div className="apollo-glow-2"></div>
      
      {/* Header Navigation */}
      <header className="apollo-header">
        <div className="apollo-header-content">
          <div className="apollo-header-inner">
            {/* Logo/Brand */}
            <div className="apollo-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <div className="apollo-logo-text">
                APOLLO AI
              </div>
            </div>
            
            {/* Back Button */}
            <div className="apollo-signin-wrapper">
              <div className="apollo-signin-glow"></div>
              <button className="apollo-signin-button" onClick={handleBackToHome}>
                ← Back to Analysis
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="apollo-main">
        <PatientProfile 
          structuredData={fallbackStructuredData}
          originalText={fallbackOriginalText}
          imageData={fallbackImageData}
        />
      </div>
    </div>
  );
}

export default PatientProfilePage;
