"use client";

import * as React from "react";

export function LockedInsightsIllustration({ className = "" }: { className?: string }) {
  const id = React.useId();

  return (
    <div
      className={`relative w-full max-w-[380px] mx-auto flex flex-col items-center select-none ${className}`}
      aria-label="Locked insights illustration showing glass cube with lightning bolt and padlock"
    >
      <svg
        viewBox="0 0 320 280"
        className="w-full h-auto overflow-visible drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glass Face Gradients */}
          <linearGradient id={`glassTop-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id={`glassLeft-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id={`glassRight-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
          </linearGradient>

          {/* Platform Gradients */}
          <linearGradient id={`grassTop-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id={`blueBaseLeft-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id={`blueBaseRight-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          {/* Golden Padlock Gradients */}
          <linearGradient id={`padlockBody-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id={`padlockShackle-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Inside Giant Golden Lightning Bolt */}
          <linearGradient id={`boltLeft-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id={`boltRight-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Soft Ground Shadow Filter */}
          <filter id={`baseShadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. Base Platform Drop Shadow */}
        <ellipse cx="160" cy="225" rx="105" ry="32" fill="rgba(15, 23, 42, 0.25)" />

        {/* 2. Platform Base (Blue Rim) */}
        <g id="platform-rim" filter={`url(#baseShadow-${id})`}>
          {/* Left Rim Face */}
          <path
            d="M 60 170 
               L 160 216 
               L 160 236 
               L 60 190 Z"
            fill={`url(#blueBaseLeft-${id})`}
          />
          {/* Right Rim Face */}
          <path
            d="M 160 216 
               L 260 170 
               L 260 190 
               L 160 236 Z"
            fill={`url(#blueBaseRight-${id})`}
          />
        </g>

        {/* 3. Grass Platform Top Slab */}
        <path
          d="M 160 124 
             L 260 170 
             L 160 216 
             L 60 170 Z"
          fill={`url(#grassTop-${id})`}
          stroke="#A7F3D0"
          strokeWidth="1.2"
        />

        {/* 4. Inside the Glass Cube: Floating Clouds & Giant Golden Lightning Bolt */}
        <g id="cube-interior">
          {/* Subtle Sunbeam Ray in Cube */}
          <polygon
            points="140,40 185,40 215,160 115,160"
            fill="url(#glassTop-id)"
            opacity="0.18"
          />

          {/* Background Cloud (Left) */}
          <path
            d="M 98 120 
               q -6 0 -8 -5 
               q -2 -9 6 -11 
               q 4 -8 14 -7 
               q 12 -2 15 8 
               q 6 3 4 10 
               q -2 5 -8 5 Z"
            fill="#FFFFFF"
            opacity="0.88"
          />

          {/* Background Cloud (Right) */}
          <path
            d="M 195 142 
               q -5 0 -6 -4 
               q -1 -7 5 -9 
               q 3 -6 11 -5 
               q 9 -2 12 6 
               q 5 2 3 8 
               q -2 4 -6 4 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />

          {/* Big Glowing 3D Golden Lightning Bolt in Center */}
          <g transform="translate(160, 118)">
            {/* Soft Ambient Bolt Glow */}
            <path
              d="M 4 -65 L -26 -14 L 0 -14 L -12 28 L 26 -20 L 4 -20 Z"
              fill="#FDE047"
              opacity="0.4"
              filter="blur(8px)"
            />

            {/* Right Bevel Shaded Face */}
            <path
              d="M 4 -65 L -26 -14 L 0 -14 L -12 28 L 26 -20 L 4 -20 Z"
              fill={`url(#boltRight-${id})`}
              transform="translate(2.5, 1.5)"
            />

            {/* Main Front Lightning Face */}
            <path
              d="M 4 -65 L -26 -14 L 0 -14 L -12 28 L 26 -20 L 4 -20 Z"
              fill={`url(#boltLeft-${id})`}
              stroke="#FDE047"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Upper Glint Reflection */}
            <path
              d="M 4 -65 L -26 -14 L 0 -14 L -6 4 L 4 -20 Z"
              fill="#FFFFFF"
              opacity="0.5"
            />
          </g>
        </g>

        {/* 5. Isometric Glass Cube Walls */}
        <g id="glass-walls">
          {/* Glass Left Wall */}
          <path
            d="M 60 78 
               L 160 124 
               L 160 216 
               L 60 170 Z"
            fill={`url(#glassLeft-${id})`}
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.2"
          />

          {/* Glass Right Wall */}
          <path
            d="M 160 124 
               L 260 78 
               L 260 170 
               L 160 216 Z"
            fill={`url(#glassRight-${id})`}
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.2"
          />

          {/* Glass Top Lid */}
          <path
            d="M 160 32 
               L 260 78 
               L 160 124 
               L 60 78 Z"
            fill={`url(#glassTop-${id})`}
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="1.5"
          />

          {/* Sharp Edge Specular Highlights */}
          <line
            x1="160"
            y1="32"
            x2="160"
            y2="124"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />
          <line
            x1="60"
            y1="78"
            x2="160"
            y2="124"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
        </g>

        {/* 6. Front Golden Padlock (Locking the base rim) */}
        <g id="golden-padlock" transform="translate(160, 204)">
          {/* Padlock Drop Shadow */}
          <ellipse cx="0" cy="22" rx="14" ry="4" fill="rgba(15, 23, 42, 0.35)" />

          {/* Padlock Shackle */}
          <path
            d="M -10 -2 
               V -14 
               C -10 -22, 10 -22, 10 -14 
               V -2"
            fill="none"
            stroke={`url(#padlockShackle-${id})`}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Padlock Body (Rounded Rect) */}
          <rect
            x="-17"
            y="-5"
            width="34"
            height="27"
            rx="9"
            fill={`url(#padlockBody-${id})`}
            stroke="#FDE047"
            strokeWidth="1"
          />

          {/* Subtle Padlock Highlight Rim */}
          <path
            d="M -12 -2 C -8 -5, 8 -5, 12 -2"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Keyhole (Slit + Hole) */}
          <circle cx="0" cy="5" r="2.8" fill="#1E293B" />
          <polygon points="-1.5,5 1.5,5 1,12 -1,12" fill="#1E293B" />
        </g>
      </svg>
    </div>
  );
}
