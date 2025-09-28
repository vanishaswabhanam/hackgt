import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeroSection } from './ui/hero-section-with-smooth-bg-shader';

function TreatmentPathwayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Same colors as homepage for consistency
  const contrastedColors = [
    "#D4E8F7", // More visible blue
    "#D4F0E8", // More visible green
    "#80CBC4", // Pastel Teal (replacing warm orange)
    "#38BDF8", // Bright Sky (replacing light peach)
    "#E0F0D4", // More visible mint
    "#E8E8E8"  // More visible gray
  ];

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
      <div className="apollo-homepage" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#F3F4F6',
        padding: '2rem'
      }}>
        {/* Modern Header */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          right: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div 
            onClick={() => navigate('/')} 
            style={{ 
              cursor: 'pointer',
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1E293B',
              fontFamily: 'Rajdhani, sans-serif'
            }}
          >
                  APOLLO AI
              </div>
              
          <button 
            onClick={() => navigate('/results')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#1E293B',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
                  <ArrowLeftIcon />
                  Back to Results
                </button>
              </div>

        {/* Modern Loading Card */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1E293B',
            margin: '0 0 1rem 0',
            lineHeight: '1.3'
          }}>
            Generating AI Treatment Recommendations...
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#64748B',
            margin: '0 0 2rem 0',
            lineHeight: '1.5'
          }}>
                    Analyzing your clinical data and generating personalized treatment options...
                  </p>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #E5E7EB',
            borderTop: '3px solid #80CBC4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
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
    <>
        <style>
          {`
            * {
              -webkit-user-select: none !important;
              -moz-user-select: none !important;
              -ms-user-select: none !important;
              user-select: none !important;
            }
            *::-webkit-tooltip {
              display: none !important;
            }
            [title]:hover:after {
              display: none !important;
            }
            
            @media print {
              /* Basic print styles */
              body {
                font-family: Arial, sans-serif !important;
                font-size: 12pt !important;
                line-height: 1.4 !important;
                margin: 20px !important;
                background: white !important;
                color: black !important;
              }
              
              /* Hide specific unwanted elements */
              button { display: none !important; }
              [style*="position: absolute"] { display: none !important; }
              [style*="background-color: #F3F4F6"] { display: none !important; }
              
              /* Hide header and navigation */
              .apollo-homepage > div:nth-child(2) { display: none !important; }
              
              /* Hide page title section */
              div[style*="textAlign: center"] { display: none !important; }
              
              /* Hide print button section */
              div[style*="marginTop: 5rem"] { display: none !important; }
              
              /* Force all text to be black and visible */
              * {
                color: black !important;
                background: white !important;
              }
              
              /* Style section titles */
              h3 {
                font-size: 14pt !important;
                font-weight: bold !important;
                margin: 20px 0 10px 0 !important;
                border-bottom: 1px solid black !important;
                padding-bottom: 5px !important;
              }
              
              /* Style content text */
              span {
                font-size: 11pt !important;
                margin: 3px 0 !important;
                display: block !important;
              }
              
              /* Make grid simple for print */
              div[style*="display: grid"] {
                display: block !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              
              /* Style treatment boxes */
              div[style*="backgroundColor: white"][style*="borderRadius: 20px"] {
                background: white !important;
                border: none !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                margin-bottom: 30px !important;
                padding: 0 !important;
                page-break-inside: avoid;
              }
            }
          `}
        </style>
    <div className="apollo-homepage">
        <div className="apollo-content">
          {/* Gray Background - Same as Cards Page */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#F3F4F6',
            zIndex: 1
          }}></div>
      
      {/* Header Navigation */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Logo */}
            <div 
              onClick={() => navigate('/')} 
              style={{ 
                cursor: 'pointer',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1E293B',
                fontFamily: 'Rajdhani, sans-serif'
              }}
            >
                APOLLO AI
            </div>
            
            {/* Back Button */}
            <button 
              onClick={() => navigate('/results')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#1E293B',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
                <ArrowLeftIcon />
                Back to Results
              </button>
            </div>
              {/* Main Content Area */}
              <div style={{
                position: 'relative',
                zIndex: 10,
                padding: '0.5rem 2rem 2rem 2rem',
                width: '100%',
                margin: '0'
              }}>
            {/* Page Title */}
            <div style={{
              textAlign: 'center',
              marginBottom: '4rem'
            }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#1E293B',
                margin: '0 0 1rem 0',
                letterSpacing: '-0.02em',
                lineHeight: '1.2'
              }}>
                Treatment Pathway
              </h1>
              <p style={{
                fontSize: '1.2rem',
                color: '#64748B',
                margin: '0',
                lineHeight: '1.5'
              }}>
                Personalized treatment recommendations based on your medical analysis
              </p>
        </div>

            {/* Dynamic Gradient Background Rectangle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95vw',
              height: '100vh',
              borderRadius: '40px',
              zIndex: 1,
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '40px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '40px',
                  overflow: 'hidden'
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
              </div>
            </div>

            {/* Four Simple White Boxes */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 2fr 1.5fr',
              gridTemplateRows: 'auto auto',
              gap: '2rem',
              marginBottom: '3rem',
              width: '100%',
              padding: '0 4rem',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Box 1 - Top Left - Medication Recommendations */}
            {recommendations?.medicationRecommendations && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  gridColumn: '1',
                  gridRow: '1',
                  height: '350px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1E293B',
                    margin: '0 0 1.5rem 0',
                    lineHeight: '1.3'
                  }}>
                      Medication Recommendations
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.75rem',
                    maxHeight: 'calc(350px - 4rem - 3rem)',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#38BDF8',
                        borderRadius: '50%',
                        marginTop: '0.5rem',
                        flexShrink: 0
                      }}></div>
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#374151',
                        lineHeight: '1.4'
                      }}>
                        <strong>Primary Treatment:</strong> {recommendations.medicationRecommendations.primaryTreatment}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#38BDF8',
                        borderRadius: '50%',
                        marginTop: '0.5rem',
                        flexShrink: 0
                      }}></div>
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#374151',
                        lineHeight: '1.4'
                      }}>
                        <strong>Dosage:</strong> {recommendations.medicationRecommendations.dosage}
                      </span>
                  </div>
                </div>
              </div>
            )}

              {/* Box 2 - Top Right - Immediate Actions */}
              {recommendations?.immediateActions && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  gridColumn: '2 / 4',
                  gridRow: '1',
                  height: '350px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1E293B',
                    margin: '0 0 1.5rem 0',
                    lineHeight: '1.3'
                  }}>
                    Immediate Actions
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.75rem',
                    maxHeight: 'calc(350px - 4rem - 3rem)',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                  }}>
                    {recommendations.immediateActions.map((action, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#80CBC4',
                          borderRadius: '50%',
                          marginTop: '0.5rem',
                          flexShrink: 0
                        }}></div>
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#374151',
                          lineHeight: '1.4'
                        }}>{action}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

              {/* Box 3 - Bottom Left - Lifestyle Modifications */}
              {recommendations?.lifestyleModifications && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  gridColumn: '1 / 3',
                  gridRow: '2',
                  height: '350px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1E293B',
                    margin: '0 0 1.5rem 0',
                    lineHeight: '1.3'
                  }}>
                    Lifestyle Modifications
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.75rem',
                    maxHeight: 'calc(350px - 4rem - 3rem)',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                  }}>
                    {recommendations.lifestyleModifications.map((modification, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#80CBC4',
                          borderRadius: '50%',
                          marginTop: '0.5rem',
                          flexShrink: 0
                        }}></div>
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#374151',
                          lineHeight: '1.4'
                        }}>{modification}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

              {/* Box 4 - Bottom Right - Follow-up Schedule */}
              {recommendations?.followUpSchedule && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  gridColumn: '3',
                  gridRow: '2',
                  height: '350px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1E293B',
                    margin: '0 0 1.5rem 0',
                    lineHeight: '1.3'
                  }}>
                    Follow-up Schedule
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.75rem',
                    maxHeight: 'calc(350px - 4rem - 3rem)',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                  }}>
                    {recommendations.followUpSchedule.slice(0, 3).map((schedule, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#80CBC4',
                          borderRadius: '50%',
                          marginTop: '0.5rem',
                          flexShrink: 0
                        }}></div>
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#374151',
                          lineHeight: '1.4'
                        }}>{schedule}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}


          </div>

            {/* Modern Print Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '5rem'
            }}>
              <button 
                onClick={() => window.print()}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#1E293B',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6,9 6,2 18,2 18,9"></polyline>
                  <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
                  <polyline points="6,14 18,14 18,22 6,22 6,14"></polyline>
                </svg>
              Print Treatment Plan
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TreatmentPathwayPage;

