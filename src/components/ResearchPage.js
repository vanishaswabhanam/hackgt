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
  const imageData = location.state?.imageData || 
    JSON.parse(localStorage.getItem('lastImageAnalysis') || 'null');

  useEffect(() => {
    if (structuredData && Object.keys(structuredData).length > 0) {
      searchPubMed(structuredData, imageData);
    }
  }, []);

  const searchPubMed = async (data, imgData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/search-pubmed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structuredData: data,
          imageData: imgData
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
      searchPubMed(mockData, imageData);
    }
  };

  return (
    <div className="container">
      <button className="btn back-btn" onClick={() => navigate('/results')}>
        ← Back to Results
      </button>
      
      <h1 className="page-title">Relevant Research</h1>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Search Section */}
        <div className="card">
          <h2>🔍 Search PubMed</h2>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Enter medical terms to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleManualSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search PubMed'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {isLoading && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>🔬 Searching PubMed...</h3>
            <p>Finding relevant research papers...</p>
          </div>
        )}

        {error && (
          <div className="card" style={{ backgroundColor: '#d32f2f', color: 'white' }}>
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="card">
            <h2>📖 Research Results</h2>
            <p style={{ marginBottom: '20px', color: '#4caf50' }}>
              Found {articles.length} relevant articles
            </p>
            
            {articles.map((article, index) => (
              <div key={article.pmid || index} style={{ 
                marginBottom: '25px', 
                padding: '20px', 
                backgroundColor: '#3949ab', 
                borderRadius: '8px',
                border: '1px solid #5c6bc0'
              }}>
                <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>
                  {article.title}
                </h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>PMID:</strong> {article.pmid}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Journal:</strong> {article.journal}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Year:</strong> {article.year}
                  </p>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <strong>Abstract:</strong>
                  <p style={{ 
                    marginTop: '8px', 
                    lineHeight: '1.6',
                    backgroundColor: '#283593',
                    padding: '10px',
                    borderRadius: '4px'
                  }}>
                    {article.abstract}
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                  >
                    Read Full Article →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && articles.length === 0 && !error && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>🔬 No Results Found</h3>
            <p>Try searching with different medical terms or check your connection.</p>
          </div>
        )}

        {/* Research Categories */}
        <div className="card">
          <h2>📊 Research Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: '#3949ab', borderRadius: '8px' }}>
              <h4>Treatment Studies</h4>
              <p>{articles.filter(a => a.title.toLowerCase().includes('treatment')).length} papers</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#3949ab', borderRadius: '8px' }}>
              <h4>Diagnostic Methods</h4>
              <p>{articles.filter(a => a.title.toLowerCase().includes('diagnosis')).length} papers</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#3949ab', borderRadius: '8px' }}>
              <h4>Clinical Trials</h4>
              <p>{articles.filter(a => a.title.toLowerCase().includes('trial')).length} papers</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#3949ab', borderRadius: '8px' }}>
              <h4>Case Studies</h4>
              <p>{articles.filter(a => a.title.toLowerCase().includes('case')).length} papers</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← Back to Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResearchPage;

