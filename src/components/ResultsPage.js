import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResultsPage() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    console.log('Card clicked:', path);
    navigate(path);
  };

  console.log('ResultsPage rendered with vertical layout');

  return (
    <div className="container">
      <button className="btn back-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      

      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '20px', 
        height: 'calc(100vh - 200px)', 
        width: '100%',
        padding: '0 20px'
      }}>
        <div className="card" onClick={() => handleCardClick('/treatment-pathway')} style={{ 
          flex: '1', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '100%'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>🏥 Treatment Pathway Recommendation</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            Get personalized treatment recommendations based on your condition and medical history. 
            This includes medication suggestions, therapy options, and lifestyle modifications.
          </p>
          <div style={{ marginTop: '30px' }}>
            <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.1rem' }}>Click to explore →</span>
          </div>
        </div>

        <div className="card" onClick={() => handleCardClick('/clinical-trials')} style={{ 
          flex: '1', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '100%'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>🔬 Clinical Trial Finder</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            Discover relevant clinical trials and research studies that match your condition. 
            Find opportunities to participate in cutting-edge medical research.
          </p>
          <div style={{ marginTop: '30px' }}>
            <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.1rem' }}>Click to explore →</span>
          </div>
        </div>

        <div className="card" onClick={() => handleCardClick('/research')} style={{ 
          flex: '1', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '100%'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>📚 Relevant Research</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            Access the latest medical research papers, studies, and publications related to your condition. 
            Stay informed about recent developments in your field of interest.
          </p>
          <div style={{ marginTop: '30px' }}>
            <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.1rem' }}>Click to explore →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
