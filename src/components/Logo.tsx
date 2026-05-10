"use client";

import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ variant = "dark", size = "md", showTagline = false }: LogoProps) {
  const isDark = variant === "dark";

  const heights = {
    sm: "h-16",
    md: "h-24",
    lg: "h-36",
  };

  return (
    <Link href="/" className="flex flex-col items-center">
      <img
        src={isDark ? "/logo-dark.png" : "/logo-light.png"}
        alt="Ágape Studio"
        className={`${heights[size]} w-auto object-contain`}
      />
      {showTagline && (
        <div
          className={`text-center text-xs font-cinzel tracking-[0.4em] mt-1 ${
            isDark ? "text-[#6B4423]" : "text-[#F6D3B3]"
          }`}
        >
          UNCONDITIONAL
        </div>
      )}
    </Link>
  );
}

// Compact logo for header
export function LogoText({ variant = "dark", size = "md" }: { variant?: "dark" | "light"; size?: "sm" | "md" | "lg" }) {
  const isDark = variant === "dark";

  const heights = {
    sm: "h-12",
    md: "h-16",
    lg: "h-24",
  };

  return (
    <Link href="/" className="flex-shrink-0 flex items-center">
      <img
        src={isDark ? "/logo-dark.png" : "/logo-light.png"}
        alt="Ágape Studio"
        className={`${heights[size]} w-auto object-contain`}
      />
    </Link>
  );
}
