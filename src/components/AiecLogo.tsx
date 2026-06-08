import React from 'react';

interface AiecLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
}

export default function AiecLogo({ 
  className = '', 
  showText = true, 
  size = 'md', 
  variant = 'color' 
}: AiecLogoProps) {
  // Size mapping for responsive rendering
  const sizeClasses = {
    xs: { icon: 'w-6 h-6', text: 'text-base', subText: 'text-[9px]' },
    sm: { icon: 'w-7 h-7', text: 'text-lg', subText: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', subText: 'text-[11px]' },
    lg: { icon: 'w-14 h-14', text: 'text-3xl', subText: 'text-xs' },
    xl: { icon: 'w-24 h-24', text: 'text-5.5xl', subText: 'text-base' },
  };

  const selectedSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Human-designed Geometric Hexagonal Shield & Interlocking Chain Logo Mark */}
      <svg
        className={`${selectedSize.icon} shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Premium teal-to-blue linear gradient for high-contrast presentation */}
          <linearGradient id="brandAiecGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" /> {/* Vivid Teal */}
            <stop offset="50%" stopColor="#0ea5e9" /> {/* Ocean Blue */}
            <stop offset="100%" stopColor="#2563eb" /> {/* Vivid Blue */}
          </linearGradient>

          {/* Semi-transparent inner white glow for premium depth */}
          <linearGradient id="innerWhiteGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
          </linearGradient>

          {/* Clean dropshadow filter for the overlapping checkmark link */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-0.8" dy="1.2" stdDeviation="1.2" floodColor="#01040a" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* 1. Flat Sleek Hexagonal Shield Outline */}
        <path
          d="M 50 8 
             L 86 28.5 
             L 86 71.5 
             L 50 92 
             L 14 71.5 
             L 14 28.5 
             Z"
          stroke="url(#brandAiecGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Simplified Stylized A-Frame inside the Hexagon */}
        <path
          d="M 32 68 
             L 50 25 
             L 68 68"
          stroke="url(#brandAiecGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Elegant Integrated Overlapping White Verification Tick */}
        <path
          d="M 37 49 
             L 48 60 
             L 70 33"
          stroke="url(#innerWhiteGlow)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#softShadow)"
        />

        {/* Gloss highlight line within checkmark for professional contrast */}
        <path
          d="M 37.5 49 
             L 48 59.5 
             L 69.5 33.5"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Typography with Outline effect to match original branding exactly */}
      {showText && (
        <div className="flex flex-col justify-center leading-none text-left select-none">
          <span 
            className={`font-sans tracking-tight font-extrabold ${selectedSize.text} uppercase`}
            style={{
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.95)',
              letterSpacing: '0.04em',
              lineHeight: '1.02',
              textShadow: '0 0 20px rgba(99, 102, 241, 0.08)',
            }}
          >
            AIEC
          </span>
          <span 
            className={`font-sans font-bold tracking-wide ${selectedSize.subText}`}
            style={{
              color: '#2dd4bf', // Teal/greenish color matching the brand tone exactly
              letterSpacing: '0.04em',
              marginTop: '1.5px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            AI Evidence Chain
          </span>
        </div>
      )}
    </div>
  );
}
