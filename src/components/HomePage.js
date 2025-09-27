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
        // Don't navigate away - show result on same page
      } else {
        alert('Error: ' + (data.error || 'Failed to analyze text'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
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
  );
}

export default HomePage;

