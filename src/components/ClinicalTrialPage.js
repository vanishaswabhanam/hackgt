import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
          <div className="apollo-clinical-layout">
            {/* Main Content Area */}
            <div className="apollo-clinical-main">
              {/* Page Title */}
              <div className="apollo-section apollo-title-section">
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
                </div>
              </div>

              {/* Tabs */}
              <div className="apollo-tabs-container">
                <button
                  className={`apollo-tab ${activeTab === 'recruiting' ? 'apollo-tab-active' : ''}`}
                  onClick={() => setActiveTab('recruiting')}
                >
                  <UserIcon />
                  Recruiting ({recruitingTrials.length})
                </button>
                <button
                  className={`apollo-tab ${activeTab === 'active' ? 'apollo-tab-active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  <ZapIcon />
                  Active ({activeTrials.length})
                </button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="apollo-section apollo-loading-section">
                  <div className="apollo-section-glow"></div>
                  <div className="apollo-section-content">
                    <div className="apollo-loading-content">
                      <div className="apollo-loading-spinner">
                        <SpinnerIcon />
                      </div>
                      <h2 className="apollo-loading-title">🔬 Searching ClinicalTrials.gov...</h2>
                      <p className="apollo-loading-description">Finding relevant clinical trials...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="apollo-section apollo-error-section">
                  <div className="apollo-section-glow"></div>
                  <div className="apollo-section-content">
                    <div className="apollo-error-content">
                      <h2 className="apollo-error-title">❌ Error</h2>
                      <p className="apollo-error-description">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trial Results */}
              {!isLoading && !error && (
                <div className="apollo-section">
                  <div className="apollo-section-glow"></div>
                  <div className="apollo-section-content">
                    <div className="apollo-section-header">
                      <div className="apollo-section-icon">
                        <FileTextIcon />
                      </div>
                      <label className="apollo-section-label">
                        {activeTab === 'recruiting' ? 'Recruiting' : 'Active'} Trials
                      </label>
                    </div>
                    <div className="apollo-trial-count">
                      Found {currentTrials.length} relevant trials
                    </div>
                    
                    {currentTrials.length > 0 ? (
                      <div className="apollo-trials-grid">
                        {currentTrials.map((trial, index) => (
                          <div key={trial.nctId || index} className="apollo-trial-card">
                            <div className="apollo-trial-header">
                              <h3 className="apollo-trial-title">
                                {trial.title}
                              </h3>
                              <span className={`apollo-trial-status apollo-trial-status-${trial.status.toLowerCase()}`}>
                                {trial.status}
                              </span>
                            </div>
                            
                            <div className="apollo-trial-details">
                              <div className="apollo-trial-detail">
                                <span className="apollo-trial-detail-label">NCT ID:</span>
                                <span className="apollo-trial-detail-value">{trial.nctId}</span>
                              </div>
                              <div className="apollo-trial-detail">
                                <span className="apollo-trial-detail-label">Condition:</span>
                                <span className="apollo-trial-detail-value">{trial.condition}</span>
                              </div>
                              <div className="apollo-trial-detail">
                                <span className="apollo-trial-detail-label">Intervention:</span>
                                <span className="apollo-trial-detail-value">{trial.intervention}</span>
                              </div>
                              <div className="apollo-trial-detail">
                                <span className="apollo-trial-detail-label">Phase:</span>
                                <span className="apollo-trial-detail-value">{trial.phase || 'Not specified'}</span>
                              </div>
                              <div className="apollo-trial-detail">
                                <span className="apollo-trial-detail-label">Location:</span>
                                <span className="apollo-trial-detail-value">
                                  {trial.city && trial.state ? `${trial.city}, ${trial.state}` : trial.country}
                                </span>
                              </div>
                              <div className="apollo-trial-detail">
                                <span className="apollo-trial-detail-label">Study Type:</span>
                                <span className="apollo-trial-detail-value">{trial.studyType}</span>
                              </div>
                            </div>
                            
                            <div className="apollo-trial-actions">
                              <a 
                                href={trial.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="apollo-button apollo-button-secondary"
                              >
                                View Details →
                              </a>
                              <button className="apollo-button apollo-button-success">
                                Contact Study
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="apollo-no-trials">
                        <div className="apollo-no-trials-icon">
                          <MicroscopeIcon />
                        </div>
                        <h3 className="apollo-no-trials-title">No Trials Found</h3>
                        <p className="apollo-no-trials-description">
                          Try adjusting your filters or check back later for new trials.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Filters */}
            <div className="apollo-clinical-filters">
              <div className="apollo-section">
                <div className="apollo-section-glow"></div>
                <div className="apollo-section-content">
                  <div className="apollo-section-header">
                    <div className="apollo-section-icon">
                      <SearchIcon />
                    </div>
                    <label className="apollo-section-label">
                      Filters
                    </label>
                  </div>
                  
                  {/* Phase Filter */}
                  <div className="apollo-filter-group">
                    <h4 className="apollo-filter-title">Phase</h4>
                    {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map(phase => (
                      <label key={phase} className="apollo-filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.phase.includes(phase)}
                          onChange={() => handleFilterChange('phase', phase)}
                        />
                        <span className="apollo-checkbox-custom"></span>
                        <span className="apollo-checkbox-label">{phase}</span>
                      </label>
                    ))}
                  </div>

                  {/* Location Filter */}
                  <div className="apollo-filter-group">
                    <h4 className="apollo-filter-title">Location</h4>
                    {['United States', 'Canada', 'Europe', 'Asia', 'Australia'].map(location => (
                      <label key={location} className="apollo-filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(location)}
                          onChange={() => handleFilterChange('location', location)}
                        />
                        <span className="apollo-checkbox-custom"></span>
                        <span className="apollo-checkbox-label">{location}</span>
                      </label>
                    ))}
                  </div>

                  {/* Study Type Filter */}
                  <div className="apollo-filter-group">
                    <h4 className="apollo-filter-title">Study Type</h4>
                    {['Interventional', 'Observational', 'Expanded Access'].map(type => (
                      <label key={type} className="apollo-filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.studyType.includes(type)}
                          onChange={() => handleFilterChange('studyType', type)}
                        />
                        <span className="apollo-checkbox-custom"></span>
                        <span className="apollo-checkbox-label">{type}</span>
                      </label>
                    ))}
                  </div>

                  {/* Filter Actions */}
                  <div className="apollo-filter-actions">
                    <button 
                      className="apollo-button apollo-button-secondary" 
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </button>
                    <button 
                      className="apollo-button apollo-button-outline" 
                      onClick={() => setFilters({ phase: [], location: [], studyType: [] })}
                    >
                      Clear All
                    </button>
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

export default ClinicalTrialPage;

