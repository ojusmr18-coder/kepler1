"use client";

import * as React from "react";

interface ThinkingCatLogoProps {
  /** Whether the AI is currently processing/thinking */
  isThinking: boolean;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Optional container class name */
  className?: string;
  /** Whether to show the floating ground shadow underneath */
  showShadow?: boolean;
  /** Optional click handler (e.g. to test or preview thinking) */
  onClick?: () => void;
  /** Optional title tooltip */
  title?: string;
}

export function ThinkingCatLogo({
  isThinking,
  size = "md",
  className = "",
  showShadow = true,
  onClick,
  title,
}: ThinkingCatLogoProps) {
  // Size dimensions mapping
  const sizeClasses = {
    sm: {
      container: "w-14 h-14",
      image: "w-12",
      shadow: "w-8 h-1.5",
      thoughtBadge: "-top-2 -right-1 text-[9px] px-1.5 py-0.2",
    },
    md: {
      container: "w-24 h-24",
      image: "w-20",
      shadow: "w-14 h-2",
      thoughtBadge: "-top-3 -right-2 text-[10px] px-2 py-0.5",
    },
    lg: {
      container: "w-32 h-32",
      image: "w-28",
      shadow: "w-20 h-2.5",
      thoughtBadge: "-top-4 -right-2 text-xs px-2.5 py-0.5",
    },
  }[size];

  return (
    <div
      onClick={onClick}
      title={title || (isThinking ? "Allie Cat is thinking..." : "Allie Cat AI Assistant")}
      className={`relative flex flex-col items-center justify-center select-none ${sizeClasses.container} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* 1. Ambient Warm Halo Glow */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
          isThinking
            ? "bg-amber-400/35 blur-xl animate-cat-halo-pulse scale-110"
            : "bg-amber-400/15 blur-xl scale-90"
        }`}
      />

      {/* 2. Floating Thought Indicator (Visible only while thinking) */}
      {isThinking && (
        <div
          className={`absolute ${sizeClasses.thoughtBadge} z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-amber-200/90 rounded-full shadow-sm text-amber-700 font-bold animate-thought-float pointer-events-none`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>💭</span>
        </div>
      )}

      {/* 3. Levitating Cat Body (Gentle idle float vs Inquisitive Thinking Tilt & Bob) */}
      <div
        className={`relative z-10 flex items-center justify-center transition-transform duration-500 ${
          isThinking ? "animate-cat-thinking" : "animate-cat-levitate"
        }`}
      >
        <img
          src="/cat_logo_levitating.png"
          alt="Allie Cat AI Assistant"
          className={`${sizeClasses.image} h-auto object-contain transition-all duration-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.22)]`}
          draggable={false}
        />

        {/* 4. Slow Blinking Eyelid Overlays (Active strictly during isThinking) */}
        {isThinking && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Left Eye Eyelid */}
            <div className="absolute left-[41.6%] top-[50.2%] w-[8.2%] h-[7.2%] animate-cat-slow-blink">
              <svg viewBox="0 0 40 32" className="w-full h-full drop-shadow-xs">
                <ellipse cx="20" cy="16" rx="18" ry="13" fill="#EFA263" />
                <path
                  d="M 4 16 Q 20 25 36 16"
                  stroke="#2C160B"
                  strokeWidth="2.8"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Right Eye Eyelid */}
            <div className="absolute left-[60.6%] top-[49.5%] w-[8.2%] h-[7.2%] animate-cat-slow-blink">
              <svg viewBox="0 0 40 32" className="w-full h-full drop-shadow-xs">
                <ellipse cx="20" cy="16" rx="18" ry="13" fill="#EFA263" />
                <path
                  d="M 4 16 Q 20 25 36 16"
                  stroke="#2C160B"
                  strokeWidth="2.8"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 5. Soft Ground Shadow Underneath (Synchronized with body levitation/thinking) */}
      {showShadow && (
        <div
          className={`${sizeClasses.shadow} bg-slate-400/30 rounded-[100%] blur-[2.5px] mt-1 transition-all duration-500 ${
            isThinking ? "animate-cat-thinking-shadow" : "animate-cat-shadow"
          }`}
        />
      )}
    </div>
  );
}
