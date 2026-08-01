import React from 'react';

interface LogoProps {
  variant?: 'full' | 'emblem';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '', size = 'md' }) => {
  const sizes = {
    sm: { height: 'h-7', emblemWidth: 'w-7', textScale: 'text-sm' },
    md: { height: 'h-9', emblemWidth: 'w-9', textScale: 'text-base' },
    lg: { height: 'h-11', emblemWidth: 'w-11', textScale: 'text-lg' },
    xl: { height: 'h-14', emblemWidth: 'w-14', textScale: 'text-2xl' },
  };

  const currentSize = sizes[size] || sizes.md;

  // Standalone Gold Interlocking GP Coin Emblem (Transparent Background)
  const EmblemSvg = (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${currentSize.emblemWidth} ${currentSize.height} shrink-0 drop-shadow-md`}
    >
      <defs>
        {/* Rich Gold Gradient */}
        <linearGradient id="gpGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF1B8" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        <linearGradient id="gpMetallic" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Left 'G' Arc */}
      <path
        d="M 100,20 A 80,80 0 1,0 100,180 A 80,80 0 0,0 170,140 L 140,140 A 50,50 0 1,1 100,50 A 50,50 0 0,1 145,72 L 172,50 A 80,80 0 0,0 100,20 Z"
        fill="url(#gpGoldGrad)"
        filter="url(#goldGlow)"
      />

      {/* Inner Interlocking GP 'G' bar & 'P' loop */}
      <path
        d="M 65,100 L 125,100 C 145,100 160,88 160,70 C 160,52 145,40 125,40 L 90,40 L 90,160 L 115,160 L 115,120 L 125,120 C 158,120 185,100 185,70 C 185,40 158,20 125,20 L 65,20 L 65,100 Z"
        fill="url(#gpMetallic)"
      />

      {/* 'P' Hole cut-out */}
      <path
        d="M 115,60 L 125,60 C 132,60 138,65 138,70 C 138,75 132,80 125,80 L 115,80 Z"
        fill="#131316"
      />
    </svg>
  );

  if (variant === 'emblem') {
    return <div className={`inline-flex items-center ${className}`}>{EmblemSvg}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {EmblemSvg}
      <div className="flex flex-col justify-center select-none">
        <span
          className={`font-black tracking-tight leading-none bg-gradient-to-r from-[#FFF1B8] via-[#F59E0B] to-[#D97706] bg-clip-text text-transparent ${currentSize.textScale}`}
        >
          Golden Penny
        </span>
        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#A0A0B0] mt-0.5">
          Personal Wealth OS
        </span>
      </div>
    </div>
  );
};
