import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="orngGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8a00" />
          <stop offset="100%" stopColor="#e52e71" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="45" stroke="url(#orngGradient)" strokeWidth="2" strokeOpacity="0.5" />
      
      {/* Orbital Paths */}
      <ellipse cx="50" cy="50" rx="40" ry="10" stroke="url(#orngGradient)" strokeWidth="1" strokeOpacity="0.3" transform="rotate(45 50 50)" />
      <ellipse cx="50" cy="50" rx="40" ry="10" stroke="url(#orngGradient)" strokeWidth="1" strokeOpacity="0.3" transform="rotate(-45 50 50)" />
      
      {/* Core */}
      <circle cx="50" cy="50" r="15" fill="url(#orngGradient)" filter="url(#glow)" />
      
      {/* Data Points */}
      <circle cx="20" cy="20" r="2" fill="#fff" opacity="0.8" />
      <circle cx="80" cy="80" r="2" fill="#fff" opacity="0.8" />
      <circle cx="80" cy="20" r="2" fill="#fff" opacity="0.8" />
      <circle cx="20" cy="80" r="2" fill="#fff" opacity="0.8" />
    </svg>
  );
}
