import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function TreatmentPathwayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get structured data from location state or localStorage
  const structuredData = location.state?.structuredData || 
    JSON.parse(localStorage.getItem('lastAnalysis') || '{}');
  const originalText = location.state?.originalText || 
    localStorage.getItem('lastAnalysisText') || '';
  const imageData = location.state?.imageData || 
    JSON.parse(localStorage.getItem('lastImageAnalysis') || 'null');

  useEffect(() => {
    if (structuredData && Object.keys(structuredData).length > 0) {
      fetchTreatmentRecommendations();
    } else {
      setError('No patient data available. Please analyze a clinical note first.');
      setIsLoading(false);
    }
  }, []);

  const fetchTreatmentRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/treatment-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structuredData: structuredData,
          originalText: originalText,
          imageData: imageData
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setRecommendations(result.recommendations);
      } else {
        setError(result.error || 'Failed to generate treatment recommendations');
      }
    } catch (err) {
      console.error('Error fetching treatment recommendations:', err);
      setError('Error connecting to treatment recommendations API');
    } finally {
      setIsLoading(false);
    }
  };

  // Apollo-style icons
  const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7"></path>
      <path d="M19 12H5"></path>
    </svg>
  );

  const HospitalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"></path>
      <path d="M5 21V7l8-4v18"></path>
      <path d="M19 21V11l-6-4"></path>
      <path d="M9 9v.01"></path>
      <path d="M9 12v.01"></path>
      <path d="M9 15v.01"></path>
      <path d="M9 18v.01"></path>
    </svg>
  );

  const PillIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 20h3a1.5 1.5 0 0 0 0-3h-3a1.5 1.5 0 0 0 0 3Z"></path>
      <path d="M6 8h12"></path>
      <path d="M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z"></path>
    </svg>
  );

  const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const ActivityIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  );

  const BookOpenIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );

  const SpinnerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="apollo-spinner">
      <path d="M21 12a9 9 0 11-6.219-8.56"></path>
    </svg>
  );

  if (isLoading) {
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
              <div className="apollo-logo">
                <div className="apollo-logo-text">
                  APOLLO AI
                </div>
              </div>
              
              {/* Back Button */}
              <div className="apollo-back-wrapper">
                <button className="apollo-back-button" onClick={() => navigate('/results')}>
                  <ArrowLeftIcon />
                  Back to Results
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <div className="apollo-main">
          <div className="apollo-content">
            <div className="apollo-section apollo-loading-section">
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
                <div className="apollo-loading-content">
                  <div className="apollo-loading-spinner">
                    <SpinnerIcon />
                  </div>
                  <h2 className="apollo-loading-title">Generating AI Treatment Recommendations...</h2>
                  <p className="apollo-loading-description">
                    Analyzing your clinical data and generating personalized treatment options...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
              <div className="apollo-logo">
                <div className="apollo-logo-text">
                  APOLLO AI
                </div>
              </div>
              
              {/* Back Button */}
              <div className="apollo-back-wrapper">
                <button className="apollo-back-button" onClick={() => navigate('/results')}>
                  <ArrowLeftIcon />
                  Back to Results
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <div className="apollo-main">
          <div className="apollo-content">
            <div className="apollo-section apollo-error-section">
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
                <div className="apollo-error-content">
                  <h2 className="apollo-error-title">Error</h2>
                  <p className="apollo-error-description">{error}</p>
                  <button className="apollo-button" onClick={fetchTreatmentRecommendations}>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <button className="apollo-back-button" onClick={() => navigate('/results')}>
                <ArrowLeftIcon />
                Back to Results
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="apollo-main">
        <div className="apollo-content">
          <div className="apollo-treatment-grid">
            {recommendations?.immediateActions && (
              <div className="apollo-section">
                <div className="apollo-section-glow"></div>
                <div className="apollo-section-content">
                  <div className="apollo-section-header">
                    <div className="apollo-section-icon">
                      <ActivityIcon />
                    </div>
                    <label className="apollo-section-label">
                      Immediate Actions
                    </label>
                  </div>
                  <div className="apollo-treatment-list">
                    {recommendations.immediateActions.map((action, index) => (
                      <div key={index} className="apollo-treatment-item">
                        <div className="apollo-treatment-bullet"></div>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {recommendations?.medicationRecommendations && (
              <div className="apollo-section">
                <div className="apollo-section-glow"></div>
                <div className="apollo-section-content">
                  <div className="apollo-section-header">
                    <div className="apollo-section-icon">
                      <PillIcon />
                    </div>
                    <label className="apollo-section-label">
                      Medication Recommendations
                    </label>
                  </div>
                  <div className="apollo-medication-content">
                    <div className="apollo-medication-item">
                      <span className="apollo-medication-label">Primary Treatment:</span>
                      <span className="apollo-medication-value">{recommendations.medicationRecommendations.primaryTreatment}</span>
                    </div>
                    <div className="apollo-medication-item">
                      <span className="apollo-medication-label">Dosage:</span>
                      <span className="apollo-medication-value">{recommendations.medicationRecommendations.dosage}</span>
                    </div>
                    <div className="apollo-medication-item">
                      <span className="apollo-medication-label">Side Effects to Monitor:</span>
                      <span className="apollo-medication-value">{recommendations.medicationRecommendations.sideEffects}</span>
                    </div>
                    <div className="apollo-medication-item">
                      <span className="apollo-medication-label">Drug Interactions:</span>
                      <span className="apollo-medication-value">{recommendations.medicationRecommendations.drugInteractions}</span>
                    </div>
                    {recommendations.medicationRecommendations.alternativeTreatments && 
                     recommendations.medicationRecommendations.alternativeTreatments.length > 0 && (
                      <div className="apollo-alternatives">
                        <span className="apollo-medication-label">Alternative Treatments:</span>
                        <div className="apollo-treatment-list">
                          {recommendations.medicationRecommendations.alternativeTreatments.map((alt, index) => (
                            <div key={index} className="apollo-treatment-item">
                              <div className="apollo-treatment-bullet"></div>
                              <span>{alt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {recommendations?.lifestyleModifications && (
              <div className="apollo-section">
                <div className="apollo-section-glow"></div>
                <div className="apollo-section-content">
                  <div className="apollo-section-header">
                    <div className="apollo-section-icon">
                      <HeartIcon />
                    </div>
                    <label className="apollo-section-label">
                      Lifestyle Modifications
                    </label>
                  </div>
                  <div className="apollo-treatment-list">
                    {recommendations.lifestyleModifications.map((modification, index) => (
                      <div key={index} className="apollo-treatment-item">
                        <div className="apollo-treatment-bullet"></div>
                        <span>{modification}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {recommendations?.followUpSchedule && (
              <div className="apollo-section">
                <div className="apollo-section-glow"></div>
                <div className="apollo-section-content">
                  <div className="apollo-section-header">
                    <div className="apollo-section-icon">
                      <CalendarIcon />
                    </div>
                    <label className="apollo-section-label">
                      Follow-up Schedule
                    </label>
                  </div>
                  <div className="apollo-treatment-list">
                    {recommendations.followUpSchedule.map((schedule, index) => (
                      <div key={index} className="apollo-treatment-item">
                        <div className="apollo-treatment-bullet"></div>
                        <span>{schedule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {recommendations?.specialistReferrals && (
              <div className="apollo-section">
                <div className="apollo-section-glow"></div>
                <div className="apollo-section-content">
                  <div className="apollo-section-header">
                    <div className="apollo-section-icon">
                      <UserIcon />
                    </div>
                    <label className="apollo-section-label">
                      Specialist Referrals
                    </label>
                  </div>
                  <div className="apollo-treatment-list">
                    {recommendations.specialistReferrals.map((referral, index) => (
                      <div key={index} className="apollo-treatment-item">
                        <div className="apollo-treatment-bullet"></div>
                        <span>{referral}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {recommendations?.monitoringRequirements && (
              <div className="apollo-section">
                <div className="apollo-section-glow"></div>
                <div className="apollo-section-content">
                  <div className="apollo-section-header">
                    <div className="apollo-section-icon">
                      <ActivityIcon />
                    </div>
                    <label className="apollo-section-label">
                      Monitoring Requirements
                    </label>
                  </div>
                  <div className="apollo-treatment-list">
                    {recommendations.monitoringRequirements.map((requirement, index) => (
                      <div key={index} className="apollo-treatment-item">
                        <div className="apollo-treatment-bullet"></div>
                        <span>{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {recommendations?.patientEducation && (
              <div className="apollo-section">
                <div className="apollo-section-glow"></div>
                <div className="apollo-section-content">
                  <div className="apollo-section-header">
                    <div className="apollo-section-icon">
                      <BookOpenIcon />
                    </div>
                    <label className="apollo-section-label">
                      Patient Education
                    </label>
                  </div>
                  <div className="apollo-treatment-list">
                    {recommendations.patientEducation.map((education, index) => (
                      <div key={index} className="apollo-treatment-item">
                        <div className="apollo-treatment-bullet"></div>
                        <span>{education}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="apollo-treatment-actions">
            <button className="apollo-button apollo-button-secondary" onClick={() => window.print()}>
              Print Treatment Plan
            </button>
            <button className="apollo-button" onClick={fetchTreatmentRecommendations}>
              Regenerate Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreatmentPathwayPage;

