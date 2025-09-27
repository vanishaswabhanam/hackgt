import React from 'react';
import { useNavigate } from 'react-router-dom';

function PatientProfile({ structuredData, originalText, imageData, onNextSteps }) {
  const navigate = useNavigate();

  const handleNextSteps = () => {
    // Store data for other pages
    localStorage.setItem('lastAnalysis', JSON.stringify(structuredData));
    localStorage.setItem('lastAnalysisText', originalText);
    if (imageData) {
      localStorage.setItem('lastImageAnalysis', JSON.stringify(imageData));
    }
    
    // Navigate to results page
    navigate('/results');
  };

  return (
    <div className="patient-profile-page">
      <div className="patient-profile-header">
        <h2>👤 Patient Profile Created</h2>
        <p className="profile-subtitle">Based on medical analysis and imaging data</p>
      </div>

      <div className="patient-profile-content">
        {/* Patient Demographics */}
        <div className="profile-section">
          <h3>📋 Patient Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Patient ID:</span>
              <span className="value">{structuredData.patient_id || 'Generated ID: ' + Date.now().toString().slice(-6)}</span>
            </div>
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{structuredData.patient_name || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="label">Age:</span>
              <span className="value">{structuredData.age || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="label">Gender:</span>
              <span className="value">{structuredData.gender || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Medical Condition */}
        <div className="profile-section">
          <h3>🏥 Medical Condition</h3>
          <div className="condition-card">
            <div className="primary-condition">
              <span className="condition-label">Primary Diagnosis:</span>
              <span className="condition-value">{structuredData.primary_diagnosis || 'Analysis in progress...'}</span>
            </div>
            {structuredData.symptoms && structuredData.symptoms.length > 0 && (
              <div className="symptoms-list">
                <span className="symptoms-label">Symptoms:</span>
                <div className="symptoms-tags">
                  {structuredData.symptoms.map((symptom, index) => {
                    // Handle both string symptoms and complex symptom objects
                    if (typeof symptom === 'string') {
                      return <span key={index} className="symptom-tag">{symptom}</span>;
                    } else if (typeof symptom === 'object' && symptom !== null) {
                      // Extract the main symptom name from the object
                      const symptomName = symptom['name of symptom'] || 
                                        symptom.name || 
                                        symptom.symptom || 
                                        Object.keys(symptom)[0] || 
                                        'Symptom';
                      return <span key={index} className="symptom-tag">{symptomName}</span>;
                    }
                    return null;
                  })}
                </div>
                
                {/* Detailed symptoms view for complex objects */}
                {structuredData.symptoms.some(symptom => typeof symptom === 'object' && symptom !== null) && (
                  <div className="detailed-symptoms">
                    <details className="symptoms-details">
                      <summary className="symptoms-summary">View detailed symptom information</summary>
                      <div className="symptoms-detail-content">
                        {structuredData.symptoms.map((symptom, index) => {
                          if (typeof symptom === 'object' && symptom !== null) {
                            return (
                              <div key={index} className="symptom-detail-item">
                                <h4 className="symptom-detail-title">
                                  {symptom['name of symptom'] || symptom.name || symptom.symptom || 'Symptom'}
                                </h4>
                                <div className="symptom-detail-properties">
                                  {Object.entries(symptom).map(([key, value]) => (
                                    <div key={key} className="symptom-property">
                                      <span className="property-key">{key}:</span>
                                      <span className="property-value">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Imaging Results */}
        {(imageData || structuredData.imaging_analysis) && (
          <div className="profile-section">
            <h3>🔬 Imaging Analysis</h3>
            <div className="imaging-results">
              <div className="imaging-item">
                <span className="imaging-label">Image Type:</span>
                <span className="imaging-value">
                  {imageData?.filename || structuredData.imaging_analysis?.filename || 'Medical Image'}
                </span>
              </div>
              <div className="imaging-item">
                <span className="imaging-label">Classification:</span>
                <span className="imaging-value highlight">
                  {(imageData?.prediction?.predicted_class || structuredData.imaging_analysis?.predicted_class || 'N/A').replace('_', ' ')}
                </span>
              </div>
              <div className="imaging-item">
                <span className="imaging-label">Confidence:</span>
                <span className="imaging-value confidence">
                  {((imageData?.prediction?.confidence || structuredData.imaging_analysis?.confidence || 0) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* Show probability distribution if available */}
            {(imageData?.prediction?.probabilities || structuredData.imaging_analysis?.probabilities) && (
              <div className="probability-distribution">
                <h4>Probability Distribution:</h4>
                {Object.entries(imageData?.prediction?.probabilities || structuredData.imaging_analysis?.probabilities).map(([className, prob]) => (
                  <div key={className} className="probability-item">
                    <div className="probability-label">
                      <span>{className.replace('_', ' ')}</span>
                      <span>{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="probability-bar">
                      <div 
                        className="probability-fill"
                        style={{
                          width: `${prob * 100}%`,
                          backgroundColor: className === (imageData?.prediction?.predicted_class || structuredData.imaging_analysis?.predicted_class) ? '#4caf50' : '#3949ab'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Medical History */}
        {(structuredData.medical_history || structuredData.medications || structuredData.allergies) && (
          <div className="profile-section">
            <h3>📚 Medical History</h3>
            <div className="history-grid">
              {structuredData.medical_history && (
                <div className="history-item">
                  <span className="history-label">Previous Conditions:</span>
                  <span className="history-value">{structuredData.medical_history}</span>
                </div>
              )}
              {structuredData.medications && (
                <div className="history-item">
                  <span className="history-label">Current Medications:</span>
                  <span className="history-value">{structuredData.medications}</span>
                </div>
              )}
              {structuredData.allergies && (
                <div className="history-item">
                  <span className="history-label">Allergies:</span>
                  <span className="history-value">{structuredData.allergies}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Treatment Recommendations */}
        {structuredData.treatment_recommendations && (
          <div className="profile-section">
            <h3>💊 Initial Treatment Recommendations</h3>
            <div className="treatment-preview">
              <p>{structuredData.treatment_recommendations}</p>
            </div>
          </div>
        )}
      </div>

      <div className="patient-profile-footer">
        <button className="btn btn-primary" onClick={handleNextSteps}>
          Next Steps →
        </button>
        <p className="footer-note">Click Next Steps to explore treatment options, clinical trials, and research</p>
      </div>
    </div>
  );
}

export default PatientProfile;
