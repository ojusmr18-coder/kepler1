"use client";

import * as React from "react";
import { TrioLightningStack } from "@/components/ui/LightningIcons";

export interface TasksDoneCardProps {
  tasksDoneCount?: number;
  onClick?: () => void;
  className?: string;
}

export function TasksDoneCard({
  tasksDoneCount = 13,
  onClick,
  className = "",
}: TasksDoneCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      title="Click to view tasks breakdown"
      aria-label={`${tasksDoneCount} Tasks Done. Click to view breakdown.`}
      className={`group relative inline-flex items-center gap-3.5 rounded-[20px] bg-gradient-to-br from-[#3891FF] via-[#2B86FE] to-[#1C73E8] p-3 sm:p-3.5 pr-4 pl-3.5 text-white shadow-lg shadow-blue-700/25 border border-white/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-700/35 active:scale-[0.98] cursor-pointer select-none ${className}`}
    >
      {/* Top-Right Info Icon (i) */}
      <button
        type="button"
        aria-label="View task insights breakdown"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full border border-white/80 flex items-center justify-center text-white/90 group-hover:text-white group-hover:border-white transition-colors cursor-pointer"
      >
        <span className="text-[11px] font-serif font-bold italic leading-none">i</span>
      </button>

      {/* 3D Lightning Bolts Cluster (Bronze, Silver, Gold) */}
      <div className="shrink-0 pl-0.5">
        <TrioLightningStack />
      </div>

      {/* Task Count & Label */}
      <div className="flex flex-col items-start pr-6 sm:pr-7">
        <span className="text-2xl sm:text-[28px] font-black text-white leading-none tracking-tight">
          {tasksDoneCount}
        </span>
        <span className="text-xs sm:text-[13px] font-semibold text-white/95 mt-1 leading-none tracking-tight">
          Tasks Done
        </span>
      </div>
    </div>
  );
}
