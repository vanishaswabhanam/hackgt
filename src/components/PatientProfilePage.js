import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PatientProfile from './PatientProfile';
import { HeroSection } from './ui/hero-section-with-smooth-bg-shader';

function PatientProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Same colors as homepage for consistency
  const contrastedColors = [
    "#D4E8F7", // More visible blue
    "#D4F0E8", // More visible green
    "#80CBC4", // Pastel Teal (replacing warm orange)
    "#38BDF8", // Bright Sky (replacing light peach)
    "#E0F0D4", // More visible mint
    "#E8E8E8"  // More visible gray
  ];

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
            
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="apollo-main">
        <div className="apollo-content">
          {/* Fixed Gradient Background Rectangle */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95vw',
            height: '60vh',
            borderRadius: '40px',
            zIndex: 1,
            overflow: 'hidden',
            pointerEvents: 'none'
          }}>
            <HeroSection
              title=""
              highlightText=""
              description=""
              buttonText=""
              colors={contrastedColors}
              distortion={1.2}
              swirl={0.8}
              speed={1.0}
              offsetX={0.1}
              className=""
              veilOpacity="bg-white/10"
              maxWidth="max-w-none"
            />
          </div>
          
          {/* Patient Profile Content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <PatientProfile 
              structuredData={fallbackStructuredData}
              originalText={fallbackOriginalText}
              imageData={fallbackImageData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfilePage;
