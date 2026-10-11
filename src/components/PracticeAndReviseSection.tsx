"use client";

import * as React from "react";
import Link from "next/link";

/* =========================================================================
   CUSTOM SOFT 3D ICONS MATCHING THE REFERENCE DESIGN & BASE COLOR PALETTE
   (Strictly avoids purple / neon-bright blue; uses teal, emerald, amber, soft sky)
   ========================================================================= */

// 1. Mock Tests Icon: Soft sky-blue rounded clipboard with checklist & clip
function MockTestsIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-xs">
      {/* Clipboard base */}
      <rect x="9" y="8" width="30" height="35" rx="7" fill="#60A5FA" />
      <rect x="9" y="8" width="30" height="35" rx="7" stroke="#3B82F6" strokeWidth="1.2" />
      {/* Top Clip */}
      <rect x="18" y="4" width="12" height="7" rx="3" fill="#2563EB" />
      <circle cx="24" cy="7.5" r="1.5" fill="#FFFFFF" opacity="0.9" />
      {/* Row 1: Checkmark + Line */}
      <path d="M16 19.5L18.5 22L23 17.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 19.5H32" stroke="#DBEAFE" strokeWidth="2.2" strokeLinecap="round" />
      {/* Row 2: Cross + Line */}
      <path d="M17 27L22 32M22 27L17 32" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M26 29.5H32" stroke="#DBEAFE" strokeWidth="2.2" strokeLinecap="round" />
      {/* Row 3: Dash + Dot */}
      <circle cx="18" cy="37" r="1.8" fill="#FFFFFF" />
      <path d="M23 37H32" stroke="#DBEAFE" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 2. Improvement Book Icon: Emerald-green notebook with upward growth graph arrow
function ImprovementBookIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-xs">
      {/* Book base */}
      <rect x="9" y="7" width="30" height="35" rx="7" fill="#10B981" />
      <rect x="9" y="7" width="30" height="35" rx="7" stroke="#059669" strokeWidth="1.2" />
      {/* Spine crease */}
      <path d="M15 7V42" stroke="#047857" strokeWidth="1.5" strokeOpacity="0.3" />
      {/* Growth arrow path */}
      <path
        d="M17 32L23.5 25.5L28 29.5L33.5 20"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow head */}
      <path
        d="M27 20H33.5V26.5"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 3. Custom Practice Icon: Teal spiral notebook with bullseye & pencil (neutral base palette, no purple)
function CustomPracticeIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-xs">
      {/* Notebook Body */}
      <rect x="11" y="8" width="27" height="33" rx="6" fill="#0D9488" />
      <rect x="11" y="8" width="27" height="33" rx="6" stroke="#0F766E" strokeWidth="1.2" />
      {/* Spiral Binder Rings */}
      <circle cx="11" cy="14" r="1.5" fill="#FFFFFF" />
      <circle cx="11" cy="20" r="1.5" fill="#FFFFFF" />
      <circle cx="11" cy="26" r="1.5" fill="#FFFFFF" />
      <circle cx="11" cy="32" r="1.5" fill="#FFFFFF" />
      {/* Target Rings */}
      <circle cx="25" cy="22" r="7.5" stroke="#CCFBF1" strokeWidth="2.2" />
      <circle cx="25" cy="22" r="4" fill="#2DD4BF" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="25" cy="22" r="1.2" fill="#FFFFFF" />
      {/* Pencil / Stylus */}
      <path
        d="M26.5 35L36.5 25L38.5 27L28.5 37L25.5 37L26.5 35Z"
        fill="#F59E0B"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M34.5 23L37.5 26" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 4. Revision Notes Icon: Muted slate-blue document with folded corner & circular sync arrows (no purple)
function RevisionNotesIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-xs">
      {/* Document with folded top-right corner */}
      <path
        d="M12 9C12 6.79086 13.7909 5 16 5H28L36 13V39C36 41.2091 34.2091 43 32 43H16C13.7909 43 12 41.2091 12 39V9Z"
        fill="#3B82F6"
      />
      <path
        d="M12 9C12 6.79086 13.7909 5 16 5H28L36 13V39C36 41.2091 34.2091 43 32 43H16C13.7909 43 12 41.2091 12 39V9Z"
        stroke="#2563EB"
        strokeWidth="1.2"
      />
      {/* Folded Flap */}
      <path d="M28 5V11C28 12.1 28.9 13 30 13H36" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.2" />
      {/* Circular Refresh / Sync Arrows */}
      <path
        d="M19 25C19 21.6863 21.6863 19 25 19C27.5 19 29.6 20.5 30.5 22.7"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M31.5 19.5V23.5H27.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M29 27C29 30.3137 26.3137 33 23 33C20.5 33 18.4 31.5 17.5 29.3"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M16.5 32.5V28.5H20.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom Summary Bar */}
      <path d="M18 37H30" stroke="#DBEAFE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 5. Flashcards Icon: Warm golden-amber card with bold white lightning bolt
function FlashcardsIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-xs">
      {/* Back Depth Shadow */}
      <path d="M14 6H34C36.2 6 38 7.8 38 10V36" stroke="#D97706" strokeWidth="1.2" opacity="0.35" />
      {/* Front Card */}
      <rect x="11" y="8" width="26" height="34" rx="7" fill="#F59E0B" />
      <rect x="11" y="8" width="26" height="34" rx="7" stroke="#D97706" strokeWidth="1.2" />
      {/* Lightning Bolt */}
      <path
        d="M25.5 14L18 25.5H24L22.5 34L30 22.5H24L25.5 14Z"
        fill="#FFFFFF"
        stroke="#FEF3C7"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ActionItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
}

const practiceItems: ActionItem[] = [
  {
    id: "mock-tests",
    title: "Mock Tests",
    href: "/test",
    icon: <MockTestsIcon />,
  },
  {
    id: "improvement-book",
    title: "Improvement Book",
    href: "/improve",
    icon: <ImprovementBookIcon />,
  },
  {
    id: "custom-practice",
    title: "Custom Practice",
    href: "/test/custom",
    icon: <CustomPracticeIcon />,
  },
];

const reviseItems: ActionItem[] = [
  {
    id: "revision-notes",
    title: "Revision Notes",
    href: "/revision-notes",
    icon: <RevisionNotesIcon />,
  },
  {
    id: "flashcards",
    title: "Flashcards",
    href: "/revision?tab=flashcards",
    icon: <FlashcardsIcon />,
  },
];

export function PracticeAndReviseSection({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-9 sm:space-y-11 select-none ${className}`}>
      {/* 1. PRACTICE MORE */}
      <section aria-label="Practice More" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Practice More
        </h2>
        <div className="flex items-start gap-6 sm:gap-8 flex-wrap">
          {practiceItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center cursor-pointer select-none"
            >
              <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-[24px] sm:rounded-[26px] bg-white border border-slate-200/80 shadow-[0_8px_22px_-4px_rgba(15,23,42,0.06),0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-center transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_32px_-6px_rgba(15,23,42,0.12)] active:scale-95">
                {item.icon}
              </div>
              <span className="text-xs sm:text-[13px] font-semibold text-slate-700 group-hover:text-slate-950 transition-colors text-center mt-2.5 max-w-[84px] sm:max-w-[96px] leading-tight">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. REVISE NOW */}
      <section aria-label="Revise Now" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Revise Now
        </h2>
        <div className="flex items-start gap-6 sm:gap-8 flex-wrap">
          {reviseItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center cursor-pointer select-none"
            >
              <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-[24px] sm:rounded-[26px] bg-white border border-slate-200/80 shadow-[0_8px_22px_-4px_rgba(15,23,42,0.06),0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-center transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_32px_-6px_rgba(15,23,42,0.12)] active:scale-95">
                {item.icon}
              </div>
              <span className="text-xs sm:text-[13px] font-semibold text-slate-700 group-hover:text-slate-950 transition-colors text-center mt-2.5 max-w-[84px] sm:max-w-[96px] leading-tight">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
