"use client";

import * as React from "react";

interface LightningIconProps {
  className?: string;
  size?: number;
}

/**
 * 3D Bronze / Coral Lightning Bolt (Easy level)
 */
export function EasyLightningIcon({ className = "", size = 28 }: LightningIconProps) {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none overflow-visible ${className}`}
      aria-label="Easy difficulty bronze lightning"
    >
      <defs>
        <filter id={`easy-shadow-${id}`} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#B9442C" floodOpacity="0.35" />
        </filter>
        {/* Main Front / Left Face: Bright Coral / Terracotta */}
        <linearGradient id={`easy-front-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F88C72" />
          <stop offset="50%" stopColor="#EA6B4E" />
          <stop offset="100%" stopColor="#D85435" />
        </linearGradient>
        {/* Right / Shaded Bevel: Rich Dark Bronze */}
        <linearGradient id={`easy-side-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C84D30" />
          <stop offset="100%" stopColor="#9C2F17" />
        </linearGradient>
        {/* Top Glint Highlight */}
        <linearGradient id={`easy-glint-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFC5B5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F88C72" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <g filter={`url(#easy-shadow-${id})`}>
        {/* 3D Depth / Right Bevel Face */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 12 42 L 28 17 L 19 17 Z"
          fill={`url(#easy-side-${id})`}
          transform="translate(1.8, 1.2)"
        />

        {/* Main Faceted Body */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 12 42 L 28 17 L 19 17 Z"
          fill={`url(#easy-front-${id})`}
          stroke="#E65E3E"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Left Highlight Ridge Facet */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 15 28 L 19 17 L 21 2 Z"
          fill={`url(#easy-glint-${id})`}
        />
      </g>
    </svg>
  );
}

/**
 * 3D Metallic Silver / Ice-Blue Lightning Bolt (Moderate level)
 */
export function ModerateLightningIcon({ className = "", size = 28 }: LightningIconProps) {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none overflow-visible ${className}`}
      aria-label="Moderate difficulty silver lightning"
    >
      <defs>
        <filter id={`mod-shadow-${id}`} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3B82F6" floodOpacity="0.28" />
        </filter>
        {/* Main Front / Left Face: Lustrous Ice Silver */}
        <linearGradient id={`mod-front-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
        {/* Right / Shaded Bevel: Steel Blue Shading */}
        <linearGradient id={`mod-side-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        {/* Crisp Top Glint */}
        <linearGradient id={`mod-glint-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <g filter={`url(#mod-shadow-${id})`}>
        {/* 3D Depth / Right Bevel Face */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 12 42 L 28 17 L 19 17 Z"
          fill={`url(#mod-side-${id})`}
          transform="translate(1.8, 1.2)"
        />

        {/* Main Faceted Body */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 12 42 L 28 17 L 19 17 Z"
          fill={`url(#mod-front-${id})`}
          stroke="#BFDBFE"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Left Highlight Ridge Facet */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 15 28 L 19 17 L 21 2 Z"
          fill={`url(#mod-glint-${id})`}
        />
      </g>
    </svg>
  );
}

/**
 * 3D Golden Yellow Lightning Bolt (Hard level)
 */
export function HardLightningIcon({ className = "", size = 28 }: LightningIconProps) {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none overflow-visible ${className}`}
      aria-label="Hard difficulty golden lightning"
    >
      <defs>
        <filter id={`hard-shadow-${id}`} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#D97706" floodOpacity="0.35" />
        </filter>
        {/* Main Front / Left Face: Brilliant Gold */}
        <linearGradient id={`hard-front-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
        {/* Right / Shaded Bevel: Warm Deep Amber */}
        <linearGradient id={`hard-side-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        {/* Top Glint Highlight */}
        <linearGradient id={`hard-glint-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <g filter={`url(#hard-shadow-${id})`}>
        {/* 3D Depth / Right Bevel Face */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 12 42 L 28 17 L 19 17 Z"
          fill={`url(#hard-side-${id})`}
          transform="translate(1.8, 1.2)"
        />

        {/* Main Faceted Body */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 12 42 L 28 17 L 19 17 Z"
          fill={`url(#hard-front-${id})`}
          stroke="#FBBF24"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Left Highlight Ridge Facet */}
        <path
          d="M 21 2 L 8 20 L 17 20 L 15 28 L 19 17 L 21 2 Z"
          fill={`url(#hard-glint-${id})`}
        />
      </g>
    </svg>
  );
}

/**
 * Trio Lightning Bolt Stack (Displayed on the "Tasks Done" card)
 * Staggers Bronze (back left), Silver (center), and Gold (front right)
 */
export function TrioLightningStack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center w-12 h-10 select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Bronze (Back Left) */}
      <div className="absolute -left-0.5 top-0.5 z-10 -rotate-12 transform scale-90 drop-shadow-sm">
        <EasyLightningIcon size={30} />
      </div>

      {/* 2. Silver Metallic (Center) */}
      <div className="absolute left-3.5 -top-1 z-20 transform scale-100 drop-shadow-sm">
        <ModerateLightningIcon size={32} />
      </div>

      {/* 3. Gold Amber (Front Right) */}
      <div className="absolute left-7 top-1 z-30 rotate-6 transform scale-95 drop-shadow-sm">
        <HardLightningIcon size={31} />
      </div>
    </div>
  );
}
