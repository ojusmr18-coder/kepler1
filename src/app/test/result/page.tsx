import { Metadata } from "next";
import { Suspense } from "react";
import { TestResultView } from "@/components/TestResultView";

export const metadata: Metadata = {
  title: "Test Performance & Score Result | Kepler Learning",
  description: "Comprehensive test result report, marks summary, and subject-wise performance breakdown.",
};

export default function TestResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F5F8FA] flex items-center justify-center text-slate-500 text-sm">
          Loading test result...
        </div>
      }
    >
      <TestResultView />
    </Suspense>
  );
}
