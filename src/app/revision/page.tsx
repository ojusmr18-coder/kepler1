import { Metadata } from "next";
import { Suspense } from "react";
import { RevisionClientView } from "./RevisionClientView";

export const metadata: Metadata = {
  title: "Chapter Revision Hub | Kepler Learning",
  description: "Interactive flashcards, key formulas, and structured revision notes for exam preparation.",
};

export default function RevisionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F4F7FC] flex items-center justify-center text-slate-500 text-sm">
          Loading chapter revision...
        </div>
      }
    >
      <RevisionClientView />
    </Suspense>
  );
}
