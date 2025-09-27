import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (textInput.trim() || selectedFile) {
      navigate('/results');
    } else {
      alert('Please enter text or upload an image');
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
        <button className="btn" onClick={handleSubmit}>
          Analyze & Get Recommendations
        </button>
      </div>
    </div>
  );
}

export default HomePage;
