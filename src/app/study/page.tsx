import { Metadata } from "next";
import { Suspense } from "react";
import { StudyClientView } from "./StudyClientView";

export const metadata: Metadata = {
  title: "Topic Study Hub | Kepler Learning",
  description: "Targeted quiz assessment and concept revision with flashcards and notes.",
};

export default function StudyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F4F7FC] flex items-center justify-center text-slate-500 text-sm">
          Loading topic study hub...
        </div>
      }
    >
      <StudyClientView />
    </Suspense>
  );
}
