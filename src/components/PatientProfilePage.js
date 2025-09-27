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
  const fallbackImageData = imageData || JSON.parse(localStorage.getItem('lastImageAnalysis') || 'null');

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <button className="btn back-btn" onClick={handleBackToHome}>
        ← Back to Analysis
      </button>
      
      <PatientProfile 
        structuredData={fallbackStructuredData}
        originalText={fallbackOriginalText}
        imageData={fallbackImageData}
      />
    </div>
  );
}

export default PatientProfilePage;
