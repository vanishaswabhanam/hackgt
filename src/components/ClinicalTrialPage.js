import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClinicalTrialPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="btn back-btn" onClick={() => navigate('/results')}>
        ← Back to Results
      </button>
      
      <h1 className="page-title">Clinical Trial Finder</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2>🔍 Active Trials Matching Your Profile</h2>
          <div style={{ marginBottom: '20px' }}>
            <h3>Trial 1: [Trial Name]</h3>
            <p><strong>Phase:</strong> Phase II/III</p>
            <p><strong>Location:</strong> Multiple sites nationwide</p>
            <p><strong>Eligibility:</strong> Adults 18-75 with [condition]</p>
            <p><strong>Duration:</strong> 12 months</p>
            <button className="btn btn-secondary" style={{ marginTop: '10px' }}>
              Learn More
            </button>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Trial 2: [Trial Name]</h3>
            <p><strong>Phase:</strong> Phase III</p>
            <p><strong>Location:</strong> [City, State]</p>
            <p><strong>Eligibility:</strong> Patients with [specific criteria]</p>
            <p><strong>Duration:</strong> 18 months</p>
            <button className="btn btn-secondary" style={{ marginTop: '10px' }}>
              Learn More
            </button>
          </div>
        </div>

        <div className="card">
          <h2>📋 Eligibility Assessment</h2>
          <p>Based on your profile, you may be eligible for:</p>
          <ul>
            <li>✅ 3 active trials</li>
            <li>⚠️ 2 trials pending additional screening</li>
            <li>❌ 1 trial not suitable (age criteria)</li>
          </ul>
        </div>

        <div className="card">
          <h2>📞 How to Participate</h2>
          <ol>
            <li>Review trial details and requirements</li>
            <li>Contact the trial coordinator</li>
            <li>Complete initial screening</li>
            <li>Attend informed consent meeting</li>
            <li>Begin trial participation</li>
          </ol>
        </div>

        <div className="card">
          <h2>🛡️ Patient Rights & Safety</h2>
          <ul>
            <li>Right to withdraw at any time</li>
            <li>Comprehensive safety monitoring</li>
            <li>Access to trial results</li>
            <li>Coverage of trial-related medical expenses</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-secondary">
            Contact Trial Coordinator
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClinicalTrialPage;
