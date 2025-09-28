import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './ui/hero-section-with-smooth-bg-shader';

export default function SimpleApolloHomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [patientText, setPatientText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Calculate the maximum scroll position where white page is fully visible
      // When scrollY * 0.2 = 90 (100 - 10), the white page is at translateY(10vh)
      // So maxScroll = 90 / 0.2 = 450
      const maxScroll = 450;
      
      if (currentScrollY <= maxScroll) {
        setScrollY(currentScrollY);
      } else {
        // Prevent scrolling beyond the limit
        window.scrollTo(0, maxScroll);
        setScrollY(maxScroll);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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

  const analyzePatientData = async () => {
    if (!patientText.trim() && !selectedFile) {
      alert('Please enter patient information or upload an image before analyzing');
      return;
    }

    setIsAnalyzing(true);
    let imageResult = null;
    
    try {
      // If image is uploaded, classify it first
      if (selectedFile) {
        imageResult = await classifyImage(selectedFile);
        if (!imageResult.success) {
          alert('Error classifying image: ' + imageResult.error);
          setIsAnalyzing(false);
          return;
        }
      }

      // If text is provided, analyze it
      if (patientText.trim()) {
        const response = await fetch('http://localhost:5001/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: patientText.trim()
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Store structured data for other pages
          localStorage.setItem('lastAnalysis', JSON.stringify(data.structuredData));
          localStorage.setItem('lastAnalysisText', patientText.trim());
          
          // Store image data if available
          if (imageResult) {
            localStorage.setItem('lastImageAnalysis', JSON.stringify(imageResult));
          }
          
          // Navigate to patient profile with the structured data
          navigate('/patient-profile', { 
            state: { 
              structuredData: data.structuredData,
              originalText: patientText.trim(),
              imageData: imageResult
            } 
          });
        } else {
          alert('Error: ' + (data.error || 'Failed to analyze patient data'));
        }
      } else if (imageResult) {
        // Only image analysis, no text
        localStorage.setItem('lastImageAnalysis', JSON.stringify(imageResult));
        
        navigate('/patient-profile', { 
          state: { 
            imageData: imageResult
          } 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server. Please make sure the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  const containerStyle = {
    width: '100vw',
    height: 'calc(100vh + 450px)', // Exact height to allow scrolling to the limit
    backgroundColor: 'white',
    position: 'relative',
    overflow: 'visible' // Allow scrolling
  };

  const gradientContainerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden'
  };

  // Simple fade out as you scroll
  const fadeOpacity = Math.max(0, 1 - (scrollY * 0.002));
  
  const centerContentStyle = {
    position: 'fixed',
    top: '40vh',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    textAlign: 'center',
    transition: 'opacity 0.1s ease-out'
  };

  // Emerging white page that slides up from bottom
  const emergingPageStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white',
    transform: `translateY(${Math.max(10, 100 - scrollY * 0.2)}vh)`,
    transition: 'transform 0.1s ease-out',
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 4rem',
    gap: '2rem',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px'
  };

  const leftContainerStyle = {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem 4rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    height: '60vh',
    display: 'flex',
    flexDirection: 'column'
  };

  const rightContainerStyle = {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem 4rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    height: '60vh',
    display: 'flex',
    flexDirection: 'column'
  };

  // Updated colors with new color palette - only changing orange tones
  const contrastedColors = [
    "#D4E8F7", // More visible blue
    "#D4F0E8", // More visible green
    "#80CBC4", // Pastel Teal (replacing warm orange)
    "#38BDF8", // Bright Sky (replacing light peach)
    "#E0F0D4", // More visible mint
    "#E8E8E8"  // More visible gray
  ];

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Gradient Section with Border */}
      <div style={gradientContainerStyle}>
        {/* Centered Content */}
        <div style={centerContentStyle}>
          <h1 style={{ 
            fontSize: '7rem', 
            fontWeight: '900', 
            color: '#1E293B', 
            margin: 0,
            letterSpacing: '-0.05em',
            fontFamily: 'Rajdhani, sans-serif',
            opacity: fadeOpacity
          }}>
            APOLLO AI
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#1E293B',
            marginTop: '0.1rem',
            fontWeight: '300',
            maxWidth: '500px',
            fontFamily: 'Georgia, serif',
            opacity: fadeOpacity,
            transition: 'opacity 0.1s ease-out'
          }}>
            Intelligent AI solutions for modern healthcare
          </p>
        </div>

        {/* MeshGradient Background */}
        <HeroSection
          title=""
          highlightText=""
          description=""
          buttonText=""
          colors={contrastedColors}
          distortion={1.2}
          swirl={0.8}
          speed={1.0}
          offsetX={0.1}
          className=""
          veilOpacity="bg-white/10"
          maxWidth="max-w-none"
        />
      </div>

      {/* Emerging White Page with Two Boxes */}
      <div style={emergingPageStyle}>
        {/* Containers Row */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          width: '100%',
          justifyContent: 'center'
        }}>
          {/* Left Container */}
          <div style={leftContainerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
              Patient Information
            </h2>
          </div>
          <textarea 
            value={patientText}
            onChange={(e) => setPatientText(e.target.value)}
            style={{
              flex: 1,
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '2rem 4rem',
              fontSize: '1rem',
              fontFamily: 'system-ui, sans-serif',
              resize: 'none',
              outline: 'none',
              backgroundColor: '#f9fafb'
            }}
            placeholder="Enter patient details, symptoms, and medical history..."
          />
        </div>

        {/* Right Container */}
        <div style={rightContainerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
              Medical Images
            </h2>
          </div>
          <div style={{
            flex: 1,
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '2rem 4rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
              Upload scans, images, or research files for AI analysis
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 1.5rem 0' }}>
              DICOM, PNG, JPG, PDF up to 50MB
            </p>
            {selectedFile && (
              <div style={{ 
                marginTop: '16px', 
                padding: '8px 16px', 
                background: '#e8f5e8', 
                color: '#2d5a2d', 
                borderRadius: '6px', 
                fontSize: '14px', 
                fontWeight: '500' 
              }}>
                Selected: {selectedFile.name}
              </div>
            )}
            <input
              type="file"
              accept="image/*,.dicom,.dcm"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
        </div>
        
        {/* Analyze Data Button */}
        <button 
          onClick={analyzePatientData}
          disabled={isAnalyzing}
          style={{
            backgroundColor: isAnalyzing ? '#80CBC4' : '#0A2342',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(10, 35, 66, 0.3)',
            marginTop: '1rem',
            opacity: isAnalyzing ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!isAnalyzing) {
              e.target.style.backgroundColor = '#38BDF8';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(56, 189, 248, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isAnalyzing) {
              e.target.style.backgroundColor = '#0A2342';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(10, 35, 66, 0.3)';
            }
          }}
        >
          {isAnalyzing ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Analyzing...
            </>
          ) : (
            'Analyze Data'
          )}
        </button>
      </div>
    </div>
  );
}