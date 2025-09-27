import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      let imageResult = null;
      let textResult = null;

      // Process image if uploaded
      if (selectedFile) {
        imageResult = await classifyImage(selectedFile);
        if (!imageResult.success) {
          alert('Error classifying image: ' + (imageResult.error || 'Unknown error'));
          setIsLoading(false);
          return;
        }
      }

      // Process text if provided
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
          textResult = data;
          // Store structured data for other pages
          localStorage.setItem('lastAnalysis', JSON.stringify(data.structuredData));
          localStorage.setItem('lastAnalysisText', textInput.trim());
        } else {
          alert('Error analyzing text: ' + (data.error || 'Failed to analyze text'));
          setIsLoading(false);
          return;
        }
      }

      // Combine results
      if (imageResult && textResult) {
        // Both image and text analysis
        const combinedResult = {
          type: 'combined_analysis',
          imageData: imageResult,
          textData: textResult,
          structuredData: {
            ...textResult.structuredData,
            imaging_analysis: {
              predicted_class: imageResult.prediction.predicted_class,
              confidence: imageResult.prediction.confidence,
              probabilities: imageResult.prediction.probabilities,
              filename: selectedFile.name
            }
          },
          filename: selectedFile.name
        };
        
        // Navigate to patient profile page
        navigate('/patient-profile', {
          state: {
            structuredData: combinedResult.structuredData,
            originalText: textInput,
            imageData: imageResult,
            resultType: 'combined_analysis'
          }
        });
      } else if (imageResult) {
        // Only image analysis
        navigate('/patient-profile', {
          state: {
            structuredData: {
              patient_id: `IMG_${Date.now().toString().slice(-6)}`,
              primary_diagnosis: imageResult.prediction.predicted_class.replace('_', ' '),
              symptoms: [`Imaging shows ${imageResult.prediction.predicted_class.replace('_', ' ')} with ${(imageResult.prediction.confidence * 100).toFixed(1)}% confidence`],
              medical_history: 'Based on medical imaging analysis',
              imaging_confidence: imageResult.prediction.confidence
            },
            originalText: "Medical imaging analysis",
            imageData: imageResult,
            resultType: 'image_classification'
          }
        });
      } else if (textResult) {
        // Only text analysis
        navigate('/patient-profile', {
          state: {
            structuredData: textResult.structuredData,
            originalText: textInput,
            imageData: null,
            resultType: 'text_analysis'
          }
        });
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
    <div className="modern-homepage">
      {/* Header */}
      <header className="modern-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">⚕</div>
            <div className="logo-text">
              <h1>MedResearch AI</h1>
              <p>Advanced Medical Analysis Platform</p>
            </div>
          </div>
          <nav className="header-nav">
            <a href="#research">Research</a>
            <a href="#analysis">Analysis</a>
            <a href="#reports">Reports</a>
            <button className="sign-in-btn">Sign In</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="modern-main">
        <div className="hero-section">
          <div className="feature-badge">
            <span className="pulse-icon">⚡</span>
            AI-Powered Medical Research
          </div>
          
          <h2 className="hero-title">
            Accelerate Medical<br />
            Discovery
          </h2>
          
          <p className="hero-description">
            Advanced AI analysis for medical images, research queries, and clinical data. 
            Empowering healthcare professionals with cutting-edge insights.
          </p>
        </div>

        {/* Main Analysis Card */}
        <div className="analysis-card">
          {/* Research Query Section */}
          <div className="query-section">
            <div className="section-header">
              <span className="section-icon">🔍</span>
              <h3>Research Query</h3>
            </div>
            <textarea
              className="modern-textarea"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your medical research question or describe the analysis you need..."
              rows="4"
            />
          </div>

          {/* File Upload Section */}
          <div className="upload-section">
            <div className="section-header">
              <span className="section-icon">📤</span>
              <h3>Medical Images & Files</h3>
            </div>
            <div className="upload-zone">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="fileInput" className="upload-label">
                <div className="upload-icon">📁</div>
                <h4>Upload Medical Images</h4>
                <p>Drag & drop files here, or click to browse</p>
                <small>Supports: DICOM, PNG, JPG, PDF (max 10MB each)</small>
                {selectedFile && (
                  <div className="selected-file">
                    ✓ {selectedFile.name}
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Start Analysis Button */}
          <button 
            className="start-analysis-btn" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <span className="btn-icon">⚡</span>
            {isLoading ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </div>

        {/* Service Cards */}
        <div className="service-cards">
          <div className="service-card">
            <div className="card-icon">🫀</div>
            <h4>Cardiology</h4>
            <p>Advanced AI analysis for cardiology research and diagnostics</p>
          </div>
          <div className="service-card">
            <div className="card-icon">🧠</div>
            <h4>Neurology</h4>
            <p>Advanced AI analysis for neurology research and diagnostics</p>
          </div>
          <div className="service-card">
            <div className="card-icon">🔬</div>
            <h4>Pathology</h4>
            <p>Advanced AI analysis for pathology research and diagnostics</p>
          </div>
          <div className="service-card">
            <div className="card-icon">⚕️</div>
            <h4>Surgery</h4>
            <p>Advanced AI analysis for surgery research and diagnostics</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <span className="logo-icon">⚕</span>
              <span>MedResearch AI</span>
            </div>
            <p>Advancing medical research through artificial intelligence and machine learning.</p>
          </div>
          
          <div className="footer-links">
            <div className="link-column">
              <h5>Platform</h5>
              <a href="#research-tools">Research Tools</a>
              <a href="#image-analysis">Image Analysis</a>
              <a href="#data-processing">Data Processing</a>
            </div>
            <div className="link-column">
              <h5>Resources</h5>
              <a href="#documentation">Documentation</a>
              <a href="#api-reference">API Reference</a>
              <a href="#support">Support</a>
            </div>
            <div className="link-column">
              <h5>Company</h5>
              <a href="#about">About</a>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 MedResearch AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

