import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get structured data from location state or localStorage
  const structuredData = location.state?.structuredData || 
    JSON.parse(localStorage.getItem('lastAnalysis') || '{}');
  const originalText = location.state?.originalText || 
    localStorage.getItem('lastAnalysisText') || '';

  const handleCardClick = (path) => {
    console.log('Card clicked:', path);
    navigate(path, {
      state: {
        structuredData: structuredData,
        originalText: originalText
      }
    });
  };

  // Apollo-style icons
  const HospitalIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"></path>
      <path d="M5 21V7l8-4v18"></path>
      <path d="M19 21V11l-6-4"></path>
      <path d="M9 9v.01"></path>
      <path d="M9 12v.01"></path>
      <path d="M9 15v.01"></path>
      <path d="M9 18v.01"></path>
    </svg>
  );

  const MicroscopeIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8"></path>
      <path d="M3 22h18"></path>
      <path d="M14 9a3 3 0 0 0-3-3H6l3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3"></path>
      <path d="M20 9a3 3 0 0 0-3-3h-5l3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3"></path>
    </svg>
  );

  const BookIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7"></path>
      <path d="M19 12H5"></path>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );

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
            <div className="apollo-back-wrapper">
              <button className="apollo-back-button" onClick={() => navigate('/')}>
                <ArrowLeftIcon />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="apollo-main">
        <div className="apollo-content">
          {/* Results Cards */}
          <div className="apollo-results-grid">
            {/* Treatment Pathway Card */}
            <div className="apollo-section apollo-results-card" onClick={() => handleCardClick('/treatment-pathway')}>
              <div className="apollo-section-glow"></div>
              <div className="apollo-section-content">
                <div className="apollo-section-header">
                  <div className="apollo-section-icon">
                    <HospitalIcon />
                  </div>
                  <label className="apollo-section-label">
                    Treatment Pathway Recommendation
                  </label>
                </div>
                <div className="apollo-card-content">
                  <p className="apollo-card-description">
                    Get personalized treatment recommendations based on your condition and medical history. 
                    This includes medication suggestions, therapy options, and lifestyle modifications.
                  </p>
                  <div className="apollo-card-action">
                    <span className="apollo-card-link">
                      Click to explore
                      <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Trials Card */}
            <div className="apollo-section apollo-results-card" onClick={() => handleCardClick('/clinical-trials')}>
              <div className="apollo-section-glow"></div>
              <div className="apollo-section-content">
                <div className="apollo-section-header">
                  <div className="apollo-section-icon">
                    <MicroscopeIcon />
                  </div>
                  <label className="apollo-section-label">
                    Clinical Trial Finder
                  </label>
                </div>
                <div className="apollo-card-content">
                  <p className="apollo-card-description">
                    Discover relevant clinical trials and research studies that match your condition. 
                    Find opportunities to participate in cutting-edge medical research.
                  </p>
                  <div className="apollo-card-action">
                    <span className="apollo-card-link">
                      Click to explore
                      <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Card */}
            <div className="apollo-section apollo-results-card" onClick={() => handleCardClick('/research')}>
              <div className="apollo-section-glow"></div>
              <div className="apollo-section-content">
                <div className="apollo-section-header">
                  <div className="apollo-section-icon">
                    <BookIcon />
                  </div>
                  <label className="apollo-section-label">
                    Relevant Research
                  </label>
                </div>
                <div className="apollo-card-content">
                  <p className="apollo-card-description">
                    Access the latest medical research papers, studies, and publications related to your condition. 
                    Stay informed about recent developments in your field of interest.
                  </p>
                  <div className="apollo-card-action">
                    <span className="apollo-card-link">
                      Click to explore
                      <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
