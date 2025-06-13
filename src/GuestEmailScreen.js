import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom"
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const GuestEmailScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const navigate = useNavigate()
  const handleFinish = () => {
    navigate("/")
  };

  const handleTouchStart = () => setButtonPressed(true);
  const handleTouchEnd = () => setButtonPressed(false);

  return (
    <div className="email-container">
      <div className="background-gradient"></div>
      <div className="content-wrapper">
        {/* Mobile-optimized Email Icon */}
        <div className={`email-icon-container ${isVisible ? 'animate-in' : ''}`}>
          <div className="email-icon-main">
            <EmailIcon />
            <div className="icon-glow"></div>
          </div>
          <div className="success-indicator"></div>
        </div>

        {/* Optimized Title */}
        <h1 className={`email-title ${isVisible ? 'slide-up' : ''}`}>
          Check Your Mail
        </h1>

        {/* Concise Message */}
        <p className={`email-message ${isVisible ? 'slide-up delay-1' : ''}`}>
          Your event is confirmed and secured. Check your email for all the details. Get ready for something extraordinary!
        </p>

        {/* Touch-optimized Button */}
        <button
          className={`finish-button ${isVisible ? 'slide-up delay-2' : ''} ${buttonPressed ? 'pressed' : ''}`}
          onClick={handleFinish}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          style={{ opacity: 1, transform: 'translateY(0)' }}
        >
          <span className="button-text">FINISH</span>
          <div className="button-ripple"></div>
        </button>
      </div>

      <style jsx>{`
        .email-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .background-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.08;
          z-index: 0;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          max-width: 100%;
          width: 100%;
          text-align: center;
        }

        /* Simplified Icon Container */
        .email-icon-container {
          position: relative;
          margin-bottom: 2rem;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .email-icon-container.animate-in {
          transform: translateY(0);
          opacity: 1;
        }

        .email-icon-main {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8bc34a, #7cb342);
          border-radius: 30px;
          box-shadow: 0 8px 32px rgba(139, 195, 74, 0.3);
        }

        .email-icon-main svg {
          width: 60px;
          height: 60px;
          color: white;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .icon-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(135deg, rgba(139, 195, 74, 0.2), rgba(124, 179, 66, 0.2));
          border-radius: 40px;
          animation: glow 2s ease-in-out infinite alternate;
        }

        .success-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 24px;
          height: 24px;
          background: #22c55e;
          border-radius: 50%;
          border: 3px solid white;
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s both;
        }

        .success-indicator::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        @keyframes glow {
          0% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Mobile-first Typography */
        .email-title {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          font-size: clamp(1.75rem, 6vw, 2.25rem);
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          line-height: 1.2;
        }

        .email-message {
          color: #64748b;
          margin-bottom: 2.5rem;
          line-height: 1.5;
          font-size: clamp(0.95rem, 4vw, 1.1rem);
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 400px;
        }

        .slide-up {
          transform: translateY(0);
          opacity: 1;
        }

        .delay-1 {
          transition-delay: 0.2s;
        }

        .delay-2 {
          transition-delay: 0.4s;
        }

        /* Touch-optimized Button */
        .finish-button {
          background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);
          padding: 16px 32px;
          border-radius: 16px;
          width: 100%;
          max-width: 280px;
          min-height: 56px;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(139, 195, 74, 0.3);
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          z-index: 1000
        }

        .finish-button.pressed {
          transform: translateY(-1px) scale(0.98);
          box-shadow: 0 4px 15px rgba(139, 195, 74, 0.4);
        }

        .button-text {
          position: relative;
          z-index: 2;
        }

        .button-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }

        .finish-button.pressed .button-ripple {
          width: 200px;
          height: 200px;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .content-wrapper {
            padding: 1.5rem 1rem;
          }

          .email-icon-main {
            width: 100px;
            height: 100px;
            border-radius: 25px;
          }

          .email-icon-main svg {
            width: 50px;
            height: 50px;
          }

          .email-message {
            margin-bottom: 2rem;
          }

          .finish-button {
            padding: 14px 28px;
            min-height: 52px;
            font-size: 1rem;
          }
        }

        /* Small Mobile Optimizations */
        @media (max-width: 480px) {
          .content-wrapper {
            padding: 1rem 0.75rem;
          }

          .email-icon-container {
            margin-bottom: 1.5rem;
          }

          .email-icon-main {
            width: 90px;
            height: 90px;
            border-radius: 22px;
          }

          .email-icon-main svg {
            width: 45px;
            height: 45px;
          }

          .success-indicator {
            width: 20px;
            height: 20px;
          }

          .success-indicator::after {
            font-size: 10px;
          }

          .email-message {
            margin-bottom: 1.75rem;
          }

          .finish-button {
            padding: 12px 24px;
            min-height: 48px;
            font-size: 0.95rem;
            letter-spacing: 0.25px;
          }
        }

        /* Landscape mobile optimization */
        @media (max-height: 600px) and (orientation: landscape) {
          .email-container {
            padding: 0.5rem;
          }

          .email-icon-container {
            margin-bottom: 1rem;
          }

          .email-icon-main {
            width: 70px;
            height: 70px;
            border-radius: 18px;
          }

          .email-icon-main svg {
            width: 35px;
            height: 35px;
          }

          .email-title {
            margin-bottom: 0.75rem;
          }

          .email-message {
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
          }

          .finish-button {
            min-height: 55px;
            font-size: 0.9rem;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestEmailScreen;