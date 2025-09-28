import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeroSection } from './ui/hero-section-with-smooth-bg-shader';

function ResearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Same colors as ResultsPage for consistency
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

  const handleCardClick = (event) => {
    // Don't advance if clicking on the "Read Full Article" button
    if (event.target.closest('.apollo-button-secondary')) {
      return;
    }
    
    // Only advance if there are multiple articles
    if (articles.length > 1) {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % articles.length);
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
    <div className="apollo-homepage" style={{ paddingTop: '80px' }}>
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
      
      
      {/* Main content area */}
      <div className="apollo-main">
        <div className="apollo-content">
          {/* Page Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem',
            marginTop: '2rem'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#1E293B',
              margin: '0 0 1rem 0',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Relevant Research
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#64748B',
              margin: '0',
              lineHeight: '1.5'
            }}>
              Latest medical research papers and studies related to your condition
            </p>
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

          {/* Research Results - Stacked Cards */}
          {articles.length > 0 && (
            <>
              {/* Gradient Background Rectangle - Square shaped for cards */}
              <div style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '800px',
                height: '600px',
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
              
              <div className="apollo-articles-stack" style={{ position: 'relative', zIndex: 2, marginTop: '-3rem' }}>
              {articles.map((article, index) => {
                const isTopCard = index === currentCardIndex;
                const stackPosition = (index - currentCardIndex + articles.length) % articles.length;
                
                return (
                  <div 
                    key={article.pmid || index} 
                    className={`apollo-article-card apollo-stacked-card ${isTopCard ? 'apollo-top-card' : 'apollo-stacked-under'}`}
                    style={{ zIndex: articles.length - stackPosition }}
                    onClick={handleCardClick}
                  >
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
                );
              })}
              </div>
            </>
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
          <div className="apollo-section" style={{ width: '800px', margin: '0 auto' }}>
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

