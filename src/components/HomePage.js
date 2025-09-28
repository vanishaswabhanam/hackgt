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

  // SVG Icons as components
  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );

  const UploadIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14,2 14,8 20,8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10,9 9,9 8,9"></polyline>
    </svg>
  );

  const FileTextIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14,2 14,8 20,8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  );

  const BarChart3Icon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"></path>
      <rect width="4" height="7" x="7" y="10" rx="1"></rect>
      <rect width="4" height="12" x="15" y="5" rx="1"></rect>
    </svg>
  );

  const DatabaseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M3 5v14a9 3 0 0 0 18 0V5"></path>
      <path d="M3 12a9 3 0 0 0 18 0"></path>
    </svg>
  );

  return (
    <div className="apollo-homepage">
      {/* Subtle background pattern */}
      <div className="apollo-background-pattern"></div>
      
      {/* Flowing lines background */}
      <div className="flowing-lines-container">
        <div className="flowing-line line-1"></div>
        <div className="flowing-line line-2"></div>
        <div className="flowing-line line-3"></div>
        <div className="flowing-line line-4"></div>
        <div className="flowing-line line-5"></div>
        <div className="flowing-line line-6"></div>
        <div className="flowing-line line-7"></div>
        <div className="flowing-line line-8"></div>
        <div className="flowing-line line-9"></div>
      </div>
      
      {/* Subtle glow effects */}
      <div className="apollo-glow-1"></div>
      <div className="apollo-glow-2"></div>
      
      {/* Header Navigation */}
      <header className="apollo-header">
        <div className="apollo-header-content">
          <div className="apollo-header-inner">
            {/* Logo/Brand */}
            <div className="apollo-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <div className="apollo-logo-text">
                APOLLO AI
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="apollo-nav">
              <button className="apollo-nav-button">
                <FileTextIcon />
                Research
              </button>
              <button className="apollo-nav-button">
                <BarChart3Icon />
                Analysis
              </button>
              <button className="apollo-nav-button">
                <DatabaseIcon />
                Reports
              </button>
              <div className="apollo-signin-wrapper">
                <div className="apollo-signin-glow"></div>
                <button className="apollo-signin-button">
                  Sign In
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="apollo-main">
        <div className="apollo-content">
          {/* Doctor Notes Section */}
          <div className="apollo-section">
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <label htmlFor="doctor-notes" className="apollo-section-label" style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1E293B',
                  lineHeight: '1.3',
                  margin: '0 0 1rem 0'
                }}>
                  Doctor Notes
                </label>
              </div>
              <textarea
                id="doctor-notes"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter in patient details and diagnoses..."
                className="apollo-textarea"
                style={{
                  fontSize: '0.85rem',
                  color: '#64748B',
                  lineHeight: '1.5'
                }}
              />
            </div>
          </div>
          
          {/* Medical Images & Files Section */}
          <div className="apollo-section">
            <div className="apollo-section-content">
              <div className="apollo-section-header">
                <label className="apollo-section-label" style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1E293B',
                  lineHeight: '1.3',
                  margin: '0 0 1rem 0'
                }}>
                  Medical Images & Files
                </label>
              </div>
              <div className="apollo-upload-zone">
                <p className="apollo-upload-title" style={{
                  fontSize: '0.85rem',
                  color: '#64748B',
                  lineHeight: '1.5',
                  margin: '0 0 0.5rem 0'
                }}>
                  Upload medical images, scans, or research files
                </p>
                <p className="apollo-upload-description" style={{
                  fontSize: '0.85rem',
                  color: '#64748B',
                  lineHeight: '1.5',
                  margin: '0 0 1rem 0'
                }}>
                  DICOM, PNG, JPG, PDF up to 50MB • Drag and drop or click to browse
                </p>
                {selectedFile && (
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '8px 16px', 
                    background: '#e8f5e8', 
                    color: '#2d5a2d', 
                    borderRadius: '6px', 
                    fontSize: '0.85rem', 
                    fontWeight: '500',
                    lineHeight: '1.5'
                  }}>
                    Selected: {selectedFile.name}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,.dicom,.dcm,.pdf"
                  className="apollo-upload-input"
                  onChange={handleFileChange}
                  multiple
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  );
}

export default HomePage;

