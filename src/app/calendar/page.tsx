import { Metadata } from "next";
import { Suspense } from "react";
import { CalendarClientView } from "./CalendarClientView";

export const metadata: Metadata = {
  title: "Academic Calendar & Test Schedule | Kepler Learning",
  description: "View scheduled chapter quizzes, full-length mock exams, and syllabus milestones.",
};

export default function CalendarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F4F7FC] flex items-center justify-center text-slate-500 text-sm">
          Loading academic calendar...
        </div>
      }
    >
      <CalendarClientView />
    </Suspense>
  );
}
