import { Metadata } from "next";
import { ScoreBoosterSection } from "@/components/ScoreBoosterSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Score Booster | Kepler Learning",
  description: "Targeted practice and AI score booster engine.",
};

export default function ScoreBoosterPage() {
  return (
    <div className="min-h-screen w-full bg-[#F4F7FC] text-slate-800 flex flex-col p-6 pl-20 sm:pl-24 antialiased">
      {/* Top Breadcrumb Navigation */}
      <div className="w-full max-w-7xl mx-auto mb-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-2xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Classroom Dashboard</span>
        </Link>
        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
          Score Booster Mode
        </div>
      </div>

      {/* Main Score Booster Section */}
      <ScoreBoosterSection
        currentMarks={142}
        nextGoalMarks={180}
        examName="JEE Mains"
        tasksCompleted={13}
        tasks={[]} // Kept strictly empty until backend provides real tasks
        className="my-auto"
      />
    </div>
  );
}
