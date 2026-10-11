import { Metadata } from "next";
import { Suspense } from "react";
import { TestClientView } from "./TestClientView";

export const metadata: Metadata = {
  title: "Tests & Assessments | Kepler Learning Platform",
  description: "Assigned quizzes, tests, and mock examinations.",
};

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#FAFAFC] flex items-center justify-center text-slate-500 text-sm">
          Loading test center...
        </div>
      }
    >
      <TestClientView />
    </Suspense>
  );
}
