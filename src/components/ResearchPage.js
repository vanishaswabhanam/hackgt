import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResearchPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="btn back-btn" onClick={() => navigate('/results')}>
        ← Back to Results
      </button>
      
      <h1 className="page-title">Relevant Research</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2>📖 Latest Research Papers</h2>
          <div style={{ marginBottom: '20px' }}>
            <h3>Recent Study: [Study Title]</h3>
            <p><strong>Authors:</strong> [Author names]</p>
            <p><strong>Journal:</strong> [Journal name]</p>
            <p><strong>Published:</strong> 2024</p>
            <p><strong>Abstract:</strong> [Brief summary of findings]</p>
            <button className="btn btn-secondary" style={{ marginTop: '10px' }}>
              Read Full Paper
            </button>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Meta-Analysis: [Study Title]</h3>
            <p><strong>Authors:</strong> [Author names]</p>
            <p><strong>Journal:</strong> [Journal name]</p>
            <p><strong>Published:</strong> 2024</p>
            <p><strong>Abstract:</strong> [Brief summary of findings]</p>
            <button className="btn btn-secondary" style={{ marginTop: '10px' }}>
              Read Full Paper
            </button>
          </div>
        </div>

        <div className="card">
          <h2>🔬 Research Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: '#3949ab', borderRadius: '8px' }}>
              <h4>Treatment Studies</h4>
              <p>12 papers</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#3949ab', borderRadius: '8px' }}>
              <h4>Diagnostic Methods</h4>
              <p>8 papers</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#3949ab', borderRadius: '8px' }}>
              <h4>Prevention</h4>
              <p>5 papers</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#3949ab', borderRadius: '8px' }}>
              <h4>Quality of Life</h4>
              <p>7 papers</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>📊 Key Findings Summary</h2>
          <ul>
            <li><strong>Efficacy:</strong> New treatment shows 85% improvement rate</li>
            <li><strong>Safety:</strong> Minimal side effects reported in recent studies</li>
            <li><strong>Long-term:</strong> 5-year follow-up data shows sustained benefits</li>
            <li><strong>Cost-effectiveness:</strong> Treatment reduces overall healthcare costs</li>
          </ul>
        </div>

        <div className="card">
          <h2>🔍 Search & Filter</h2>
          <div className="input-group">
            <input type="text" placeholder="Search research papers..." />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button className="btn btn-secondary">Filter by Year</button>
            <button className="btn btn-secondary">Filter by Journal</button>
            <button className="btn btn-secondary">Filter by Study Type</button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-secondary">
            Subscribe to Research Updates
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResearchPage;
