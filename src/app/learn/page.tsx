import { Metadata } from "next";
import { Suspense } from "react";
import { LearnSubjectView } from "./LearnSubjectView";

export const metadata: Metadata = {
  title: "Select Subject & Learning Library | Kepler Learning",
  description: "Browse subject textbooks, curriculum chapters, and practice modules.",
};

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F4F7FC] flex items-center justify-center text-slate-500 text-sm">
          Loading subjects library...
        </div>
      }
    >
      <LearnSubjectView />
    </Suspense>
  );
}
