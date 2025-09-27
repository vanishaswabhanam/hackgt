import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!textInput.trim() && !selectedFile) {
      alert('Please enter text or upload an image');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // If image is uploaded, classify it first
      if (selectedFile) {
        const imageResult = await classifyImage(selectedFile);
        if (imageResult.success) {
          setResult({
            ...imageResult,
            type: 'image_classification',
            filename: selectedFile.name
          });
          setIsLoading(false);
          return;
        }
      }

      // If text is provided, analyze it
      if (textInput.trim()) {
        const response = await fetch('http://localhost:5001/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textInput.trim()
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setResult(data);
          // Store structured data for other pages
          localStorage.setItem('lastAnalysis', JSON.stringify(data.structuredData));
          localStorage.setItem('lastAnalysisText', textInput.trim());
        } else {
          alert('Error: ' + (data.error || 'Failed to analyze text'));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const classifyImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5001/api/classify-brain-tumor', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Image classification error:', error);
      return { success: false, error: 'Failed to classify image' };
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Medical Research Assistant</h1>
      
      <div className="input-group">
        <label htmlFor="textInput">Enter your medical query or symptoms:</label>
        <textarea
          id="textInput"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Describe your symptoms, medical condition, or research question..."
          rows="6"
        />
      </div>

      <div className="file-upload">
        <label htmlFor="fileInput" className="file-upload-label">
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div>
            <h3>📁 Upload Medical Image</h3>
            <p>Click here to upload an image (X-ray, MRI, CT scan, etc.)</p>
            {selectedFile && (
              <p style={{ color: '#4caf50', marginTop: '10px' }}>
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </label>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button 
          className="btn" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze & Get Recommendations'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#283593', borderRadius: '8px' }}>
          {result.type === 'image_classification' ? (
            <div>
              <h3>Image Classification Result:</h3>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#4caf50' }}>
                  Predicted Class: {result.prediction.predicted_class}
                </h4>
                <p style={{ fontSize: '1.2rem' }}>
                  <strong>Confidence:</strong> {(result.prediction.confidence * 100).toFixed(1)}%
                </p>
                <p><strong>File:</strong> {result.filename}</p>
              </div>

              <div>
                <h4>Probability Distribution:</h4>
                {Object.entries(result.prediction.probabilities).map(([className, prob]) => (
                  <div key={className} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>{className.replace('_', ' ')}</span>
                      <span>{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '20px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${prob * 100}%`,
                        height: '100%',
                        backgroundColor: className === result.prediction.predicted_class ? '#4caf50' : '#3949ab',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="btn btn-secondary" onClick={() => navigate('/results')}>
                  View Service Options →
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3>Analysis Result:</h3>
              <pre style={{ 
                backgroundColor: '#1a237e', 
                padding: '15px', 
                borderRadius: '5px', 
                overflow: 'auto',
                fontSize: '14px',
                color: '#ffffff',
                maxHeight: '400px'
              }}>
                {JSON.stringify(result.structuredData, null, 2)}
              </pre>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="btn btn-secondary" onClick={() => navigate('/results')}>
                  View Service Options →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;

