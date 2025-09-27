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

    </div>
  );
}

export default HomePage;

