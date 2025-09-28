import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeroSection } from './ui/hero-section-with-smooth-bg-shader';

function ClinicalTrialPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('recruiting');
  const [recruitingTrials, setRecruitingTrials] = useState([]);
  const [activeTrials, setActiveTrials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    phase: [],
    location: [],
    studyType: []
  });

  // Get structured data from location state or localStorage
  const structuredData = location.state?.structuredData || 
    JSON.parse(localStorage.getItem('lastAnalysis') || '{}');
  const imageData = location.state?.imageData || 
    JSON.parse(localStorage.getItem('lastImageAnalysis') || 'null');

  useEffect(() => {
    if (structuredData && Object.keys(structuredData).length > 0) {
      searchTrials();
    }
  }, [structuredData]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchTrials = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Search for recruiting trials
      const recruitingResponse = await fetch('http://localhost:5001/api/search-clinical-trials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structuredData,
          imageData,
          status: 'Recruiting',
          filters
        }),
      });

      // Search for active trials
      const activeResponse = await fetch('http://localhost:5001/api/search-clinical-trials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structuredData,
          imageData,
          status: 'Active',
          filters
        }),
      });

      const recruitingResult = await recruitingResponse.json();
      const activeResult = await activeResponse.json();
      
      if (recruitingResult.success) {
        setRecruitingTrials(recruitingResult.trials || []);
      }
      
      if (activeResult.success) {
        setActiveTrials(activeResult.trials || []);
      }
      
    } catch (err) {
      console.error('Error searching ClinicalTrials.gov:', err);
      setError('Error connecting to ClinicalTrials.gov API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const applyFilters = () => {
    searchTrials();
  };

  const currentTrials = activeTab === 'recruiting' ? recruitingTrials : activeTrials;

  // Same colors as homepage for consistency
  const contrastedColors = [
    "#D4E8F7", // More visible blue
    "#D4F0E8", // More visible green
    "#80CBC4", // Pastel Teal (replacing warm orange)
    "#38BDF8", // Bright Sky (replacing light peach)
    "#E0F0D4", // More visible mint
    "#E8E8E8"  // More visible gray
  ];

  // Apollo-style icons
  const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7"></path>
      <path d="M19 12H5"></path>
    </svg>
  );

  const MicroscopeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8"></path>
      <path d="M3 22h18"></path>
      <path d="M14 9a3 3 0 0 0-3-3H6l3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3"></path>
      <path d="M20 9a3 3 0 0 0-3-3h-5l3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3"></path>
    </svg>
  );

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const ZapIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
    </svg>
  );

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );

  const FileTextIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14,2 14,8 20,8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  );

  const SpinnerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="apollo-spinner">
      <path d="M21 12a9 9 0 11-6.219-8.56"></path>
    </svg>
  );

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
        `}
      </style>
          <div className="apollo-homepage" style={{ backgroundColor: '#F3F4F6', minHeight: '100vh', position: 'relative', paddingTop: '80px' }}>
            {/* Dynamic Gradient Rectangle - Behind everything */}
            <div style={{
              position: 'fixed',
              top: '0',
              right: '0',
              width: '25vw',
              height: '100vh',
              borderRadius: '0',
              zIndex: 1,
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
      
        {/* Main Content Area */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          padding: '0 2rem 2rem 2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Left Content */}
          <div style={{ flex: 1 }}>
            {/* Page Title */}
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1E293B',
              margin: '0 0 2rem 0'
            }}>
              Clinical Trial Finder
            </h1>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <button
                onClick={() => setActiveTab('recruiting')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === 'recruiting' ? '#0A2342' : 'rgba(255, 255, 255, 0.9)',
                  color: activeTab === 'recruiting' ? 'white' : '#64748B',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <UserIcon />
                Recruiting ({recruitingTrials.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === 'active' ? '#0A2342' : 'rgba(255, 255, 255, 0.9)',
                  color: activeTab === 'active' ? 'white' : '#64748B',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <ZapIcon />
                Active ({activeTrials.length})
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '3rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #E5E7EB',
                  borderTop: '3px solid #80CBC4',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1.5rem auto'
                }}></div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1E293B',
                  margin: '0 0 0.5rem 0'
                }}>
                  Searching ClinicalTrials.gov...
                </h2>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748B',
                  margin: '0'
                }}>
                  Finding relevant clinical trials for your condition...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '3rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#DC2626',
                  margin: '0 0 0.5rem 0'
                }}>
                  Connection Error
                </h2>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748B',
                  margin: '0'
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* Trial Results */}
            {!isLoading && !error && (
              <div>
                {currentTrials.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gap: '1.5rem'
                  }}>
                    {currentTrials.map((trial, index) => (
                      <div 
                        key={trial.nctId || index} 
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '20px',
                          padding: '2rem',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '1.5rem'
                        }}>
                          <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#1E293B',
                            margin: '0',
                            flex: 1,
                            lineHeight: '1.4'
                          }}>
                            {trial.title}
                          </h3>
                          <span style={{
                            backgroundColor: trial.status === 'Recruiting' ? '#10B981' : '#3B82F6',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            marginLeft: '1rem'
                          }}>
                            {trial.status}
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '1rem',
                          marginBottom: '2rem'
                        }}>
                          <div>
                            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '500' }}>NCT ID:</span>
                            <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '600' }}>{trial.nctId}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '500' }}>Condition:</span>
                            <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '600' }}>{trial.condition}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '500' }}>Intervention:</span>
                            <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '600' }}>{trial.intervention}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '500' }}>Phase:</span>
                            <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '600' }}>{trial.phase || 'Not specified'}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '500' }}>Location:</span>
                            <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '600' }}>
                              {trial.city && trial.state ? `${trial.city}, ${trial.state}` : trial.country}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '500' }}>Study Type:</span>
                            <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '600' }}>{trial.studyType}</div>
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center'
                        }}>
                          <a 
                            href={trial.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              color: '#80CBC4',
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              textDecoration: 'none',
                              transition: 'color 0.3s ease'
                            }}
                          >
                            View Details →
                          </a>
                          <button style={{
                            backgroundColor: '#0A2342',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}>
                            Contact Study
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    padding: '3rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center'
                  }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <MicroscopeIcon />
                    </div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#1E293B',
                      margin: '0 0 0.5rem 0'
                    }}>
                      No Trials Found
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      color: '#64748B',
                      margin: '0'
                    }}>
                      Try adjusting your filters or check back later for new trials.
                    </p>
                  </div>
                )}
              </div>
            )}
            </div>

          {/* Right Side Filters */}
          <div style={{ width: '300px', flexShrink: 0 }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'sticky',
              top: '2rem',
              marginLeft: '2.5rem',
              marginTop: '10rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1E293B',
                margin: '0 0 1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <SearchIcon />
                Filters
              </h2>
              
              {/* Phase Filter */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1E293B',
                  margin: '0 0 1rem 0'
                }}>Phase</h4>
                {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map(phase => (
                  <label key={phase} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.phase.includes(phase)}
                      onChange={() => handleFilterChange('phase', phase)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#80CBC4'
                      }}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#64748B',
                      fontWeight: '500'
                    }}>{phase}</span>
                  </label>
                ))}
              </div>

              {/* Location Filter */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1E293B',
                  margin: '0 0 1rem 0'
                }}>Location</h4>
                {['United States', 'Canada', 'Europe', 'Asia', 'Australia'].map(location => (
                  <label key={location} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={() => handleFilterChange('location', location)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#80CBC4'
                      }}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#64748B',
                      fontWeight: '500'
                    }}>{location}</span>
                  </label>
                ))}
              </div>

              {/* Study Type Filter */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1E293B',
                  margin: '0 0 1rem 0'
                }}>Study Type</h4>
                {['Interventional', 'Observational', 'Expanded Access'].map(type => (
                  <label key={type} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={filters.studyType.includes(type)}
                      onChange={() => handleFilterChange('studyType', type)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#80CBC4'
                      }}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#64748B',
                      fontWeight: '500'
                    }}>{type}</span>
                  </label>
                ))}
              </div>

              {/* Filter Actions */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <button 
                  onClick={applyFilters}
                  style={{
                    backgroundColor: '#0A2342',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Apply Filters
                </button>
                <button 
                  onClick={() => setFilters({ phase: [], location: [], studyType: [] })}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#64748B',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add spinner animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </>
  );
}

export default ClinicalTrialPage;

