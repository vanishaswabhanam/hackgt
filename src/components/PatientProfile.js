import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientProfile = ({ structuredData, originalText, imageData }) => {
  const navigate = useNavigate();

  // Debug: Log the data to see what we're working with
  console.log('PatientProfile - structuredData:', structuredData);
  console.log('PatientProfile - originalText:', originalText);
  console.log('PatientProfile - imageData:', imageData);
  console.log('PatientProfile - imageData type:', typeof imageData);
  console.log('PatientProfile - imageData filename:', imageData?.filename);
  console.log('PatientProfile - imageData prediction:', imageData?.prediction);

  // Extract patient information from structured data
  const patientInfo = structuredData['patient information'] || {};
  const symptoms = structuredData.symptoms || [];
  const diagnosisTests = structuredData['diagnosis tests'] || [];
  const treatments = structuredData.treatments || [];
  const medicalHistory = structuredData['patient medical history'] || {};

  console.log('PatientProfile - patientInfo:', patientInfo);
  console.log('PatientProfile - symptoms:', symptoms);
  console.log('PatientProfile - diagnosisTests:', diagnosisTests);
  console.log('PatientProfile - treatments:', treatments);
  console.log('PatientProfile - medicalHistory:', medicalHistory);

  const handleNextSteps = () => {
    // Navigate to results page
    navigate('/results');
  };

  return (
    <div className="apollo-profile-content">
      <div className="apollo-profile-header">
        <h2 className="apollo-profile-title">👤 Patient Profile Created</h2>
        <p className="apollo-profile-subtitle">Based on medical analysis and imaging data</p>
      </div>

      <div className="apollo-profile-sections">
        {/* Debug: Raw Data Display */}
        {Object.keys(structuredData).length > 0 && (
          <div className="apollo-section apollo-section-wide">
            <div className="apollo-section-glow"></div>
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <div className="apollo-section-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <label className="apollo-section-label">
                  Raw Analysis Data (Debug)
                </label>
              </div>
              <pre className="apollo-debug-pre">
                {JSON.stringify(structuredData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Patient Demographics */}
        <div className="apollo-section apollo-section-wide">
          <div className="apollo-section-glow"></div>
          <div className="apollo-section-content">
            <div className="apollo-section-header">
              <div className="apollo-section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <label className="apollo-section-label">
                Patient Information
              </label>
            </div>
            <div className="apollo-info-grid-wide">
              <div className="apollo-info-item">
                <span className="apollo-info-label">Patient ID:</span>
                <span className="apollo-info-value">{structuredData.patient_id || 'Generated ID: ' + Date.now().toString().slice(-6)}</span>
              </div>
              <div className="apollo-info-item">
                <span className="apollo-info-label">Name:</span>
                <span className="apollo-info-value">{patientInfo.name || 'Not specified'}</span>
              </div>
              <div className="apollo-info-item">
                <span className="apollo-info-label">Age:</span>
                <span className="apollo-info-value">{patientInfo.age || 'Not specified'}</span>
              </div>
              <div className="apollo-info-item">
                <span className="apollo-info-label">Gender:</span>
                <span className="apollo-info-value">{patientInfo.sex || 'Not specified'}</span>
              </div>
              <div className="apollo-info-item">
                <span className="apollo-info-label">Ethnicity:</span>
                <span className="apollo-info-value">{patientInfo.ethnicity || 'Not specified'}</span>
              </div>
              <div className="apollo-info-item">
                <span className="apollo-info-label">Weight:</span>
                <span className="apollo-info-value">{patientInfo.weight || 'Not specified'}</span>
              </div>
              <div className="apollo-info-item">
                <span className="apollo-info-label">Height:</span>
                <span className="apollo-info-value">{patientInfo.height || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Condition */}
        <div className="apollo-section apollo-section-wide">
          <div className="apollo-section-glow"></div>
          <div className="apollo-section-content">
            <div className="apollo-section-header">
              <div className="apollo-section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <label className="apollo-section-label">
                Medical Condition
              </label>
            </div>
            <div className="apollo-condition-card">
              <div className="apollo-primary-condition">
                <span className="apollo-condition-label">Primary Diagnosis:</span>
                <span className="apollo-condition-value">
                  {diagnosisTests.length > 0 ? diagnosisTests[0].condition || 'Analysis in progress...' : 'Analysis in progress...'}
                </span>
              </div>
              
              {/* Visit Motivation */}
              {structuredData['visit motivation'] && (
                <div className="apollo-visit-motivation">
                  <span className="apollo-condition-label">Chief Complaint:</span>
                  <span className="apollo-condition-value">{structuredData['visit motivation']}</span>
                </div>
              )}

              {/* Symptoms */}
              {symptoms.length > 0 && (
                <div className="apollo-symptoms-list">
                  <span className="apollo-symptoms-label">Symptoms:</span>
                  <div className="apollo-symptoms-tags">
                    {symptoms.map((symptom, index) => {
                      // Handle both string symptoms and complex symptom objects
                      if (typeof symptom === 'string') {
                        return <span key={index} className="apollo-symptom-tag">{symptom}</span>;
                      } else if (typeof symptom === 'object' && symptom !== null) {
                        // Extract the main symptom name from the object
                        const symptomName = symptom['name of symptom'] || 
                                          symptom.name || 
                                          symptom.symptom || 
                                          Object.keys(symptom)[0] || 
                                          'Symptom';
                        return <span key={index} className="apollo-symptom-tag">{symptomName}</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  {/* Detailed symptoms view for complex objects */}
                  {symptoms.some(symptom => typeof symptom === 'object' && symptom !== null) && (
                    <div className="apollo-detailed-symptoms">
                      <details className="apollo-symptoms-details">
                        <summary className="apollo-symptoms-summary">View detailed symptom information</summary>
                        <div className="apollo-symptoms-detail-content">
                          {symptoms.map((symptom, index) => {
                            if (typeof symptom === 'object' && symptom !== null) {
                              return (
                                <div key={index} className="apollo-symptom-detail-item">
                                  <h4 className="apollo-symptom-detail-title">
                                    {symptom['name of symptom'] || symptom.name || symptom.symptom || 'Symptom'}
                                  </h4>
                                  <div className="apollo-symptom-detail-properties">
                                    {Object.entries(symptom).map(([key, value]) => (
                                      <div key={key} className="apollo-symptom-property">
                                        <span className="apollo-property-key">{key}:</span>
                                        <span className="apollo-property-value">{value}</span>
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
        </div>

<<<<<<< Updated upstream
        {/* Imaging Results - Only show if there's actual image data */}
        {imageData && imageData !== null && imageData !== 'null' && (imageData.filename || imageData.prediction) && (
          <div className="apollo-section apollo-section-wide">
=======
        {/* Imaging Results */}
        {(imageData || structuredData.imaging_analysis) && (
          <div className="apollo-section">
>>>>>>> Stashed changes
            <div className="apollo-section-glow"></div>
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <div className="apollo-section-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21,15 16,10 5,21"></polyline>
                  </svg>
                </div>
                <label className="apollo-section-label">
                  Imaging Analysis
                </label>
              </div>
<<<<<<< Updated upstream
              <div className="apollo-imaging-results-wide">
                <div className="apollo-imaging-item">
                  <span className="apollo-imaging-label">Image Type:</span>
                  <span className="apollo-imaging-value">
                    {imageData?.filename || 'Medical Image'}
=======
              <div className="apollo-imaging-results">
                <div className="apollo-imaging-item">
                  <span className="apollo-imaging-label">Image Type:</span>
                  <span className="apollo-imaging-value">
                    {imageData?.filename || structuredData.imaging_analysis?.filename || 'Medical Image'}
>>>>>>> Stashed changes
                  </span>
                </div>
                <div className="apollo-imaging-item">
                  <span className="apollo-imaging-label">Classification:</span>
                  <span className="apollo-imaging-value highlight">
<<<<<<< Updated upstream
                    {(imageData?.prediction?.predicted_class || 'N/A').replace('_', ' ')}
=======
                    {(imageData?.prediction?.predicted_class || structuredData.imaging_analysis?.predicted_class || 'N/A').replace('_', ' ')}
>>>>>>> Stashed changes
                  </span>
                </div>
                <div className="apollo-imaging-item">
                  <span className="apollo-imaging-label">Confidence:</span>
                  <span className="apollo-imaging-value confidence">
<<<<<<< Updated upstream
                    {imageData?.prediction?.confidence ? 
                      `${(imageData.prediction.confidence * 100).toFixed(1)}%` : 
                      'N/A'
                    }
=======
                    {((imageData?.prediction?.confidence || structuredData.imaging_analysis?.confidence || 0) * 100).toFixed(1)}%
>>>>>>> Stashed changes
                  </span>
                </div>
              </div>
              
              {/* Show probability distribution if available */}
<<<<<<< Updated upstream
              {imageData?.prediction?.probabilities && (
                <div className="apollo-probability-distribution">
                  <h4>Probability Distribution:</h4>
                  {Object.entries(imageData.prediction.probabilities).map(([className, prob]) => (
=======
              {(imageData?.prediction?.probabilities || structuredData.imaging_analysis?.probabilities) && (
                <div className="apollo-probability-distribution">
                  <h4>Probability Distribution:</h4>
                  {Object.entries(imageData?.prediction?.probabilities || structuredData.imaging_analysis?.probabilities).map(([className, prob]) => (
>>>>>>> Stashed changes
                    <div key={className} className="apollo-probability-item">
                      <div className="apollo-probability-label">
                        <span>{className.replace('_', ' ')}</span>
                        <span>{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="apollo-probability-bar">
                        <div 
                          className="apollo-probability-fill"
                          style={{
                            width: `${prob * 100}%`,
<<<<<<< Updated upstream
                            backgroundColor: className === imageData.prediction.predicted_class ? '#4caf50' : '#3949ab'
=======
                            backgroundColor: className === (imageData?.prediction?.predicted_class || structuredData.imaging_analysis?.predicted_class) ? '#4caf50' : '#3949ab'
>>>>>>> Stashed changes
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diagnostic Tests - Only show if there's image data */}
        {imageData && imageData !== null && imageData !== 'null' && (imageData.filename || imageData.prediction) && diagnosisTests.length > 0 && (
          <div className="apollo-section apollo-section-wide">
            <div className="apollo-section-glow"></div>
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <div className="apollo-section-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m0-7h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H9m0-7V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </div>
                <label className="apollo-section-label">
                  Diagnostic Tests
                </label>
              </div>
              <div className="apollo-tests-grid-wide">
                {diagnosisTests.map((test, index) => (
                  <div key={index} className="apollo-test-item">
                    <div className="apollo-test-condition">
                      <span className="apollo-test-label">Condition:</span>
                      <span className="apollo-test-value highlight">{test.condition || 'N/A'}</span>
                    </div>
                    <div className="apollo-test-type">
                      <span className="apollo-test-label">Test:</span>
                      <span className="apollo-test-value">{test.test || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Treatments */}
        {treatments.length > 0 && (
          <div className="apollo-section apollo-section-wide">
            <div className="apollo-section-glow"></div>
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <div className="apollo-section-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <label className="apollo-section-label">
                  Current Treatments
                </label>
              </div>
              <div className="apollo-treatments-grid-wide">
                {treatments.map((treatment, index) => (
                  <div key={index} className="apollo-treatment-item">
                    <div className="apollo-treatment-name">
                      <span className="apollo-treatment-label">Medication:</span>
                      <span className="apollo-treatment-value highlight">{treatment.name || 'N/A'}</span>
                    </div>
                    <div className="apollo-treatment-condition">
                      <span className="apollo-treatment-label">For:</span>
                      <span className="apollo-treatment-value">{treatment['related condition'] || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medical History */}
        {medicalHistory && Object.keys(medicalHistory).length > 0 && (
          <div className="apollo-section apollo-section-wide">
            <div className="apollo-section-glow"></div>
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <div className="apollo-section-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <label className="apollo-section-label">
                  Medical History
                </label>
              </div>
              <div className="apollo-history-grid-wide">
                {medicalHistory['physiological context'] && (
                  <div className="apollo-history-item">
                    <span className="apollo-history-label">Physiological Context:</span>
                    <span className="apollo-history-value">{medicalHistory['physiological context']}</span>
                  </div>
                )}
                {medicalHistory['family medical history'] && (
                  <div className="apollo-history-item">
                    <span className="apollo-history-label">Family Medical History:</span>
                    <span className="apollo-history-value">{medicalHistory['family medical history']}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Treatment Recommendations */}
        {structuredData.treatment_recommendations && (
          <div className="apollo-section apollo-section-wide">
            <div className="apollo-section-glow"></div>
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <div className="apollo-section-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                    <path d="M3 12h18v6c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1v-6z"></path>
                  </svg>
                </div>
                <label className="apollo-section-label">
                  Initial Treatment Recommendations
                </label>
              </div>
              <div className="apollo-recommendations">
                <p className="apollo-recommendations-text">{structuredData.treatment_recommendations}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      <div className="apollo-profile-footer">
        <button className="apollo-button" onClick={handleNextSteps}>
          Next Steps →
        </button>
        <p className="apollo-footer-note">Click Next Steps to explore treatment options, clinical trials, and research</p>
      </div>
    </div>
  );
};

export default PatientProfile;