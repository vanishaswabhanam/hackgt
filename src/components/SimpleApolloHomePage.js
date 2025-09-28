import React, { useState, useEffect } from 'react';
import { HeroSection } from './ui/hero-section-with-smooth-bg-shader';

export default function SimpleApolloHomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const containerStyle = {
    width: '100vw',
    minHeight: '200vh', // Make it scrollable
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
    transform: `translateY(${Math.max(0, 100 - scrollY * 0.2)}vh)`,
    transition: 'transform 0.1s ease-out',
    zIndex: 30,
    display: 'flex',
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
            APOLLO
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
        {/* Left Container */}
        <div style={leftContainerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              backgroundColor: '#0A2342', 
              borderRadius: '4px',
              marginRight: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
              Patient Information
            </h2>
          </div>
          <textarea 
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
            <div style={{ 
              width: '24px', 
              height: '24px', 
              backgroundColor: '#0A2342', 
              borderRadius: '4px',
              marginRight: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
              AI Analysis
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
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', margin: '0 0 0.5rem 0', color: '#374151' }}>
              Upload Medical Data
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
              Upload scans, images, or research files for AI analysis
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 1.5rem 0' }}>
              DICOM, PNG, JPG, PDF up to 50MB
            </p>
            <button style={{
              backgroundColor: '#0A2342',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Analyze Patient Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}