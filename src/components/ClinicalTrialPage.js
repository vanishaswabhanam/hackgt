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

  return (
    <div className="container">
      <button className="btn back-btn" onClick={() => navigate('/results')}>
        ← Back to Results
      </button>
      
      <h1 className="page-title">Clinical Trial Finder</h1>
      
      <div style={{ display: 'flex', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Content Area */}
        <div style={{ flex: '1', minWidth: '0' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '2px solid #3949ab' }}>
            <button
              className={`btn ${activeTab === 'recruiting' ? 'btn-secondary' : 'btn'}`}
              onClick={() => setActiveTab('recruiting')}
              style={{ 
                borderRadius: '8px 8px 0 0',
                marginRight: '10px',
                backgroundColor: activeTab === 'recruiting' ? '#5c6bc0' : '#3949ab'
              }}
            >
              🔬 Recruiting ({recruitingTrials.length})
            </button>
            <button
              className={`btn ${activeTab === 'active' ? 'btn-secondary' : 'btn'}`}
              onClick={() => setActiveTab('active')}
              style={{ 
                borderRadius: '8px 8px 0 0',
                backgroundColor: activeTab === 'active' ? '#5c6bc0' : '#3949ab'
              }}
            >
              ⚡ Active ({activeTrials.length})
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="card" style={{ textAlign: 'center' }}>
              <h3>🔬 Searching ClinicalTrials.gov...</h3>
              <p>Finding relevant clinical trials...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card" style={{ backgroundColor: '#d32f2f', color: 'white' }}>
              <h3>❌ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Trial Results */}
          {!isLoading && !error && (
            <div className="card">
              <h2>📋 {activeTab === 'recruiting' ? 'Recruiting' : 'Active'} Trials</h2>
              <p style={{ marginBottom: '20px', color: '#4caf50' }}>
                Found {currentTrials.length} relevant trials
              </p>
              
              {currentTrials.length > 0 ? (
                currentTrials.map((trial, index) => (
                  <div key={trial.nctId || index} style={{ 
                    marginBottom: '25px', 
                    padding: '20px', 
                    backgroundColor: '#3949ab', 
                    borderRadius: '8px',
                    border: '1px solid #5c6bc0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <h3 style={{ color: '#ffffff', margin: '0', flex: '1' }}>
                        {trial.title}
                      </h3>
                      <span style={{ 
                        backgroundColor: trial.status === 'Recruiting' ? '#4caf50' : '#ff9800',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginLeft: '10px'
                      }}>
                        {trial.status}
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '5px 0' }}>
                        <strong>NCT ID:</strong> {trial.nctId}
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <strong>Condition:</strong> {trial.condition}
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <strong>Intervention:</strong> {trial.intervention}
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <strong>Phase:</strong> {trial.phase || 'Not specified'}
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <strong>Location:</strong> {trial.city && trial.state ? `${trial.city}, ${trial.state}` : trial.country}
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <strong>Study Type:</strong> {trial.studyType}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <a 
                        href={trial.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ textDecoration: 'none', display: 'inline-block', marginRight: '10px' }}
                      >
                        View Details →
                      </a>
                      <button className="btn" style={{ backgroundColor: '#4caf50' }}>
                        Contact Study
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <h3>🔬 No Trials Found</h3>
                  <p>Try adjusting your filters or check back later for new trials.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Filters */}
        <div style={{ width: '300px', flexShrink: '0' }}>
          <div className="card">
            <h3>🔍 Filters</h3>
            
            {/* Phase Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Phase</h4>
              {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map(phase => (
                <label key={phase} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.phase.includes(phase)}
                    onChange={() => handleFilterChange('phase', phase)}
                    style={{ marginRight: '8px' }}
                  />
                  {phase}
                </label>
              ))}
            </div>

            {/* Location Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Location</h4>
              {['United States', 'Canada', 'Europe', 'Asia', 'Australia'].map(location => (
                <label key={location} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.location.includes(location)}
                    onChange={() => handleFilterChange('location', location)}
                    style={{ marginRight: '8px' }}
                  />
                  {location}
                </label>
              ))}
            </div>

            {/* Study Type Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Study Type</h4>
              {['Interventional', 'Observational', 'Expanded Access'].map(type => (
                <label key={type} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.studyType.includes(type)}
                    onChange={() => handleFilterChange('studyType', type)}
                    style={{ marginRight: '8px' }}
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* Apply Filters Button */}
            <button 
              className="btn btn-secondary" 
              onClick={applyFilters}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Apply Filters
            </button>

            {/* Clear Filters Button */}
            <button 
              className="btn" 
              onClick={() => setFilters({ phase: [], location: [], studyType: [] })}
              style={{ width: '100%', marginTop: '10px' }}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Back to Analysis
        </button>
      </div>
    </div>
  );
}

export default ClinicalTrialPage;

