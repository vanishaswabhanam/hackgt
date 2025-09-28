import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ResearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get structured data from location state or localStorage
  const structuredData = location.state?.structuredData || 
    JSON.parse(localStorage.getItem('lastAnalysis') || '{}');

  useEffect(() => {
    if (structuredData && Object.keys(structuredData).length > 0) {
      searchPubMed(structuredData);
    }
  }, []);

  const searchPubMed = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/search-pubmed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structuredData: data
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setArticles(result.articles || []);
        setSearchQuery(result.query || '');
      } else {
        setError(result.error || 'Failed to search PubMed');
      }
    } catch (err) {
      console.error('Error searching PubMed:', err);
      setError('Error connecting to PubMed API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      // Create mock structured data for manual search
      const mockData = {
        'visit motivation': searchQuery,
        symptoms: [{ 'name of symptom': searchQuery }]
      };
      searchPubMed(mockData);
    }
  };

  // Apollo-style icons
  const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7"></path>
      <path d="M19 12H5"></path>
    </svg>
  );

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );

  const BookOpenIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );

  const BarChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  );

  const SpinnerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="apollo-spinner">
      <path d="M21 12a9 9 0 11-6.219-8.56"></path>
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

  const MicroscopeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8"></path>
      <path d="M3 22h18"></path>
      <path d="M14 9a3 3 0 0 0-3-3H6l3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3"></path>
      <path d="M20 9a3 3 0 0 0-3-3h-5l3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3"></path>
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

          {/* Loading State */}
          {isLoading && (
            <div className="apollo-section apollo-loading-section">
              <div className="apollo-section-glow"></div>
              <div className="apollo-section-content">
                <div className="apollo-loading-content">
                  <div className="apollo-loading-spinner">
                    <SpinnerIcon />
                  </div>
                  <h2 className="apollo-loading-title">🔬 Searching PubMed...</h2>
                  <p className="apollo-loading-description">Finding relevant research papers...</p>
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

          {/* Research Results */}
          {articles.length > 0 && (
            <div className="apollo-section">
              <div className="apollo-section-glow"></div>
              <div className="apollo-section-content">
                <div className="apollo-section-header">
                  <div className="apollo-section-icon">
                    <FileTextIcon />
                  </div>
                  <label className="apollo-section-label">
                    Research Results
                  </label>
                </div>
                <div className="apollo-research-count">
                  Found {articles.length} relevant articles
                </div>
                
                <div className="apollo-articles-grid">
                  {articles.map((article, index) => (
                    <div key={article.pmid || index} className="apollo-article-card">
                      <div className="apollo-article-header">
                        <h3 className="apollo-article-title">
                          {article.title}
                        </h3>
                      </div>
                      
                      <div className="apollo-article-details">
                        <div className="apollo-article-detail">
                          <span className="apollo-article-detail-label">PMID:</span>
                          <span className="apollo-article-detail-value">{article.pmid}</span>
                        </div>
                        <div className="apollo-article-detail">
                          <span className="apollo-article-detail-label">Journal:</span>
                          <span className="apollo-article-detail-value">{article.journal}</span>
                        </div>
                        <div className="apollo-article-detail">
                          <span className="apollo-article-detail-label">Year:</span>
                          <span className="apollo-article-detail-value">{article.year}</span>
                        </div>
                      </div>
                      
                      <div className="apollo-article-abstract">
                        <h4 className="apollo-abstract-title">Abstract</h4>
                        <p className="apollo-abstract-text">
                          {article.abstract}
                        </p>
                      </div>
                      
                      <div className="apollo-article-actions">
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="apollo-button apollo-button-secondary"
                        >
                          Read Full Article →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && articles.length === 0 && !error && (
            <div className="apollo-section">
              <div className="apollo-section-glow"></div>
              <div className="apollo-section-content">
                <div className="apollo-no-results">
                  <div className="apollo-no-results-icon">
                    <MicroscopeIcon />
                  </div>
                  <h3 className="apollo-no-results-title">No Results Found</h3>
                  <p className="apollo-no-results-description">
                    Try searching with different medical terms or check your connection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="apollo-section">
            <div className="apollo-section-glow"></div>
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <div className="apollo-section-icon">
                  <SearchIcon />
                </div>
                <label className="apollo-section-label">
                  Search PubMed
                </label>
              </div>
              
              <div className="apollo-search-container">
                <div className="apollo-input-group">
                  <input 
                    type="text" 
                    className="apollo-search-input"
                    placeholder="Enter medical terms to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                  />
                </div>
                
                <div className="apollo-search-actions">
                  <button 
                    className="apollo-button apollo-button-primary" 
                    onClick={handleManualSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <SpinnerIcon />
                        Searching...
                      </>
                    ) : (
                      <>
                        <SearchIcon />
                        Search PubMed
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default ResearchPage;

