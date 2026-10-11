"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  EasyLightningIcon,
  ModerateLightningIcon,
  HardLightningIcon,
} from "@/components/ui/LightningIcons";

export interface TasksBreakdownData {
  easy: number;
  moderate: number;
  hard: number;
}

export interface TasksDoneBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTasks?: number;
  breakdown?: TasksBreakdownData;
}

export function TasksDoneBreakdownModal({
  isOpen,
  onClose,
  totalTasks = 13,
  breakdown = { easy: 9, moderate: 3, hard: 1 },
}: TasksDoneBreakdownModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is active
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tasks-breakdown-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl shadow-slate-900/20 border border-slate-100 transition-all duration-200 animate-in zoom-in-95"
      >
        {/* Subtle Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tasks breakdown"
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <h3
          id="tasks-breakdown-title"
          className="text-center text-lg sm:text-xl font-bold tracking-tight text-slate-900 mb-5 select-none"
        >
          {totalTasks} Tasks Done
        </h3>

        {/* Breakdown Items List */}
        <div className="space-y-3">
          {/* 1. Easy-Level Topics */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#F0F4F9] p-4 sm:p-4.5 transition-colors hover:bg-[#E9F0F8]">
            <span className="w-6 text-center text-lg sm:text-xl font-bold text-slate-800 shrink-0">
              {breakdown.easy}
            </span>
            <div className="shrink-0 flex items-center justify-center w-8">
              <EasyLightningIcon size={30} />
            </div>
            <p className="text-xs sm:text-[13.5px] leading-snug text-slate-700 font-normal">
              For these topics, you breeze through{" "}
              <strong className="font-bold text-slate-900">Easy–level questions!</strong>
            </p>
          </div>

          {/* 2. Moderate-Level Topics */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#F0F4F9] p-4 sm:p-4.5 transition-colors hover:bg-[#E9F0F8]">
            <span className="w-6 text-center text-lg sm:text-xl font-bold text-slate-800 shrink-0">
              {breakdown.moderate}
            </span>
            <div className="shrink-0 flex items-center justify-center w-8">
              <ModerateLightningIcon size={30} />
            </div>
            <p className="text-xs sm:text-[13.5px] leading-snug text-slate-700 font-normal">
              For these topics, you can handle{" "}
              <strong className="font-bold text-slate-900">Moderate–level questions!</strong>
            </p>
          </div>

          {/* 3. Hard-Level Topics */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#F0F4F9] p-4 sm:p-4.5 transition-colors hover:bg-[#E9F0F8]">
            <span className="w-6 text-center text-lg sm:text-xl font-bold text-slate-800 shrink-0">
              {breakdown.hard}
            </span>
            <div className="shrink-0 flex items-center justify-center w-8">
              <HardLightningIcon size={30} />
            </div>
            <p className="text-xs sm:text-[13.5px] leading-snug text-slate-700 font-normal">
              For these topics, you&apos;ve skills to tackle{" "}
              <strong className="font-bold text-slate-900">Hard–level questions!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
