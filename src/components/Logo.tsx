"use client";

import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ variant = "dark", size = "md", showTagline = false }: LogoProps) {
  const colorClass = variant === "dark" ? "text-[#6B4423]" : "text-[#F6D3B3]";
  const strokeColor = variant === "dark" ? "#6B4423" : "#F6D3B3";
  
  const sizes = {
    sm: { arch: 24, text: "text-lg", tagline: "text-[8px]" },
    md: { arch: 32, text: "text-xl", tagline: "text-[10px]" },
    lg: { arch: 48, text: "text-3xl", tagline: "text-xs" },
  };

  const { arch, text, tagline } = sizes[size];

  return (
    <Link href="/" className="flex flex-col items-center">
      {/* Arch/U Inverted Logo */}
      <div className="relative">
        {/* Top curved text */}
        <svg 
          viewBox="0 0 200 60" 
          className={`w-auto h-${arch/4}`}
          style={{ height: arch * 0.75 }}
        >
          <defs>
            <path
              id="topCurve"
              d="M 20,50 A 80,80 0 0,1 180,50"
              fill="transparent"
            />
          </defs>
          <text 
            className={`font-cinzel ${colorClass} tracking-[0.3em]`}
            style={{ fontSize: arch * 0.4 }}
          >
            <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
              AGAPE STUDIO
            </textPath>
          </text>
        </svg>
        
        {/* The Arch / Inverted U */}
        <div className="flex justify-center -mt-2">
          <svg 
            width={arch} 
            height={arch * 1.2} 
            viewBox="0 0 40 48" 
            fill="none"
            className="animate-pulse-gentle"
          >
            {/* Outer arch */}
            <path
              d="M4 44V20C4 11.163 11.163 4 20 4C28.837 4 36 11.163 36 20V44"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Middle arch */}
            <path
              d="M10 44V20C10 14.477 14.477 10 20 10C25.523 10 30 14.477 30 20V44"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Inner arch */}
            <path
              d="M16 44V20C16 17.791 17.791 16 20 16C22.209 16 24 17.791 24 20V44"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Bottom text - EST. 2026 or UNCONDITIONAL */}
        {showTagline && (
          <div className={`text-center ${tagline} font-cinzel tracking-[0.4em] ${colorClass} -mt-1`}>
            UNCONDITIONAL
          </div>
        )}
      </div>
    </Link>
  );
}

// Simpler text logo for header
export function LogoText({ variant = "dark", size = "md" }: { variant?: "dark" | "light"; size?: "sm" | "md" | "lg" }) {
  const colorClass = variant === "dark" ? "text-[#6B4423]" : "text-[#F6D3B3]";
  
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <Link href="/" className={`font-cinzel ${sizes[size]} ${colorClass} tracking-[0.15em] uppercase`}>
      Ágape Studio
    </Link>
  );
}
