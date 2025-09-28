import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeroSection } from './ui/hero-section-with-smooth-bg-shader';

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Same colors as homepage for consistency
  const contrastedColors = [
    "#D4E8F7", // More visible blue
    "#D4F0E8", // More visible green
    "#80CBC4", // Pastel Teal (replacing warm orange)
    "#38BDF8", // Bright Sky (replacing light peach)
    "#E0F0D4", // More visible mint
    "#E8E8E8"  // More visible gray
  ];

  // Get structured data from location state or localStorage
  const structuredData = location.state?.structuredData || 
    JSON.parse(localStorage.getItem('lastAnalysis') || '{}');
  const originalText = location.state?.originalText || 
    localStorage.getItem('lastAnalysisText') || '';

  const handleCardClick = (path) => {
    console.log('Card clicked:', path);
    navigate(path, {
      state: {
        structuredData: structuredData,
        originalText: originalText
      }
    });
  };

  // Apollo-style icons
  const HospitalIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"></path>
      <path d="M5 21V7l8-4v18"></path>
      <path d="M19 21V11l-6-4"></path>
      <path d="M9 9v.01"></path>
      <path d="M9 12v.01"></path>
      <path d="M9 15v.01"></path>
      <path d="M9 18v.01"></path>
    </svg>
  );

  const MicroscopeIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8"></path>
      <path d="M3 22h18"></path>
      <path d="M14 9a3 3 0 0 0-3-3H6l3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3"></path>
      <path d="M20 9a3 3 0 0 0-3-3h-5l3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3"></path>
    </svg>
  );

  const BookIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7"></path>
      <path d="M19 12H5"></path>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );

  return (
    <>
      <style>
        {`
          * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
          }
          *::-webkit-tooltip {
            display: none !important;
          }
          [title]:hover:after {
            display: none !important;
          }
        `}
      </style>
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
            
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="apollo-main">
        <div className="apollo-content">
          {/* Dynamic Gradient Background Rectangle */}
          <div style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95vw',
            height: '60vh',
            borderRadius: '40px',
            zIndex: 1,
            overflow: 'hidden'
          }}>
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
          
          {/* Results Cards */}
          <div style={{ 
            position: 'relative', 
            zIndex: 2, 
            display: 'flex', 
            gap: '2rem', 
            justifyContent: 'center',
            alignItems: 'stretch',
            padding: '0 2rem',
            marginTop: '5vh'
          }}>
            {/* Treatment Pathway Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              flex: 1,
              maxWidth: '350px',
              minHeight: '400px',
              cursor: 'pointer',
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
            }}
            onClick={() => handleCardClick('/treatment-pathway')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ height: '24px', marginBottom: '0.5rem' }}></div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0 0 1.5rem 0',
                color: '#1E293B',
                lineHeight: '1.3'
              }}>
                Treatment Pathway Recommendation
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#64748B',
                margin: '0 0 1.5rem 0',
                lineHeight: '1.5',
                flex: 1
              }}>
                Get personalized treatment recommendations based on your condition and medical history. 
                Includes medication suggestions, therapy options, and lifestyle modifications.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: '#80CBC4',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                <span>Explore</span>
                <ArrowRightIcon />
              </div>
            </div>

            {/* Clinical Trials Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              flex: 1,
              maxWidth: '350px',
              minHeight: '400px',
              cursor: 'pointer',
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
            }}
            onClick={() => handleCardClick('/clinical-trials')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ height: '24px', marginBottom: '0.5rem' }}></div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0 0 1.5rem 0',
                color: '#1E293B',
                lineHeight: '1.3'
              }}>
                Clinical Trial Finder
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#64748B',
                margin: '0 0 1.5rem 0',
                lineHeight: '1.5',
                flex: 1
              }}>
                Discover relevant clinical trials and research studies that match your condition. 
                Find opportunities to participate in cutting-edge medical research.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: '#38BDF8',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                <span>Explore</span>
                <ArrowRightIcon />
              </div>
            </div>

            {/* Research Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              flex: 1,
              maxWidth: '350px',
              minHeight: '400px',
              cursor: 'pointer',
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
            }}
            onClick={() => handleCardClick('/research')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ height: '24px', marginBottom: '0.5rem' }}></div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0 0 1.5rem 0',
                color: '#1E293B',
                lineHeight: '1.3'
              }}>
                Relevant Research
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#64748B',
                margin: '0 0 1.5rem 0',
                lineHeight: '1.5',
                flex: 1
              }}>
                Access the latest medical research papers, studies, and publications related to your condition. 
                Stay informed about recent developments in your field of interest.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: '#D4F0E8',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                <span>Explore</span>
                <ArrowRightIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ResultsPage;
