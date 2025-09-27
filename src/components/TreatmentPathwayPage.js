import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function TreatmentPathwayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get structured data from location state or localStorage
  const structuredData = location.state?.structuredData || 
    JSON.parse(localStorage.getItem('lastAnalysis') || '{}');
  const originalText = location.state?.originalText || 
    localStorage.getItem('lastAnalysisText') || '';

  useEffect(() => {
    if (structuredData && Object.keys(structuredData).length > 0) {
      fetchTreatmentRecommendations();
    } else {
      setError('No patient data available. Please analyze a clinical note first.');
      setIsLoading(false);
    }
  }, []);

  const fetchTreatmentRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/treatment-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structuredData: structuredData,
          originalText: originalText
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setRecommendations(result.recommendations);
      } else {
        setError(result.error || 'Failed to generate treatment recommendations');
      }
    } catch (err) {
      console.error('Error fetching treatment recommendations:', err);
      setError('Error connecting to treatment recommendations API');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <button className="btn back-btn" onClick={() => navigate('/results')}>
          ← Back to Results
        </button>
        
        <h1 className="page-title">Treatment Pathway Recommendation</h1>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Generating AI Treatment Recommendations...</h2>
          <p>Analyzing your clinical data and generating personalized treatment options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <button className="btn back-btn" onClick={() => navigate('/results')}>
          ← Back to Results
        </button>
        
        <h1 className="page-title">Treatment Pathway Recommendation</h1>
        
        <div className="card" style={{ backgroundColor: '#d32f2f', color: 'white' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchTreatmentRecommendations}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="btn back-btn" onClick={() => navigate('/results')}>
        ← Back to Results
      </button>
      
      <h1 className="page-title">Treatment Pathway Recommendation</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {recommendations?.immediateActions && (
          <div className="card">
            <h2>Immediate Actions</h2>
            <ul>
              {recommendations.immediateActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations?.medicationRecommendations && (
          <div className="card">
            <h2>Medication Recommendations</h2>
            <p><strong>Primary Treatment:</strong> {recommendations.medicationRecommendations.primaryTreatment}</p>
            <p><strong>Dosage:</strong> {recommendations.medicationRecommendations.dosage}</p>
            <p><strong>Side Effects to Monitor:</strong> {recommendations.medicationRecommendations.sideEffects}</p>
            <p><strong>Drug Interactions:</strong> {recommendations.medicationRecommendations.drugInteractions}</p>
            {recommendations.medicationRecommendations.alternativeTreatments && 
             recommendations.medicationRecommendations.alternativeTreatments.length > 0 && (
              <div>
                <strong>Alternative Treatments:</strong>
                <ul>
                  {recommendations.medicationRecommendations.alternativeTreatments.map((alt, index) => (
                    <li key={index}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {recommendations?.lifestyleModifications && (
          <div className="card">
            <h2>Lifestyle Modifications</h2>
            <ul>
              {recommendations.lifestyleModifications.map((modification, index) => (
                <li key={index}>{modification}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations?.followUpSchedule && (
          <div className="card">
            <h2>Follow-up Schedule</h2>
            <ul>
              {recommendations.followUpSchedule.map((schedule, index) => (
                <li key={index}>{schedule}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations?.specialistReferrals && (
          <div className="card">
            <h2>Specialist Referrals</h2>
            <ul>
              {recommendations.specialistReferrals.map((referral, index) => (
                <li key={index}>{referral}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations?.monitoringRequirements && (
          <div className="card">
            <h2>Monitoring Requirements</h2>
            <ul>
              {recommendations.monitoringRequirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations?.patientEducation && (
          <div className="card">
            <h2>Patient Education</h2>
            <ul>
              {recommendations.patientEducation.map((education, index) => (
                <li key={index}>{education}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print Treatment Plan
          </button>
          <button className="btn btn-secondary" onClick={fetchTreatmentRecommendations} style={{ marginLeft: '10px' }}>
            Regenerate Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}

export default TreatmentPathwayPage;

