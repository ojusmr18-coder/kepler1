import { Metadata } from "next";
import { Suspense } from "react";
import { RevisionNotesClientView } from "./RevisionNotesClientView";

export const metadata: Metadata = {
  title: "Revision Notes | Kepler Learning Platform",
  description: "Browse CBSE Class 10 subjects and view official lesson PDF revision notes.",
};

export default function RevisionNotesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 text-sm">
          Loading Revision Notes...
        </div>
      }
    >
      <RevisionNotesClientView />
    </Suspense>
  );
}
