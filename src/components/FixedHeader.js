import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function FixedHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show header on homepage
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* APOLLO Logo */}
      <div 
        onClick={() => navigate('/')} 
        style={{ 
          cursor: 'pointer',
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1E293B',
          fontFamily: 'Rajdhani, sans-serif',
          letterSpacing: '-0.02em'
        }}
      >
        APOLLO AI
      </div>
      
      {/* Modern Back Button */}
      <button 
        onClick={handleBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          color: '#1E293B',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
        Back
      </button>
    </div>
  );
}

export default FixedHeader;
