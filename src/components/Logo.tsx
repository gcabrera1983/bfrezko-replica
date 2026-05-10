"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ variant = "dark", size = "md", showTagline = false }: LogoProps) {
  const isDark = variant === "dark";
  
  const sizes = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 180, height: 180 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href="/" className="flex flex-col items-center">
      <Image
        src={isDark ? "/logo-dark.png" : "/logo-light.png"}
        alt="Ágape Studio"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
      {showTagline && (
        <div className={`text-center text-xs font-cinzel tracking-[0.4em] mt-1 ${isDark ? "text-[#6B4423]" : "text-[#F6D3B3]"}`}>
          UNCONDITIONAL
        </div>
      )}
    </Link>
  );
}

// Simpler logo for header (smaller, no tagline)
export function LogoText({ variant = "dark", size = "md" }: { variant?: "dark" | "light"; size?: "sm" | "md" | "lg" }) {
  const isDark = variant === "dark";
  
  const sizes = {
    sm: { width: 100, height: 40 },
    md: { width: 140, height: 50 },
    lg: { width: 200, height: 70 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href="/" className="flex-shrink-0">
      <Image
        src={isDark ? "/logo-dark.png" : "/logo-light.png"}
        alt="Ágape Studio"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  );
}
