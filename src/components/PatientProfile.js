import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientProfile = ({ structuredData, originalText, imageData }) => {
  const navigate = useNavigate();

  // Debug: Log the data to see what we're working with
  console.log('PatientProfile - structuredData:', structuredData);
  console.log('PatientProfile - originalText:', originalText);
  console.log('PatientProfile - imageData:', imageData);

  // Extract patient information from structured data
  const patientInfo = structuredData['patient information'] || {};
  const symptoms = structuredData.symptoms || [];
  const diagnosisTests = structuredData['diagnosis tests'] || [];
  const treatments = structuredData.treatments || [];
  const medicalHistory = structuredData['patient medical history'] || {};

  const handleNextSteps = () => {
    // Navigate to results page
    navigate('/results');
  };

  return (
    <div style={{ 
      position: 'relative', 
      zIndex: 2, 
      display: 'flex', 
      flexDirection: 'column',
      gap: '2rem', 
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 2rem',
      marginTop: '5vh'
    }}>
      {/* Patient Information Card */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '800px',
        minHeight: '200px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          margin: '0 0 1.5rem 0',
          color: '#1E293B',
          lineHeight: '1.3'
        }}>
          Patient Information
        </h3>
        <div style={{
          fontSize: '0.85rem',
          color: '#64748B',
          margin: '0 0 1.5rem 0',
          lineHeight: '1.5',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem'
        }}>
          {/* Left Column */}
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Patient ID:</strong> {structuredData.patient_id || 'Generated ID: ' + Date.now().toString().slice(-6)}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Name:</strong> {patientInfo.name || 'Not specified'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Gender:</strong> {patientInfo.sex || 'Not specified'}
            </div>
            <div>
              <strong>Age:</strong> {patientInfo.age || 'Not specified'}
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Ethnicity:</strong> {patientInfo.ethnicity || 'Not specified'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Weight:</strong> {patientInfo.weight || 'Not specified'}
            </div>
            <div>
              <strong>Height:</strong> {patientInfo.height || 'Not specified'}
            </div>
          </div>
        </div>
      </div>

      {/* Medical Condition Card */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '800px',
        minHeight: '200px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          margin: '0 0 1.5rem 0',
          color: '#1E293B',
          lineHeight: '1.3'
        }}>
          Medical Condition
        </h3>
        <div style={{
          fontSize: '0.85rem',
          color: '#64748B',
          margin: '0 0 1.5rem 0',
          lineHeight: '1.5',
          flex: 1
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Primary Diagnosis:</strong> {diagnosisTests.length > 0 ? diagnosisTests[0].condition || 'Analysis in progress...' : 'Analysis in progress...'}
          </div>
          
          {structuredData['visit motivation'] && (
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Chief Complaint:</strong> {structuredData['visit motivation']}
            </div>
          )}

          {symptoms.length > 0 && (
            <div>
              <strong>Symptoms:</strong> {symptoms.map((symptom, index) => {
                if (typeof symptom === 'string') {
                  return symptom;
                } else if (typeof symptom === 'object' && symptom !== null) {
                  return symptom['name of symptom'] || symptom.name || symptom.symptom || Object.keys(symptom)[0] || 'Symptom';
                }
                return null;
              }).filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Imaging Analysis Card - Only show if there's actual image data */}
      {imageData && imageData !== null && imageData !== 'null' && (imageData.filename || imageData.prediction) && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          width: '100%',
          maxWidth: '800px',
          minHeight: '200px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0 0 1.5rem 0',
            color: '#1E293B',
            lineHeight: '1.3'
          }}>
            Imaging Analysis
          </h3>
          <div style={{
            fontSize: '0.85rem',
            color: '#64748B',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5',
            flex: 1
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Image Type:</strong> {imageData?.filename || 'Medical Image'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Classification:</strong> {(() => {
                const classification = imageData?.prediction?.predicted_class || 
                                    imageData?.predicted_class || 
                                    imageData?.classification ||
                                    'N/A';
                
                // Replace class names with proper medical terminology
                const replacements = {
                  'brain_tumor': 'Brain Pituitary Tumor',
                  'brain_glioma': 'Brain Glioma', 
                  'brain_menin': 'Brain Meningioma'
                };
                
                return replacements[classification] || classification.replace('_', ' ');
              })()}
            </div>
            <div>
              <strong>Confidence:</strong> {
                imageData?.prediction?.confidence ? 
                  `${(imageData.prediction.confidence * 100).toFixed(1)}%` : 
                imageData?.confidence_score ?
                  `${(imageData.confidence_score * 100).toFixed(1)}%` :
                imageData?.confidence ?
                  `${(imageData.confidence * 100).toFixed(1)}%` :
                  'N/A'
              }
            </div>
          </div>
        </div>
      )}

      {/* Current Treatments Card */}
      {treatments.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          width: '100%',
          maxWidth: '800px',
          minHeight: '200px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0 0 1.5rem 0',
            color: '#1E293B',
            lineHeight: '1.3'
          }}>
            Current Treatments
          </h3>
          <div style={{
            fontSize: '0.85rem',
            color: '#64748B',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5',
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {(() => {
              // Group treatments by condition
              const groupedTreatments = treatments.reduce((groups, treatment) => {
                const condition = treatment['related condition'] || 'General';
                if (!groups[condition]) {
                  groups[condition] = [];
                }
                groups[condition].push(treatment.name || 'N/A');
                return groups;
              }, {});

              return Object.entries(groupedTreatments).map(([condition, medications]) => (
                <div key={condition} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>
                    <strong>For: {condition}</strong>
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '1rem' }}>
                    {medications.map((medication, index) => (
                      <li key={index} style={{ marginBottom: '0.25rem' }}>
                        {medication}
                      </li>
                    ))}
                  </ul>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Medical History Card */}
      {medicalHistory && Object.keys(medicalHistory).length > 0 && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          width: '100%',
          maxWidth: '800px',
          minHeight: '200px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0 0 1.5rem 0',
            color: '#1E293B',
            lineHeight: '1.3'
          }}>
            Medical History
          </h3>
          <div style={{
            fontSize: '0.85rem',
            color: '#64748B',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5',
            flex: 1
          }}>
            {medicalHistory['physiological context'] && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Physiological Context:</strong> {medicalHistory['physiological context']}
              </div>
            )}
            {medicalHistory['family medical history'] && (
              <div>
                <strong>Family Medical History:</strong> {medicalHistory['family medical history']}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Treatment Recommendations Card */}
      {structuredData.treatment_recommendations && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          width: '100%',
          maxWidth: '800px',
          minHeight: '200px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0 0 1.5rem 0',
            color: '#1E293B',
            lineHeight: '1.3'
          }}>
            Treatment Recommendations
          </h3>
          <div style={{
            fontSize: '0.85rem',
            color: '#64748B',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5',
            flex: 1
          }}>
            {structuredData.treatment_recommendations}
          </div>
        </div>
      )}

      {/* Next Steps Button */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '800px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <button 
          onClick={handleNextSteps}
          style={{
            backgroundColor: '#80CBC4',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#6bb3ad';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#80CBC4';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Next Steps →
        </button>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748B',
          margin: '0',
          lineHeight: '1.5'
        }}>
          Click Next Steps to explore treatment options, clinical trials, and research
        </p>
      </div>
    </div>
  );
};

export default PatientProfile;