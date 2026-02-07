"use client";

// Gradient & Glow Filters
const GradientAndGlow = () => (
  <defs>
    <linearGradient id="pulse-red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF1F1F" />
      <stop offset="100%" stopColor="#800000" />
    </linearGradient>
    <filter id="pulse-neon-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// Wrapper for Hover Effects
const IconWrapper = ({ children, size = 24, onClick, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    className={`${className} cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95`}
    style={{ filter: "url(#pulse-neon-glow)" }}
  >
    <GradientAndGlow />
    {children}
  </svg>
);

// --- Icons ---

export const ShuffleIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M21 16V21H16" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 21H8V16" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3H21V8" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 3H3V8" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 3L3 21" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L3 3" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </IconWrapper>
);

export const PreviousIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M19 20L9 12L19 4V20Z" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 4V20" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </IconWrapper>
);

export const NextIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M5 4L15 12L5 20V4Z" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 4V20" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </IconWrapper>
);

export const RepeatIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M17 1L21 5L17 9" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 23L3 19L7 15" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="url(#pulse-red-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </IconWrapper>
);

export const PlayPauseButton = ({ isPlaying, onClick, size = 50 }) => (
  <button onClick={onClick} className="relative group focus:outline-none mx-4">
    {/* Glow Backdrop */}
    <div className="absolute inset-0 bg-red-600 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
    
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="relative z-10 transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
      <defs>
        <linearGradient id="btn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3333" />
          <stop offset="100%" stopColor="#990000" />
        </linearGradient>
      </defs>
      
      <circle cx="24" cy="24" r="23" stroke="url(#btn-gradient)" strokeWidth="2" fill="rgba(20,20,20,0.8)" />
      
      {isPlaying ? (
        <path d="M18 14H22V34H18V14Z M26 14H30V34H26V14Z" fill="white" />
      ) : (
        <path d="M19 14L33 24L19 34V14Z" fill="white" />
      )}
    </svg>
  </button>
);