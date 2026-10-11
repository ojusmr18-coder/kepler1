"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CartoonHome,
  CartoonBook,
  CartoonAsk,
  CartoonTest,
  CartoonImprove,
  CartoonPapers,
  CartoonZap,
} from "@/components/ui/cartoon-icons";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  activeColor: string;
  activeBg: string;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: CartoonHome,
    description: "Classroom Dashboard",
    activeColor: "bg-orange-400",
    activeBg: "bg-orange-50/90 text-orange-900 border-orange-200/80 shadow-xs",
  },
  {
    name: "Learn",
    href: "/learn",
    icon: CartoonBook,
    description: "Subject Selection & Bookshelf",
    activeColor: "bg-sky-500",
    activeBg: "bg-sky-50/90 text-sky-900 border-sky-200/80 shadow-xs",
  },
  {
    name: "Ask",
    href: "/ask",
    icon: CartoonAsk,
    description: "AI Assistant",
    activeColor: "bg-teal-400",
    activeBg: "bg-teal-50/90 text-teal-900 border-teal-200/80 shadow-xs",
  },
  {
    name: "Test",
    href: "/test",
    icon: CartoonTest,
    description: "Practice & Mock Tests",
    activeColor: "bg-amber-400",
    activeBg: "bg-amber-50/90 text-amber-900 border-amber-200/80 shadow-xs",
  },
  {
    name: "Improve",
    href: "/improve",
    icon: CartoonImprove,
    description: "Improvement Book & Mistakes",
    activeColor: "bg-emerald-400",
    activeBg: "bg-emerald-50/90 text-emerald-900 border-emerald-200/80 shadow-xs",
  },
  {
    name: "Papers",
    href: "/papers",
    icon: CartoonPapers,
    description: "Previous Years' Papers",
    activeColor: "bg-rose-400",
    activeBg: "bg-rose-50/90 text-rose-900 border-rose-200/80 shadow-xs",
  },
  {
    name: "Score Booster",
    href: "/score-booster",
    icon: CartoonZap,
    description: "Score Booster Engine",
    activeColor: "bg-teal-400",
    activeBg: "bg-teal-50/90 text-teal-900 border-teal-200/80 shadow-xs",
  },
];

export function FloatingTaskbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Do not show on initial sign-in / intro page
  if (!pathname || pathname === "/") {
    return null;
  }

  return (
    <aside
      aria-label="Navigation Sidebar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-3 sm:left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start
        bg-white/80 backdrop-blur-2xl backdrop-saturate-150
        border border-white/90
        shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]
        rounded-2xl p-1.5 gap-1 select-none overflow-hidden
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isHovered ? "w-[188px] shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]" : "w-[52px]"}`}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;

        let isActive = false;
        if (item.name === "Score Booster") {
          isActive = pathname === "/score-booster";
        } else if (item.name === "Home") {
          isActive = pathname === "/dashboard" || pathname === "/";
        } else if (item.href === "/ask") {
          isActive = pathname === "/ask" || pathname === "/doubt-solver";
        } else {
          isActive = pathname === item.href;
        }

        const itemContent = (
          <>
            {/* Active Indicator Pip */}
            {isActive && (
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 ${item.activeColor} rounded-r-full shadow-xs`}
              />
            )}

            {/* Soft Cartoon Icon Container (always fixed 40px width so it stays rock solid centered in collapsed mode) */}
            <div className="shrink-0 w-10 h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Icon className="w-5 h-5 drop-shadow-xs" />
            </div>

            {/* Smooth Expanding Label */}
            <div
              className={`flex flex-col justify-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isHovered
                  ? "max-w-[125px] opacity-100 translate-x-0 ml-1.5"
                  : "max-w-0 opacity-0 -translate-x-2 ml-0 pointer-events-none"
              }`}
            >
              <span className="text-[13px] leading-tight tracking-tight whitespace-nowrap">
                {item.name}
              </span>
            </div>
          </>
        );

        return (
          <React.Fragment key={item.name}>
            {/* Subtle Divider after Home */}
            {idx === 1 && (
              <div
                className={`h-[1px] bg-slate-200/70 my-0.5 rounded-full transition-all duration-300 ${
                  isHovered ? "w-[calc(100%-12px)] mx-auto" : "w-6 mx-auto"
                }`}
              />
            )}

            <Link
              href={item.href}
              title={!isHovered ? `${item.name} — ${item.description}` : undefined}
              className={`group relative flex items-center h-10 w-full rounded-xl transition-all duration-200 overflow-hidden ${
                isActive
                  ? item.activeBg + " border font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70 font-medium border border-transparent"
              }`}
            >
              {itemContent}
            </Link>
          </React.Fragment>
        );
      })}
    </aside>
  );
}
