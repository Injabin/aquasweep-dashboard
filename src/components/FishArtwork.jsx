import React from 'react';
export const FishArt = ({ type, active = false, className = "w-14 h-9" }) => {
  const stroke = active ? "#22d3ee" : "#94a3b8";
  const fill = active ? "rgba(34, 211, 238, 0.12)" : "rgba(148, 163, 184, 0.04)";
  const glow = active ? "drop-shadow(0 0 6px rgba(34, 211, 238, 0.45))" : "none";

  switch (type?.toLowerCase()) {
    case 'carp':
      return (
        <svg viewBox="0 0 80 48" fill="none" className={className} style={{ filter: glow }}>
          <path
            d="M12 24 C 18 10, 48 8, 64 20 L 76 12 C 73 21, 73 27, 76 36 L 64 28 C 48 40, 18 38, 12 24 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M28 12 C 36 5, 48 7, 54 16" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M24 31 C 28 37, 36 38, 39 33" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M22 17 C 24 21, 23 26, 20 28" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="16" cy="22" r="1.8" fill={stroke} />
          <path d="M10 26 Q 7 30 5 33" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M34 20 Q 38 23 34 26 M42 19 Q 46 22 42 25" stroke={stroke} strokeWidth="1.1" strokeOpacity="0.7" />
        </svg>
      );

    case 'tilapia':
      return (
        <svg viewBox="0 0 80 48" fill="none" className={className} style={{ filter: glow }}>
          <path
            d="M14 24 C 20 11, 46 11, 60 20 L 74 13 C 71 21, 71 27, 74 35 L 60 28 C 46 37, 20 37, 14 24 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M24 14 L 28 7 L 33 11 L 38 7 L 43 10 L 48 7 L 54 11 L 58 17" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 34 L 46 41 L 51 38 L 55 31" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="22" r="1.8" fill={stroke} />
          <path d="M25 17 C 28 21, 27 27, 23 29" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M28 24 H 54" stroke={stroke} strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.75" />
        </svg>
      );

    case 'catfish':
      return (
        <svg viewBox="0 0 80 48" fill="none" className={className} style={{ filter: glow }}>
          <path
            d="M16 22 C 26 16, 48 18, 62 21 L 74 15 C 71 22, 71 26, 74 33 L 62 27 C 48 30, 26 32, 16 26 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M14 21 C 8 15, 3 14, 1 7" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M15 25 C 9 28, 3 34, 1 41" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M18 26 Q 11 34 9 42" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M34 16 L 39 11 L 44 17 M 53 19 Q 58 17 60 21" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="21" r="1.6" fill={stroke} />
        </svg>
      );

    case 'rohu':
      return (
        <svg viewBox="0 0 80 48" fill="none" className={className} style={{ filter: glow }}>
          <path
            d="M10 24 C 18 12, 46 12, 62 20 L 76 11 C 72 20, 72 28, 76 37 L 62 28 C 46 36, 18 36, 10 24 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M32 14 Q 40 4, 46 14" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M26 31 L 29 38 L 34 33 M 44 32 L 47 38 L 51 31" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="17" cy="22" r="1.8" fill={stroke} />
          <path d="M23 17 C 26 21, 25 27, 21 29" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 80 48" fill="none" className={className} style={{ filter: glow }}>
          <path
            d="M10 24 L 26 12 L 56 16 L 72 9 L 66 24 L 72 39 L 56 32 L 26 36 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
          />
          <circle cx="24" cy="24" r="2.5" stroke={stroke} strokeWidth="1.5" />
          <path d="M38 18 L 48 24 L 38 30" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
  }
};
