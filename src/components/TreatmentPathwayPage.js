import React from 'react';
import { useNavigate } from 'react-router-dom';

function TreatmentPathwayPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="btn back-btn" onClick={() => navigate('/results')}>
        ← Back to Results
      </button>
      
      <h1 className="page-title">Treatment Pathway Recommendation</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2>🎯 Immediate Actions</h2>
          <ul>
            <li>Schedule consultation with a specialist</li>
            <li>Begin prescribed medication regimen</li>
            <li>Implement lifestyle modifications</li>
            <li>Set up regular monitoring appointments</li>
          </ul>
        </div>

        <div className="card">
          <h2>💊 Medication Recommendations</h2>
          <p><strong>Primary Treatment:</strong> [Based on analysis]</p>
          <p><strong>Dosage:</strong> As prescribed by your healthcare provider</p>
          <p><strong>Side Effects to Monitor:</strong> [Relevant side effects]</p>
          <p><strong>Drug Interactions:</strong> Please consult with your pharmacist</p>
        </div>

        <div className="card">
          <h2>🏃‍♂️ Lifestyle Modifications</h2>
          <ul>
            <li>Dietary changes specific to your condition</li>
            <li>Exercise recommendations</li>
            <li>Stress management techniques</li>
            <li>Sleep hygiene improvements</li>
          </ul>
        </div>

        <div className="card">
          <h2>📅 Follow-up Schedule</h2>
          <ul>
            <li>2-week follow-up appointment</li>
            <li>Monthly progress monitoring</li>
            <li>Quarterly comprehensive review</li>
            <li>Annual specialist consultation</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print Treatment Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default TreatmentPathwayPage;
